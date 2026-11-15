"use client";

import { Callout, H2, H3, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Quiz } from "@/components/course/quiz";
import { ParamLab } from "@/components/course/param-lab";
import { DownloadButton } from "@/components/course/download-button";
import { EXPERIMENT_P4 } from "@/lib/course/experiments/expP4";
import { PACK_P4 } from "@/lib/course/packs";

const PROMPT = `请帮我开发一个「销售数据看板」页面，单文件 HTML + ECharts（CDN 引入即可）。

【布局】
1. 顶部三张 KPI 卡片：总销售额、总利润、利润率（利润率 = 总利润 / 总销售额）。
2. 下方一张折柱混合图：柱状图是各月销售额，折线是各月利润，共用横轴月份。

【交互】
- 悬停图表时显示该月两项数据的 tooltip（联动提示）。
- 浏览器窗口缩放时图表自适应（不出现横向滚动或空白）。

【数据】
- 12 个月的销售额与利润，先用两个数组写死，但请把「数据 → KPI 计算」与「数据 → 图表配置」分层写：
  将来我把数组换成接口返回值时，只改数据源部分。

【视觉】
- 主色绿色系，柱状圆角，折线加粗；整体简洁，不要 3D 和渐变炫技。

【约束】注释用中文；KPI 计算用 reduce 等数组方法，不要写 for 循环堆叠。`;

const LAYER_SAMPLE = `// AI 产出的「分层」正是提示词要求的体现——三层各司其职：

// ===== 第 1 层：数据源（将来只改这里）=====
var SALES  = [42, 48, 51, 47, 58, 63, 59, 66, 71, 68, 75, 82];
var PROFIT = [12, 15, 16, 14, 19, 23, 21, 25, 28, 26, 30, 34];

// ===== 第 2 层：数据加工（纯函数，不碰 DOM）=====
var sumS = SALES.reduce(function (a, b) { return a + b; }, 0);
var sumP = PROFIT.reduce(function (a, b) { return a + b; }, 0);
var rate = Math.round(sumP / sumS * 100) + "%";

// ===== 第 3 层：视图配置（ECharts 只认一个 option 对象）=====
chart.setOption({
  xAxis: { type: "category", data: MONTHS },
  series: [
    { name: "销售额", type: "bar", data: SALES },
    { name: "利润", type: "line", data: PROFIT },
  ],
});`;

const OPTION_ANATOMY = `// 读 option 的正确姿势：它只是「一份图表的JSON描述」
{
  tooltip:  { trigger: "axis" },          // 悬停行为：整列联动
  legend:   { data: ["销售额", "利润"] },  // 图例：哪些系列可切换
  grid:     { left: 42, top: 36 },        // 图表的内边距（第 3 章盒模型的直觉）
  xAxis:    { type: "category", data: [...] },  // 横轴：类目轴
  yAxis:    { type: "value", name: "万元" },     // 纵轴：数值轴
  series:   [                              // 系列数组：每个元素一层图
    { type: "bar",  data: [...], itemStyle: {...} },
    { type: "line", data: [...], smooth: true },
  ],
}
// 改任何一层 → setOption 即生效。所谓"学会 ECharts"，
// 本质就是能对着官方示例把 option 里每个字段讲出用途。`;

