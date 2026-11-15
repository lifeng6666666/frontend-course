"use client";

import { Callout, H2, H3, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Quiz } from "@/components/course/quiz";
import { DownloadButton } from "@/components/course/download-button";
import { PACK_LAND3 } from "@/lib/course/packs";

const PROMPT_V1 = `请帮我开发一个「全栈博客平台」，分两步交付。

第一步（本条）：前端页面，React + Vite。
【页面】
1. 文章列表页：卡片式文章列表（标题、摘要、发布时间），带加载骨架屏。
2. 文章详情页：根据 URL 参数加载单篇文章（用 React Router 的动态路由 :id）。
3. 发布页：标题 + 正文两个输入，提交后跳转回列表。
【要求】
- 数据层先写假数据（内存数组），但所有数据访问必须封装在一个 api.js 模块里，
  每个函数返回 Promise，签名与未来真实接口一致（listPosts / getPost / createPost / deletePost）。
- 做好加载 / 成功 / 空 / 错误四种界面状态。

第二步（下一条我会贴接口文档）：把 api.js 的实现从假数据切换为真实 HTTP 请求，
接入 Express + JWT，登录后才能发布与删除。`;

const PROMPT_V2 = `第二步：后端已就绪，接口文档如下——

- POST /api/auth/login  { username, password } → { token }（演示账号 demo/demo123）
- GET  /api/posts       → { data: [...] }（公开）
- GET  /api/posts/:id   → { data: {...} }（公开）
- POST /api/posts       { title, body } → 201（需要登录）
- DELETE /api/posts/:id → 204（需要登录，且只能删自己的）

请完成：
1. api.js 切换为真实请求，统一走 authFetch（自动带 Authorization，401 时跳登录页）。
2. 登录页：提交成功后把 token 存 localStorage，跳转回原页面。
3. 发布与删除按钮对未登录用户隐藏。
4. 开发期 Vite 代理指向 localhost:3000；生产环境用 VITE_API_BASE 环境变量。

【约束】所有状态码分支都要处理；错误提示用中文；注释用中文。`;

const AUTH_FETCH = `// api.js —— 三轮迭代后的最终形态：统一入口 + 鉴权 + 状态码全覆盖
const BASE = import.meta.env.VITE_API_BASE ?? "/api";

function getToken() {
  return localStorage.getItem("token");
}

export async function authFetch(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: "Bearer " + getToken() } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {              // 登录过期：统一善后
    localStorage.removeItem("token");
    location.hash = "#/login";
    throw new Error("登录已过期，请重新登录");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "HTTP " + res.status);
  }
  return res.status === 204 ? null : res.json();
}

export const listPosts = () => authFetch("/posts").then((r) => r.data);
export const getPost = (id) => authFetch("/posts/" + id).then((r) => r.data);
export const createPost = (title, body) =>
  authFetch("/posts", { method: "POST", body: JSON.stringify({ title, body }) });
export const deletePost = (id) => authFetch("/posts/" + id, { method: "DELETE" });`;

const CORS_CONFIG = `// server.js —— 生产/开发两用的 CORS 配置
const allowList = ["https://blog.example.com", "http://localhost:5173", "http://localhost:5500"];

app.use(
  cors({
    origin(origin, cb) {
      // origin 为 undefined 的情况：同源请求或服务端之间的调用（如 curl），直接放行
      if (!origin || allowList.includes(origin)) cb(null, true);
      else cb(new Error("不在允许列表的来源: " + origin));
    },
    credentials: true,        // 如果以后要带 Cookie 登录，必须开这个
  })
);

// 评审要点：AI 默认写 app.use(cors()) 全开放（生产严禁）；
// 追问「把允许列表收紧到白名单」才算上线级代码。`;

