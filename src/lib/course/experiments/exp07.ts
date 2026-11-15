import type { Experiment } from "./types";

const MINI_RENDERER = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>手造迷你渲染器：先看看 React 在做什么</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 560px; margin: 28px auto; padding: 0 16px; color: #1f2937; }
    button { cursor: pointer; padding: 6px 14px; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  </style>
</head>
<body>
  <h2>30 行迷你渲染器</h2>
  <p>下面没有 React——渲染器是我们自己写的。点按钮试试。</p>
  <div id="root"></div>

  <script>
    // 1) h()：制造「虚拟节点」——一个描述界面的普通 JS 对象
    //    相当于 React.createElement
    function h(tag, props, ...children) {
      return { tag: tag, props: props || {}, children: children };
    }

    // 2) render()：把虚拟节点变成真实 DOM
    function render(vnode) {
      if (typeof vnode === "string") return document.createTextNode(vnode);
      const el = document.createElement(vnode.tag);
      for (const key in vnode.props) {
        if (key.slice(0, 2) === "on") {
          el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
        } else {
          el.setAttribute(key, vnode.props[key]);
        }
      }
      vnode.children.forEach(function (child) { el.appendChild(render(child)); });
      return el;
    }

    // 3) mount()：挂载——用「整棵重画」更新容器
    function mount(vnode, container) {
      container.replaceChildren(render(vnode));
    }

    // ---------- 用它写一个「组件」：数据 + 视图描述 ----------
    let count = 0; // state

    function App() {
      return h("div", null,
        h("p", null, "点击了 " + count + " 次"),
        h("button", { onClick: function () { count++; mount(App(), document.getElementById("root")); } }, "+1")
      );
    }

    mount(App(), document.getElementById("root"));
    // 点击按钮 → count 变化 → App() 描述新界面 → mount() 整棵重画
  </script>
</body>
</html>
`;

const STEP2_BODY = `import React from "react";
import { createRoot } from "react-dom/client";

// 你刚在①里手写的 h() → React 里叫 React.createElement
// JSX 只是它的语法糖：
//
//   <button onClick={...}>+1</button>
//   ↓ Babel 编译后（把下面这行想象成编译输出）
//   React.createElement("button", { onClick: ... }, "+1")
//
function Counter({ start }) {
  return (
    <div>
      <p>从 {start} 开始：点击了 {start} 次</p>
      <button onClick={() => alert("按钮被点击了（事件处理和①里的 addEventListener 一个道理）")}>
        +1
      </button>
    </div>
  );
}

// 组件是可以复用的：传不同的 props，得到不同「配置」的同一组件
function App() {
  return (
    <>
      <Counter start={0} />
      <Counter start={10} />
      <Counter start={100} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);`;

const STEP3_BODY = `import React, { useState } from "react";
import { createRoot } from "react-dom/client";

// 任务清单 · React 组件化版
// 对比第 6 章的命令式写法：这里没有一行手动操作 DOM
function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "读懂迷你渲染器" },
    { id: 2, text: "组件化重写任务清单" },
  ]);
  const [text, setText] = useState("");

  function addTodo() {
    if (!text.trim()) return;
    setTodos(todos.concat({ id: Date.now(), text: text })); // 不可变更新：concat 生成新数组
    setText("");
  }

  function removeTodo(id) {
    // TODO：用 filter 过滤掉要删除的那条，然后 setTodos——
    // 注意：不要直接修改原数组（todos.splice 不行），要生成新数组
  }

  return (
    <div>
      <h2>任务清单（React）</h2>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}   // 受控组件：input 的值由 state 驱动
        placeholder="新增待办，回车添加"
        onKeyDown={(e) => e.key === "Enter" && addTodo()}
      />
      <button onClick={addTodo}>添加</button>
      <ul>
        {todos.map((todo) => (
          // key 帮 React 识别「哪一条是谁」——删除时它靠 key 精准定位，而不是整棵重画
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
      <p>{todos.length === 0 ? "都做完了，喝口水" : "还有 " + todos.length + " 条"}</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);`;

export const EXPERIMENT_7: Experiment = {
  id: "exp7",
  badge: "浏览器内转译",
  title: "实验 7 · 从迷你渲染器到真 React",
  intro:
    "三步：①先手造一个 30 行的迷你渲染器，看清「虚拟节点 → 真实 DOM」的本质；②换真 React，理解 JSX 只是语法糖；③组件化重写第 6 章的任务清单。",
  tasks: [
    "步骤①：点几次 +1 按钮，在控制台里确认：每次点击都是整棵重画（改一下代码让按钮点完变红试试）",
    "步骤②：给 <Counter /> 传一个新 props（比如 tip=\"你好\"），并在组件里渲染出来",
    "步骤③：补全 removeTodo 的 TODO（提示：filter 生成新数组）",
    "步骤③：故意在 map 里把 key={todo.id} 删掉运行，看控制台的黄色警告——这就是为什么列表必须写 key",
  ],
  steps: [
    {
      id: "step1",
      label: "① 手造迷你渲染器",
      brief:
        "这份代码没有引任何库。h() 造虚拟节点、render() 造真实 DOM、mount() 整棵挂载——React 的核心循环和它同构。点 +1 时发生了什么？看代码最后三行注释。",
      code: MINI_RENDERER,
    },
    {
      id: "step2",
      label: "② JSX 与 props",
      brief:
        "同样的「组件」，换成了 React + JSX。看代码顶部注释里的编译对照。任务：复制一行 <Counter start={2026} /> 试试——组件复用就是「传不同的 props」。",
      code: STEP2_BODY,
      mode: "react",
    },
    {
      id: "step3",
      label: "③ 组件化重写任务清单",
      brief:
        "第 6 章命令式写了 40 行的手动 DOM 操作，React 版只剩「改 state」。补全 removeTodo，再故意删掉 key 看警告。",
      code: STEP3_BODY,
      mode: "react",
    },
  ],
  files: [
    { name: "mini-renderer.html", content: MINI_RENDERER },
    { name: "todo-react.jsx", content: STEP3_BODY },
  ],
  readme:
    "mini-renderer.html 双击即可打开（无依赖）；todo-react.jsx 是步骤③参考答案，无法直接双击运行——Vite 工程里的用法见第 5 章。",
  console: true,
};
