"use client";

import { Callout, DevNote, H2, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { TerminalLab } from "@/components/course/terminal-lab";
import { Quiz } from "@/components/course/quiz";

const MOD_SAMPLE = `<!-- 单文件时代：三个 script 共享同一个全局作用域，谁先谁后靠人肉保证 -->
<script src="utils.js"></script>
<script src="cart.js"></script>

<!-- 模块时代：每个文件一个独立作用域，依赖关系写在代码里 -->
<script type="module">
  import { formatPrice } from "./utils/format.js";
  import { addToCart } from "./cart.js";
</script>`;

const PKG_SAMPLE = `{
  "name": "task-app",
  "scripts": {
    "dev": "vite",                        // npm run dev → 启动开发服务器
    "build": "tsc -b && vite build"       // npm run build → 类型检查 + 打包
  },
  "dependencies": {
    "react": "^19.1.0"                    // ^19.1.0 = 接受 19.x.x 的更新，锁住大版本
  },
  "devDependencies": {
    "vite": "^6.3.5"                      // 只在开发期用的工具
  }
}`;

const VITE_LADDER = `// AI 生成的单文件 HTML → 标准工程的迁移路径
// ① npm create vite@latest portfolio -- --template vanilla
// ② 把 <body> 里的 HTML 搬进 index.html
// ③ 把 <style> 搬进 src/style.css，在 main.js 里 import "./style.css"
// ④ 把 <script> 搬进 src/main.js，长函数按职责拆成 src/utils/*.js 并用 import 连接
// ⑤ npm run dev → 页面行为不变，但热更新与模块化就位了`;

const QUIZ = [
  {
    question: "package.json 里的 scripts 字段是干什么的？",
    options: [
      "声明网页里要加载的脚本文件",
      "把常用命令起短名字：npm run dev 实际执行的是 scripts.dev 的内容",
      "列出项目的所有源码文件",
      "存放接口地址",
    ],
    answerIndex: 1,
    explanation:
      "scripts 是项目命令的别名表。除了 dev/build/preview，你也可以加 \"lint\": \"eslint .\" 之类的自定义命令。",
  },
  {
    question: "dependencies 与 devDependencies 的区别是？",
    options: [
      "一个是官方包，一个是第三方包",
      "前者运行时需要（会被打进产物），后者只在开发期用（如构建工具、类型包）",
      "前者免费，后者收费",
      "没有区别",
    ],
    answerIndex: 1,
    explanation:
      "react 是 dependencies；vite、typescript 是 devDependencies。装错位置一般不影响本地开发，但会影响生产安装体积。",
  },
  {
    question: "Vite 开发时为什么快？",
    options: [
      "它把代码压缩得更好",
      "按需编译：浏览器请求哪个模块就即时转换哪个，项目再大启动也只编译入口",
      "它绕过了浏览器",
      "它使用了缓存数据库",
    ],
    answerIndex: 1,
    explanation:
      "传统构建工具启动时要先「打包整个项目」，Vite 利用浏览器原生 ESM 按需编译——这正是第 5.2 节模块化知识的直接应用。",
  },
  {
    question: "HMR（热模块替换）和「手动刷新页面」的区别是？",
    options: [
      "没有区别，只是自动刷新",
      "HMR 只替换被修改的模块并保留应用状态（输入框内容、当前路由都不丢）",
      "HMR 只在生产环境生效",
      "HMR 需要重启服务器",
    ],
    answerIndex: 1,
    explanation:
      "整页刷新会丢掉所有运行时状态；HMR 做最小替换。改个弹窗样式不用重新走完「下单流程」才能看效果——这是开发体验的关键差异。",
  },
  {
    question: "npm run build 之后 dist/ 里的文件为什么都带哈希后缀（如 app.3f9c2a.js）？",
    options: [
      "加密保护代码",
      "内容一变文件名就变，让 CDN 和浏览器放心地长期缓存；没变的文件继续用缓存",
      "防止用户复制代码",
      "压缩需要",
    ],
    answerIndex: 1,
    explanation:
      "这是「内容哈希」缓存策略：文件名 = 内容指纹。改版后新文件名强制缓存失效，未改动的依赖继续命中缓存。",
  },
];

export function Chapter5() {
  return (
    <>
      <p>
        前四章的代码都在「一个文件」里：打开、编辑、双击就能跑。真实项目动辄上百个文件、几十个依赖，
        必须有工具链来管理。这一章补上工程化的三块基石——模块、npm、Vite——并亲手走一遍创建工程的全流程。学完你将能够：
      </p>
      <StepList
        items={[
          <>说清楚模块化解决了什么问题，写出 import / export；</>,
          <>读懂 package.json：scripts、dependencies 与版本号；</>,
          <>理解 Vite 的两大角色：开发服务器（含 HMR）与构建工具；</>,
          <>掌握 Git 三板斧（add / commit / push）；</>,
          <><strong>把 AI 生成的单文件页面升级为标准 Vite 工程</strong>（5.5 节落地指南 + 实验 5）。</>,
        ]}
      />

      <H2>5.1 为什么单文件撑不住了</H2>
      <p>
        第一篇的实验都是单文件，因为它便于观察「代码 → 画面」的因果。但单文件有三个天花板：
        <strong>命名冲突</strong>（所有 script 共享一个全局作用域，两个文件都定义 <code>function init()</code> 就打架）、
        <strong>加载顺序脆弱</strong>（utils.js 必须写在 cart.js 前面，全靠人肉记忆）、
        <strong>无法复用</strong>（想把购物车逻辑搬去另一个页面，只能复制粘贴）。
      </p>
      <CodeBlock code={MOD_SAMPLE} language="html" filename="modules.html" />
      <p>
        模块（ES Modules）一举解决三件事：每个文件自带独立作用域；
        依赖关系写进 import 语句（工具会自动处理顺序）；按文件拆分后天然可复用。
        第 7 章的 React 组件、第 5 章实验里的 Vite 工程，全部建立在它之上。
      </p>

      <H2>5.2 Node 与 npm：JavaScript 的包管理器</H2>
      <p>
        <strong>Node.js</strong> 是「能跑在服务器上的 JavaScript」（第 10 章会用它写后端）。
        除此之外它还养活了整个前端工具链：Vite、TypeScript、ESLint……都是 Node 程序。
        <strong>npm</strong> 则是 Node 的包管理器——一个装着 200 多万个开源包的仓库 + 一条安装命令。
      </p>
      <CodeBlock code={PKG_SAMPLE} language="json" filename="package.json" />
      <KVTable
        head={["命令", "作用", "记忆点"]}
        rows={[
          { k: "npm install", v: "按 package.json 装好所有依赖到 node_modules", v2: "新机器 / 新同事克隆项目后第一条命令" },
          { k: "npm run dev", v: "执行 scripts 里的 dev", v2: "开发期常驻终端" },
          { k: "npm run build", v: "打包产出 dist/ 目录", v2: "产物才是真正部署上线的文件" },
          { k: "npm install <pkg>", v: "安装新依赖并写入 package.json", v2: "加 --save-dev 进 devDependencies" },
        ]}
      />
      <Callout tone="info" title="版本号 ^19.1.0 的含义">
        语义化版本 = 大版本.小版本.补丁（19.1.0）。前缀 <code>^</code> 表示「接受 19.x.x 内的更新」。
        精确锁版本靠 package-lock.json——它记录每个依赖的精确版本，团队协作与部署环境靠它保证「装的都一样」。
      </Callout>

      <H2>5.3 Vite：开发服务器 + 构建工具</H2>
      <p>
        <strong>Vite</strong>（法语「快」，读 /vit/）做两件事：
      </p>
      <StepList
        items={[
          <><strong>开发期：开发服务器。</strong>利用浏览器原生 ESM 按需编译——请求哪个文件才编译哪个，所以启动极快。还内置 HMR（热模块替换）：改代码保存后，浏览器只替换改动模块，<strong>页面状态不丢、不整页刷新</strong>。</>,
          <><strong>交付期：构建工具。</strong><code>npm run build</code> 把上百个源文件打包、压缩、加上内容哈希，产出可部署的 dist/ 目录。</>,
        ]}
      />
      <p>
        一句话总结分工：<strong>开发看 Vite，部署看 dist</strong>。你平时 90% 的时间活在开发服务器里。
      </p>

      <H2>5.4 Git 三板斧</H2>
      <p>
        版本管理不是选修课。AI 时代更需要它：改坏了随时回退，是放心大改代码的底气。
        第一篇只需要三条命令：
      </p>
      <CodeBlock
        code={`git init                       # 让这个目录变成 Git 仓库（只需一次）
git add .                      # 把当前所有改动放进「暂存区」
git commit -m "完成响应式作品集"  # 存档：以后随时可以回到这个时刻
git log --oneline              # 查看存档历史`}
        language="bash"
        filename="git-3.md"
      />
      <p>
        建议节奏：每完成一个实验就 commit 一次，注释写清楚做了什么。附录 B 有完整的环境安装与远程仓库说明。
      </p>

      <H2>5.5 AI 产出落地指南：单文件升级为 Vite 工程</H2>
      <p>
        你平时让 AI 生成的多半是单文件 HTML。它能跑，但享受不到模块化与热更新。
        把它升级为标准工程只需五步（这也是本课程所有项目复盘的通用前置动作）：
      </p>
      <CodeBlock code={VITE_LADDER} language="javascript" filename="upgrade-steps.js" />
      <Callout tone="ai" title="给 AI 的迁移提示词模板">
        「我有一个单文件 HTML 前端项目（见附件）。请帮我迁移到 Vite 工程：保持功能与样式完全不变；
        按「页面结构 / 样式 / 工具函数 / 数据」拆分模块；index.html 只保留挂载点；
        最后给出 npm 命令清单与目录树。」——先拆分再迁移，比让 AI 一次性重写安全得多。
      </Callout>

      <H2>5.6 实验 5：终端跟练——npm create vite 到 npm run dev</H2>
      <p>
        现在把整个流程「演」一遍：从创建工程、安装依赖到启动开发服务器。跟着终端输出逐行读，
        回放结束后用虚拟文件树找到每个关键文件（任务清单里有三个必答题）：
      </p>
      <DevNote>
        {"// 注：终端内容为预录回放，逐行高亮由课程页驱动；你在本机执行同样的命令会得到相同输出（版本号可能不同）。\n// 虚拟文件树的内容即真实 Vite 模板文件，「篇末落地二」会在你自己的电脑上把这五条命令真跑一遍。"}
      </DevNote>
      <TerminalLab />

      <H2>5.7 AI 产出精读：package.json 里藏着项目说明书</H2>
      <p>
        拿到任何 AI 生成的工程，第一件事是读 package.json——它就是项目说明书。三问定位法：
      </p>
      <Table
        head={["看哪里", "能判断什么"]}
        rows={[
          [<><code>scripts</code></>, "项目怎么跑：dev 的命令是什么？build 前有没有 lint/type-check？命令名字能看出团队习惯"],
          [<><code>dependencies</code></>, "技术栈与版本：react 还是 vue？用的还是不是 Active 维护的大版本（如 React 19 而不是 16）"],
          [<><code>devDependencies</code></>, "工程化水平：有没有 TypeScript、ESLint、Prettier——齐全说明工程规范；全空就要警惕代码质量"],
        ]}
      />
      <Callout tone="info" title="呼应后文">
        第 7 章起的所有 React 实验都在「Vite 工程的心智模型」下进行：浏览器内转译只是教学沙箱，
        真实形态就是这里创建的 task-app。两章内容会互相对照。
      </Callout>

      <H2>5.8 自测</H2>
      <Quiz id="quiz-ch5" questions={QUIZ} />
    </>
  );
}