const QUIZ = [
  {
    question: "项目三的提示词为什么要分两轮（先假数据页面、再接真实接口）？",
    options: [
      "为了省提示词字数",
      "把「界面与状态」和「联调」两个复杂度分开消化；api.js 的固定签名让第二步只换实现不动组件",
      "AI 无法一次生成全栈项目",
      "为了多看几轮输出",
    ],
    answerIndex: 1,
    explanation:
      "数据访问层抽象（api.js 返回 Promise）让前端与后端可以并行开发——这是真实团队的标准协作方式，也是提示词策略：一次只让 AI 承担一种复杂度。",
  },
  {
    question: "「401 时统一跳登录页」写在哪一层最合适？",
    options: [
      "每个页面组件里各自 try/catch",
      "统一的 authFetch 封装里：所有请求都经过它，401 善后逻辑只写一次",
      "index.html 里",
      "Vite 配置里",
    ],
    answerIndex: 1,
    explanation:
      "横切关注点收敛到数据层。组件树里几十个调用点各自处理 401，迟早有漏网之鱼且行为不一致。",
  },
  {
    question: "生产环境 CORS 配置，为什么不能用 app.use(cors()) 全开放？",
    options: [
      "性能太差",
      "全开放等于任何网站都能带着用户浏览器调你的接口；应按白名单收紧来源",
      "Express 不支持",
      "全开放是最佳实践",
    ],
    answerIndex: 1,
    explanation:
      "CORS 白名单是「你声明哪些外部站点可以使用你的 API」。开发期可以全开方便调试，上线必须收紧——这是落地实验三的核心排错点。",
  },
  {
    question: "「只能删除自己的文章」这条业务规则，应该在哪一层强制？",
    options: [
      "前端隐藏删除按钮就够了",
      "服务端：DELETE 处理函数里校验 Token 的 sub 与文章作者的对应关系，不符返回 403",
      "数据库自动处理",
      "浏览器本地判断",
    ],
    answerIndex: 1,
    explanation:
      "前端隐藏按钮只是体验优化，接口本身必须校验权限（否则直接构造请求就能删别人的文章）。安全规则永远以服务端为准。",
  },
];