const QUIZ = [
  {
    question: "「遇到没学过的库」时，本复盘推荐的三步读法是？",
    options: [
      "直接通读库源码",
      "官方示例跑起来 → 改字段观察变化 → 对照文档确认字段含义",
      "让 AI 重写一遍",
      "只看视频教程",
    ],
    answerIndex: 1,
    explanation:
      "数据可视化库的 API 面极大，通读不现实。示例驱动 + 字段实验 + 文档确认，是读「配置对象型」库（ECharts/Chart.js/AntV）的通用路径。",
  },
  {
    question: "提示词里「数据 → KPI 计算与数据 → 图表配置分层」这条约束，换来的直接收益是？",
    options: [
      "代码更短",
      "数据源替换（数组 → 接口返回值）时只动第 1 层；这也是「接口契约先行」思想的数据版",
      "图表渲染更快",
      "不需要 ECharts 了",
    ],
    answerIndex: 1,
    explanation:
      "分层让「数据来源」与「数据消费」解耦。追问一（接真实接口）之所以十行搞定，全靠这条约束在第一轮就立好了结构。",
  },
  {
    question: "图表自适应（窗口缩放不破版）靠的是哪一行？",
    options: [
      "CSS 的 width: 100%",
      "window.addEventListener(\"resize\", () => chart.resize())",
      "媒体查询",
      "ECharts 自动完成",
    ],
    answerIndex: 1,
    explanation:
      "ECharts 初始化时按容器尺寸计算像素布局，容器变化后必须手动 chart.resize() 重算。漏了这行是「缩放后图表错位」的头号原因。",
  },
  {
    question: "tooltip 的「联动」（悬停一根柱，整月数据一起亮）由哪个字段开启？",
    options: [
      "legend: { selected }",
      "tooltip: { trigger: 'axis' }",
      "series: { hoverAnimation }",
      "grid: { containLabel }",
    ],
    answerIndex: 1,
    explanation:
      "trigger 有 'item'（单个数据项）与 'axis'（按轴联动）两档。提示词里的「联动提示」一词精确对应了 axis 触发。",
  },
];

