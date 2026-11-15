"use client";

import { Callout, H2, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { EXPERIMENT_3 } from "@/lib/course/experiments";

const SPECIFICITY = `/* 同一个元素可能被多条规则命中，谁赢？看优先级，从高到低： */
#hero .title        { color: red; }      /* ID + 类：最具体 */
#hero               { color: orange; }   /* ID */
.title              { color: green; }    /* 类 */
h1                  { color: blue; }     /* 标签 */
*                   { color: gray; }     /* 通配：最低 */

/* 两条优先级相同的规则，写在后面的赢： */
p  { color: black; }
p  { color: purple; }   /* 生效的是紫色 */

/* 内联样式（style 属性）赢过以上一切；!important 再赢过内联——但它是代码异味 */
`;

const FLEX_SNIPPET = `.toolbar {
  display: flex;              /* 启用 Flex：子项默认沿主轴从左到右排 */
  justify-content: space-between; /* 主轴对齐：两端分开，中间留空 */
  align-items: center;        /* 交叉轴对齐：垂直居中 */
  gap: 12px;                  /* 子项间距：一个属性全搞定 */
}
.toolbar .spacer { flex: 1; }  /* 吃掉剩余空间的「弹簧」 */`;

const GRID_SNIPPET = `.cards {
  display: grid;
  /* 最常用的一行：每列最小 200px、最大平分剩余空间，放不下就换行 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* 经典「圣杯」布局：页面级二维网格 */
.page {
  display: grid;
  grid-template-columns: 220px 1fr;   /* 侧栏 + 主区 */
  grid-template-rows: auto 1fr auto;  /* 头 / 身 / 脚 */
  min-height: 100vh;
}`;

const AI_CSS_SAMPLE = `*, *::before, *::after { box-sizing: border-box; }  /* 1 */

.card {
  padding: clamp(16px, 3vw, 28px);        /* 2 */
  font-size: 1rem;
  line-height: 1.7;
}
.title {
  font-size: clamp(28px, 5vw, 44px);      /* 3 */
}

@media (max-width: 640px) {                /* 4 */
  .cards { grid-template-columns: 1fr; }
}`;

const QUIZ = [
  {
    question: "默认盒模型下，width: 200px 的元素加了 padding: 20px 和 border: 5px，实际占多宽？",
    options: ["200px", "210px", "240px", "250px"],
    answerIndex: 3,
    explanation:
      "默认 box-sizing: content-box，实际宽度 = 200（内容）+ 40（左右 padding）+ 10（左右 border）= 250px。改成 border-box 后 width 就是最终宽度。",
  },
  {
    question: "Flex 布局的 justify-content 和 align-items 分别控制什么？",
    options: [
      "都是水平对齐",
      "主轴对齐 / 交叉轴对齐",
      "都是垂直对齐",
      "一个管间距一个管换行",
    ],
    answerIndex: 1,
    explanation:
      "justify-content 管主轴（默认水平），align-items 管交叉轴（默认垂直）。flex-direction 改变方向时，两者角色随之对调。",
  },
  {
    question: "哪行 CSS 能让卡片网格「每张最小 200px、自动填满一行、放不下自动换行」？",
    options: [
      "display: flex; flex-wrap: wrap;",
      "grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));",
      "grid-auto-flow: row;",
      "float: left; width: 200px;",
    ],
    answerIndex: 1,
    explanation:
      "repeat + auto-fill + minmax + fr 是响应式网格的黄金组合：浏览器自己计算列数与换行，不需要写媒体查询。",
  },
  {
    question: "「移动优先」写法的特点是？",
    options: [
      "先写桌面样式，再用 max-width 收窄",
      "默认样式就是移动端布局，用 min-width 逐级向大屏增强",
      "必须用 rem 才算移动优先",
      "手机上禁用媒体查询",
    ],
    answerIndex: 1,
    explanation:
      "移动优先 = 基础样式面向最小屏，@media (min-width: 768px) 逐级增强。这样窄屏设备不用加载并覆盖一大堆桌面规则。",
  },
  {
    question: "以下选择器优先级最高的是？",
    options: [".card .title", "h1 span", "#main .card .title", "div p *"],
    answerIndex: 2,
    explanation:
      "ID 的权重远高于类与标签。#main .card .title 含一个 ID + 两个类，胜过只有类或标签的组合。尽量靠「类组合」而非 !important 解决冲突。",
  },
];

export function Chapter3() {
  return (
    <>
      <p>
        第 2 章的骨架已经语义完整，但还素面朝天。这一章给作品集「穿上衣服」：
        先弄懂盒模型与选择器的底层规则，再学两大布局武器 Flex 与 Grid，最后用媒体查询让页面适配任意屏宽。学完你将能够：
      </p>
      <StepList
        items={[
          <>心算盒模型的实际宽度，并用 box-sizing 终结这个麻烦；</>,
          <>说清楚两条规则的冲突由谁裁决（层叠与优先级）；</>,
          <>用 Flex 排导航栏、用 Grid 排卡片网格；</>,
          <>写媒体查询并理解「移动优先」；</>,
          <><strong>完成响应式挑战，让作品集在 375px 手机上也不破版</strong>（实验 3）。</>,
        ]}
      />

      <H2>3.1 盒模型：每个元素都是一个「包裹」</H2>
      <p>
        浏览器眼里，每个元素都是四层包裹：<strong>内容（content）→ 内边距（padding）→ 边框（border）→ 外边距（margin）</strong>。
        padding 是「包裹里的缓冲棉」，border 是「盒子外壳」，margin 是「盒子与其他盒子之间的距离」。
      </p>
      <CodeBlock code={SPECIFICITY} language="css" filename="specificity.css" />
      <Callout tone="info" title="margin 合并现象">
        垂直方向上，相邻两个元素的 margin 会「取大者合并」而不是相加（20px + 30px ≠ 50px，而是 30px）。
        排版间距时若发现「间距没有叠加」，通常就是它。实用对策：布局间距尽量只给一侧（常用 margin-bottom）或统一用 gap。
      </Callout>

      <H2>3.2 选择器与层叠：冲突的裁决规则</H2>
      <p>
        CSS 里的 C 就是 Cascade（层叠）：多条规则命中同一元素时，按<strong>优先级</strong>裁决——
        ID 最强、类次之、标签最弱；同等优先级时后写的赢。日常开发记住一条守则：
        <strong>用「类 + 组合」组织样式，不轻易动用 ID 与 !important</strong>，优先级失控是样式代码腐化的第一步。
      </p>

      <H2>3.3 Flex：一维布局的主力</H2>
      <p>
        Flex 解决「一行（或一列）内的排列与分配」：导航栏、按钮组、卡片行、工具条。
        启用后子项成为 flex item，主轴默认水平：
      </p>
      <CodeBlock code={FLEX_SNIPPET} language="css" filename="toolbar.css" />
      <KVTable
        head={["属性", "作用", "常用值"]}
        rows={[
          { k: "justify-content", v: "主轴方向的对齐与分配", v2: "flex-start / center / space-between / space-evenly" },
          { k: "align-items", v: "交叉轴方向的对齐", v2: "center / stretch / flex-end" },
          { k: "gap", v: "子项间距（推荐替代 margin）", v2: "12px / 8px 16px" },
          { k: "flex: 1", v: "子项伸缩：吃掉剩余空间", v2: "1 / 0 auto" },
          { k: "flex-wrap", v: "放不下时是否换行", v2: "wrap" },
        ]}
      />

      <H2>3.4 Grid：二维布局的主力</H2>
      <p>
        Grid 解决「行列同时规划」：卡片墙、表单布局、整页骨架。最值得背下来的是自动换行那一行：
      </p>
      <CodeBlock code={GRID_SNIPPET} language="css" filename="cards.css" />
      <Callout tone="info" title="怎么选">
        一句话判断：内容沿着一条线排 → Flex；需要「几行几列」的对齐关系 → Grid。
        两者不是二选一，真实项目里经常嵌套使用：页面骨架用 Grid，局部一排按钮用 Flex。
      </Callout>

      <H2>3.5 响应式：同一份代码，适配所有屏幕</H2>
      <p>
        响应式三件套：<strong>媒体查询</strong>（按屏宽切换规则）、<strong>相对单位</strong>（rem / % / vw）与
        <strong>弹性尺寸</strong>（fr / minmax / clamp）。别忘了第 1 章埋的伏笔：
        <code>&lt;meta name="viewport"&gt;</code> 是手机正常显示的前提。
      </p>
      <CodeBlock
        code={`/* 移动优先：基础样式面向小屏，min-width 逐级增强 */
.cards { grid-template-columns: 1fr; }          /* 手机：单列 */

@media (min-width: 768px) {                      /* 平板起：两列 */
  .cards { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1080px) {                     /* 桌面：三列 */
  .cards { grid-template-columns: repeat(3, 1fr); }
}

/* clamp(最小, 首选, 最大)：字号随视口平滑缩放，不写断点也响应式 */
h1 { font-size: clamp(28px, 5vw, 44px); }`}
        language="css"
        filename="responsive.css"
      />

      <H2>3.6 实验 3：给作品集上样式，并完成响应式挑战</H2>
      <p>
        四步实验：盒模型观察 → Flex 导航栏 → Grid 作品网格 → 响应式挑战。
        步骤④请使用预览窗格上方的宽度按钮，在 375 / 640 / 820px 之间切换验证：
      </p>
      <Playground experiment={EXPERIMENT_3} />

      <H2>3.7 AI 产出精读：AI 的 CSS 出厂设置</H2>
      <p>AI 生成样式时几乎总会带上这四样，逐个看懂它们为什么「几乎总是对的」：</p>
      <Table
        head={["AI 的默认动作", "背后的原因"]}
        rows={[
          [<><code>*, *::before, *::after {"{ box-sizing: border-box }"}</code></>, "统一盒模型口径：width 即最终宽度，预估尺寸不再失灵。几乎所有现代工程的开局第一行"],
          [<><code>clamp(16px, 3vw, 28px)</code></>, "随视口缩放但设上下限：一条声明替代两三个断点，是最优雅的响应式字号方案"],
          [<><code>line-height: 1.7</code>（无单位）</>, "无单位行高随字号等比缩放；写死 24px 则字号一改就乱"],
          [<><code>@media (max-width: …)</code> 收窄</>, "AI 默认「桌面优先」写法。功能等价，但与「移动优先」理念相反——读懂即可，不必强改"],
        ]}
      />
      <Callout tone="ai" title="审 AI 样式代码的三问">
        一问：盒模型统一了吗（有没有 border-box 声明）？二问：间距用的是 margin 硬凑还是 flex/grid 的 gap？
        三问：断点是「每个元素一套」还是「整页布局级」？——三问过不了的样式，大方向上就值得返工。
      </Callout>

      <H2>3.8 自测</H2>
      <Quiz id="quiz-ch3" questions={QUIZ} />
    </>
  );
}
