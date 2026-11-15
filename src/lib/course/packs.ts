import { EXPERIMENT_P4 } from "@/lib/course/experiments/expP4";
import { EXPERIMENT_P5 } from "@/lib/course/experiments/expP5";
import type { ExperimentFile } from "@/lib/course/experiments/types";

/** 各篇「落地实验」与独立项目的下载包。均以 README 开头。 */

/* ============ 落地一：多文件版作品集（双击 index.html 即可） ============ */

export const PACK_LAND1: ExperimentFile[] = [
  {
    name: "README.md",
    content: `# 落地实验一 · 把作品集装进你的电脑

## 怎么运行
1. 解压本压缩包，得到 index.html、css/style.css、js/main.js。
2. **双击 index.html**——浏览器直接打开，不需要安装任何东西。
3. 按 F12 打开开发者工具，完成核对清单（见课程「篇末落地一」页面）。

## 文件结构
- index.html    结构（HTML）
- css/style.css 表现（CSS）：变量、Flex 导航、Grid 卡片、媒体查询、暗色主题
- js/main.js    行为（JS）：主题切换、导航高亮、版权年份

## 观察点
- 把浏览器窗口拉窄：媒体查询在 640px 处切换布局。
- 点右上角「夜间」按钮：CSS 变量整体换肤。
- 在 F12 的 Elements 面板里改任何文字，页面立即变化——DOM 是活的。
`,
  },
  {
    name: "index.html",
    content: `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>张小凡 · 作品集</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="hero">
    <div class="wrap">
      <h1>你好，我是<span class="accent">张小凡</span></h1>
      <p class="sub">Python 工程师 · 正在用 AI 学前端</p>
      <p class="sub">白天写数据管道，晚上把 AI 生成的代码一行行读懂。</p>
      <button id="theme-btn" class="btn">切换夜间 / 日间</button>
    </div>
  </header>

  <nav class="nav">
    <div class="wrap nav-inner">
      <span class="logo">ZXF</span>
      <div class="links">
        <a href="#about">关于我</a>
        <a href="#projects">项目</a>
        <a href="#contact">联系我</a>
      </div>
    </div>
  </nav>

  <main class="wrap">
    <section id="about">
      <h2>关于我</h2>
      <ul class="facts">
        <li><strong>技能</strong>：Python（熟练）、SQL、正在学 HTML / CSS / JavaScript</li>
        <li><strong>目标</strong>：看懂并改得动 AI 生成的每一行代码</li>
        <li><strong>方法</strong>：每个实验亲手做，每个项目逐句复盘</li>
      </ul>
    </section>

    <section id="projects">
      <h2>项目</h2>
      <div class="cards">
        <article class="card">
          <h3>实验 1 · 第一个网页</h3>
          <p>三件套入门，带一个点击计数器。</p>
          <span class="tag">HTML/CSS/JS</span>
        </article>
        <article class="card">
          <h3>实验 2 · 作品集骨架</h3>
          <p>语义化标签与锚点导航。</p>
          <span class="tag">HTML</span>
        </article>
        <article class="card">
          <h3>实验 3 · 响应式样式</h3>
          <p>盒模型、Flex、Grid 与媒体查询。</p>
          <span class="tag">CSS</span>
        </article>
        <article class="card">
          <h3>实验 4 · 动态数据</h3>
          <p>fetch 调接口，渲染名言卡片。</p>
          <span class="tag">JavaScript</span>
        </article>
      </div>
    </section>

    <section id="contact">
      <h2>联系我</h2>
      <p>邮箱：<a href="mailto:xiaofan@example.com">xiaofan@example.com</a></p>
    </section>
  </main>

  <footer>
    <p>© <span id="year"></span> 张小凡 · 用三件套手工打造</p>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
`,
  },
  {
    name: "css/style.css",
    content: `/* ===== 全局变量：改这里 = 改全站 ===== */
:root {
  --bg: #fafaf9;
  --fg: #1c1917;
  --muted: #78716c;
  --card: #ffffff;
  --border: #e7e5e4;
  --accent: #059669;
}
[data-theme="dark"] {
  --bg: #0c0a09;
  --fg: #e7e5e4;
  --muted: #a8a29e;
  --card: #1c1917;
  --border: #292524;
  --accent: #34d399;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.7;
  background: var(--bg);
  color: var(--fg);
  transition: background 0.3s, color 0.3s;
}
.wrap { max-width: 860px; margin: 0 auto; padding: 0 20px; }
.accent { color: var(--accent); }

/* ===== Hero：Flex 居中 ===== */
.hero { padding: 72px 0 56px; text-align: center; }
.hero h1 { font-size: 40px; margin: 0 0 12px; }
.sub { color: var(--muted); margin: 4px 0; }
.btn {
  margin-top: 18px; padding: 10px 22px;
  border: 1px solid var(--border); border-radius: 10px;
  background: var(--card); color: var(--fg);
  cursor: pointer; font-size: 14px;
}

/* ===== 导航栏：Flex 两端对齐 ===== */
.nav { position: sticky; top: 0; background: var(--bg); border-bottom: 1px solid var(--border); z-index: 10; }
.nav-inner { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; }
.logo { font-weight: 800; color: var(--accent); }
.links { display: flex; gap: 8px; }
.links a { color: var(--muted); text-decoration: none; padding: 6px 14px; border-radius: 8px; }
.links a:hover { background: var(--card); color: var(--fg); }

/* ===== 卡片网格：Grid 自动换行 ===== */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 16px;
}
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
}
.card h3 { margin: 0 0 6px; font-size: 15px; }
.card p { margin: 0 0 10px; font-size: 13px; color: var(--muted); }
.tag { font-size: 11px; color: var(--accent); border: 1px solid var(--accent); border-radius: 999px; padding: 2px 10px; }

.facts { padding-left: 20px; }
section { margin: 40px 0; }
h2 { border-bottom: 1px solid var(--border); padding-bottom: 8px; font-size: 20px; }

footer { border-top: 1px solid var(--border); margin-top: 48px; padding: 20px; text-align: center; color: var(--muted); font-size: 13px; }

/* ===== 响应式：窄屏收缩 ===== */
@media (max-width: 640px) {
  .hero h1 { font-size: 28px; }
  .hero { padding: 48px 0 36px; }
  .nav-inner { flex-direction: column; gap: 8px; }
}
`,
  },
  {
    name: "js/main.js",
    content: `// 行为层：主题切换、年份、导航高亮
// 和第 1 章的计数器一样朴素：查 DOM → 监听事件 → 改 DOM/属性

// 1) 主题切换：改的是 <html> 的 data-theme 属性，样式全部由 CSS 变量联动
document.getElementById("theme-btn").addEventListener("click", function () {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
});

// 2) 版权年份自动更新
document.getElementById("year").textContent = new Date().getFullYear();

// 3) 导航高亮：滚动到哪个区块，对应链接就亮起来
const links = document.querySelectorAll(".links a");
window.addEventListener("scroll", function () {
  const sections = ["about", "projects", "contact"];
  let current = "";
  sections.forEach(function (id) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < 120) current = id;
  });
  links.forEach(function (a) {
    a.style.color = a.getAttribute("href") === "#" + current ? "var(--accent)" : "";
  });
});
`,
  },
];

