"use client";

import { Callout, H2, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { EXPERIMENT_9 } from "@/lib/course/experiments";

const EVOLUTION = `/* 同一个按钮的四种写法（演进方向：从「样式名」到「原子类」） */

/* ① 全局 CSS：命名靠人肉，冲突靠运气 */
.button { padding: 10px 18px; border-radius: 8px; background: #059669; }

/* ② CSS Modules：类名局部化，冲突消失，但要写 .module.css 文件 */
import styles from "./button.module.css";   // <button className={styles.button}>

/* ③ styled-components：样式跟着组件走（运行时方案，体积与性能有代价） */
const Button = styled.button\`
  padding: 10px 18px;
\`;

/* ④ Tailwind：原子类直接组合——没有名字要起，没有文件要跳 */
<button className="rounded-lg bg-emerald-600 px-[18px] py-[10px]" />`;

const TAILWIND_MAP = `// 原子类速查：名字 ≈ 属性的缩写 + 数值刻度
<div className="flex items-center justify-between p-4 rounded-xl shadow-sm">
  <h3 className="text-base font-semibold text-zinc-800">标题</h3>
  <span className="text-xs rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700">进行中</span>
</div>

// flex / items-center / justify-between → 第 3 章 Flex 的原子化版本
// p-4        → padding: 1rem（4 × 0.25rem 刻度）
// rounded-xl → border-radius: 0.75rem
// text-xs / text-base → 字号档位；font-semibold → 字重
// bg-emerald-100 / text-emerald-700 → 配色系统（100 浅底、700 深字）`;

const A11Y_SAMPLE = `// 可访问性：不是附加题，是几行代码的基本功
<button
  onClick={toggle}
  aria-pressed={done}                    // 状态告知读屏软件
  aria-label={"勾选任务：" + title}       // 按钮 purpose
  className="focus:outline-none focus:ring-2 focus:ring-emerald-500"
>                                        // 键盘焦点可见（focus:ring）
  {done ? "☑" : "☐"} {title}
</button>

// 三条纪律：
// 1. 可交互就用 <button>/<a>——它们天生支持 Tab 与 Enter
// 2. 图标按钮必须有 aria-label
// 3. 焦点框不许删（outline: none 必须配可见的替代方案）`;

const AI_TAILWIND_SAMPLE = `<div className="mx-auto max-w-md space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">

// 读长串原子类的方法：按「布局 → 尺寸 → 间距 → 边框 → 颜色 → 状态 → 暗色」分组
// mx-auto          → 水平居中（margin-x auto）
// max-w-md         → 最大宽度 md 档（28rem）
// space-y-3        → 子元素纵向间距 0.75rem
// rounded-xl … p-4 → 圆角与内边距
// border-zinc-200 / bg-white → 亮色皮肤
// hover:shadow-md  → 悬停态
// dark:border-zinc-700 / dark:bg-zinc-900 → 暗色皮肤（dark: 孪生类）
// 一旦按组读，任何长串都不再可怕`;

const QUIZ = [
  {
    question: "Tailwind「原子类」方案最大的好处与代价分别是？",
    options: [
      "好处：不用起类名；代价：HTML 里类名很长",
      "好处：性能更好；代价：要学新语言",
      "好处：兼容旧浏览器；代价：必须用构建工具",
      "好处：自动响应式；代价：不能自定义颜色",
    ],
    answerIndex: 0,
    explanation:
      "原子类消灭了「起名 + 全局冲突」两大负担，样式即所见即所得；代价是类串较长（用组件封装缓解）与少量学习记忆成本。",
  },
  {
    question: "dark: 前缀类生效的前提是？",
    options: [
      "用户系统必须是暗色",
      "检测机制开启：<html> 上出现 dark 类（class 策略）或系统 prefers-color-scheme（media 策略）",
      "必须使用 styled-components",
      "没有前提，自动生效",
    ],
    answerIndex: 1,
    explanation:
      "本课程实验用 class 策略：JS 切换 documentElement.classList.toggle(\"dark\")。组件里每个颜色类配一个 dark: 孪生类。",
  },
  {
    question: "为什么图标按钮必须加 aria-label？",
    options: [
      "为了 SEO",
      "读屏软件只能念出文本内容，纯图标按钮没有文本，念不出来就等于「不存在的按钮」",
      "浏览器要求",
      "为了防止点击",
    ],
    answerIndex: 1,
    explanation:
      "aria-label 提供可访问名称。同样的道理：icon-only 按钮在视觉设计上也应配 tooltip，两份收益一份成本。",
  },
  {
    question: "「可交互元素用 <button> 而不是 <div onClick>」的根本原因？",
    options: [
      "button 样式更好看",
      "button 天生可键盘操作（Tab 聚焦、Enter/Space 触发）、可聚焦、语义明确；div 全部缺失",
      "div 不支持事件",
      "没有根本原因，只是惯例",
    ],
    answerIndex: 1,
    explanation:
      "原生交互元素自带完整的键盘与辅助技术支持。用 div 造按钮就要手动补 tabindex、role、keydown……补不齐就是可访问性事故。",
  },
  {
    question: "评审 AI 生成的 Tailwind 类串，最该检查的是？",
    options: [
      "类名是否按字母排序",
      "每个颜色类是否都有 dark: 孪生类、是否使用了统一的色彩档位（而不是随手写 hex）",
      "类串是否超过 20 个",
      "是否用了 !important",
    ],
    answerIndex: 1,
    explanation:
      "AI 最常见的样式问题是「亮色齐整、暗色漏配」与「色彩档位漂移」（一会儿 zinc-200 一会儿 gray-300）。按组读 + 查孪生类即可定位。",
  },
];

export function Chapter9() {
  return (
    <>
      <p>
        功能已成，这一章解决「好看、统一、好用」：样式方案怎么选、Tailwind 为什么成了事实标准、
        组件库与设计系统的思路，以及人人都能做的可访问性基本功。学完你将能够：
      </p>
      <StepList
        items={[
          <>说出样式方案的演进路径与各自的取舍；</>,
          <>读懂 Tailwind 原子类：把长串类名按组拆开；</>,
          <>用 dark: 孪生类实现暗色模式，理解 class 切换机制；</>,
          <>落实可访问性三纪律（原生元素 / aria / 焦点可见）；</>,
          <><strong>给任务应用换上 Tailwind 皮肤并支持暗色</strong>（实验 9）。</>,
        ]}
      />

      <H2>9.1 样式方案的演进：从命名到组合</H2>
      <p>项目变大后，「全局 CSS + 类名」会出现命名冲突与样式覆盖混乱。社区给过四代答案：</p>
      <CodeBlock code={EVOLUTION} language="jsx" filename="style-evolution.js" />
      <Table
        head={["方案", "核心思想", "代价"]}
        rows={[
          [<><strong>全局 CSS</strong></>, "结构 / 表现分离（第一篇的做法）", "类名全局共享，命名冲突与覆盖失控"],
          [<><strong>CSS Modules</strong></>, "编译时把类名局部化", "每个组件配一个文件，跳转成本高"],
          [<><strong>CSS-in-JS</strong></>, "样式跟组件走，运行时注入", "运行时开销，生态摇摆"],
          [<><strong>Tailwind（原子类）</strong></>, "预置原子类直接组合", "类串较长；需记忆刻度体系"],
        ]}
      />

      <H2>9.2 Tailwind 思想：设计刻度 + 原子组合</H2>
      <p>
        Tailwind 的本质是两件事：<strong>一套固定的设计刻度</strong>（间距 0.25rem 步进、字号档位、色彩系统）
        与<strong>原子类组合</strong>。它强制团队使用统一的间距与颜色档位——这恰好就是「设计系统」的约束：
      </p>
      <CodeBlock code={TAILWIND_MAP} language="jsx" filename="tailwind-map.jsx" />
      <Callout tone="info" title="与第 3 章的关系">
        Tailwind 没有发明任何新 CSS——flex、gap、media query 你都学过了。它只是把这些属性封装成短名。
        所以读懂第 3 章，Tailwind 就是「换个名字再见面」。
      </Callout>

      <H2>9.3 暗色模式与组件库思路</H2>
      <p>
        暗色模式的机制非常朴素：<code>&lt;html&gt;</code> 挂上 <code>class="dark"</code>，
        所有 <code>dark:</code> 前缀的类随之生效；JS 只负责切换这一个类。
        项目二复盘的完整实现就在这里的基础上补了「记住用户选择」（localStorage）。
      </p>
      <p>
        组件库（如 shadcn/ui、Radix、Ant Design）则是「原子类 + 交互逻辑」的成品化：
        把对话框、下拉菜单这类复杂交互做成可复用组件。思路你已经在第 7 章练过——组件就是「props 进、界面出」，
        组件库只是把这些零件打磨到了生产级。
      </p>

      <H2>9.4 可访问性：三纪律 + focus 可见</H2>
      <CodeBlock code={A11Y_SAMPLE} language="jsx" filename="a11y.jsx" />
      <Callout tone="warn" title="最常见的三条违规">
        一是 <code>&lt;div onClick&gt;</code> 造按钮（键盘不可达）；二是图标按钮没有 aria-label（读屏不可知）；
        三是全局 <code>outline: none</code> 又不给替代焦点样式（键盘用户失明）。实验③会让你用 Tab 键亲手验证。
      </Callout>

      <H2>9.5 实验 9：任务应用 UI 升级</H2>
      <Playground experiment={EXPERIMENT_9} />

      <H2>9.6 AI 产出精读：怎么读长串原子类</H2>
      <p>
        AI + Tailwind 的产出是一眼望不到头的 className。别慌，按固定顺序分组读：
        <strong>布局 → 尺寸 → 间距 → 边框 → 颜色 → 交互态 → 暗色</strong>：
      </p>
      <CodeBlock code={AI_TAILWIND_SAMPLE} language="jsx" filename="long-classes.js" source="AI 生成 · 典型类串" />
      <Callout tone="ai" title="检查 AI 样式的固定清单">
        一查 <code>dark:</code> 孪生类是否齐全；二查色彩是否只用统一档位（出现裸 hex 值要追问）；
        三查交互元素是否用了原生标签；四查焦点样式是否被删。
      </Callout>

      <H2>9.7 自测</H2>
      <Quiz id="quiz-ch9" questions={QUIZ} />
    </>
  );
}
