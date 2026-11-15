"use client";

import { Callout, H2, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { EXPERIMENT_6 } from "@/lib/course/experiments";

const PAIN_SAMPLE = `// 命令式：每一步都手动同步。状态一多，「同步清单」就失控
function addTask(text) {
  tasks.push(text);              // 1. 改数组
  renderList();                  // 2. 重画列表
  updateCount();                 // 3. 重画计数 —— 忘了这步就是 bug
  saveToLocal();                 // 4. 存 localStorage —— 忘了刷新就丢
  if (tasks.length === 0) showEmptyTip(); // 5. 边界状态 —— 分支越来越多
}
// 三种状态来源（数组、DOM、localStorage）各自演化，迟早对不上号`;

const DECLARATIVE_SAMPLE = `// 声明式：只有一条数据流 —— 数据变，视图跟着变
let tasks = [...];

function render() {
  renderList(tasks);        // 列表是 tasks 的函数
  updateCount(tasks.length);
  saveToLocal(tasks);
  tasks.length === 0 ? showEmptyTip() : hideEmptyTip();
}

function addTask(text) {
  tasks = tasks.concat(text);
  render();                 // 所有联动都在这里，业务代码不再操心「同步」
}`;

const VDOM_SAMPLE = `// 声明式「整棵重画」的代价：列表 1000 项，改 1 项也要重建 1000 个 DOM 节点
// 虚拟 DOM 的思路：先在内存里「画」两棵轻量树，diff 出差异，再最小化更新真实 DOM
//
//   state →  新虚拟树（纯对象，极便宜）
//             ↓ diff
//          旧虚拟树
//             ↓ 补丁（只有真正变化的节点）
//          真实 DOM（昂贵，操作越少越好）
//
// 你在第 7 章实验①手造的迷你渲染器，就是这条链路的「整棵重画」版本；
// React 的 react-dom 就是把 diff 补丁这一步补全的工业实现。`;

const AI_VANILLA = `// 同一个需求，让两种工具分别生成——差异一眼可见：

/* AI + 原生 JS：40 行，5 处手动同步 */
function toggleDone(id) {
  const li = document.querySelector('[data-id="' + id + '"]');
  li.classList.toggle("done");
  const idx = tasks.findIndex((t) => t.id === id);
  tasks[idx].done = !tasks[idx].done;      // 状态与 DOM 两处各改一次
  updateCount();                            // 手动补一刀
}

/* AI + React：8 行，0 处手动同步 */
function toggleDone(id) {
  setTasks((prev) =>
    prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
  );                                        // 数据变 → React 自动重渲染
}`;

const QUIZ = [
  {
    question: "命令式写法最大的隐患是？",
    options: [
      "代码行数多",
      "状态散落在多处（数组、DOM、存储），每一处都要手动同步，漏一处就是 bug",
      "运行速度慢",
      "不支持中文变量名",
    ],
    answerIndex: 1,
    explanation:
      "痛点不在代码量，而在「同步清单」会随功能增长失控。声明式把所有联动收敛为一条数据流，业务代码只改数据。",
  },
  {
    question: "「视图是数据的函数」这句话意味着？",
    options: [
      "视图可以脱离数据存在",
      "同样的数据必然渲染出同样的视图；更新界面的唯一途径是更新数据",
      "数据必须存在数据库里",
      "视图只能用函数组件写",
    ],
    answerIndex: 1,
    explanation:
      "这就是声明式的定义。它把「界面如何变化」从业务代码里剥离出来，交给框架统一处理——你只描述「应该长什么样」。",
  },
  {
    question: "虚拟 DOM 的价值在于？",
    options: [
      "让页面渲染更快",
      "把「昂贵的真实 DOM 操作」最小化：先 diff 出变化，再精准更新",
      "替代了 JavaScript",
      "让代码更短",
    ],
    answerIndex: 1,
    explanation:
      "虚拟树是普通 JS 对象，创建与比较都便宜；真实 DOM 操作昂贵。diff + 最小补丁让「声明式的写法」不必付出「全量重画」的代价。",
  },
  {
    question: "什么时候可以完全不用框架？",
    options: [
      "永远不用，框架都是花架子",
      "页面状态少、交互简单（如静态官网、单页介绍页）时，原生三件套更轻更快",
      "只有大型公司才用框架",
      "框架只适合移动端",
    ],
    answerIndex: 1,
    explanation:
      "框架解决的是「状态管理与视图同步」的复杂度。状态少、交互少的页面，引入框架反而是负担。技术选型跟随复杂度，这是第 6 章最重要的判断力。",
  },
  {
    question: "实验里两种写法都实现了同一需求。若要新增「双击编辑」功能，哪种写法改动面更小？",
    options: [
      "命令式，因为更直接",
      "声明式：数据结构加一个 editingId 字段，render 里加一个分支即可",
      "两者一样",
      "取决于浏览器版本",
    ],
    answerIndex: 1,
    explanation:
      "声明式的扩展点是「数据 + 描述」，新增功能通常只改这两处；命令式的扩展点是「又一串手动同步步骤」，容易牵一发动全身。",
  },
];

export function Chapter6() {
  return (
    <>
      <p>
        第一篇你用原生三件套完成了整个作品集——状态少，手写毫无压力。
        但一旦应用有了「多条数据、多处联动、多种界面状态」，命令式写法就会开始漏水。
        这一章解释<strong>框架到底解决什么问题</strong>，为 React 的登场铺路。学完你将能够：
      </p>
      <StepList
        items={[
          <>指出命令式写法的三个结构性痛点；</>,
          <>用「视图是数据的函数」一句话说清声明式；</>,
          <>画出虚拟 DOM 的 diff 直觉图；</>,
          <>判断什么时候该上框架、什么时候原生更合适；</>,
          <><strong>亲手跑同一个需求的两种写法</strong>（实验 6）。</>,
        ]}
      />

      <H2>6.1 命令式写法的三个痛点</H2>
      <p>
        回顾第 4 章的任务清单：加一条待办，你要手动完成「改数组 → 重画列表 → 更新计数 → 存 localStorage → 处理空态」五步。
        功能每多一项，清单就长一截——这不是你代码写得差，而是<strong>结构性问题</strong>：
      </p>
      <CodeBlock code={PAIN_SAMPLE} language="javascript" filename="pain-points.js" />
      <KVTable
        head={["痛点", "表现", "后果"]}
        rows={[
          { k: "状态散落", v: "数组里一份、DOM 里一份、localStorage 里一份", v2: "三份「真相」迟早对不上" },
          { k: "手动同步", v: "每个操作都要亲自补齐所有联动步骤", v2: "漏一步就是难查的脏数据 bug" },
          { k: "复用困难", v: "逻辑与 DOM 胶水代码缠在一起", v2: "换个页面只能复制粘贴" },
        ]}
      />

      <H2>6.2 声明式：视图是数据的函数</H2>
      <p>
        框架给出的答案是换一种「描述方式」：<strong>不再一步步指挥 DOM，而是声明「界面应该长什么样」，数据一变，框架负责让界面跟上</strong>。
      </p>
      <CodeBlock code={DECLARATIVE_SAMPLE} language="javascript" filename="declarative.js" />
      <p>
        对比两段代码：业务逻辑（改数据）与界面联动（render 里的所有步骤）被彻底分离。
        加新功能时你只需要想「数据怎么变」，render 自然覆盖全部界面分支。
        这就是<strong>声明式</strong>——React、Vue、SwiftUI、Flutter 共享的同一个思想。
      </p>

      <H2>6.3 虚拟 DOM 的直觉：先算账，再动手</H2>
      <p>
        声明式有个隐藏代价：既然「数据变 → 重画」，那数据轻微变化也要整棵界面重画吗？
        真实 DOM 操作昂贵（可能触发重排重绘），全量重画在复杂页面上会卡。
        <strong>虚拟 DOM</strong> 是两全方案：每次先在内存里用纯对象「画」一棵轻量树，与上一棵对比（diff），
        得出最小补丁集，再精准地更新真实 DOM：
      </p>
      <CodeBlock code={VDOM_SAMPLE} language="text" filename="vdom-flow.txt" />
      <Callout tone="info" title="造轮子预告">
        第 7 章实验①你会亲手写一个 30 行的「整棵重画」迷你渲染器——把 h / render / mount 三个函数握在手里之后，
        React 的 <code>createElement</code> 与 <code>createRoot</code> 只是同一思想的工业版。
      </Callout>

      <H2>6.4 组件化：把界面拆成可复用的零件</H2>
      <p>
        框架的第二个礼物是<strong>组件</strong>：把界面按职责拆成独立单元——导航栏一个组件、卡片一个组件、
        列表项一个组件。每个组件「数据进（props）→ 界面出」，可组合、可复用、可单独修改。
        第 2 章语义化标签给内容分区，组件给<strong>代码</strong>分区——思想一脉相承。
      </p>
      <p>
        一个任务应用拆下来大概是：<code>&lt;App&gt;</code> 管理「任务列表」这份数据，
        <code>&lt;AddForm&gt;</code> 收集输入，<code>&lt;TaskList&gt;</code> 和 <code>&lt;TaskItem&gt;</code>
        逐条展示。第 9 章会把这个拆分做实。
      </p>

      <H2>6.5 实验 6：同一个需求，两种写法</H2>
      <Playground experiment={EXPERIMENT_6} />
      <p>
        跑完两个步骤后，建议做一个动作：把两份代码并排放在屏幕上，从上到下找「手动同步」的行数——
        这是你理解框架价值最直观的一分钟。
      </p>

      <H2>6.6 AI 产出精读：同需求、不同框架的产出对比</H2>
      <p>
        分别用「原生 JS」和「React」生成同一个功能，AI 的产出会呈现两种典型形状。能一眼看出形状差异，
        是评估 AI 前端产出的基本功：
      </p>
      <CodeBlock code={AI_VANILLA} language="javascript" filename="contrast.js" source="同一需求 · 两种生成" />
      <Table
        head={["观察点", "原生 JS 产出", "React 产出"]}
        rows={[
          ["状态在哪", "数组和 DOM 各一份", "唯一来源：useState 里的 tasks"],
          ["同步步骤", "5 处手动调用", "0 处（自动重渲染）"],
          ["出 bug 的位置", "同步链路任何一环", "数据更新逻辑（不可变操作）"],
          ["评审重点", "同步清单是否齐全", "是否遵守不可变更新、key 是否正确"],
        ]}
      />
      <Callout tone="ai" title="提问模板">
        让 AI 做技术选型对比时，给它固定模板：「同一需求分别用 A 和 B 实现，输出两份代码并标注各自的
        状态存放位置与同步步骤数量」。对比会逼出最诚实的结论。
      </Callout>

      <H2>6.7 自测</H2>
      <Quiz id="quiz-ch6" questions={QUIZ} />
    </>
  );
}
