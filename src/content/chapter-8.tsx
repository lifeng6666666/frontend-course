"use client";

import { BuildBadge, Callout, H2, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { EXPERIMENT_8 } from "@/lib/course/experiments";

const USESTATE_SAMPLE = `// useState：一对返回值 [当前值, 修改函数]
const [todos, setTodos] = useState([
  { id: 1, text: "学会 useState", done: false },
]);

// 修改 = 生成新数据，而不是修改旧数据（不可变更新）
setTodos(todos.concat({ id: 2, text: "新任务", done: false }));  // 加：concat
setTodos(todos.map((t) => t.id === 1 ? { ...t, done: true } : t)); // 改：map + 展开
setTodos(todos.filter((t) => t.id !== 1));                        // 删：filter

// 依赖旧值时，用「函数式更新」最稳（连点三次也不会丢状态）：
setCount((prev) => prev + 1);`;

const USEEFFECT_SAMPLE = `// 副作用：React 渲染之外的一切 —— 定时器、订阅、localStorage、网络请求
useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(todos));
  console.log("已保存", todos.length, "条");       // 依赖数组的作用：只有 todos 变了才执行
}, [todos]);

// 三个常见依赖数组写法：
useEffect(() => { /* 每次渲染后都执行 */ });                 // 不写：慎用
useEffect(() => { /* 只在首次渲染后执行一次 */ }, []);        // 空数组：挂载时机
useEffect(() => { /* todos 变了才执行 */ }, [todos]);        // 有依赖

// 清理函数：组件卸载或依赖变化前调用，防止定时器/订阅泄漏
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);           // 返回的函数就是清理函数
}, []);`;

const HASH_ROUTER_EXPLAIN = `// 30 行 hash 路由的核心三步（实验①逐行可读）
const routes = {
  "/": () => "<div>首页</div>",
  "/tasks": () => "<div>任务页</div>",
};

function render() {
  const path = (location.hash.slice(1) || "/").split("?")[0]; // ① 读：#/tasks → /tasks
  const html = routes[path] ? routes[path]() : "<div>404</div>"; // ② 查：路由表查不到就 404
  document.getElementById("view").innerHTML = html;           // ③ 换：整页内容替换
}

window.addEventListener("hashchange", render); // hash 一变 → 重渲染；页面从不刷新`;

const ROUTER_MAP = `// 把手写路由「翻译」成 React Router：
<HashRouter>                                    // 事件监听 + 状态管理，全被组件化
  <nav>
    <NavLink to="/tasks">任务页</NavLink>        // 自动带 active 高亮，替代手写 toggle
  </nav>
  <Routes>                                       // routes 表 → 声明式配置
    <Route path="/" element={<Home />} />
    <Route path="/tasks" element={<Tasks />} />
    <Route path="*" element={<Navigate to="/" replace />} />  // 404 兜底 → 重定向
  </Routes>
</HashRouter>`;

const AI_EFFECT_BUG = `// AI 生成代码里的经典隐患：useEffect 死循环
function Bad() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/items")
      .then((r) => r.json())
      .then((d) => setItems(d.data));   // setItems 触发重渲染 → effect 重跑 → 再 fetch …
  });                                   // ← 忘了依赖数组！每次渲染后都执行
  return <List items={items} />;
}

// 正确版本：空数组 = 只在挂载后执行一次
function Good() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch("/api/items")
      .then((r) => r.json())
      .then((d) => setItems(d.data));
  }, []);
  return <List items={items} />;
}`;

const QUIZ = [
  {
    question: "为什么 React 强调「不可变更新」？",
    options: [
      "为了代码好看",
      "React 靠「数据引用是否变化」判断要不要重渲染；直接改旧数组引用没变，会被当成「没变」",
      "JavaScript 的限制",
      "为了省内存",
    ],
    answerIndex: 1,
    explanation:
      "setTodos(todos) 传的是同一个引用，React 认为数据没变就不重渲染。concat/map/filter/展开运算符都在生成新引用——这是 Hooks 时代的核心纪律。",
  },
  {
    question: "useEffect 的依赖数组 [todos] 表示？",
    options: [
      "effect 只能访问 todos",
      "只有 todos 变化后，这个 effect 才重新执行",
      "todos 必须是不可变的",
      "todos 是全局状态",
    ],
    answerIndex: 1,
    explanation:
      "依赖数组是 effect 的触发条件。空数组 [] = 只在挂载后跑一次；不写 = 每次渲染后都跑（慎用，容易死循环）。",
  },
  {
    question: "手写 hash 路由的三步是？",
    options: [
      "建表 → 监听 hashchange → 读 hash、查表、换内容",
      "刷新页面 → 读 URL → 重载 JS",
      "用 Cookie 存路径 → 重定向",
      "只能用第三方库实现",
    ],
    answerIndex: 0,
    explanation:
      "读（location.hash）→ 查（路由表）→ 换（更新视图）。React Router 的 HashRouter 把这三步组件化，你手写过之后它就是「熟悉的陌生人」。",
  },
  {
    question: "useEffect 返回一个函数，这个函数什么时候被调用？",
    options: [
      "永远不被调用",
      "组件卸载前，或下一次 effect 重新执行前（清理时机）",
      "每次渲染后立即调用",
      "组件报错时",
    ],
    answerIndex: 1,
    explanation:
      "返回的函数是「清理函数」，负责收尾：清定时器、退订阅、abort 请求。漏写清理是内存泄漏与重复请求的主要来源。",
  },
  {
    question: "AI 生成的 useEffect 代码没有写依赖数组（如 AI_EFFECT_BUG 示例），会发生什么？",
    options: [
      "编译报错",
      "每次渲染后都执行一次 effect：fetch → setState → 重渲染 → 再 fetch，形成请求风暴",
      "只在挂载时执行一次",
      "React 自动补上依赖",
    ],
    answerIndex: 1,
    explanation:
      "不写依赖数组 = 每次渲染后都跑。带 setState 的 effect 会形成「渲染→请求→渲染」死循环。评审 AI 产出时，先看每个 useEffect 的依赖数组。",
  },
];

export function Chapter8() {
  return (
    <>
      <p>
        组件会「动」起来，靠的是两根支柱：state（组件内部会变的数据）与 effect（渲染之外的副作用）。
        再加上应用骨架的关键一环——路由，你就能搭出真正的多页应用了。学完你将能够：
      </p>
      <StepList
        items={[
          <>用 useState 管理状态，熟练执行不可变更新三件套；</>,
          <>用 useEffect 处理副作用，写对依赖数组与清理函数；</>,
          <><strong>手造 30 行 hash 路由</strong>（造轮子 ②），理解 SPA「地址变、页面不刷新」的原理；</>,
          <>把手写路由映射到 React Router 的组件化用法；</>,
          <><strong>完成任务应用的增删改查与 localStorage 持久化</strong>（实验 8）。</>,
        ]}
      />

      <H2>8.1 useState：组件的记忆</H2>
      <p>
        <code>useState</code> 给组件一块「可变记忆」：<code>const [x, setX] = useState(初始值)</code>。
        两条铁律：<strong>改数据必须走 setX</strong>（直接改变量不会触发重渲染）；
        <strong>生成新数据而不是修改旧数据</strong>（不可变更新）：
      </p>
      <CodeBlock code={USESTATE_SAMPLE} language="jsx" filename="use-state.jsx" />
      <Callout tone="warn" title="为什么不能直接改？">
        React 通过「新旧数据是否是同一个引用」判断要不要重渲染。<code>todos.push(...)</code> 修改的还是原数组，
        引用没变，React 就认为「没变」——界面纹丝不动，而数据其实已经变了。这类「界面与数据不同步」的 bug
        最难排查，从源头杜绝：永远 concat / map / filter / 展开运算符。
      </Callout>

      <H2>8.2 useEffect：渲染之外的事</H2>
      <p>
        渲染必须「纯粹」——同样的 props/state 必须渲染出同样的结果，不做任何外部改变。
        定时器、网络请求、localStorage 这些「副作用」统一交给 <code>useEffect</code>：
      </p>
      <CodeBlock code={USEEFFECT_SAMPLE} language="jsx" filename="use-effect.jsx" />
      <KVTable
        head={["依赖数组写法", "执行时机", "典型用途"]}
        rows={[
          { k: "（不写）", v: "每次渲染后", v2: "几乎不用——容易死循环" },
          { k: "[]", v: "首次渲染后执行一次", v2: "初始化：拉一次数据、挂事件" },
          { k: "[todos]", v: "todos 变化后", v2: "同步 localStorage、发送统计" },
          { k: "返回清理函数", v: "卸载前 / 依赖变化前", v2: "清定时器、退订阅、abort 请求" },
        ]}
      />

      <H2>8.3 先手造：30 行 hash 路由</H2>
      <p>
        <BuildBadge>造轮子 ②</BuildBadge>
        多页应用的本质只有三步：读地址、查表、换内容。第 2 章的锚点 <code>#about</code> 之所以能跳，
        是因为浏览器原生监听 hash 变化——SPA 路由就是把这个机制用出了新意：
      </p>
      <CodeBlock code={HASH_ROUTER_EXPLAIN} language="javascript" filename="hash-router.js" />
      <Callout tone="info" title="为什么用 hash 而不是真路径">
        hash（#/tasks）变化不会向服务器发请求，单文件部署即可运行，天然适合本课程的实验沙箱与静态托管。
        真实项目常用 History 路由（路径无 #），但需要服务器配合「所有路径都返回 index.html」——落地实验三会见到。
      </Callout>

      <H2>8.4 React Router：手写路由的工业版</H2>
      <p>你在 8.3 手写的每一样东西，React Router 都给了组件化对应物：</p>
      <CodeBlock code={ROUTER_MAP} language="jsx" filename="router.jsx" />
      <Table
        head={["手写路由", "React Router", "增强"]}
        rows={[
          [<><code>routes = {"{…}"}</code> 路由表</>, <><code>&lt;Routes&gt;&lt;Route /&gt;</code></>, "声明式、支持嵌套路由与动态参数 :id"],
          [<><code>hashchange</code> 监听</>, <><code>&lt;HashRouter&gt;</code></>, "状态与渲染联动，自动重渲染"],
          [<><code>&lt;a href="#/x"&gt;</code></>, <><code>&lt;Link to="/x"&gt;</code></>, "拦截点击做客户端跳转，不整页刷新"],
          [<>手写 active 高亮</>, <><code>&lt;NavLink&gt;</code></>, "自动 active 类名与 aria-current"],
          [<>404 分支</>, <><code>&lt;Route path="*"&gt;</code></>, "可重定向、可渲染 Not Found 页"],
        ]}
      />

      <H2>8.5 localStorage 持久化：数据落在用户浏览器</H2>
      <p>
        任务数据目前活在内存里——刷新就没了。挂到 <code>localStorage</code>（键值对、每域约 5MB、字符串存储）
        只需一个 useEffect：变化时写入，挂载时读出。它是前端本地持久化的第一站
        （IndexedDB 是进阶选项，本课程不做展开）。
      </p>

      <H2>8.6 实验 8：Hooks、手写路由与 React Router</H2>
      <Playground experiment={EXPERIMENT_8} />

      <H2>8.7 AI 产出精读：useEffect 是 AI 代码的高发事故区</H2>
      <p>
        评审 AI 生成的 React 代码，<strong>每个 useEffect 的依赖数组都要重点检查</strong>。
        最典型的事故：带请求的 effect 忘写依赖数组，形成「渲染 → 请求 → setState → 再渲染」死循环：
      </p>
      <CodeBlock code={AI_EFFECT_BUG} language="jsx" filename="effect-bug.js" source="AI 生成 · 典型隐患" />
      <Callout tone="ai" title="追问模板">
        拿到 AI 生成的 effect 代码，三连问：「这个 effect 的触发条件是什么？」「重复执行会发什么？」「清理函数在哪？」
        ——第三问经常暴露定时器与请求未清理的问题。
      </Callout>

      <H2>8.8 自测</H2>
      <Quiz id="quiz-ch8" questions={QUIZ} />
    </>
  );
}
