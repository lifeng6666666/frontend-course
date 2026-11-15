/** 实验 5：npm create vite 的终端回放数据与虚拟文件树 */

export interface TerminalLine {
  kind: "cmd" | "out" | "ok" | "warn";
  text: string;
}

export const TERMINAL_SCRIPT: TerminalLine[] = [
  { kind: "cmd", text: "npm create vite@latest task-app -- --template react-ts" },
  { kind: "out", text: "│" },
  { kind: "out", text: "◇  Project name:" },
  { kind: "out", text: "│  task-app" },
  { kind: "out", text: "│" },
  { kind: "out", text: "◇  Select a framework:" },
  { kind: "out", text: "│  React" },
  { kind: "out", text: "│" },
  { kind: "out", text: "◇  Select a variant:" },
  { kind: "out", text: "│  TypeScript" },
  { kind: "out", text: "│" },
  { kind: "ok", text: "◆  Scaffolding project in ./task-app..." },
  { kind: "out", text: "│" },
  { kind: "ok", text: "└─ Done. Now run:" },
  { kind: "out", text: "   cd task-app" },
  { kind: "out", text: "   npm install" },
  { kind: "out", text: "   npm run dev" },
  { kind: "cmd", text: "cd task-app" },
  { kind: "cmd", text: "npm install" },
  { kind: "out", text: "⠙ resolving dependencies…" },
  { kind: "out", text: "⠹ building dependency graph…" },
  { kind: "ok", text: "added 152 packages in 18s" },
  { kind: "warn", text: "17 packages are looking for funding" },
  { kind: "warn", text: "found 0 vulnerabilities" },
  { kind: "cmd", text: "npm run dev" },
  { kind: "out", text: "" },
  { kind: "out", text: "> task-app@0.0.0 dev" },
  { kind: "out", text: "> vite" },
  { kind: "out", text: "" },
  { kind: "ok", text: "  VITE v6.3.5  ready in 312 ms" },
  { kind: "out", text: "" },
  { kind: "ok", text: "  ➜  Local:   http://localhost:5173/" },
  { kind: "out", text: "  ➜  Network: use --host to expose" },
  { kind: "out", text: "  ➜  press h + enter to show help" },
  { kind: "out", text: "" },
  { kind: "out", text: "  （此时修改 src/App.tsx 并保存，终端会打印：）" },
  { kind: "ok", text: "  hmr update /src/App.tsx" },
];

export interface TreeNode {
  name: string;
  children?: TreeNode[];
  content?: string;
}

export const VITE_PROJECT_TREE: TreeNode = {
  name: "task-app",
  children: [
    {
      name: "public",
      children: [
        {
          name: "vite.svg",
          content:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">\n  <!-- 站点图标：构建时会被原样拷贝进 dist 目录 -->\n</svg>',
        },
      ],
    },
    {
      name: "src",
      children: [
        {
          name: "main.tsx",
          content: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// 整个应用的入口：把 <App /> 渲染进 index.html 里的 <div id="root">
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
        },
        {
          name: "App.tsx",
          content: `import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>task-app</h1>
      <button onClick={() => setCount(count + 1)}>
        clicked {count} times
      </button>
    </main>
  );
}

export default App;`,
        },
        {
          name: "index.css",
          content: `/* 全局样式：默认只写了字体与重置，可自由替换 */
:root {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}
body {
  margin: 0;
}`,
        },
        { name: "App.css" , content: `/* 组件级样式：在 App.tsx 里 import "./App.css" 后生效 */` },
      ],
    },
    {
      name: "index.html",
      content: `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>task-app</title>
  </head>
  <body>
    <!-- 唯一的挂载点：main.tsx 会把 React 应用渲染到这里 -->
    <div id="root"></div>
    <!-- 注意：这里没有 <script src="main.tsx">！
         Vite 的开发服务器会在返回 HTML 时自动注入模块入口 -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
    {
      name: "package.json",
      content: `{
  "name": "task-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",           // npm run dev → 启动开发服务器
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
}`,
    },
    {
      name: "vite.config.ts",
      content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite 的配置文件：插件在这里挂载，dev server 的端口、代理也在这里设置
export default defineConfig({
  plugins: [react()],
});`,
    },
    { name: "tsconfig.json", content: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true
  },
  "include": ["src"]
}` },
  ],
};

export const EXP5_TASKS = [
  "回放完成后，在虚拟文件树里找到 package.json：三条 npm 命令分别对应 scripts 里的哪几行？",
  "找到 index.html：页面唯一的挂载点是什么？main.tsx 把应用渲染到了哪里？",
  "找到 App.tsx：state 变量叫什么？点击按钮后发生了什么？",
  "思考：为什么 index.html 里没有引用 main.tsx 的完整路径也能跑？（答案在 vite.config.ts 与 Vite 的约定里）",
];