/* ============ 落地二：Vite 任务管理工程（npm install && npm run dev） ============ */

export const PACK_LAND2: ExperimentFile[] = [
  {
    name: "README.md",
    content: `# 落地实验二 · 本地跑起 Vite，亲眼看热更新（HMR）

## 准备
先按附录 B 安装 Node.js（LTS 版本），然后在终端里执行：

    node -v    # 能打印版本号就说明装好了

## 三条命令
    cd task-app
    npm install     # 第一次要联网，把 package.json 里的依赖下载到 node_modules
    npm run dev     # 启动开发服务器，终端会给出 http://localhost:5173

## HMR 核对清单
1. 浏览器打开 http://localhost:5173
2. 打开 src/App.tsx，把标题文字改一个字并保存（Ctrl+S）
3. 观察浏览器：**页面没有刷新，文字瞬间变了**——这就是 HMR
4. 看终端：打印了一行 hmr update /src/App.tsx
5. 把 src/App.tsx 里一处代码改成错的（删一个括号），保存：
   终端与浏览器覆盖层会立刻报错，修好后自动恢复

## 构建预览（可选）
    npm run build   # 产出 dist/ 目录：压缩、改名（带 hash）后的静态文件
    npm run preview # 本地预览构建产物
`,
  },
  {
    name: "package.json",
    content: `{
  "name": "task-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "@vitejs/plugin-react": "^4.5.0",
    "typescript": "~5.8.0",
    "vite": "^6.3.5"
  }
}
`,
  },
  {
    name: "vite.config.ts",
    content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`,
  },
  {
    name: "index.html",
    content: `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>task-app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
  },
  {
    name: "src/main.tsx",
    content: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
  },
  {
    name: "src/index.css",
    content: `:root {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #1c1917;
}
body { margin: 0; background: #fafaf9; }
button { cursor: pointer; }
`,
  },
  {
    name: "src/App.tsx",
    content: `import { useEffect, useState } from "react";
import AddForm from "./components/AddForm";
import TaskItem from "./components/TaskItem";

// 状态提升：列表数据放在父组件，子组件只管「展示」和「上报事件」
// 持久化：useEffect 把每次变化同步进 localStorage（第 8 章）
interface Task {
  id: number;
  text: string;
  done: boolean;
}

function loadTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem("tasks") ?? "[]") as Task[];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "open" ? !t.done : t.done
  );

  return (
    <main className="wrap">
      <h1>任务管理应用</h1>
      <AddForm
        onAdd={(text) =>
          setTasks(tasks.concat({ id: Date.now(), text, done: false }))
        }
      />
      <div className="filters">
        {(["all", "open", "done"] as const).map((f) => (
          <button
            key={f}
            className={filter === f ? "chip active" : "chip"}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "全部" : f === "open" ? "未完成" : "已完成"}
          </button>
        ))}
      </div>
      <ul className="list">
        {visible.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            onToggle={() =>
              setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
            }
            onDelete={() => setTasks(tasks.filter((x) => x.id !== t.id))}
          />
        ))}
      </ul>
      <p className="meta">共 {tasks.length} 条 · 试试改掉这句话保存，亲眼看 HMR</p>
    </main>
  );
}
`,
  },
  {
    name: "src/components/AddForm.tsx",
    content: `import { useState } from "react";

// 受控组件：input 的值来自 state，onChange 每次敲键都同步
interface Props {
  onAdd: (text: string) => void;
}

export default function AddForm({ onAdd }: Props) {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(text.trim());
        setText("");
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新增任务，回车提交"
      />
      <button type="submit">添加</button>
    </form>
  );
}
`,
  },
  {
    name: "src/components/TaskItem.tsx",
    content: `// 展示组件：数据来自 props，操作通过回调上报（数据向下，事件向上）
interface Props {
  task: { id: number; text: string; done: boolean };
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className={task.done ? "item done" : "item"}>
      <label>
        <input type="checkbox" checked={task.done} onChange={onToggle} />
        <span>{task.text}</span>
      </label>
      <button className="del" onClick={onDelete}>删除</button>
    </li>
  );
}
`,
  },
  {
    name: "tsconfig.json",
    content: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
`,
  },
];

/* ============ 落地三：Express 全栈工程（node server.js） ============ */

export const PACK_LAND3: ExperimentFile[] = [
  {
    name: "README.md",
    content: `# 落地实验三 · 本地启动 Express，亲手排一次 CORS 错

## 启动后端（终端 1）
    cd mini-blog
    npm install
    node server.js      # 看到「博客 API 已就绪」即可

## 启动前端（终端 2）
    cd mini-blog/public
    npx serve -l 5500   # 一个极简静态服务器，地址 http://localhost:5500

## 排错实验：亲手制造一次 CORS 报错
1. 打开 http://localhost:5500 —— 一切正常（前端配了 dev 代理或同源）。
2. 打开 server.js，找到 CORS_MIDDLEWARE = false，改成 true 并重启后端。
3. 刷新页面：控制台出现著名的红色 CORS 报错，Network 里多了一条 OPTIONS。
4. 把它改回 true → false，重启，恢复正常。

## 核对清单
- [ ] 后端终端出现「博客 API 已就绪」
- [ ] 前端页面能增删查博客文章
- [ ] 亲手制造并修复过一次 CORS 报错
- [ ] 能说出：CORS 是浏览器的安全机制，不是服务器或前端库的 bug
`,
  },
  {
    name: "package.json",
    content: `{
  "name": "mini-blog",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.0"
  }
}
`,
  },
  {
    name: "server.js",
    content: `// 迷你博客后端：Express + cors
// 这是课程站 /api/* 系列接口的「同款」，本地跑起来就是真实后端
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// ===== 排错实验开关 =====
// true  = 允许所有来源的跨域请求（默认）
// false = 关掉 CORS 中间件 —— 前端跨域调用就会收到浏览器的 CORS 报错
const CORS_MIDDLEWARE = true;

app.use(express.json());
if (CORS_MIDDLEWARE) app.use(cors());

let posts = [
  { id: 1, title: "第一篇：Hello 全栈", body: "前端调后端，就是这么朴素的一条 HTTP 请求。" },
  { id: 2, title: "第二篇：CORS 是什么", body: "浏览器的安全机制：默认不允许页面读别的源的数据。" },
];
let nextId = 3;

// ===== REST API =====
app.get("/api/posts", (req, res) => res.json({ data: posts }));

app.post("/api/posts", (req, res) => {
  const { title, body } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "title 必填" });
  const post = { id: nextId++, title: title.trim(), body: String(body ?? "") };
  posts.push(post);
  res.status(201).json({ data: post });
});

