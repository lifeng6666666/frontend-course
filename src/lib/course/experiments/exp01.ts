import type { Experiment } from "./types";

const STEP1_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>我的第一个网页</title>
  <!-- ========== 下面这段是 CSS：负责“表现”（长什么样） ========== -->
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 640px;
      margin: 40px auto;
      line-height: 1.7;
      color: #1f2937;
    }
    .tip { color: #6b7280; font-size: 14px; }
    button {
      font-size: 16px;
      padding: 8px 18px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      cursor: pointer;
    }
    button:hover { background: #f3f4f6; }
  </style>
</head>
<body>
  <!-- ========== 下面是 HTML：负责“结构”（有什么内容） ========== -->
  <h1>我的第一个网页</h1>
  <p class="tip">这是浏览器帮我渲染出来的第一个页面。</p>

  <button id="like-btn">点我试试</button>
  <p id="count-label">这个按钮还没被点过。</p>

  <script>
    // ========== 下面是 JavaScript：负责“行为”（做什么事） ==========
    let count = 0;
    const btn = document.getElementById("like-btn");
    const label = document.getElementById("count-label");

    btn.addEventListener("click", function () {
      count = count + 1;
      label.textContent = "按钮被点了 " + count + " 次。";
    });
  </script>
</body>
</html>
`;

const STEP2_CODE = STEP1_CODE.replace("我的第一个网页", "TODO：改成你的名字")
  .replace('<h1>TODO：改成你的名字</h1>', '<h1>TODO：我的标题</h1>')
  .replace(
    '  <p class="tip">这是浏览器帮我渲染出来的第一个页面。</p>\n\n  <button',
    `  <p class="tip">任务 2：在下面加一个 <p>，写一句自我介绍。</p>
  <!-- 任务 3：加一个 <a> 链接指向你喜欢的网站，提示：target="_blank" 新标签页打开 -->
  <!-- 任务 4：用 <ul> 和 <li> 列出你的三个爱好 -->

  <button`
  )
  .replace(
    `  <script>
    // ========== 下面是 JavaScript：负责“行为”（做什么事） ==========
    let count = 0;
    const btn = document.getElementById("like-btn");
    const label = document.getElementById("count-label");

    btn.addEventListener("click", function () {
      count = count + 1;
      label.textContent = "按钮被点了 " + count + " 次。";
    });
  </script>`,
    `  <script>
    // 任务 5：让按钮记录点击次数
    // 提示：声明一个变量保存次数；每次点击后加 1；
    // 再把新数字写进 #count-label 的 textContent 里。
    const btn = document.getElementById("like-btn");
    const label = document.getElementById("count-label");

    btn.addEventListener("click", function () {
      // TODO：补全这里的三行逻辑
    });
  </script>`
  );

const STEP3_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>张小凡的作品集 · 练习版</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 640px;
      margin: 40px auto;
      line-height: 1.7;
      color: #1f2937;
    }
    .tip { color: #6b7280; font-size: 14px; }
    a { color: #059669; }
    button {
      font-size: 16px;
      padding: 8px 18px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      cursor: pointer;
    }
    button:hover { background: #f3f4f6; }
  </style>
</head>
<body>
  <h1>你好，我是张小凡</h1>
  <p class="tip">白天写 Python，晚上正在用 AI 学前端。目标：看懂并改得动 AI 生成的每一行代码。</p>

  <p>
    我常逛：
    <a href="https://developer.mozilla.org/" target="_blank">MDN Web 文档</a>
  </p>

  <h2>我的三个爱好</h2>
  <ul>
    <li>踢足球</li>
    <li>看科幻小说</li>
    <li>折腾各种 AI 工具</li>
  </ul>

  <button id="like-btn">赞</button>
  <p id="count-label">这个按钮还没被点过。</p>

  <script>
    let count = 0;
    const btn = document.getElementById("like-btn");
    const label = document.getElementById("count-label");

    btn.addEventListener("click", function () {
      count = count + 1;
      label.textContent = "按钮被点了 " + count + " 次。";
    });
  </script>
</body>
</html>
`;

export const EXPERIMENT_1: Experiment = {
  id: "exp1",
  badge: "真实浏览器渲染",
  title: "实验 1 · 解剖网页，写出第一个页面",
  intro:
    "左边改代码，右边看结果——预览窗格里跑的就是你浏览器同款的渲染引擎。按步骤完成 5 个小任务，改坏了随时「重置本步」。",
  tasks: [
    "把 <title> 和 <h1> 改成你自己的标题",
    "在 <h1> 下面加一个 <p>，写一句自我介绍",
    "加一个 <a> 链接，指向你喜欢的网站（记得 target=\"_blank\"）",
    "用 <ul> 和 <li> 列出你的三个爱好",
    "补全按钮脚本：点击时在页面上显示累计点击次数",
  ],
  steps: [
    {
      id: "step1",
      label: "① 认识初始代码",
      brief:
        "先别急着写。通读这份三件套齐全的页面，注意注释标出的三个区域：CSS 管长相、HTML 管内容、JS 管行为。点「运行」看看它现在的样子。",
      code: STEP1_CODE,
    },
    {
      id: "step2",
      label: "② 轮到你了",
      brief:
        "代码里留了 5 个 TODO（对应下方任务清单）。改一行就点一次「运行」，体会「代码变了 → 画面立刻变」的感觉。",
      code: STEP2_CODE,
    },
    {
      id: "step3",
      label: "③ 参考答案",
      brief:
        "卡住了再看答案。重点对比：你的写法和参考答案差在哪？比如 <a> 有没有加 target=\"_blank\"、计数变量放在了函数外面还是里面。",
      code: STEP3_CODE,
    },
  ],
  files: [{ name: "index.html", content: STEP3_CODE }],
  readme:
    "解压后双击 index.html 即可在浏览器中打开（无需安装任何环境）。按 F12 可打开开发者工具查看页面结构。",
  console: true,
};
