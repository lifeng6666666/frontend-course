"use client";

import { BuildBadge, Callout, DevNote, H2, H3, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { EXPERIMENT_7 } from "@/lib/course/experiments";

const MINI_CORE = `// 迷你渲染器的三个函数（实验①的骨架，30 行内解决）
function h(tag, props, ...children) {
  return { tag, props: props || {}, children };      // ① 造虚拟节点：一个普通对象
}

function render(vnode) {
  if (typeof vnode === "string") return document.createTextNode(vnode);
  const el = document.createElement(vnode.tag);
  for (const key in vnode.props) {
    if (key.slice(0, 2) === "on")                     // onClick → click 监听
      el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
    else
      el.setAttribute(key, vnode.props[key]);         // class / id / src …
  }
  vnode.children.forEach((c) => el.appendChild(render(c)));  // 递归渲染子节点
  return el;
}

function mount(vnode, container) {
  container.replaceChildren(render(vnode));           // ② 整棵挂载（重画）
}

// ③ 用法：state → App() → mount
let count = 0;
function App() {
  return h("div", null,
    h("p", null, "点击了 " + count + " 次"),
    h("button", { onClick: () => { count++; mount(App(), document.getElementById("root")); } }, "+1")
  );
}
mount(App(), document.getElementById("root"));`;

const JSX_COMPILED = `// 你写的 JSX：
const el = <button onClick={handleClick} className="btn">+1</button>;

// Babel 编译后的真实 JavaScript：
import { jsx as _jsx } from "react/jsx-runtime";
const el = _jsx("button", {
  className: "btn",
  onClick: handleClick,
  children: "+1"
});

// 第 1 章你已经知道浏览器的流水线；这里补一环：
// 浏览器不认识 JSX，构建工具（Vite 里的 Babel/SWC）会先把它编译成上面这样的
// 普通函数调用，再交给浏览器执行。「语法糖」的本质就是一次自动改写。`;

const PROPS_SAMPLE = `// 组件 = 接收 props、返回 JSX 的函数。props 只读！
function TaskCard({ title, desc, tag }) {     // 解构 props（第 3 章 3.x 的解构语法）
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="tag">{tag}</span>
    </article>
  );
}

// 复用 = 传不同的 props：
<TaskCard title="实验 1" desc="第一个网页" tag="HTML" />
<TaskCard title="实验 2" desc="作品集骨架" tag="HTML" />

// children：写在标签对之间的内容，作为特殊 prop 传递——布局组件的灵魂
function Panel({ children }) {
  return <section className="panel">{children}</section>;
}
<Panel>
  <h2>任意内容</h2>
  <p>都能塞进 Panel 里</p>
</Panel>`;

const KEY_SAMPLE = `{todos.map((todo) => (
  <li key={todo.id}>          {/* key 告诉 React「这一项是谁」，diff 靠它精准定位 */}
    {todo.text}
  </li>
))}

// 条件渲染：JSX 里没有 if 语句，用表达式
{loading && <p>加载中…</p>}                     {/* 逻辑与：true 才渲染 */}
{error ? <ErrorBox msg={error} /> : <List data={data} />}  {/* 三元 */}
{todos.length === 0 && <EmptyTip />}`;

const AI_REACT_SAMPLE = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// 逐行拆解：
// import … createRoot   → 模块导入（第 5 章）；createRoot 是 React 18+ 的挂载入口
// document.getElementById("root") → 第 1 章的 DOM 查询；root 是 index.html 里的挂载点
// .render(<App />)      → 挂载：把组件树变成真实 DOM，塞进 root
// <StrictMode>          → 开发期「放大镜」：对不安全写法（如副作用重复执行）给出警告
//                          它本身不渲染任何界面，生产构建里自动无副作用`;

const QUIZ = [
  {
    question: "JSX 本质是什么？",
    options: [
      "一种新的编程语言",
      "语法糖：编译后就是 React.createElement / jsx 的函数调用",
      "浏览器原生支持的模板语法",
      "HTML 的别名",
    ],
    answerIndex: 1,
    explanation:
      "浏览器不认识 JSX，构建工具先把它编译成普通 JS 函数调用再执行。实验②的注释里有完整对照。",
  },
  {
    question: "关于 props，正确的是？",
    options: [
      "组件内部可以随意修改 props",
      "props 只读：组件不能修改传入的 props，需要变化的数据应该用 state",
      "props 只能传字符串",
      "props 是全局变量",
    ],
    answerIndex: 1,
    explanation:
      "props 是「父组件对子组件的配置」，单向流动。改 props 不会触发重渲染，且违反单向数据流，是新手最高频错误之一。",
  },
  {
    question: "列表渲染时 key 的作用是？",
    options: [
      "CSS 选择器用",
      "帮助 diff 算法识别「每一项是谁」，从而精准复用与更新 DOM 节点",
      "必须从 0 开始连续编号",
      "只是为了通过编译",
    ],
    answerIndex: 1,
    explanation:
      "diff 对比新旧两棵树时按 key 匹配节点。用稳定 id（如 todo.id）做 key；用数组下标会在插入/删除时错位复用，引发诡异 bug。",
  },
  {
    question: "实验①的迷你渲染器里，点击按钮后界面更新的方式是？",
    options: [
      "只更新被改的那个文本节点",
      "App() 生成新虚拟树并整棵重画（mount 里 replaceChildren）",
      "浏览器自动 diff",
      "局部刷新页面",
    ],
    answerIndex: 1,
    explanation:
      "迷你渲染器是「整棵重画」版声明式——它让你看清「数据 → 视图」的最小闭环；React 在此基础上补了 diff，避免全量 DOM 操作。",
  },
  {
    question: "AI 生成的入口文件里 <StrictMode> 的作用是？",
    options: [
      "开启严格模式的 CSS",
      "开发期把不安全写法暴露出来（如副作用重复执行）；不渲染任何内容，生产环境无影响",
      "禁用 console.log",
      "加快渲染速度",
    ],
    answerIndex: 1,
    explanation:
      "StrictMode 是 React 的开发期检查器：故意双调用一些函数来暴露副作用隐患。见到它双份 log 不要慌，生产构建不会这样。",
  },
];

export function Chapter7() {
  return (
    <>
      <p>
        上一章说清了框架的「为什么」。这一章开始用 React——但顺序是反的：
        <strong>先手造，再用</strong>。你会先写一个 30 行的迷你渲染器，看清「虚拟节点 → 真实 DOM」的全过程；
        然后打开真正的 React，你会发现每一步都似曾相识。学完你将能够：
      </p>
      <StepList
        items={[
          <><strong>手造迷你渲染器</strong>（造轮子 ①），说出 React 渲染的最小闭环；</>,
          <>解释 JSX 的编译对照，能心算「JSX → 函数调用」；</>,
          <>用组件 + props 组合界面，区分 props 与 state；</>,
          <>正确使用列表 key 与条件渲染；</>,
          <><strong>组件化重写第一篇的任务清单</strong>（实验 7）。</>,
        ]}
      />

      <H2>7.1 先手造：30 行迷你渲染器</H2>
      <p>
        <BuildBadge>造轮子 ①</BuildBadge>
        React 的核心循环只有三步：造虚拟节点 → 变成真实 DOM → 挂载。先看我们自己的版本（实验①可运行）：
      </p>
      <CodeBlock code={MINI_CORE} language="javascript" filename="mini-renderer.js" />
      <StepList
        items={[
          <><code>h()</code> 不碰 DOM，只造普通对象——「按钮是什么、有什么属性、有哪些孩子」。这就是虚拟节点。</>,
          <><code>render()</code> 递归地把对象变成真实 DOM：属性、事件监听、子节点一一落位。</>,
          <><code>mount()</code> 把整棵树塞进容器。数据变了？再调一次 <code>App()</code> + <code>mount()</code>，整棵重画。</>,
        ]}
      />
      <p>
        记住这个「数据 → 描述 → 真实 DOM」的闭环，接下来的一切都是给它的增量升级。
      </p>

      <H2>7.2 JSX：你写糖，工具写函数</H2>
      <p>
        <code>h("button", &lbrace;...&rbrace;, "+1")</code> 能用但难读。JSX 让你直接写 <code>&lt;button&gt;+1&lt;/button&gt;</code>——
        编译时自动还原成函数调用。看对照：
      </p>
      <CodeBlock code={JSX_COMPILED} language="javascript" filename="jsx-compiled.js" source="编译对照" />
      <Callout tone="info" title="本课程实验沙箱的转译">
        第 7-9 章的 React 实验在浏览器内用 Babel 即时转译 JSX（无需构建），所以你改完代码点「运行」就能看到结果。
        真实工程里这一步由 Vite 在开发服务器里完成——你在第 5 章见过的 HMR，转译的就是这些文件。
      </Callout>

      <H2>7.3 组件与 props：界面的函数化</H2>
      <p>
        组件就是「接收 props、返回 JSX 的函数」。props 是父组件传给子组件的只读配置——
        <strong>props 只读</strong>是单向数据流的第一条纪律：
      </p>
      <CodeBlock code={PROPS_SAMPLE} language="jsx" filename="props.jsx" />
      <KVTable
        head={["概念", "一句话", "谁拥有它"]}
        rows={[
          { k: "props", v: "父组件传入的只读配置", v2: "父组件" },
          { k: "state", v: "组件自己的、会变的数据（下一章主角）", v2: "组件自己" },
          { k: "children", v: "标签对之间的内容，特殊的 prop", v2: "调用方" },
        ]}
      />

      <H2>7.4 列表与条件渲染：JSX 里没有 if</H2>
      <p>
        JSX 本质是函数调用，所以「逻辑」全靠 JS 表达式完成——数组用 <code>map</code> 渲染成列表，
        条件用 <code>&amp;&amp;</code> 与三元：
      </p>
      <CodeBlock code={KEY_SAMPLE} language="jsx" filename="list.jsx" />
      <Callout tone="warn" title="key 的三条纪律">
        一用稳定唯一 id，不用数组下标；二只在同一层兄弟之间比较时唯一；三不要用 Math.random()（每次渲染都变，等于没有 key）。
        实验③里你会亲手删掉 key，看控制台警告。
      </Callout>

      <H2>7.5 实验 7：从迷你渲染器到真 React</H2>
      <p>
        三步走：先跑自己手造的渲染器，再进真 React 验证「同一件事」，最后组件化重写任务清单：
      </p>
      <Playground experiment={EXPERIMENT_7} />

      <H2>7.6 AI 产出精读：入口文件的四件套</H2>
      <p>
        任何 AI 生成的 React 工程都有一个长得几乎一样的入口文件。逐行读懂它，React 项目对你就不再有黑盒：
      </p>
      <CodeBlock code={AI_REACT_SAMPLE} language="jsx" filename="main.jsx" source="AI 生成 · 典型入口" />
      <Table
        head={["逐行拆解", "回溯"]}
        rows={[
          [<><code>import &lbrace; createRoot &rbrace;</code></>, "ESM 导入（第 5 章 5.1）"],
          [<><code>getElementById("root")</code></>, "DOM 查询（第 4 章 4.1）；对应实验 5 虚拟文件树里 index.html 的挂载点"],
          [<><code>.render(&lt;App /&gt;)</code></>, "mount 的工业版：本章节实验①里你手写的那个函数"],
          [<><code>&lt;StrictMode&gt;</code></>, "开发期检查器：双调用暴露副作用隐患（第 8 章 useEffect 时你会遇到）"],
        ]}
      />

      <H2>7.7 自测</H2>
      <Quiz id="quiz-ch7" questions={QUIZ} />
    </>
  );
}