export function Project4() {
  return (
    <>
      <p>
        第四篇不再引入新章节，而是两个独立项目的<strong>完整复盘</strong>——检验你在没有主线课程护送时，
        能否读明白「AI 用没学过的库写出的代码」。先来数据可视化看板（ECharts）。
      </p>

      <H2>一、遇到没学过的库怎么读：三步法</H2>
      <StepList
        items={[
          <><strong>跑官方示例：</strong>数据可视化库的文档都以「可改示例」为核心。先运行最接近需求的示例，确认它能画出来。</>,
          <><strong>改字段观察变化：</strong>对 option 里的字段做「一次只改一个」的实验，建立字段 ↔ 视觉效果的映射。</>,
          <><strong>对照文档确认：</strong>把实验结论与配置项文档对齐，形成可复用的「字段笔记」。三步走完，这个库对你就没有黑盒。</>,
        ]}
      />

      <H2>二、ECharts 十分钟速览</H2>
      <p>
        ECharts 的心智模型只有三行：<strong>init</strong>（在一个 DOM 容器上初始化实例）→
        <strong>setOption</strong>（交一份描述图表的配置对象）→ <strong>resize</strong>（容器变化后重算布局）。
        一切复杂图表都是 option 对象的堆叠：
      </p>
      <CodeBlock code={OPTION_ANATOMY} language="javascript" filename="option-anatomy.js" />

      <H2>三、提示词原文</H2>
      <CodeBlock code={PROMPT} language="text" filename="prompt.txt" source="第一轮提示词" />
      <Callout tone="ai" title="这份提示词的两个亮点">
        一是<strong>分层约束</strong>（数据源 / 数据加工 / 视图配置），二是<strong>反炫技</strong>
        （"不要 3D 和渐变"——明确排除 AI 爱加的花活）。两者都来自前几篇复盘的积累。
      </Callout>

      <H2>四、逐句拆解</H2>
      <Table
        head={["提示词原句", "AI 用了什么", "回溯"]}
        rows={[
          [<><code>三张 KPI 卡片</code></>, "Flex 三等分（flex:1）+ reduce 聚合算出数值", "第 3 章 3.3 / 第 3 章 3.x 数组方法"],
          [<><code>利润率 = 总利润 / 总销售额</code></>, "先聚合再计算，保留一位精度", "数据加工层（纯函数）"],
          [<><code>折柱混合图，共用横轴</code></>, "series 数组放 bar + line 两个系列，xAxis 共享", "ECharts option 结构"],
          [<><code>悬停联动 tooltip</code></>, "tooltip.trigger = 'axis'", "示例驱动读文档的成果"],
          [<><code>窗口缩放自适应</code></>, "resize 监听 + chart.resize()", "事件监听（第 4 章 4.2）"],
          [<><code>数据与配置分层</code></>, "第 1/2/3 层各自成段", "与项目三的接口契约同构"],
          [<><code>柱状圆角、折线加粗</code></>, "itemStyle.borderRadius / lineStyle.width", "改字段实验的产出"],
          [<><code>用 reduce，不要 for 堆叠</code></>, "KPI 全部 reduce 实现", "第 3 章数组方法的直接调用"],
        ]}
      />

      <H2>五、代码精讲：分层结构</H2>
      <CodeBlock code={LAYER_SAMPLE} language="javascript" filename="layered.js" />
      <p>
        注意第 2 层的注释「纯函数，不碰 DOM」——数据加工与视图彻底分离后，
        追问一（换接口数据）真的只需重写第一层：
      </p>

      <H2>六、技术点回溯</H2>
      <Table
        head={["技术点", "出自", "在本项目的形态"]}
        rows={[
          [<><strong>数组方法 reduce / map</strong></>, "第 3 章", "KPI 聚合、月份裁剪 slice"],
          [<><strong>事件监听</strong></>, "第 4 章 4.2", "resize 自适应"],
          [<><strong>CSS Flex 与盒模型</strong></>, "第 3 章", "KPI 卡片三等分、图表容器内边距"],
          [<><strong>DOM 查询与初始化</strong></>, "第 4 章 4.1", "echarts.init(document.getElementById(...))"],
          [<><strong>数据分层 / 接口契约</strong></>, "第 10-11 章", "为接真实接口预留的纯函数层"],
        ]}
      />

      <H2>七、追问与迭代</H2>
      <StepList
        items={[
          <><strong>追问一（接口化）：</strong>「数据改为 fetch('/api/sales') 获取，加载期间 KPI 与图表显示骨架，失败显示重试按钮。」——第 4 章三状态 + 第 11 章 authFetch 的直接复用。</>,
          <><strong>追问二（主题联动）：</strong>「让看板支持暗色模式：CSS 变量换肤时，ECharts 的文字与轴线颜色跟着变。」——答案是用 echarts.registerTheme 或 setOption 动态改 textStyle，正好练习「CSS 世界与 Canvas 世界的边界」（Canvas 内部不受 CSS 控制！这是可视化最反直觉的一课）。</>,
          <><strong>追问三（大数据量）：</strong>「如果数据变成 5 年日粒度（1800 点），折线会很乱：请加按月聚合与 LTTB 降采样两个方案。」——性能与可读性的权衡思维，比记 API 更值钱。</>,
        ]}
      />

      <H2>八、实验：可运行看板（改参数看效果）</H2>
      <p>改下面的参数并「应用重启」，对照第七节的追问亲手验证配置对象如何驱动图表：</p>
      <ParamLab
        id={EXPERIMENT_P4.id}
        title={EXPERIMENT_P4.title}
        badge={EXPERIMENT_P4.badge}
        intro={EXPERIMENT_P4.intro}
        params={EXPERIMENT_P4.params}
        html={EXPERIMENT_P4.html}
        tasks={EXPERIMENT_P4.tasks}
        height={EXPERIMENT_P4.height}
        console={EXPERIMENT_P4.console}
      />

      <H2>九、自测</H2>
      <Quiz id="quiz-p4" questions={QUIZ} />

      <H2>十、带走这个项目</H2>
      <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
        <DownloadButton folderName="dashboard-echarts" files={PACK_P4} label="下载项目四代码包" />
        <span className="text-xs text-muted-foreground">单文件看板 + 改造建议</span>
      </div>
    </>
  );
}
