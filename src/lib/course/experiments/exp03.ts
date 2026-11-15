import type { Experiment } from "./types";

const STEP1_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>盒模型观察</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    .box {
      background: #ecfdf5;
      border: 3px solid #059669;
      padding: 20px;
      margin-bottom: 24px;
    }
    .inner { background: #d1fae5; padding: 8px; }
    /* box-sizing 决定 width 算不算 padding 和 border：
       content-box（默认）：width 只是内容区，越加 padding 盒子越宽
       border-box：width = 内容 + padding + border，说 200px 就是 200px */
    .sized { width: 200px; }
    .content-box { box-sizing: content-box; }
    .border-box { box-sizing: border-box; }
  </style>
</head>
<body>
  <h2>盒模型：content + padding + border + margin</h2>
  <div class="box">
    <div class="inner">我是一段内容。绿色浅色区是 content，围绕它的一圈空白是 padding（内边距），边框是 border，而我和下一个盒子之间的距离来自 margin（外边距）。</div>
  </div>
  <div class="box sized content-box"><div class="inner">width: 200px · content-box<br>我实际占了 200 + 20×2 + 3×2 = 246px</div></div>
  <div class="box sized border-box"><div class="inner">width: 200px · border-box<br>我实际就是 200px，内容区自动被压缩</div></div>
</body>
</html>
`;

const STEP2_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Flex 导航栏</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    .nav {
      display: flex;
      align-items: center;
      /* TODO 1：左右两端对齐——查一下 justify-content 的哪个值 */
      justify-content: flex-start;
      /* TODO 2：给每个子项之间留 20px 间隙——一个属性搞定 */
      background: #0f172a;
      padding: 12px 20px;
      border-radius: 10px;
    }
    .nav .logo { color: #fff; font-weight: bold; font-size: 18px; }
    .nav .links { display: flex; }
    .nav .links a { color: #cbd5e1; text-decoration: none; padding: 6px 14px; border-radius: 6px; }
    .nav .links a:hover { background: #1e293b; color: #fff; }
    .row { display: flex; gap: 16px; margin-top: 24px; }
    .card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
  </style>
</head>
<body>
  <nav class="nav">
    <span class="logo">张小凡</span>
    <div class="links">
      <a href="#about">关于我</a>
      <a href="#projects">项目</a>
      <a href="#contact">联系我</a>
    </div>
  </nav>

  <div class="row">
    <div class="card">这张卡片和右边卡片能并排、等宽，靠的是父容器 display:flex 和子项 flex:1。试着把窗口拉窄再拉宽，观察它们始终并排。</div>
    <div class="card">Flex 是一维布局：只管一行（或一列）怎么排。像这样的卡片行、导航栏、工具条，都是 Flex 的主场。</div>
  </div>
</body>
</html>
`;

const STEP3_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Grid 作品网格</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 760px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    h2 { margin: 8px 0 16px; }
    .grid {
      /* TODO：让卡片自动换行、每张最小 200px 最大平分剩余空间——
         提示：repeat(auto-fill, minmax(200px, 1fr)) */
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px;
    }
    .card h3 { margin: 0 0 8px; font-size: 16px; }
    .card p { margin: 0; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <h2>我的项目</h2>
  <div class="grid">
    <div class="card"><h3>实验 1 · 第一个网页</h3><p>三件套入门，点击计数器。</p></div>
    <div class="card"><h3>实验 2 · 作品集骨架</h3><p>语义化标签与锚点导航。</p></div>
    <div class="card"><h3>实验 3 · 响应式样式</h3><p>盒模型、Flex、Grid 与媒体查询。</p></div>
    <div class="card"><h3>实验 4 · 动态数据</h3><p>fetch 调接口，渲染名言卡片。</p></div>
    <div class="card"><h3>实验 5 · 工程化</h3><p>npm 与 Vite 终端跟练。</p></div>
  </div>
</body>
</html>
`;

const STEP4_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>响应式挑战</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; color: #1f2937; }
    .hero { background: #0f172a; color: #fff; padding: 48px 24px; text-align: center; }
    .hero h1 { font-size: 40px; margin: 0; }
    .hero p { color: #94a3b8; margin: 12px 0 0; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      max-width: 760px;
      margin: 24px auto;
      padding: 0 16px;
    }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
    /* TODO：写一个媒体查询——宽度 ≤ 640px 时：
       1) .hero h1 字号降到 26px；
       2) .grid 只剩一列（grid-template-columns: 1fr）；
       3) .hero 的上下内边距降到 32px */
    /* 在这里写 @media (max-width: 640px) { ... } */
  </style>
</head>
<body>
  <div class="hero">
    <h1>张小凡的作品集</h1>
    <p>用右上角的「宽度」按钮切换 375 / 640 / 820 预览，验证你的媒体查询生效。</p>
  </div>
  <div class="grid">
    <div class="card"><h3>卡片一</h3><p>窄屏时应该叠成一列。</p></div>
    <div class="card"><h3>卡片二</h3><p>宽屏时自动多列排布。</p></div>
    <div class="card"><h3>卡片三</h3><p>这就是「移动优先」的对立面写法：<br>先写桌面，再用 max-width 收窄。</p></div>
  </div>
</body>
</html>
`;

const ANSWER_MEDIA = `    @media (max-width: 640px) {
      .hero h1 { font-size: 26px; }
      .hero { padding: 32px 24px; }
      .grid { grid-template-columns: 1fr; }
    }`;

export const EXPERIMENT_3: Experiment = {
  id: "exp3",
  badge: "真实浏览器渲染",
  title: "实验 3 · 给作品集上样式：盒模型、Flex、Grid 与响应式",
  intro:
    "四步走：先亲眼看清盒模型，再亲手写 Flex 导航栏和 Grid 作品网格，最后用媒体查询完成响应式挑战。右上角的宽度按钮用来模拟不同设备。",
  tasks: [
    "步骤①：把 .sized 两个盒子的 box-sizing 对调，观察宽度变化",
    "步骤②：完成 TODO 1、2，让 logo 靠左、链接靠右、间距 20px",
    "步骤③：把 .grid 的列定义改成 repeat(auto-fill, minmax(200px, 1fr))，拖动宽度看卡片自动换行",
    "步骤④：补全 @media 媒体查询的三个要求",
    "用宽度按钮切换 375 / 640 / 820，逐项核对媒体查询效果",
  ],
  steps: [
    {
      id: "step1",
      label: "① 盒模型观察",
      brief: "两个 width:200px 的盒子为什么一个 246px 一个 200px？box-sizing 是元凶。任务：把两者的 class 对调一下，点「运行」验证你理解了。",
      code: STEP1_CODE,
    },
    {
      id: "step2",
      label: "② Flex 导航栏",
      brief: "导航栏现在挤在左边。完成两个 TODO：justify-content 用哪个值能让两边分开？gap 能一次给所有子项加间距。",
      code: STEP2_CODE,
    },
    {
      id: "step3",
      label: "③ Grid 作品网格",
      brief: "现在固定两列。改用 repeat(auto-fill, minmax(200px, 1fr))，让浏览器自己决定几列——这是 Grid 最常用的响应式套路。",
      code: STEP3_CODE,
    },
    {
      id: "step4",
      label: "④ 响应式挑战",
      brief: "用宽度按钮切到 375px 看看：标题太大、卡片太挤。写媒体查询修复它，再切回 820px 确认宽屏不受影响。",
      code: STEP4_CODE,
    },
  ],
  files: [
    {
      name: "responsive.html",
      content: STEP4_CODE.replace("    /* 在这里写 @media (max-width: 640px) { ... } */", ANSWER_MEDIA),
    },
  ],
  readme: "响应式挑战参考答案。解压后双击 responsive.html，拖动浏览器窗口宽度观察断点效果。",
  widthCtl: true,
};
