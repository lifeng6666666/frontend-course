"use client";

import { Callout, H2, H3, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Quiz } from "@/components/course/quiz";
import { DownloadButton } from "@/components/course/download-button";
import { PACK_LAND2 } from "@/lib/course/packs";

const PROMPT = `请帮我开发一个「任务管理应用」，技术栈 React 19 + TypeScript + Vite，不用 UI 组件库。

【功能】
1. 任务列表：每条任务有标题、完成状态；可添加、勾选完成、删除。
2. 顶部筛选栏：全部 / 未完成 / 已完成 三个筛选，显示各自数量。
3. 添加表单：输入为空时按钮禁用；回车与按钮都可提交。
4. 数据持久化：刷新页面后任务不丢（localStorage）。
5. 统计行：显示「共 X 条 · 已完成 Y 条」。

【组件划分】
- App：持有任务数组与筛选状态（状态提升）
- AddForm：受控输入，提交时回调父组件
- TaskItem：单条任务展示 + 勾选/删除回调
- 筛选栏可内联在 App 里

【交互细节】
- 列表渲染用稳定 id 作 key
- 勾选有划线样式，删除前不弹确认
- 暗色模式跟随系统（prefers-color-scheme）

【约束】
- 状态更新一律不可变操作（concat/map/filter）
- 所有事件回调由子组件触发、父组件处理（数据向下，事件向上）
- TypeScript 严格模式；注释用中文`;

const STATE_SAMPLE = `// App.tsx —— 唯一的数据源（状态提升）
export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);   // 惰性初始化：只读一次存储
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  // 副作用：tasks 一变就同步 localStorage（依赖数组写对了）
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 派生数据不用 useState 存！现算即可——这是新手最常犯的冗余状态错误
  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "open" ? !t.done : t.done
  );
  const doneCount = tasks.filter((t) => t.done).length;

  // 增删改三件套：全部生成新数组，全部留在父组件
  const add = (text: string) =>
    setTasks(tasks.concat({ id: Date.now(), text, done: false }));
  const toggle = (id: number) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: number) => setTasks(tasks.filter((t) => t.id !== id));`;

const CHILD_SAMPLE = `// components/TaskItem.tsx —— 纯展示组件：props 进、事件出
interface Props {
  task: Task;
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

// components/AddForm.tsx —— 受控组件：输入值由 state 驱动
export default function AddForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState("");
  const canSubmit = text.trim().length > 0;      // 派生值：直接算，不存 state

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!canSubmit) return; onAdd(text.trim()); setText(""); }}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit" disabled={!canSubmit}>添加</button>
    </form>
  );
}`;

const QUIZ = [
  {
    question: "提示词里「状态提升」这一条，最终落在代码的哪个位置？",
    options: [
      "每个子组件自己存一份任务数组",
      "任务数组与筛选状态都放在 App 里，子组件只接收 props 和回调",
      "存在 localStorage 里",
      "存在 Context 里",
    ],
    answerIndex: 1,
    explanation:
      "状态提升 = 把多个组件共享的数据放到最近的公共父组件。App 持有 tasks/filter，AddForm 与 TaskItem 都是无状态的展示组件。",
  },
  {
    question: "「显示各自数量」为什么要用派生值而不是新增一个 state？",
    options: [
      "派生值渲染更快",
      "计数可以由 tasks 现算出来；再存一份 state 会引入两份真相，忘记同步就出 bug",
      "useState 数量有限制",
      "TypeScript 不允许",
    ],
    answerIndex: 1,
    explanation:
      "「能从现有 state 计算出来的值，就不要存进 state」——这是 React 官方文档都强调的状态设计原则。冗余状态是数据不一致的温床。",
  },
  {
    question: "提示词约定「删除前不弹确认」，AI 最可能用什么实现？",
    options: [
      "window.confirm",
      "直接 filter 移除；删除按钮 onClick 只做一件事：setTasks(tasks.filter(…))",
      "弹一个自定义 Modal",
      "标记 isDeleted 再过滤",
    ],
    answerIndex: 1,
    explanation:
      "提示词把交互细节写死了，AI 就不会自作主张加 confirm。反之若不写，多数 AI 会保守地加一层确认——这正说明「交互细节值得逐条写进提示词」。",
  },
  {
    question: "TaskItem 的 className 三元表达式（done ? 'item done' : 'item'）依据的是哪条设计？",
    options: [
      "CSS Modules 的局部类名",
      "状态驱动视图：done 是数据，样式只是它的映射；切换完成状态不需要碰 DOM",
      "组件库的主题系统",
      "内联样式",
    ],
    answerIndex: 1,
    explanation:
      "视图 = 数据的函数。done 翻转 → App 重渲染 → TaskItem 拿到新 props → 类名自动变化。没有任何一行手动 classList 操作。",
  },
];