app.delete("/api/posts/:id", (req, res) => {
  const before = posts.length;
  posts = posts.filter((p) => p.id !== Number(req.params.id));
  if (posts.length === before) return res.status(404).json({ error: "文章不存在" });
  res.status(204).end();
});

app.use((req, res) => res.status(404).json({ error: "接口不存在" }));

app.listen(PORT, () => {
  console.log("博客 API 已就绪: http://localhost:" + PORT);
});
`,
  },
  {
    name: "public/index.html",
    content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>迷你博客 · 前端</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    form { display: flex; gap: 8px; }
    input { flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; }
    button { padding: 8px 16px; border: none; border-radius: 8px; background: #059669; color: #fff; cursor: pointer; }
    article { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; margin: 12px 0; }
    article h3 { margin: 0 0 6px; }
    article p { margin: 0; font-size: 14px; color: #6b7280; }
    .del { background: #fee2e2; color: #b91c1c; padding: 2px 10px; font-size: 12px; float: right; }
    #err { color: #b91c1c; font-size: 14px; min-height: 20px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>迷你博客</h1>
  <form id="f">
    <input id="title" placeholder="文章标题" />
    <button>发布</button>
  </form>
  <p id="err"></p>
  <div id="list"></div>

  <script>
    // 注意这个地址：如果前端跑在 5500 端口，它就是一次「跨域请求」
    const API = "http://localhost:3000/api/posts";

    async function load() {
      try {
        const res = await fetch(API);
        const data = await res.json();
        document.getElementById("err").textContent = "";
        document.getElementById("list").innerHTML = data.data
          .map((p) =>
            "<article><button class=\\"del\\" data-id=\\"" + p.id + "\\">删除</button>" +
            "<h3>" + p.title + "</h3><p>" + p.body + "</p></article>"
          )
          .join("");
      } catch (err) {
        // 跨域被拦时，fetch 直接 reject，报错会落在这里
        document.getElementById("err").textContent =
          "加载失败：" + err.message + "\\n（如果看到 Failed to fetch，去 server.js 检查 CORS_MIDDLEWARE 开关）";
      }
    }

    document.getElementById("f").addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      if (!title) return;
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body: "发布于 " + new Date().toLocaleTimeString() }),
      });
      document.getElementById("title").value = "";
      load();
    });

    document.getElementById("list").addEventListener("click", async (e) => {
      const id = e.target.dataset && e.target.dataset.id;
      if (!id) return;
      await fetch(API + "/" + id, { method: "DELETE" });
      load();
    });

    load();
  </script>
</body>
</html>
`,
  },
];

