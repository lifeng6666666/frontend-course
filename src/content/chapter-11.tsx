"use client";

import { Callout, H2, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { EXPERIMENT_11 } from "@/lib/course/experiments";

const PROXY_SAMPLE = `// vite.config.ts —— 开发代理：让前端请求"看起来"同源
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",  // 后端地址
        changeOrigin: true,
      },
    },
  },
});

// 前端代码里永远写相对路径：fetch("/api/notes")
// 浏览器把请求发给 Vite（同源）→ Vite 转发给 Express → 响应原路返回
// CORS 在开发期被代理"绕开"，生产环境再用同源部署或服务端 CORS 正规解决`;

const ENV_SAMPLE = `# .env.local —— 环境变量：配置与代码分离
VITE_API_BASE=/api            # Vite 约定：VITE_ 前缀的变量才会暴露给前端代码

// 代码里：
const res = await fetch(import.meta.env.VITE_API_BASE + "/notes");

// 三条纪律：
// 1. 密钥绝不放进 VITE_ 变量——它会打进前端产物，任何用户都能看到
//    （真正的密钥只存在于后端环境变量里）
// 2. .env 文件必须写进 .gitignore（.env.example 提交模板）
// 3. 接口地址配置化，换环境（开发/测试/生产）不改代码`;

const JWT_SAMPLE = `// 第 11 章的升级版封装：authFetch —— 自动带 Token、统一处理 401
let token = localStorage.getItem("token");

async function authFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
  });

  if (res.status === 401) {
    // Token 过期/无效：清掉本地凭证，交还登录页（或触发刷新 Token 流程）
    localStorage.removeItem("token");
    token = null;
    location.hash = "#/login";
    throw new Error("登录已过期，请重新登录");
  }
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.status === 204 ? null : res.json();
}`;

const JWT_FLOW = `登录流程的完整时序：

① 前端 POST /api/auth/login { username, password }
② 服务端验证（查库 + 比对哈希），通过 → 签发 JWT：
     header  { "alg": "HS256", "typ": "JWT" }        算法声明
     payload { "sub": "demo", "exp": 1735689600 }    用户信息 + 过期时间
     signature  HMAC-SHA256(header.payload, 服务端密钥)   防伪造
③ 前端保存 Token（本课程用 localStorage）
④ 之后每个受保护请求都带：Authorization: Bearer <token>
⑤ 服务端校验签名与过期时间 → 通过则处理业务；失败返回 401`;

const QUIZ = [
  {
    question: "开发期「代理」解决跨域的原理是？",
    options: [
      "修改了后端代码",
      "浏览器把请求发给同源的开发服务器，由它转发给后端——浏览器视角根本不存在跨域",
      "关闭了浏览器安全机制",
      "修改了 hosts 文件",
    ],
    answerIndex: 1,
    explanation:
      "同源策略只约束浏览器行为。Vite 作为中间人转发请求，前后端代码都不用改——这是开发期最优雅的方案。",
  },
  {
    question: "JWT 的第三段（签名）的作用是？",
    options: [
      "加密 payload 不让用户看到",
      "防伪造：服务端用密钥重算签名比对，改过任何一个字都会对不上",
      "压缩数据",
      "标记来源 IP",
    ],
    answerIndex: 1,
    explanation:
      "注意：JWT 是签名不是加密——payload 是 Base64，谁都能解开看（实验里你就解过）。签名保证的是「内容未被篡改」，机密内容不要放 payload。",
  },
  {
    question: "Token 放 localStorage 与放 HttpOnly Cookie 的取舍，正确的是？",
    options: [
      "localStorage 完全没有风险",
      "localStorage 读取方便但易受 XSS 窃取；HttpOnly Cookie JS 读不到、天然防 XSS，但要配 CSRF 防护",
      "Cookie 已经淘汰",
      "两者完全等价",
    ],
    answerIndex: 1,
    explanation:
      "工程上的经典权衡：XSS 风险 vs CSRF 风险。课程实验用 localStorage 便于教学演示；生产系统通常 HttpOnly Cookie + CSRF Token。",
  },
  {
    question: "VITE_ 前缀的环境变量为什么不能放密钥？",
    options: [
      "变量名太长",
      "Vite 会把 VITE_ 变量直接打进前端构建产物——任何用户打开浏览器源码都能看到",
      "系统限制",
      "加密会失败",
    ],
    answerIndex: 1,
    explanation:
      "前端代码最终跑在用户浏览器里，没有秘密可言。密钥只放在后端环境变量中，前端通过调用后端接口间接使用。",
  },
  {
    question: "用户报告「刷新后退出登录了」，最可能的原因是？",
    options: [
      "服务器挂了",
      "Token 只存在内存变量里没持久化；应存 localStorage（或 Cookie），刷新后先读再挂到请求头",
      "JWT 过期时间设太长",
      "代理配置错误",
    ],
    answerIndex: 1,
    explanation:
      "内存变量随页面刷新清空。登录态属于「跨刷新存活」的数据，必须持久化——项目三复盘的追问一就是这个案例。",
  },
];

export function Chapter11() {
  return (
    <>
      <p>
        接口能通了，真实联调还有三关：<strong>环境关</strong>（开发期代理与配置）、
        <strong>安全关</strong>（登录与鉴权）、<strong>交付关</strong>（构建与部署）。
        闯完这三关，你的应用才算真正「全栈」。学完你将能够：
      </p>
      <StepList
        items={[
          <>配置 Vite 开发代理与环境变量，并记住密钥的纪律；</>,
          <>设计加载态与错误处理的完整闭环；</>,
          <>解释 JWT 的三段结构，实现「登录 → 带 Token → 调受保护接口」全流程；</>,
          <>理解构建产物与部署形态；</>,
          <><strong>在课程站上完整体验一次真实鉴权流程</strong>（实验 11）。</>,
        ]}
      />

      <H2>11.1 开发代理与环境变量</H2>
      <p>
        10.4 节说过开发期跨域用代理最优雅——配置只有五行：
      </p>
      <CodeBlock code={PROXY_SAMPLE} language="javascript" filename="vite.config.ts" />
      <p>
        环境变量则解决「换环境不改代码」：接口地址、开关都写进 <code>.env</code> 文件：
      </p>
      <CodeBlock code={ENV_SAMPLE} language="bash" filename="env.md" />
      <Callout tone="warn" title="安全红线">
        <strong>任何前端可见的配置都不是秘密。</strong>VITE_ 变量会原样打进产物，用户在浏览器里全能看到。
        密钥只属于后端。评审 AI 生成的代码时，看到前端代码里出现 API Key，直接判不合格。
      </Callout>

      <H2>11.2 加载态与错误处理的完整闭环</H2>
      <p>
        第 4 章的三状态（加载/成功/错误）在真实项目里还要补两个分支：
        <strong>空态</strong>（请求成功但没数据——「暂无内容」也是 UI）与
        <strong>慢请求的竞态</strong>（用户连续切换筛选，先发的请求后到，会覆盖新数据——处理办法是记录请求序号或直接 abort 旧请求）。
        五种分支，每一种都要有界面回应。
      </p>

      <H2>11.3 JWT：从登录到受保护接口</H2>
      <p>
        HTTP 本身「无状态」——服务器不记得你是谁。传统方案是 Session（服务端存状态，Cookie 带编号）；
        移动互联网时代更流行 <strong>JWT（JSON Web Token）</strong>：登录后服务器签发一个自带信息、防伪造的字符串，
        之后每个请求带着它，服务器验证签名即可，<strong>无需存会话</strong>：
      </p>
      <CodeBlock code={JWT_FLOW} language="text" filename="jwt-flow.txt" />
      <p>
        把第 10 章的 fetchJSON 升级为 authFetch——Token 自动挂载、401 统一处理：
      </p>
      <CodeBlock code={JWT_SAMPLE} language="javascript" filename="auth-fetch.js" />

      <H2>11.4 构建与部署</H2>
      <p>
        <code>npm run build</code> 产出 dist/ 静态文件后，部署形态按后端有无分两类：
      </p>
      <KVTable
        head={["形态", "内容", "典型平台"]}
        rows={[
          { k: "纯静态托管", v: "dist/ 直接扔给静态服务器（无后端逻辑，接口来自第三方）", v2: "GitHub Pages、Netlify、Vercel、对象存储 + CDN" },
          { k: "Node 服务器", v: "Express 同时托管静态文件与 /api 接口（落地三的同款架构）", v2: "VPS、容器、Serverless 函数" },
          { k: "前后端分离部署", v: "前端静态 + 后端 API 独立域名，需正式配置 CORS 或网关", v2: "中大型项目" },
        ]}
      />

      <H2>11.5 实验 11：真实鉴权全流程</H2>
      <Playground experiment={EXPERIMENT_11} />

      <H2>11.6 AI 产出精读：鉴权代码的三个必查点</H2>
      <Table
        head={["必查点", "典型事故"]}
        rows={[
          [<><strong>Token 持久化</strong></>, "只存内存变量，刷新即丢登录态（自测第 5 题的案例）"],
          [<><strong>401 的统一处理</strong></>, "每个接口自己 try/catch 401，代码重复且行为不一致；应收敛在 authFetch 里"],
          [<><strong>密码明文传输/存储</strong></>, "生产必须 HTTPS + 服务端 bcrypt 哈希存储；课程接口用演示账号，真实项目绝不如此"],
        ]}
      />
      <Callout tone="ai" title="追问模板">
        「请补全鉴权方案的边界情况：Token 过期时怎么无感刷新？多个标签页同时登录态变化怎么同步？
        登出时除了清 Token 还要清理什么？」——把安全细节逼出来，而不是默认 AI 写的就是安全的。
      </Callout>

      <H2>11.7 自测</H2>
      <Quiz id="quiz-ch11" questions={QUIZ} />
    </>
  );
}
