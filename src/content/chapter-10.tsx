"use client";

import { BuildBadge, Callout, H2, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { EXPERIMENT_10 } from "@/lib/course/experiments";

const HTTP_SAMPLE = `GET /api/notes HTTP/1.1            ← 请求行：方法 + 路径 + 协议版本
Host: course.example.com          ← 请求头：环境信息，一行一个
Accept: application/json
Content-Type: application/json    ← （有请求体时）说明正文的格式

{ "title": "今天的待办" }          ← 请求体：POST/PUT 才有，通常是 JSON

HTTP/1.1 201 Created              ← 响应行：状态码 + 短语
Content-Type: application/json
X-Course-Api: notes

{ "data": { "id": 4, "title": "今天的待办", "done": false } }   ← 响应体`;

const EXPRESS_SAMPLE = `// server.js —— 用 Express 写第一个真实的后端接口
const express = require("express");
const app = express();

app.use(express.json());          // 中间件：把 JSON 请求体解析好挂到 req.body

let notes = [{ id: 1, title: "第一条", done: false }];
let nextId = 2;

// 读：GET 列表
app.get("/api/notes", (req, res) => {
  res.json({ data: notes });
});

// 增：POST 新建（做服务端校验！前端校验只是善意提示）
app.post("/api/notes", (req, res) => {
  const title = (req.body?.title ?? "").trim();
  if (!title || title.length > 60) {
    return res.status(400).json({ error: "title 必填且不超过 60 字" });
  }
  const note = { id: nextId++, title, done: false };
  notes.push(note);
  res.status(201).json({ data: note });
});

// 删：DELETE
app.delete("/api/notes/:id", (req, res) => {
  const before = notes.length;
  notes = notes.filter((n) => n.id !== Number(req.params.id));
  if (notes.length === before) return res.status(404).json({ error: "笔记不存在" });
  res.status(204).end();          // 204 = 成功但无内容
});

app.listen(3000, () => console.log("API 就绪: http://localhost:3000"));`;

const FETCHJSON_SAMPLE = `// 造轮子 ③：fetchJSON —— 把第 4 章的样板代码封装成 20 行
async function fetchJSON(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error("HTTP " + res.status + " " + res.statusText);   // 统一抛错
  }
  return res.status === 204 ? null : res.json();   // 204 无内容，不解析
}

// 之后的业务代码全部变成一行式：
const { data } = await fetchJSON("GET", "/api/notes");
await fetchJSON("POST", "/api/notes", { title: "新笔记" });
await fetchJSON("DELETE", "/api/notes/3");`;

const CORS_EXPLAIN = `# 跨域请求的完整对话（前端 5500 端口 → 后端 3000 端口）

# ① 预检（仅"非简单请求"才有，如带 Content-Type: application/json 的 POST）
OPTIONS /api/posts HTTP/1.1
Origin: http://localhost:5500
Access-Control-Request-Method: POST

# ② 服务器应答"我允许你"：
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:5500
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization

# ③ 浏览器收到允许后，才发出真正的 POST 请求
# 服务器没应答允许 → 浏览器在控制台报 CORS 错，请求根本发不出去`;

const QUIZ = [
  {
    question: "HTTP 请求由哪四要素组成？",
    options: [
      "URL、Cookie、缓存、代理",
      "请求方法、路径、请求头、请求体",
      "状态码、响应头、响应体、超时",
      "域名、端口、协议、路径",
    ],
    answerIndex: 1,
    explanation:
      "方法（GET/POST…）+ 路径（/api/notes）+ 头（环境与格式信息）+ 体（数据）。响应同构：状态行 + 响应头 + 响应体。",
  },
  {
    question: "REST 风格里「删除第 3 篇文章」的正确请求是？",
    options: [
      "GET /api/delete-post?id=3",
      "DELETE /api/posts/3",
      "POST /api/posts/remove {id:3}",
      "GET /api/posts/3?delete=1",
    ],
    answerIndex: 1,
    explanation:
      "REST 把「操作」映射到「资源 + 方法」：/api/posts/3 是资源地址，DELETE 是动作。动词进方法，名词进路径。",
  },
  {
    question: "CORS 报错是谁抛出的？",
    options: [
      "服务器拒绝响应",
      "浏览器：收到响应但发现来源未获允许，拦截不给页面用",
      "前端框架",
      "DNS",
    ],
    answerIndex: 1,
    explanation:
      "服务器其实返回了数据，是浏览器出于同源策略把响应扣下了。所以「Postman 里正常、浏览器里报错」——Postman 没有同源策略。",
  },
  {
    question: "手写 fetchJSON 时，为什么 204 要特殊处理？",
    options: [
      "204 是错误状态码",
      "204 表示成功但无响应体，对空 body 调 res.json() 会抛解析错误",
      "204 会自动重定向",
      "没有必要特殊处理",
    ],
    answerIndex: 1,
    explanation:
      "res.json() 对空体会抛「Unexpected end of JSON input」。约定删除类接口返回 204，客户端就跳过解析。",
  },
  {
    question: "为什么 Express 接口必须再做一次服务端校验？",
    options: [
      "为了性能",
      "前端校验可以完全绕过（直接构造 HTTP 请求），服务端校验才是安全防线",
      "为了 SEO",
      "浏览器要求",
    ],
    answerIndex: 1,
    explanation:
      "curl、Postman 或恶意脚本都能绕过页面直接打接口。前端校验提升体验，服务端校验保证安全，两者缺一不可。",
  },
];

export function Chapter10() {
  return (
    <>
      <p>
        前端应用的边界终于来了：数据存在哪、谁来验证、别的应用怎么调用——答案都在服务器上。
        这一章你将亲手写后端（Express），并把你第 4 章学过的 fetch 升级成工程级的封装。学完你将能够：
      </p>
      <StepList
        items={[
          <>拆出 HTTP 请求/响应的四要素，读懂一条原始报文；</>,
          <>按 REST 风格设计接口，用对状态码；</>,
          <>用 Express 写出带校验的增删查接口；</>,
          <>说清同源策略与 CORS 的来龙去脉；</>,
          <><strong>手造 fetchJSON 封装</strong>（造轮子 ③），<strong>对课程站真实 API 完成一次全流程 CRUD</strong>（实验 10）。</>,
        ]}
      />

      <H2>10.1 HTTP 四要素：一条报文的解剖</H2>
      <p>
        第 1 章初见 HTTP 时只记了「请求-响应」形状。现在拆开看细节——以后你在 Network 面板里看到的每一行都有名字了：
      </p>
      <CodeBlock code={HTTP_SAMPLE} language="text" filename="http-message.txt" />
      <Table
        head={["方法", "语义", "典型状态码"]}
        rows={[
          [<><code>GET</code></>, "读资源，无副作用", "200"],
          [<><code>POST</code></>, "新建资源", "201（已创建）"],
          [<><code>PATCH</code></>, "部分修改资源", "200"],
          [<><code>DELETE</code></>, "删除资源", "204（成功无内容）"],
          [<><code>OPTIONS</code></>, "询问允许范围（CORS 预检）", "204"],
        ]}
      />

      <H2>10.2 REST 与 JSON：接口的公共语言</H2>
      <p>
        <strong>REST</strong> 是一套接口设计约定：<strong>名词进路径、动词进方法、状态码表达结果</strong>。
        <code>/api/notes</code> 是资源集合，<code>/api/notes/3</code> 是第 3 条资源——路径是名词，动作交给方法。
        <strong>JSON</strong> 则是前后端之间的通用数据格式：键值对 + 数组，<code>JSON.parse / stringify</code>
        一对函数来回转换（第 4 章已用）。
      </p>

      <H2>10.3 用 Express 写第一个接口</H2>
      <p>
        <strong>Express</strong> 是 Node.js 最流行的 Web 框架，把「监听端口、解析请求、返回响应」封装成三行起手。
        下面这个迷你笔记服务，就是课程站 <code>/api/notes</code> 的同款：
      </p>
      <CodeBlock code={EXPRESS_SAMPLE} language="javascript" filename="server.js" />
      <p>
        三个关键概念：路由（<code>app.get/post/delete</code> 把「方法+路径」映射到处理函数）；
        中间件（<code>app.use(express.json())</code> 在请求到达处理函数前先加工一道）；
        服务端校验（POST 里的 if——<strong>它才是真正的安全防线</strong>）。
        「篇末落地三」你会在本机把这份代码真的跑起来。
      </p>

      <H2>10.4 CORS：跨域为什么会报错</H2>
      <p>
        浏览器的<strong>同源策略</strong>：默认禁止页面读取「不同源」的响应（协议、域名、端口任一不同即不同源）。
        这是安全机制——没有它，任何网页都能偷读你登录过的银行页面。开发期前后端分开跑
        （Vite 5173、Express 3000）恰好构成跨域，于是就有了著名的红色 CORS 报错。
      </p>
      <CodeBlock code={CORS_EXPLAIN} language="bash" filename="cors-flow.txt" />
      <KVTable
        head={["解决方式", "做法", "适用"]}
        rows={[
          { k: "服务端开 CORS", v: "后端加 cors 中间件或手动写 Access-Control-Allow-Origin 头", v2: "接口明确要给多方使用" },
          { k: "开发代理", v: "Vite 的 server.proxy 把 /api 转发到后端——请求变成同源", v2: "开发期首选（第 11 章 11.1 实操）" },
          { k: "同源部署", v: "上线时前后端放在同一域名下（或反向代理）", v2: "生产环境常规形态" },
        ]}
      />
      <Callout tone="info" title="本课程实验的巧妙之处">
        课程站的实验沙箱与 <code>/api/*</code> 接口同源，所以你在实验里不会遇到 CORS——
        而「篇末落地三」会让你在本机亲手制造并修复一次 CORS 报错，把这个知识点焊牢。
      </Callout>

      <H2>10.5 先手造：fetchJSON 封装</H2>
      <p>
        <BuildBadge>造轮子 ③</BuildBadge>
        第 4 章每调一次接口就要重复「设 header、查 res.ok、解析 JSON、catch 报错」四件事。
        把它们封装成一个函数，业务代码从此只剩一行：
      </p>
      <CodeBlock code={FETCHJSON_SAMPLE} language="javascript" filename="fetch-json.js" />
      <p>
        这个 20 行的函数会在第 11 章再升级一次（加 Authorization 头与 401 统一处理）——
        造过轮子，才知道工业级的轮子（axios、TanStack Query）替你做了什么。
      </p>

      <H2>10.6 实验 10：真实 CRUD 全流程</H2>
      <Playground experiment={EXPERIMENT_10} />

      <H2>10.7 AI 产出精读：后端代码的评审清单</H2>
      <p>
        让 AI 生成 Express 接口，逐条核对这份清单——前两条是最常被漏掉的：
      </p>
      <Table
        head={["检查项", "为什么"]}
        rows={[
          [<><code>express.json()</code> 中间件</>, "没加它，POST 的 req.body 是 undefined——最高频的新手事故"],
          [<><strong>服务端参数校验</strong></>, "前端校验可被绕过；400 响应应说明哪里错了"],
          [<>状态码语义</>, "新建 201、删除 204、找不到 404、参数错 400、服务端崩 500——AI 有时全用 200，要追问"],
          [<><code>/:id</code> 路由参数</>, "req.params.id 是字符串！与数字 id 比较前要 Number() 转换"],
          [<>错误兜底路由</>, "app.use((req,res)=>res.status(404)…) 让未知路径也有明确响应"],
        ]}
      />

      <H2>10.8 自测</H2>
      <Quiz id="quiz-ch10" questions={QUIZ} />
    </>
  );
}