/* ============ 项目四：ECharts 看板单文件 ============ */

export const PACK_P4: ExperimentFile[] = [
  {
    name: "index.html",
    content: EXPERIMENT_P4.html.replace("__CFG__", JSON.stringify({ months: 12, showBar: true, smooth: true })),
  },
  {
    name: "README.md",
    content: `# 项目四 · 数据可视化看板（ECharts）

## 运行
双击 index.html 即可（图表库经 CDN 加载，需联网）。

## 改造建议
1. 把 SALES / PROFIT 两个数组换成 fetch("/api/...") 的返回值——第 10 章的 fetchJSON 直接可用。
2. 复制一份 index.html，只保留折线，体会「配置对象」如何裁剪功能。
3. 看板适配更多数据：把 KPI 的计算改成 reduce 聚合函数并复用。
`,
  },
];

/* ============ 项目五：太空射击单文件 ============ */

export const PACK_P5: ExperimentFile[] = [
  {
    name: "index.html",
    content: EXPERIMENT_P5.html.replace(
      "__CFG__",
      JSON.stringify({ enemySpeed: 110, fireInterval: 260, spawnInterval: 900, playerSpeed: 280 })
    ),
  },
  {
    name: "README.md",
    content: `# 项目五 · 2D 太空射击游戏（Canvas）

## 运行
双击 index.html，方向键 / A D 移动，空格射击。

## 改造建议
1. 把 CFG 里的数值改一改，感受「手感 = 循环里的数值」。
2. 给敌机加两种速度（快慢搭配）：只需要在 spawnEnemy 里随机 vy 时分两档。
3. 加音效：击中时 new Audio("hit.mp3").play()——注意浏览器要求用户先有交互。
`,
  },
];
