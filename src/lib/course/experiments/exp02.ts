import type { Experiment } from "./types";

const BASE_STYLE = `  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 32px auto; line-height: 1.7; color: #1f2937; padding: 0 16px; }
    .tip { color: #6b7280; font-size: 14px; }
    nav a { margin-right: 16px; color: #059669; text-decoration: none; }
    h2 { border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    footer { border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 12px; color: #6b7280; }
  </style>`;

const STEP1_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>张小凡的作品集 · 骨架示范</title>
${BASE_STYLE}
</head>
<body>
  <!-- header：页头，放名字和一句话人设 -->
  <header>
    <h1>你好，我是张小凡</h1>
    <p>Python 工程师 · 正在用 AI 学前端</p>
  </header>

  <!-- nav：导航，锚点链接跳到对应 section（页面内跳转，不刷新） -->
  <nav>
    <a href="#about">关于我</a>
    <a href="#projects">项目</a>
    <a href="#contact">联系我</a>
  </nav>

  <!-- main：页面主体，一个页面只有一个 main -->
  <main>
    <section id="about">
      <h2>关于我</h2>
      <p>白天写 Python，晚上用 AI 学前端。目标：看懂并改得动 AI 生成的每一行代码。</p>
      <ul>
        <li>技能：Python（熟练）</li>
        <li>正在学：HTML / CSS / JavaScript</li>
      </ul>
    </section>

    <section id="projects">
      <h2>项目</h2>
      <!-- article：一个独立、完整的内容块，一张项目卡片就是一个 article -->
      <article>
        <h3>实验 1：第一个网页</h3>
        <p>用三件套写出的第一个页面，带一个点击计数器。</p>
      </article>
    </section>

    <section id="contact">
      <h2>联系我</h2>
      <p>邮箱：<a href="mailto:xiaofan@example.com">xiaofan@example.com</a></p>
    </section>
  </main>

  <!-- footer：页脚 -->
  <footer>
    <p><small>© 2026 张小凡 · 用三件套手工打造</small></p>
  </footer>
</body>
</html>
`;

const STEP2_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TODO：作品集骨架</title>
${BASE_STYLE}
</head>
<body>
  <header>
    <!-- 任务 1：把名字和一句话人设换成你自己的 -->
    <h1>TODO：你的名字</h1>
    <p>TODO：一句话人设</p>
  </header>

  <nav>
    <!-- 任务 2：补上第三个导航链接「联系我」，href 指向 #contact -->
    <a href="#about">关于我</a>
    <a href="#projects">项目</a>
  </nav>

  <main>
    <section id="about">
      <h2>关于我</h2>
      <!-- 任务 3：把下面的列表换成你自己的三条 -->
      <ul>
        <li>技能：TODO</li>
        <li>正在学：TODO</li>
      </ul>
    </section>

    <section id="projects">
      <h2>项目</h2>
      <article>
        <h3>实验 1：第一个网页</h3>
        <p>用三件套写出的第一个页面，带一个点击计数器。</p>
      </article>
      <!-- 任务 4：再写一张 article 项目卡片（标题 + 一句话描述），
           内容可以是「第 2 章：作品集骨架」——本项目本身！ -->
    </section>

    <section id="contact">
      <h2>联系我</h2>
      <!-- 任务 5：把邮箱链接换成你自己的，mailto: 前缀别忘了 -->
      <p>邮箱：<a href="mailto:you@example.com">you@example.com</a></p>
    </section>
  </main>

  <footer>
    <p><small>© 2026 你的名字</small></p>
  </footer>
</body>
</html>
`;

export const EXPERIMENT_2: Experiment = {
  id: "exp2",
  badge: "真实浏览器渲染",
  title: "实验 2 · 搭出作品集的完整骨架",
  intro:
    "第 1 章的页面只有「头和正文」。这一步把它升级成结构完整的作品集：页头、导航、主体分区、页脚，并且每个标签都有语义。",
  tasks: [
    "把 header 里的名字和一句话人设换成你自己的",
    "在 nav 里补上「联系我」链接，href=\"​#contact\"",
    "把「关于我」的技能列表换成你自己的三条",
    "在「项目」里再写一张 article 卡片（h3 标题 + p 描述）",
    "把邮箱链接换成你自己的（mailto: 前缀）",
  ],
  steps: [
    {
      id: "step1",
      label: "① 骨架示范",
      brief:
        "通读这份骨架，注意三件事：nav 里的 href=\"#about\" 是锚点跳转；main 里三个 section 各有 id 与导航对应；一张项目卡片就是一个 article。点「运行」后试着点导航链接。",
      code: STEP1_CODE,
    },
    {
      id: "step2",
      label: "② 轮到你了",
      brief:
        "按任务清单改代码。改完点导航链接验证锚点跳转是否都正常——链接不跳？八成是 href 里的 id 拼错了。",
      code: STEP2_CODE,
    },
  ],
  files: [{ name: "index.html", content: STEP1_CODE }],
  readme: "作品集骨架参考答案。解压后双击 index.html 在浏览器中打开。",
};
