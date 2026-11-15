import type { Experiment } from "./types";

const HASH_ROUTER = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>手写 hash 路由：SPA 的骨架</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 560px; margin: 28px auto; padding: 0 16px; color: #1f2937; }
    nav a { margin-right: 12px; color: #059669; text-decoration: none; padding: 4px 10px; border-radius: 6px; }
    nav a.active { background: #059669; color: #fff; }
    .page { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-top: 16px; }
    .tip { color: #6b7280; font-size: 13px; }
  </style>
</head>
<body>
  <nav>
    <a href="#/" data-route="/">首页</a>
    <a href="#/tasks" data-route="/tasks">任务页</a>
    <a href="#/about" data-route="/about">关于页</a>
  </nav>
  <div id="view"></div>
  <p class="tip">注意地址栏：URL 以 # 开头变化，页面从不刷新——这就是单页应用（SPA）。</p>

  <script>
    // 「路由表」：路径 → 渲染函数
    const routes = {
      "/": () => '<div class="page"><h2>首页</h2><p>这是 #/ 对应的页面。</p></div>',
      "/tasks": () => '<div class="page"><h2>任务页</h2><p>还记得第 2 章的锚点跳转吗？hash 最初就是干这个的，路由是它的「新用法」。</p></div>',
      "/about": () => '<div class="page"><h2>关于页</h2><p>页面从不刷新，内容全靠 JS 换。</p></div>',
    };

    function render() {
      // ① 取当前 hash：#/tasks → "/tasks"；没有 hash 时视为 "/"
      const path = (location.hash.slice(1) || "/").split("?")[0];
      // ② 查路由表：查不到就渲染 404
      const html = routes[path] ? routes[path]() : '<div class="page"><h2>404</h2><p>页面不存在</p></div>';
      // ③ 换内容 + 高亮导航
      document.getElementById("view").innerHTML = html;
      document.querySelectorAll("[data-route]").forEach((a) => {
        a.classList.toggle("active", a.dataset.route === path);
      });
    }

    window.addEventListener("hashchange", render); // hash 一变就重渲染
    render();                                       // 首次进入也渲染一次
  </script>
</body>
</html>
`;

const USESTATE_BODY = `import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  // useState 返回一对：当前值 + 修改函数。修改函数被调用后 React 会重新渲染
  const [todos, setTodos] = useState([
    { id: 1, text: "学会 useState", done: false },
    { id: 2, text: "学会不可变更新", done: true },
  ]);
  const [input, setInput] = useState("");

  function addTodo() {
    if (!input.trim()) return;
    // 不可变更新三件套：concat 加、map 改、filter 删
    // TODO 1：添加一条 { id: Date.now(), text: input, done: false }
  }

  function toggleTodo(id) {
    // TODO 2：把对应条目的 done 取反（map + 三元表达式）
    // 提示：todo.id === id ? { ...todo, done: !todo.done } : todo
  }

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div>
      <h2>任务清单 · useState</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="回车添加" />
      <ul>
        {todos.map((t) => (
          <li key={t.id} onClick={() => toggleTodo(t.id)} style={{ cursor: "pointer" }}>
            <span style={t.done ? { textDecoration: "line-through", color: "#9ca3af" } : null}>
              {t.done ? "☑ " : "☐ "}{t.text}
            </span>
          </li>
        ))}
      </ul>
      <p>已完成 {doneCount} / {todos.length}</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);`;

const USEEFFECT_BODY = `import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [todos, setTodos] = useState(() => {
    // 初始化函数只执行一次：先把上次存的读出来
    try {
      return JSON.parse(localStorage.getItem("todos")) || [];
    } catch {
      return [];
    }
  });

  // 副作用：把 todos 同步到 localStorage
  // 依赖数组 [todos] 的含义：「只有 todos 变了，这个副作用才重新执行」
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    console.log("已保存", todos.length, "条任务");
  }, [todos]);

  function addTodo() {
    const text = "任务 " + (todos.length + 1);
    setTodos(todos.concat({ id: Date.now(), text, done: false }));
  }

  return (
    <div>
      <h2>任务清单 · localStorage 持久化</h2>
      <button onClick={addTodo}>加一条任务</button>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>{t.text}{t.done ? " ✓" : ""}</li>
        ))}
      </ul>
      <p style={{ color: "#6b7280", fontSize: 13 }}>
        现在点几次「加一条任务」，然后点击预览窗格右上角的「运行」刷新整个沙箱——
        任务还在吗？在，因为 localStorage 存住了它们。
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);`;

const ROUTER_BODY = `import React, { useState } from "react";
import { HashRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { createRoot } from "react-dom/client";

// 三个页面组件——真实项目里通常一个页面一个文件
function Home() {
  return <div><h2>首页</h2><p>这是 / 对应的页面。</p></div>;
}

function Tasks() {
  const [todos, setTodos] = useState(["复刻手写路由", "用 React Router"]);
  return (
    <div>
      <h2>任务页</h2>
      <ul>{todos.map((t) => <li key={t}>{t}</li>)}</ul>
    </div>
  );
}

function About() {
  return <div><h2>关于页</h2><p>NavLink 自动带 active 类名，导航高亮不用自己写。</p></div>;
}

function App() {
  return (
    // HashRouter：地址用 #/xxx 形式——和你手写的路由一模一样，但支持嵌套路由、参数、守卫
    <HashRouter>
      <nav style={{ display: "flex", gap: 12 }}>
        <NavLink to="/">首页</NavLink>
        <NavLink to="/tasks">任务页</NavLink>
        <NavLink to="/about">关于页</NavLink>
      </nav>
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/about" element={<About />} />
        {/* 没匹配到的路径统一重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);`;

export const EXPERIMENT_8: Experiment = {
  id: "exp8",
  badge: "浏览器内转译",
  title: "实验 8 · Hooks、手写路由与 React Router",
  intro:
    "四步：①手写一个 30 行的 hash 路由，看懂 SPA「地址变、页面不刷新」的原理；②用 useState 完成任务清单；③用 useEffect 加上 localStorage 持久化；④升级到工业级的 React Router。",
  tasks: [
    "步骤①：点导航切换三个页面，注意地址栏的 # 与页面的无刷新变化；把地址改成 #/none 看看 404 分支",
    "步骤②：完成 TODO 1（concat 添加）和 TODO 2（map 改 done）",
    "步骤③：点几次按钮后点「运行」刷新沙箱，验证 localStorage 持久化生效",
    "步骤④：对照步骤①的手写路由找对应关系：routes 表 ↔ <Routes>；render() ↔ 自动重渲染；active 高亮 ↔ NavLink",
  ],
  steps: [
    {
      id: "step1",
      label: "① 手写 hash 路由",
      brief: "整个 SPA 只有一份 HTML，所谓「换页」不过是监听 hashchange、查表、换 innerHTML。第 8.3 节会把它逐行拆解。",
      code: HASH_ROUTER,
    },
    {
      id: "step2",
      label: "② useState 任务清单",
      brief: "TODO 1、2 都在改数据的位置。写完点任务条目试试切换完成状态——UI 的勾选样式是数据驱动的，没有一行手动改 DOM。",
      code: USESTATE_BODY,
      mode: "react",
    },
    {
      id: "step3",
      label: "③ useEffect 持久化",
      brief: "重点看 useEffect 的依赖数组 [todos]。控制台会打印每次保存——数一数：一次添加触发了几次保存？为什么？",
      code: USEEFFECT_BODY,
      mode: "react",
    },
    {
      id: "step4",
      label: "④ React Router 多页",
      brief: "工业级路由把你手写的三件事全部组件化了。对照任务清单第 4 条做映射，这一步做下来，路由就再也不是黑盒。",
      code: ROUTER_BODY,
      mode: "react",
    },
  ],
  files: [
    { name: "hash-router.html", content: HASH_ROUTER },
    { name: "todo-hooks.jsx", content: USESTATE_BODY },
    { name: "todo-router.jsx", content: ROUTER_BODY },
  ],
  readme: "hash-router.html 双击可打开；两个 .jsx 参考答案用于 Vite 工程。",
  console: true,
};
