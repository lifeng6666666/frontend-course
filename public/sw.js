/**
 * 课程站静态部署兼容层（Service Worker）。
 *
 * 设计目标：课程站构建为纯静态文件（out/）后，实验区依然完整可用——
 *
 * 1. 实验沙箱托管（POST /api/sandbox → GET /sandbox/:id）
 *    用 Cache API 存储，Service Worker 优先响应。无论部署在 Node 服务器还是
 *    GitHub Pages / Cloudflare Pages / Netlify 等纯静态托管，行为完全一致，
 *    且比服务器内存存储更稳（服务器重启不影响已打开的实验）。
 *
 * 2. 教学接口（/api/quotes、/api/auth/login、/api/me、/api/notes、/api/stream）
 *    真实服务器优先：接口存在时原样透传（401/500 等教学错误如实呈现）；
 *    静态托管上请求落到 404/405 页面时，由内置模拟层接管——模拟层用
 *    IndexedDB 存储数据，按与服务器版本一致的 HTTP 协议行为返回
 *    （状态码、响应头、延迟、错误分支均一致）。
 */

const BP = new URL(
  (self.serviceWorker && self.serviceWorker.scriptURL) || "/sw.js",
  self.location
).pathname.replace(/\/sw\.js$/, "");

const SANDBOX_TTL = 60 * 60 * 1000;
const SANDBOX_MAX = 60;
const SANDBOX_CACHE = "course-sandbox-v1";

/* ---------------- 通用工具 ---------------- */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
}

/** 内存兜底（极少数不支持 Cache API 的环境） */
const memDocs = new Map();

/* ---------------- IndexedDB：模拟层的数据存储 ---------------- */

function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("course-api-static", 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains("kv")) {
        req.result.createObjectStore("kv");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function kvGet(key) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readonly");
    const req = tx.objectStore("kv").get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function kvSet(key, value) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("kv", "readwrite");
    tx.objectStore("kv").put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** 集合读取：无数据则播种 */
async function loadCollection(key, seedFactory) {
  const existing = await kvGet(key);
  if (existing) return existing;
  const fresh = seedFactory();
  await kvSet(key, fresh);
  return fresh;
}

/* ---------------- JWT（与服务器版本同算法：HS256 + 同一教学密钥） ---------------- */

const SECRET = "course-demo-secret-do-not-use-in-production";
const te = new TextEncoder();

function b64urlFromBytes(bytes) {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function bytesFromB64url(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    te.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signJwt(payload, expiresInSeconds) {
  const header = b64urlFromBytes(
    te.encode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  );
  const now = Math.floor(Date.now() / 1000);
  const body = b64urlFromBytes(
    te.encode(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds }))
  );
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), te.encode(`${header}.${body}`));
  return `${header}.${body}.${b64urlFromBytes(new Uint8Array(sig))}`;
}

async function verifyJwt(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  let ok = false;
  try {
    ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      bytesFromB64url(sig),
      te.encode(`${header}.${body}`)
    );
  } catch (e) {
    ok = false;
  }
  if (!ok) return null; // 签名对不上 = 被伪造或篡改
  try {
    const payload = JSON.parse(new TextDecoder().decode(bytesFromB64url(body)));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null; // 过期
    return payload;
  } catch (e) {
    return null;
  }
}

/* ---------------- 实验沙箱托管（Service Worker 优先） ---------------- */

async function handleSandboxPost(req) {
  let html;
  try {
    const body = await req.json();
    html = body && body.html;
  } catch (e) {
    html = undefined;
  }
  if (typeof html !== "string" || html.length === 0 || html.length > 400000) {
    return jsonResponse({ error: "invalid html" }, 400);
  }

  const now = Date.now();
  const seq = (self.__sandboxSeq = ((self.__sandboxSeq || 0) + 1));
  const id = `s${now.toString(36)}${seq.toString(36)}`;
  const url = `${BP}/sandbox/${id}`;
  const doc = new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Sandbox-Created-At": String(now),
    },
  });

  let stored = false;
  try {
    const cache = await caches.open(SANDBOX_CACHE);
    // GC：清理过期文档 + 控制总量
    const keys = await cache.keys();
    const metas = [];
    for (const k of keys) {
      const hit = await cache.match(k);
      const created = Number((hit && hit.headers.get("X-Sandbox-Created-At")) || 0);
      if (!created || now - created > SANDBOX_TTL) {
        await cache.delete(k);
      } else {
        metas.push([created, k]);
      }
    }
    metas.sort((a, b) => a[0] - b[0]);
    while (metas.length >= SANDBOX_MAX) {
      await cache.delete(metas.shift()[1]);
    }
    await cache.put(url, doc);
    stored = true;
  } catch (e) {
    /* Cache API 不可用 → 内存兜底 */
  }
  if (!stored) {
    memDocs.set(id, { doc, createdAt: now });
  }
  return jsonResponse({ url });
}

