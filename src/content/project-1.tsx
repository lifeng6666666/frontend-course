"use client";

import { Callout, H2, H3, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Quiz } from "@/components/course/quiz";
import { DownloadButton } from "@/components/course/download-button";
import { PACK_LAND1 } from "@/lib/course/packs";

const PROMPT = `请帮我做一个「响应式个人作品集主页」，单文件 HTML（内联 CSS 和 JS）。

【内容】
1. 顶部大标题区：名字「张小凡」、一句话简介「Python 工程师 · 正在学前端」、一个「联系我」按钮。
2. 吸顶导航栏：logo 在左、三个锚点链接（关于我 / 项目 / 联系我）在右；滚动到对应区域时，当前链接自动高亮。
3. 三个区块：关于我（技能列表）、项目（4 张卡片，含标题、描述、技术标签）、联系我（邮箱链接）。
4. 页脚：版权与自动更新的年份。

【视觉】
- 支持日间/夜间主题切换，切换要有平滑过渡。
- 卡片是圆角白底带阴影，悬停时上浮。
- 主色用绿色系，其他颜色保持克制。

【响应式】
- 手机（约 375px）上：导航收进两行、项目卡片单列、标题字号缩小。
- 桌面上：项目卡片自动多列。

【约束】
- 不用任何框架和外部依赖；中文内容；代码注释用中文。`;

const NAV_JS = `// 吸顶导航的滚动高亮：IntersectionObserver（现代方案，性能远优于 scroll 事件）
const sections = document.querySelectorAll("section[id]");
const links = document.querySelectorAll(".links a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach((a) => {
        const active = a.getAttribute("href") === "#" + id;
        a.classList.toggle("active", active); // 只有「当前区块」的链接亮起
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" } // 视口中部一条横带：进入即视为「到达」
);
sections.forEach((s) => observer.observe(s));`;

const GRID_CSS = `.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); /* ① 响应式列数 */
  gap: 16px;
}
.card {
  background: var(--card);                 /* ② 颜色走 CSS 变量：换肤零成本 */
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  transition: transform 0.2s, box-shadow 0.2s;  /* ③ 过渡声明在基本态 */
}
.card:hover {
  transform: translateY(-4px);             /* ④ 悬停上浮：只动 transform，不触发重排 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}`;

const THEME_CSS = `/* 主题 = 一组变量。两种皮肤只是两套变量值 */
:root {
  --bg: #fafaf9;
  --card: #ffffff;
  --accent: #059669;
  /* …… */
}
[data-theme="dark"] {
  --bg: #0c0a09;
  --card: #1c1917;
  --accent: #34d399;
}
body {
  background: var(--bg);
  transition: background 0.3s, color 0.3s; /* 平滑过渡写在这里 */
}`;

const QUIZ = [
  {
    question: "复盘提示词时，哪一句最直接决定了项目的视觉基调？",
    options: [
      "「吸顶导航栏」",
      "「主色用绿色系，其他颜色保持克制」",
      "「代码注释用中文」",
      "「自动更新的年份」",
    ],
    answerIndex: 1,
    explanation:
      "颜色与克制程度是视觉基调的核心约束。复盘的意义在于建立「提示词句子 → 视觉结果」的因果链，下次自己写提示词就知道哪些词管什么。",
  },
  {
    question: "「滚动到对应区域时当前链接自动高亮」这句话背后最合适的技术是？",
    options: [
      "setInterval 每 100ms 检查一次滚动位置",
      "IntersectionObserver 观察各区块进出视口的状态",
      "每个链接上挂 scroll 监听",
      "CSS :hover 伪类",
    ],
    answerIndex: 1,
    explanation:
      "IntersectionObserver 由浏览器在合成线程回调，避免 scroll 事件高频触发的性能问题。AI 现在默认给这个方案——能识别它就说明你读懂了产出。",
  },
  {
    question: "AI 生成代码里，主题切换用 CSS 变量（--bg）而不是 JS 逐个改元素颜色，好处是？",
    options: [
      "CSS 变量执行更快",
      "换肤 = 换一组变量值，所有引用 var(--bg) 的规则自动联动；JS 只需改一个 data 属性",
      "旧浏览器兼容性更好",
      "没有好处，只是写法差异",
    ],
    answerIndex: 1,
    explanation:
      "变量集中了「颜色决策」。新增组件只要引用变量就自动支持两套主题——这就是第 9 章「设计令牌」思想的雏形。",
  },
  {
    question: "「手机上卡片单列、桌面自动多列」用一行 CSS 实现，是哪一行？",
    options: [
      "flex-wrap: wrap",
      "grid-template-columns: repeat(auto-fill, minmax(190px, 1fr))",
      "display: block",
      "column-count: auto",
    ],
    answerIndex: 1,
    explanation:
      "Grid 的 auto-fill + minmax 让浏览器自己算列数：容器宽 → 多列，容器窄 → 单列。提示词里的响应式要求，被一行声明精确兑现。",
  },
];

