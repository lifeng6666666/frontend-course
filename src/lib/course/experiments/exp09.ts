import type { Experiment } from "./types";

const STEP1_BODY = `import React from "react";
import { createRoot } from "react-dom/client";

// Tailwind 思想：不写 .card { padding: 16px; ... }，直接把「原子类」写在标签上
// p-4 = padding 1rem   rounded-xl = 圆角   bg-white = 白底   shadow-sm = 小阴影
// 对应关系：传统 CSS 的「起名字 + 写规则」两步，变成了「直接组合原子类」一步

function TaskCard({ title, desc, done }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-800">{title}</h3>
        <span className="text-xs rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700">
          {done ? "已完成" : "进行中"}
        </span>
      </div>
      <p className="mt-1.5 text-sm text-zinc-500">{desc}</p>
    </div>
  );
}

function App() {
  return (
    <div className="max-w-md mx-auto space-y-3">
      <h2 className="text-xl font-bold">任务清单 · Tailwind 版</h2>
      {/* TODO：给下面这张卡片加几个原子类，让它看起来像「待办」——
          试试 border-dashed border-zinc-300 和 opacity-60 */}
      <div className="rounded-xl bg-white">
        <h3>任务卡片二号（TODO：上样式）</h3>
        <p className="text-sm text-zinc-500">把上面注释里的类名复制到 className 里看看效果</p>
      </div>
      <TaskCard title="读懂原子类" desc="p-4、rounded-xl、shadow-sm 分别改了什么？" done={false} />
      <TaskCard title="完成第 9 章实验" desc="给任务应用换上 Tailwind 皮肤" done={true} />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);`;

const STEP2_BODY = `import React, { useState } from "react";
import { createRoot } from "react-dom/client";

// 暗色模式原理：给 <html> 加 class="dark"，所有 dark: 前缀的类随之生效
// 本沙箱的 Tailwind 已配置 darkMode: 'class'（看页面源码第 9 行）
function App() {
  const [dark, setDark] = useState(false);

  function toggle() {
    const next = !dark;
    setDark(next);
    // 原理级操作：改根元素的类名， Tailwind 的 dark: 变体全部联动
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <div className="max-w-md mx-auto space-y-4 transition-colors">
      <button
        onClick={toggle}
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        {dark ? "切回亮色" : "切换暗色"}
      </button>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">暗色卡片</h3>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          我在每个颜色类旁都写了一个 dark: 前缀的「孪生类」。
        </p>
        {/* TODO：把下面这个按钮补全 dark: 孪生类——参考上面任何一处写法 */}
        <button className="mt-3 rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
          我还缺 dark: 孪生类（点暗色模式看看后果）
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);`;

const STEP3_BODY = `import React, { useState } from "react";
import { createRoot } from "react-dom/client";

// 可访问性三件套：键盘可达（button 天生可 Tab）、aria 提示、focus 可见
// 试一试用 Tab 键走一遍这个页面——每个按钮都应该有清晰的焦点框
function App() {
  const [items, setItems] = useState(["键盘按 Tab 走一遍", "用 Enter 勾选我"]);

  function toggle(i) {
    setItems(items.map((t, idx) => (idx === i ? { ...t } : t)));
  }

  return (
    <div className="max-w-md mx-auto space-y-2">
      <h2 className="text-lg font-bold">任务清单 · 可访问性版</h2>
      <ul className="space-y-2">
        {items.map((t, i) => (
          <li key={i} className="flex items-center gap-2">
            {/* button 天生可键盘操作（Tab 聚焦、Enter 按下）——
                比 onClick 的 <li> 或 <div> 更可访问 */}
            <button
              onClick={() => toggle(i)}
              aria-pressed={false}
              aria-label={"勾选任务：" + t}
              className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                         hover:border-emerald-500"
            >
              ☐ {t}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-zinc-500">
        aria-label 让读屏软件念出按钮用途；focus:ring 让键盘用户看清焦点在哪。
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);`;

export const EXPERIMENT_9: Experiment = {
  id: "exp9",
  badge: "浏览器内转译",
  title: "实验 9 · 任务应用 UI 升级：Tailwind、暗色模式与可访问性",
  intro:
    "沙箱里预装了 Tailwind 的浏览器版：原子类即时生效，不需要构建步骤。三步升级任务应用的外观，同时补上可访问性短板。",
  tasks: [
    "步骤①：把 TODO 卡片补上 border-dashed border-zinc-300 opacity-60，观察「待办」的视觉感从哪来",
    "步骤②：先点「切换暗色」看看那张缺孪生类的按钮变成了什么——然后给它补上 dark: 类",
    "步骤③：只用 Tab 键（和 Enter）操作一遍任务列表，确认每一步焦点可见",
    "步骤③：给 aria-pressed 传 true/false 让它反映按钮真实状态（改完用暗色模式验证无报错）",
  ],
  steps: [
    {
      id: "step1",
      label: "① 原子类初见",
      brief: "传统 CSS：起类名、写规则、防冲突。Tailwind：直接组合 p-4 / rounded-xl / shadow-sm 这些原子类。先读 TaskCard，再完成 TODO。",
      code: STEP1_BODY,
      mode: "tailwind",
    },
    {
      id: "step2",
      label: "② 暗色模式",
      brief: "核心机制只有一行：document.documentElement.classList.toggle(\"dark\", next)。dark: 前缀的类全部随之联动。",
      code: STEP2_BODY,
      mode: "tailwind",
    },
    {
      id: "step3",
      label: "③ 可访问性",
      brief: "三处改动：用 button 而不是 div、加 aria-label/aria-pressed、加 focus:ring。可访问性不是附加题，是成本极低的基本功。",
      code: STEP3_BODY,
      mode: "tailwind",
    },
  ],
  files: [{ name: "todo-tailwind.jsx", content: STEP2_BODY }],
  readme: "第 9 章参考答案（暗色模式版）。真实工程中 Tailwind 通过 PostCSS 集成，见项目二复盘的 Vite 工程包。",
};