async function handleSandboxGet(req) {
  // Cache API 优先（?r= 时间戳不影响命中）
  try {
    const cache = await caches.open(SANDBOX_CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) {
      const created = Number(hit.headers.get("X-Sandbox-Created-At") || 0);
      if (created && Date.now() - created <= SANDBOX_TTL) return hit;
      await cache.delete(req, { ignoreSearch: true });
    }
  } catch (e) {
    /* 忽略，走内存兜底 */
  }
  // 内存兜底
  const pathId = new URL(req.url).pathname.slice(BP.length + "/sandbox/".length);
  const mem = memDocs.get(pathId);
  if (mem && Date.now() - mem.createdAt <= SANDBOX_TTL) return mem.doc.clone();
  if (mem) memDocs.delete(pathId);

  // 兜底：真实服务器可能仍持有这份文档（Node 部署）
  try {
    const net = await fetch(req);
    if (net.ok) return net;
  } catch (e) {
    /* 忽略 */
  }
  return new Response("沙箱已过期，请回到课程页重新「运行」。", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/* ---------------- 教学接口（真实服务器优先 → 内置模拟层兜底） ---------------- */

async function handleApi(req) {
  const url = new URL(req.url);
  const rel = url.pathname.slice(BP.length); // 例如 /api/quotes

  // 1) 真实服务器优先：接口存在就原样透传（含业务错误，教学语义不变）
  try {
    const res = await fetch(req.clone());
    if (res.ok) return res;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("json")) return res; // 真实接口的 400/401/404/500 原样呈现
    // 其余（静态托管的 404/405 HTML 页面）→ 落入模拟层
  } catch (e) {
    /* 网络失败 → 模拟层 */
  }

  // 2) 内置模拟层（数据存 IndexedDB，协议行为与服务器版本一致）
  return mockApi(req, url, rel);
}

/* ----- 模拟层：名言接口 ----- */

const QUOTE_SEED = [
  { text: "千里之行，始于足下。", author: "老子" },
  { text: "纸上得来终觉浅，绝知此事要躬行。", author: "陆游" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "程序写来终觉浅，绝知此码要躬行。", author: "本课程（教学改编）" },
  { text: "不积跬步，无以至千里。", author: "荀子" },
  { text: "学而不思则罔，思而不学则殆。", author: "孔子" },
  { text: "世上本没有路，走的人多了，也便成了路。", author: "鲁迅" },
];

async function mockQuotes(req, url) {
  if (req.method === "GET") {
    await sleep(200 + Math.random() * 250); // 与服务器一致：模拟真实网络延迟
    if (url.searchParams.get("fail") === "1") {
      return jsonResponse({ error: "Internal Server Error" }, 500);
    }
    const store = await loadCollection("quotes", () => ({
      list: QUOTE_SEED.map((q, i) => ({ ...q, id: i + 1 })),
      nextId: QUOTE_SEED.length + 1,
    }));
    return jsonResponse(
      {
        data: store.list,
        meta: { server: "course-api", count: store.list.length, time: Date.now() },
      },
      200,
      { "X-Course-Api": "quotes" }
    );
  }
  if (req.method === "POST") {
    await sleep(280 + Math.random() * 200);
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ error: "请求体必须是合法 JSON" }, 400);
    }
    const text = ((body && body.text) ?? "").trim();
    if (!text || text.length > 50) {
      return jsonResponse({ error: "text 必填且不超过 50 字" }, 400);
    }
    const store = await loadCollection("quotes", () => ({
      list: QUOTE_SEED.map((q, i) => ({ ...q, id: i + 1 })),
      nextId: QUOTE_SEED.length + 1,
    }));
    const quote = {
      id: store.nextId++,
      text,
      author: ((body && body.author) ?? "我").trim() || "我",
    };
    store.list.push(quote);
    await kvSet("quotes", store);
    return jsonResponse({ data: quote }, 201);
  }
  return jsonResponse({ error: "method not allowed" }, 405);
}

/* ----- 模拟层：登录与受保护接口 ----- */

async function mockLogin(req) {
  if (req.method !== "POST") return jsonResponse({ error: "method not allowed" }, 405);
  await sleep(200 + Math.random() * 150);
  let body = {};
  try {
    body = await req.json();
  } catch (e) {
    body = {};
  }
  // 与服务器一致的演示账号；真实项目应查库并做密码哈希比对（如 bcrypt）
  if (!body || body.username !== "demo" || body.password !== "demo123") {
    return jsonResponse({ error: "用户名或密码错误" }, 401);
  }
  const token = await signJwt({ sub: "demo", name: "课程学员" }, 3600);
  return jsonResponse({ token, tokenType: "Bearer", expiresIn: 3600 });
}

async function mockMe(req) {
  if (req.method !== "GET") return jsonResponse({ error: "method not allowed" }, 405);
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return jsonResponse(
      { error: "缺少 Token。请先登录，并在请求头携带 Authorization: Bearer <token>" },
      401
    );
  }
  const payload = await verifyJwt(token);
  if (!payload) {
    return jsonResponse({ error: "Token 无效或已过期（签名校验失败 / 过期）" }, 401);
  }
  return jsonResponse({
    data: { sub: payload.sub, name: payload.name, exp: payload.exp },
    meta: { server: "course-api", protected: true },
  });
}