export function Project1() {
  return (
    <>
      <p>
        这是第一篇的毕业作品复盘：一次真实的 AI 协作开发全记录。我们把它拆成五段——
        <strong>提示词原文 → 逐句拆解 → 代码精讲 → 技术点回溯 → 追问迭代</strong>。
        复盘的目的不是「看懂这一个项目」，而是掌握一套通用的精读方法：以后你面对任何 AI 产出，
        都能按这五段走一遍。
      </p>

      <H2>一、提示词原文</H2>
      <p>
        这段提示词刻意写得比较完整：内容、视觉、响应式、约束四个部分各自成块。
        后面你会看到，它的每一句话都精确对应一块技术实现——这就是「好的提示词」的样子：
      </p>
      <CodeBlock code={PROMPT} language="text" filename="prompt-v1.txt" source="第一轮提示词" />

      <H2>二、逐句拆解：每句话背后的技术</H2>
      <Table
        head={["提示词原句", "意图", "AI 用了什么技术", "回溯"]}
        rows={[
          [<><code>单文件 HTML（内联 CSS 和 JS）</code></>, "零环境交付", "无构建单文件；三个代码分区注释标清归属", "第 1 章 1.2 / 1.6 节"],
          [<><code>吸顶导航栏：logo 在左、链接在右</code></>, "经典导航布局", "position: sticky + Flex 两端对齐（justify-content: space-between）", "第 3 章 3.3 节"],
          [<><code>滚动到对应区域时当前链接自动高亮</code></>, "滚动联动", "IntersectionObserver 观察区块进出视口", "第 4 章 4.2 节（事件思想）"],
          [<><code>三个区块 + 锚点链接</code></>, "页面骨架", "语义化标签 header/main/section + 锚点 href=\"#about\"", "第 2 章 2.1 节"],
          [<><code>4 张卡片（标题/描述/技术标签）</code></>, "内容网格", "Grid repeat(auto-fill, minmax()) 自动换行卡片墙", "第 3 章 3.4 节"],
          [<><code>支持日间/夜间主题切换，平滑过渡</code></>, "换肤机制", "CSS 变量两套皮肤 + data-theme 属性切换 + transition", "第 3 章 3.1 节（层叠与变量）"],
          [<><code>圆角白底带阴影，悬停上浮</code></>, "卡片质感", "border-radius / box-shadow / transition + transform", "第 3 章 3.1 节（盒模型）"],
          [<><code>手机单列、桌面自动多列、字号缩小</code></>, "响应式", "auto-fill 网格 + @media 断点 + clamp() 字号", "第 3 章 3.5 节"],
          [<><code>自动更新的年份</code></>, "行为逻辑", "textContent = new Date().getFullYear()", "第 4 章 4.1 节"],
          [<><code>不用任何框架和外部依赖</code></>, "技术栈约束", "原生三件套实现全部功能", "全书第一篇的技术边界"],
        ]}
      />

      <H2>三、代码精讲：三处值得逐行读的地方</H2>

      <H3>① 滚动高亮：为什么不用 scroll 事件</H3>
      <CodeBlock code={NAV_JS} language="javascript" filename="nav-highlight.js" />
      <p>
        传统做法监听 scroll 再算位置，每秒可能触发几十次回调。IntersectionObserver 把「元素是否进入视口」
        交给浏览器异步回调，主线程几乎零开销。<code>rootMargin</code> 把判断区压缩成视口中部一条横带——
        滚到哪块，哪块算「当前」。这就是「读懂 AI 产出」的典型样本：方案正确、参数有讲究、注释一句话点破。
      </p>

      <H3>② 卡片网格与悬停上浮</H3>
      <CodeBlock code={GRID_CSS} language="css" filename="cards.css" />
      <p>
        四个细节：颜色一律走变量（换肤零成本）；transition 声明在基本态而不是 hover 态（进出动画才对称）；
        动画只动 transform 与 box-shadow（不触发重排，第 1 章渲染流水线里最贵的两步被绕开了）；
        网格用 auto-fill 而不是写死三列。任何一条不懂，都值得回头翻对应章节。
      </p>

      <H3>③ 主题切换 = 改一个属性</H3>
      <CodeBlock code={THEME_CSS} language="css" filename="theme.css" />
      <p>
        JS 侧只有一行：<code>document.documentElement.dataset.theme = "dark"</code>。
        剩下的全部交给 CSS 级联——所有引用 <code>var(--bg)</code> 的规则瞬间换血。
        「行为层薄、表现层厚」是界面代码的理想形状。
      </p>

      <H2>四、技术点回溯：整张地图</H2>
      <Table
        head={["技术点", "出自", "在项目里的形态"]}
        rows={[
          [<><strong>语义化 HTML</strong></>, "第 2 章 2.1", "header / nav / main / section / article / footer 六类标签撑起骨架"],
          [<><strong>盒模型与层叠</strong></>, "第 3 章 3.1-3.2", "圆角、内边距、边框、阴影；变量优先级管理两套主题"],
          [<><strong>Flex 布局</strong></>, "第 3 章 3.3", "吸顶导航的两端对齐；按钮组间距 gap"],
          [<><strong>Grid 布局</strong></>, "第 3 章 3.4", "项目卡片墙的自动换行多列"],
          [<><strong>媒体查询与响应式</strong></>, "第 3 章 3.5", "640px 断点两行导航；clamp 字号"],
          [<><strong>DOM 操作</strong></>, "第 4 章 4.1", "年份自动更新；data-theme 切换"],
          [<><strong>事件与委托</strong></>, "第 4 章 4.2", "主题按钮监听；滚动高亮的观察器回调"],
          [<><strong>渲染流水线意识</strong></>, "第 1 章 1.3", "动画只动 transform/box-shadow，避免重排"],
        ]}
      />
      <Callout tone="info" title="复盘的收获检验">
        把上表盖住，看着项目截图能说出每个效果的实现技术与出处章节——第一篇就算真正毕业。
        说不出对应关系的位置，回到表格里标注的章节重读一小节，成本很低。
      </Callout>

      <H2>五、追问与迭代：好项目都是问出来的</H2>
      <p>第一版上线后，通常还会有两轮追问。每轮的提问方式都值得记住：</p>
      <StepList
        items={[
          <><strong>第二轮（加功能）：</strong>「保持现有结构与变量命名不变，给项目卡片加图片；图片加载前页面不能跳动（占位），并给每个 img 写 alt。」——约束先行，AI 就不会推翻已有实现。图片占位靠显式 width/height，正是第 2 章 2.2 节的知识。</>,
          <><strong>第三轮（讲性能）：</strong>「首页动画有点卡，帮我排查：只保留 transform/box-shadow 动画，把 scroll 监听换成交替方案，并解释每个改动为什么影响性能。」——把第 1 章的渲染流水线变成提问语言。</>,
          <><strong>第四轮（可访问性）：</strong>「按 WCAG 快速自查：对比度、焦点样式、键盘导航、读屏标签。逐条列出问题与修复代码。」——第 2 章 2.4 节四项基本功的专业版。</>,
        ]}
      />
      <Callout tone="ai" title="复盘方法论（全书通用）">
        五段式的本质是一条因果链：<strong>你的每一句提示词 → AI 的每一项技术选择 → 前文的某一章节</strong>。
        链条通了，你就在「指挥」而不只是「许愿」；链条断了，缺口就是你的下一步学习清单。
      </Callout>

      <H2>六、自测</H2>
      <Quiz id="quiz-p1" questions={QUIZ} />

      <H2>七、带走这个项目</H2>
      <p>多文件版（HTML / CSS / JS 分离）就是本项目的最终形态，也是「篇末落地一」的材料：</p>
      <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
        <DownloadButton folderName="portfolio-website" files={PACK_LAND1} label="下载项目一代码包" />
        <span className="text-xs text-muted-foreground">含 index.html、css/style.css、js/main.js 与运行说明</span>
      </div>
    </>
  );
}