export function Project3() {
  return (
    <>
      <p>
        第三篇的毕业作品是一次真正的全栈交付：React 前端 + Express 后端 + JWT 鉴权 + CORS 联调。
        它的提示词也采用「两轮策略」——先界面后联调，把两种复杂度分开消化。
      </p>

      <H2>一、提示词原文（两轮）</H2>
      <CodeBlock code={PROMPT_V1} language="text" filename="prompt-step1.txt" source="第一轮 · 前端页面" />
      <CodeBlock code={PROMPT_V2} language="text" filename="prompt-step2.txt" source="第二轮 · 接入后端" />
      <Callout tone="ai" title="两轮策略的精髓">
        第一轮里最关键的一句是「数据访问必须封装在 api.js，签名与真实接口一致」——
        它在前后端之间立了一份<strong>契约</strong>。第二轮只需要替换 api.js 的实现，
        组件树一行不用动。接口契约先行，是全栈协作的第一原则。
      </Callout>

      <H2>二、逐句拆解</H2>
      <Table
        head={["提示词原句", "意图", "AI 用了什么", "回溯"]}
        rows={[
          [<><code>动态路由 :id</code></>, "详情页", "React Router 的 useParams", "第 8 章 8.4"],
          [<><code>api.js 统一封装，返回 Promise</code></>, "接口契约", "四个函数覆盖增删查；切接口不改组件", "第 10 章 10.5（fetchJSON 的升华）"],
          [<><code>四种界面状态</code></>, "完整状态机", "loading/success/empty/error 各有 UI", "第 11 章 11.2"],
          [<><code>authFetch 自动带 Authorization</code></>, "鉴权收敛", "请求拦截 + 401 统一善后", "第 11 章 11.3"],
          [<><code>token 存 localStorage</code></>, "登录态持久化", "刷新后仍登录；配合 401 清理", "第 11 章 11.3 / 11.6"],
          [<><code>未登录隐藏发布/删除</code></>, "体验层权限", "登录状态驱动条件渲染", "第 7 章 7.4（条件渲染）"],
          [<><code>Vite 代理 → localhost:3000</code></>, "开发期跨域", "server.proxy 配置", "第 11 章 11.1"],
          [<><code>VITE_API_BASE 环境变量</code></>, "多环境", "import.meta.env 读取", "第 11 章 11.1"],
          [<><code>服务端校验 + 只能删自己的</code></>, "安全规则", "JWT sub 与文章作者比对，403 拒绝", "第 10 章 10.7"],
        ]}
      />

      <H2>三、代码精讲</H2>
      <H3>① api.js：全项目的数据咽喉</H3>
      <CodeBlock code={AUTH_FETCH} language="javascript" filename="api.js" />
      <p>
        从第 10 章的 fetchJSON（造轮子③）到这里的 authFetch，封装长了一层「鉴权大脑」：
        Token 自动挂载、401 统一善后、错误信息人类可读、204 特殊处理。
        组件只 import 四个语义化函数，永远不直接碰 fetch。
      </p>
      <H3>② 服务端 CORS：上线级的白名单</H3>
      <CodeBlock code={CORS_CONFIG} language="javascript" filename="server.js" />
      <p>
        对比 AI 的默认产出（<code>app.use(cors())</code> 全开放），白名单版本多了三样：
        来源校验、同源请求放行、credentials 预留。<strong>落地实验三</strong>会让你亲手体验「不开 CORS 时浏览器的反应」，
        把这段代码的每一行都变成肌肉记忆。
      </p>

      <H2>四、技术点回溯（跨三篇的全景）</H2>
      <Table
        head={["技术点", "出自", "在本项目的形态"]}
        rows={[
          [<><strong>语义化 HTML / CSS 布局</strong></>, "第 2-3 章", "文章卡片、列表页骨架"],
          [<><strong>DOM 事件 → 声明式</strong></>, "第 4/6 章", "表单提交、条件渲染全部数据驱动"],
          [<><strong>组件与路由</strong></>, "第 7-8 章", "列表/详情/发布三页 + 动态路由"],
          [<><strong>fetch 与三状态</strong></>, "第 4 章 4.4", "api.js 的四种界面分支"],
          [<><strong>REST 与 Express</strong></>, "第 10 章", "五个接口 + 服务端校验"],
          [<><strong>CORS 与代理</strong></>, "第 10-11 章", "开发代理 + 生产白名单"],
          [<><strong>JWT 鉴权</strong></>, "第 11 章", "登录页、authFetch、权限隐藏"],
          [<><strong>环境变量</strong></>, "第 11 章 11.1", "VITE_API_BASE 多环境切换"],
        ]}
      />

      <H2>五、追问与迭代</H2>
      <StepList
        items={[
          <><strong>追问一（刷新丢登录）：</strong>「刷新后用户被踢回登录页。排查 token 的存取时机，修复后保证刷新仍保持登录。」——病因是 Token 只存了内存；修法见第 11 章 11.6。</>,
          <><strong>追问二（图片上传）：</strong>「文章支持封面图：前端表单用 <code>&lt;input type=&quot;file&quot;&gt;</code>，以 multipart/form-data 提交；后端用 multer 接收并存到 uploads/，静态托管该目录。」——数据格式从 JSON 换成 multipart，是新的知识点，值得单独消化。</>,
          <><strong>追问三（草稿自动保存）：</strong>「发布页每 3 秒把未提交内容存 localStorage，进入页面时若存在则恢复并提示。」——定时器 + 清理函数（第 8 章 useEffect）与序列化的综合练习。</>,
        ]}
      />
      <Callout tone="ai" title="全栈提示词的三条经验">
        ①接口契约先行（api.js 签名）②安全规则写进提示词（服务端校验、权限、CORS 白名单）
        ③分轮消化复杂度（界面 → 联调 → 增强）。三条都用在了本项目里。
      </Callout>

      <H2>六、自测</H2>
      <Quiz id="quiz-p3" questions={QUIZ} />

      <H2>七、带走这个项目</H2>
      <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
        <DownloadButton folderName="mini-blog" files={PACK_LAND3} label="下载项目三代码包（Express 全栈工程）" />
        <span className="text-xs text-muted-foreground">server.js + public 前端页 + 排错实验说明</span>
      </div>
    </>
  );
}