export function Project2() {
  return (
    <>
      <p>
        第二篇的毕业作品：一个带持久化与筛选的任务管理应用。它体量不大，但五脏俱全——
        状态设计、组件划分、受控表单、副作用、不可变更新、key，第二篇所有知识点都在里面各就各位。
        同样按五段式复盘。
      </p>

      <H2>一、提示词原文</H2>
      <p>
        与项目一相比，这份提示词最大的变化是<strong>多了一段「组件划分」</strong>——
        框架项目的提示词必须替 AI 想好「数据放哪、组件怎么拆」，否则你会得到一个 800 行的巨型组件：
      </p>
      <CodeBlock code={PROMPT} language="text" filename="prompt-v1.txt" source="第一轮提示词" />

      <H2>二、逐句拆解</H2>
      <Table
        head={["提示词原句", "意图", "AI 用了什么", "回溯"]}
        rows={[
          [<><code>React 19 + TypeScript + Vite，不用 UI 库</code></>, "钉死技术栈", "Vite 工程 + 严格模式 TS 配置", "第 5 章 5.3 / 第 6 章 6.6"],
          [<><code>App 持有任务数组与筛选状态（状态提升）</code></>, "确定数据归属", "useState 双状态 + 派生数据现算", "第 8 章 8.1"],
          [<><code>AddForm 受控输入，回调父组件</code></>, "数据向下事件向上", "value + onChange 受控模式", "第 7 章 7.3"],
          [<><code>可添加、勾选完成、删除</code></>, "核心 CRUD", "concat / map / filter 不可变三件套", "第 8 章 8.1"],
          [<><code>数据持久化（localStorage）</code></>, "刷新不丢", "useEffect 依赖 [tasks] 同步写入 + 惰性初始化读取", "第 8 章 8.2 / 8.5"],
          [<><code>列表渲染用稳定 id 作 key</code></>, "diff 正确性", "key={task.id}，禁用数组下标", "第 7 章 7.4"],
          [<><code>输入为空时按钮禁用</code></>, "防无效提交", "派生值 canSubmit 驱动 disabled", "第 8 章 8.1（派生而非冗余）"],
          [<><code>全部 / 未完成 / 已完成 + 数量</code></>, "筛选视图", "filter 状态 + tasks.filter 派生", "第 8 章 8.1"],
          [<><code>暗色模式跟随系统</code></>, "主题细节", "prefers-color-scheme 媒体查询 + CSS 变量", "第 3 章 3.5 / 第 9 章 9.3"],
          [<><code>TypeScript 严格模式</code></>, "质量底线", "interface Task / Props 类型标注", "第 6 章拓展阅读"],
        ]}
      />

      <H2>三、代码精讲：两处决定项目质量的地方</H2>

      <H3>① App 的状态结构：一切清晰之源</H3>
      <CodeBlock code={STATE_SAMPLE} language="tsx" filename="App.tsx" />
      <p>
        四个值得画线的地方：状态只有两个（tasks、filter）；<strong>计数与可见列表都是现算的派生值</strong>；
        增删改三个函数全在父组件（子组件无状态）；useEffect 的依赖数组精确到 [tasks]。
        状态设计干净的组件树，bug 都无处藏身。
      </p>

      <H3>② 子组件的形状：props 进、事件出</H3>
      <CodeBlock code={CHILD_SAMPLE} language="tsx" filename="TaskItem.tsx" />
      <p>
        TaskItem 不知道「数据从哪来、要存到哪去」——它只管展示与上报。
        这种<strong>展示组件</strong>可以随便复制到任何项目里复用。AddForm 的受控模式
        （value + onChange）是表单组件的标准形态，第 11 章的登录表单会是它的翻版。
      </p>

      <H2>四、技术点回溯</H2>
      <Table
        head={["技术点", "出自", "在本项目的形态"]}
        rows={[
          [<><strong>状态提升与派生值</strong></>, "第 8 章 8.1", "App 双状态 + 现算的 visible/doneCount"],
          [<><strong>不可变更新</strong></>, "第 8 章 8.1", "concat / map / filter / 展开运算符"],
          [<><strong>useEffect 与依赖数组</strong></>, "第 8 章 8.2", "localStorage 同步；惰性初始化读回"],
          [<><strong>受控组件</strong></>, "第 7-8 章", "AddForm 的 value/onChange；禁用态派生"],
          [<><strong>列表 key</strong></>, "第 7 章 7.4", "key={task.id}"],
          [<><strong>组件通信</strong></>, "第 7 章 7.3 / 第 8 章", "props 向下、回调向上，TaskItem 纯展示"],
          [<><strong>原子类样式</strong></>, "第 9 章 9.2-9.3", "类名组合 + 暗色孪生类"],
          [<><strong>可访问性</strong></>, "第 9 章 9.4", "checkbox 原生控件、aria-pressed、focus 可见"],
        ]}
      />

      <H2>五、追问与迭代</H2>
      <StepList
        items={[
          <><strong>追问一（列表拖拽排序）：</strong>不要直接让 AI「加个拖拽」。先一起把数据结构说清：「任务数组顺序即展示顺序；拖拽 = 修改数组顺序。请用 @dnd-kit 实现，拖拽结束后 setTasks 一次完成，禁止在拖拽过程中逐帧改 React 状态」。约束越具体，产出越可控。</>,
          <><strong>追问二（性能）：</strong>「任务数达到几百条时筛选明显卡顿，请分析是渲染开销还是过滤开销，给出最小改动方案。」——标准答案通常是给 TaskItem 包一层 memo（props 不变就不重渲染），而不是引入状态库。</>,
          <><strong>追问三（多选删除）：</strong>「增加批量删除：进入多选模式，删除按钮显示已选数量。」——注意它会把状态又提升一层（selectedIds 放 App），正好检验你对状态设计的理解。</>,
        ]}
      />
      <Callout tone="ai" title="本项目复盘的核心收获">
        框架项目的提示词要回答三个架构问题：<strong>数据放哪（状态提升）、组件怎么拆（职责单一）、
        更新怎么写（不可变）</strong>。三个答案写进提示词，AI 产出的结构就大概率是可维护的；
        不写，AI 会替你做决定——而它的默认决定往往是「全塞进一个文件」。
      </Callout>

      <H2>六、自测</H2>
      <Quiz id="quiz-p2" questions={QUIZ} />

      <H2>七、带走这个项目</H2>
      <p>完整的 Vite 工程包就是「篇末落地二」的材料：</p>
      <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
        <DownloadButton folderName="task-app" files={PACK_LAND2} label="下载项目二代码包（Vite 工程）" />
        <span className="text-xs text-muted-foreground">npm install 后 npm run dev 即可运行</span>
      </div>
    </>
  );
}