/* ----- 模拟层：笔记接口 ----- */

const NOTE_SEED = [
  { id: 1, title: "读完第 10 章并用 fetchJSON 完成 CRUD", done: false, createdAt: 1 },
  { id: 2, title: "把作品集网站发给朋友看", done: true, createdAt: 2 },
  { id: 3, title: "尝试给课程站提一个 Issue（练习）", done: false, createdAt: 3 },
];

async function mockNotes(req) {
  if (req.method === "GET") {
    await sleep(120 + Math.random() * 150);
    const store = await loadCollection("notes", () => ({
      list: NOTE_SEED.slice(),
      nextId: NOTE_SEED.length + 1,
    }));
    return jsonResponse({ data: store.list }, 200, { "X-Course-Api": "notes" });
  }
  if (req.method === "POST") {
    await sleep(150 + Math.random() * 150);
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return jsonResponse({ error: "请求体必须是合法 JSON" }, 400);
    }
    const title = ((body && body.title) ?? "").trim();
    if (!title || title.length > 60) {
      return jsonResponse({ error: "title 必填且不超过 60 字" }, 400);
    }
    const store = await loadCollection("notes", () => ({
      list: NOTE_SEED.slice(),
      nextId: NOTE_SEED.length + 1,
    }));
    const note = { id: store.nextId++, title, done: false, createdAt: Date.now() };
    store.list.push(note);
    await kvSet("notes", store);
    return jsonResponse({ data: note }, 201);
  }
  return jsonResponse({ error: "method not allowed" }, 405);
}

async function mockNoteItem(req, id) {
  const store = await loadCollection("notes", () => ({
    list: NOTE_SEED.slice(),
    nextId: NOTE_SEED.length + 1,
  }));
  const idx = store.list.findIndex((n) => n.id === Number(id));
  if (idx === -1) {
    await sleep(120);
    return jsonResponse({ error: `笔记 #${id} 不存在` }, 404);
  }
  if (req.method === "PATCH") {
    await sleep(120);
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }
    if (typeof body.done === "boolean") store.list[idx].done = body.done;
    if (typeof body.title === "string" && body.title.trim()) {
      store.list[idx].title = body.title.trim();
    }
    await kvSet("notes", store);
    return jsonResponse({ data: store.list[idx] });
  }
  if (req.method === "DELETE") {
    await sleep(120);
    store.list.splice(idx, 1);
    await kvSet("notes", store);
    return new Response(null, { status: 204 });
  }
  return jsonResponse({ error: "method not allowed" }, 405);
}

/* ----- 模拟层：SSE 流式接口 ----- */

const STREAM_SENTENCE =
  "你好，我是课程站的流式接口。你现在看到的每一个字，都不是一次性到达的，而是服务器通过 SSE 一块一块推送过来的。SSE 的报文格式非常朴素：每个事件以 data: 开头，以两个换行结尾。浏览器端的 EventSource 对象负责解析它们，并在 onmessage 回调里把内容交给你。ChatGPT 的打字机效果、大模型应用的流式输出，底层用的都是同一类机制。理解了流，你就理解了 AI 应用的前端如何与模型对话。";

function mockStream() {
  const chunks = [];
  let i = 0;
  while (i < STREAM_SENTENCE.length) {
    const size = 6 + Math.floor(Math.random() * 9);
    chunks.push(STREAM_SENTENCE.slice(i, i + size));
    i += size;
  }
  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(te.encode(`data: ${chunk}\n\n`));
        await sleep(110);
      }
      controller.enqueue(te.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

/* ----- 模拟层路由 ----- */

async function mockApi(req, url, rel) {
  if (rel === "/api/quotes") return mockQuotes(req, url);
  if (rel === "/api/auth/login") return mockLogin(req);
  if (rel === "/api/me") return mockMe(req);
  if (rel === "/api/notes") return mockNotes(req);
  const noteItem = rel.match(/^\/api\/notes\/([^/]+)$/);
  if (noteItem) return mockNoteItem(req, noteItem[1]);
  if (rel === "/api/stream") return mockStream();
  return jsonResponse({ error: "静态模式下无此接口" }, 404);
}

/* ---------------- 生命周期与请求分发 ---------------- */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const method = req.method.toUpperCase();
  if (method !== "GET" && method !== "POST" && method !== "PATCH" && method !== "DELETE") {
    return;
  }
  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;

  if (method === "POST" && path === `${BP}/api/sandbox`) {
    event.respondWith(handleSandboxPost(req));
    return;
  }
  if (path.startsWith(`${BP}/sandbox/`)) {
    event.respondWith(handleSandboxGet(req));
    return;
  }
  if (path === `${BP}/api` || path.startsWith(`${BP}/api/`)) {
    event.respondWith(handleApi(req));
    return;
  }
  /* 其余请求不接管：交还浏览器默认行为（页面、静态资源、HMR 均不受影响） */
});
