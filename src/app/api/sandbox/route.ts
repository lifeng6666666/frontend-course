import { NextRequest, NextResponse } from "next/server";

/**
 * 实验沙箱托管：POST 一个完整 HTML 文档，返回一个可被 iframe 加载的真实 URL。
 * 相比 srcdoc，真实地址让沙箱拥有正常的 location 与 origin——
 * react-router 等依赖 window.location 的库才能在实验中真实运行。
 */

interface SandboxStore {
  map: Map<string, { html: string; createdAt: number }>;
  seq: number;
}

declare global {
  var __courseSandboxStore: SandboxStore | undefined;
}

const store = (globalThis.__courseSandboxStore ??= {
  map: new Map(),
  seq: 0,
});

const MAX_ENTRIES = 60;
const TTL_MS = 60 * 60 * 1000;

function gc() {
  const now = Date.now();
  for (const [k, v] of store.map) {
    if (now - v.createdAt > TTL_MS) store.map.delete(k);
  }
  while (store.map.size > MAX_ENTRIES) {
    const oldest = [...store.map.entries()].sort((a, b) => a[1].createdAt - b[1].createdAt)[0];
    if (!oldest) break;
    store.map.delete(oldest[0]);
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { html?: string } | null;
  const html = body?.html;
  if (typeof html !== "string" || html.length === 0 || html.length > 400_000) {
    return NextResponse.json({ error: "invalid html" }, { status: 400 });
  }
  gc();
  const id = `s${Date.now().toString(36)}${(store.seq++).toString(36)}`;
  store.map.set(id, { html, createdAt: Date.now() });
  return NextResponse.json({ url: `/sandbox/${id}` });
}
