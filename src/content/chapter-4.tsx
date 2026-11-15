"use client";

import { Callout, H2, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { EXPERIMENT_4 } from "@/lib/course/experiments";

const DOM_SAMPLE = `// 查询：querySelector 走 CSS 选择器语法，查不到返回 null
const btn   = document.querySelector("#theme-btn");
const cards = document.querySelectorAll(".card");   // 伪数组 NodeList

// 读改内容：textContent 只碰文字（安全）；innerHTML 会解析 HTML（有风险）
btn.textContent = "切换暗色模式";

// 读改属性：dataset 对应 data-* 自定义属性
btn.dataset.theme = "dark";
btn.classList.toggle("dark");        // 类名的增删切换

// 创建与插入
const p = document.createElement("p");
p.textContent = "JS 刚刚创建了我";
document.querySelector("main").appendChild(p);`;

const EVENTS_SAMPLE = `// 委托：把监听器挂在父元素上，靠事件冒泡统一处理所有子项
list.addEventListener("click", (e) => {
  const item = e.target.closest("li");       // 真正被点的元素向上找最近的 li
  if (!item || !list.contains(item)) return; // 点到列表外就不管
  item.classList.toggle("done");
});

// 三个最常用的收尾动作
e.preventDefault();  // 拦截默认行为（如表单整页提交）
e.stopPropagation(); // 阻止继续冒泡（少用，会破坏委托）
e.key === "Enter";   // 键盘事件里判断具体按键`;

const ASYNC_SAMPLE = `// 异步的直觉：耗时操作不阻塞主线程，完成后通过回调通知你
setTimeout(() => console.log("B：1 秒后"), 1000);
console.log("A：立刻");
// 打印顺序 A → B。JS 是单线程的：先跑完同步代码（A），
// 定时器到点后把回调排进队列（事件循环），才有 B。

// Promise：对「未来结果」的占位。fetch 返回的就是它
// async/await：用同步的写法写异步，错误用 try/catch 统一处理
async function loadQuotes() {
  try {
    const res = await fetch("/api/quotes");
    if (!res.ok) throw new Error("HTTP " + res.status);  // HTTP 错误不会自动抛！
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("加载失败", err);   // 网络断了 / 接口 500 了 / JSON 解析失败，都到这
    return null;
  }
}`;

const AI_JS_SAMPLE = `async function loadPosts() {
  loading.value = true;                    // 1) 先进加载态
  error.value = "";
  try {
    const res = await fetch("/api/posts");
    if (!res.ok) throw new Error("HTTP " + res.status);
    posts.value = await res.json();
  } catch (err) {
    error.value = "加载失败，请稍后重试";   // 2) 用户能看懂的错误文案
    console.error(err);                     // 3) 开发者看的技术细节
  } finally {
    loading.value = false;                  // 4) 无论成败都退出加载态
  }
}`;

const QUIZ = [
  {
    question: "为什么渲染用户输入的内容时，推荐 textContent 而不是 innerHTML？",
    options: [
      "textContent 性能更好",
      "innerHTML 会把内容当 HTML 解析，恶意 <script> 或 <img onerror> 会执行——即 XSS 注入",
      "textContent 支持换行",
      "innerHTML 已被废弃",
    ],
    answerIndex: 1,
    explanation:
      "innerHTML 解析并执行 HTML 标签。凡是渲染「不可信输入」（用户留言、接口数据）都应该用 textContent 或 createElement，这是安全底线。",
  },
  {
    question: "事件委托的核心原理是？",
    options: [
      "事件会从被点击的子元素向上冒泡到父元素，父元素的监听器也能收到",
      "浏览器自动复制监听器给每个子元素",
      "子元素的事件监听器可以继承",
      "父元素可以拦截并吞掉子元素事件",
    ],
    answerIndex: 0,
    explanation:
      "利用冒泡机制只挂一个监听器，配合 e.target / closest 判断真正的目标。列表项再多也只有一个监听器，新增项无需重新绑定。",
  },
  {
    question: "fetch 请求返回 HTTP 500 时，下面哪句话是对的？",
    options: [
      "fetch 会抛异常，必须 catch",
      "fetch 正常返回，只是 res.ok 为 false——必须自己检查 res.ok 并主动 throw",
      "浏览器自动弹出错误提示",
      "res.json() 会抛出 500 错误",
    ],
    answerIndex: 1,
    explanation:
      "fetch 只在网络层失败（断网、DNS 失败）时 reject。HTTP 4xx/5xx 属于「收到了响应」，await 不会抛错——漏查 res.ok 是最高频的接口错误处理 bug。",
  },
  {
    question: "console.log(\"A\") 与 setTimeout(() => console.log(\"B\"), 0) 的打印顺序是？",
    options: ["B 然后 A", "A 然后 B", "同时打印", "不确定"],
    answerIndex: 1,
    explanation:
      "JS 单线程：当前同步代码先全部跑完（A），再由事件循环调度 setTimeout 的回调（B）。哪怕延时 0 毫秒也要排队。",
  },
  {
    question: "「加载态 → 成功态 / 错误态」的三状态设计，目的是？",
    options: [
      "让代码更面向对象",
      "任何网络请求都有延迟与失败可能，用户需要即时反馈才知道发生了什么",
      "浏览器要求必须如此",
      "为了 SEO",
    ],
    answerIndex: 1,
    explanation:
      "加载中给 spinner 或骨架、成功渲染数据、失败给可理解的提示与重试入口。实验 4 步骤②的 fail=1 演练就是为了让这个状态机跑起来。",
  },
];

export function Chapter4() {
  return (
    <>
      <p>
        前三章的页面是「静态的」：HTML 写死什么就显示什么。这一章 JavaScript 正式登场：
        操作 DOM 让页面动起来，fetch 让页面第一次<strong>联网</strong>——课程站的真实接口就架在那里等你调用。学完你将能够：
      </p>
      <StepList
        items={[
          <>用 querySelector 查询、修改 DOM，并区分 textContent 与 innerHTML 的安全边界；</>,
          <>理解事件冒泡，写出事件委托；</>,
          <>读懂异步：事件循环、Promise 与 async/await；</>,
          <>建立「加载 / 成功 / 错误」三状态意识；</>,
          <><strong>调用课程站真实 API，并在网络面板里逐条核对请求</strong>（实验 4）。</>,
        ]}
      />

      <H2>4.1 DOM 操作：页面是一棵可以编程的树</H2>
      <p>
        第 1 章说过：浏览器解析 HTML 后得到 DOM 树。JavaScript 操作页面，本质就是在这棵树上
        「查找节点 → 修改内容/属性/样式 → 增删节点」：
      </p>
      <CodeBlock code={DOM_SAMPLE} language="javascript" filename="dom-basics.js" />
      <Callout tone="warn" title="textContent vs innerHTML：安全分界线">
        <code>textContent</code> 把内容当纯文本；<code>innerHTML</code> 把内容当 HTML 解析并可能执行脚本。
        凡是渲染用户输入或接口数据，一律用 textContent——这行纪律能挡住最常见的 XSS 攻击。
      </Callout>

      <H2>4.2 事件：页面的神经系统</H2>
      <p>
        点击、输入、滚动、键盘……都是事件。第 1 章你已经用过 <code>addEventListener</code>；
        现在补上两个关键认知：<strong>冒泡</strong>与<strong>委托</strong>。
        事件先在目标元素上触发，然后逐级向上（冒泡）——所以把监听器挂在父元素上，就能统一处理所有子元素的事件：
      </p>
      <CodeBlock code={EVENTS_SAMPLE} language="javascript" filename="delegation.js" />
      <p>
        委托的好处：列表有 1000 项也只挂一个监听器；后续新增的列表项自动被覆盖，无需重新绑定。
        实验步骤①会让你亲手写一遍。
      </p>

      <H2>4.3 异步：单线程如何做到「同时」等很多事</H2>
      <p>
        JS 是单线程的，却可以同时等接口、等定时器、等用户点击——靠的是<strong>事件循环</strong>：
        同步代码立刻执行；耗时操作交给浏览器的其他能力（网络线程、定时器），完成后回调被排进队列，
        等主线程空闲时再执行。
      </p>
      <CodeBlock code={ASYNC_SAMPLE} language="javascript" filename="async.js" />
      <KVTable
        head={["概念", "一句话理解"]}
        rows={[
          { k: "同步", v: "代码按顺序立刻执行，下一行等上一行跑完" },
          { k: "回调", v: "「完事之后请调用这个函数」。嵌套多了就是回调地狱" },
          { k: "Promise", v: "对「未来结果」的占位凭证，可 then/catch 链式处理" },
          { k: "async/await", v: "Promise 的语法糖：用同步的写法写异步，配 try/catch 统一处理错误" },
          { k: "事件循环", v: "主线程跑完同步任务后，反复从队列取回调执行的调度机制" },
        ]}
      />

      <H2>4.4 与服务器对话：fetch、JSON 与三状态</H2>
      <p>
        <code>fetch</code> 是浏览器原生的 HTTP 客户端。两个最容易踩的坑，实验里都会演练：
      </p>
      <StepList
        items={[
          <><strong>HTTP 错误不会自动抛异常</strong>：接口返回 500 时 fetch 照样 resolve，必须检查 <code>res.ok</code> 自己 throw。</>,
          <><strong>网络失败才真正 reject</strong>：断网、DNS 失败走 catch。两类失败要分别处理。</>,
        ]}
      />
      <p>
        而 UI 层面要建立<strong>三状态</strong>意识：加载中（告诉用户在等）、成功（渲染数据）、
        失败（说人话的错误提示 + 重试入口）。第 10 章会把这套流程封装成 fetchJSON。
      </p>

      <H2>4.5 实验 4：暗色模式、事件委托与真实接口</H2>
      <p>
        本章实验第一次联网：名言接口 <code>/api/quotes</code> 就架在课程站服务器上，
        每一条请求都会出现在实验区下方的<strong>网络面板</strong>里（方法、状态码、耗时）。
        四步：事件委托与暗色模式 → GET 拉取名言 → POST 提交名言 → 故障演练。
      </p>
      <Playground experiment={EXPERIMENT_4} />
      <Callout tone="info" title="把网络面板用起来">
        这是 DevTools Network 面板的浓缩版。做完全部步骤后回到步骤②，把每个请求的方法、状态码、耗时
        抄在笔记本上——前三篇的联调实验都依赖这个习惯。
      </Callout>

      <H2>4.6 AI 产出精读：接口调用的标准形状</H2>
      <p>
        让 AI「写个加载数据的函数」，十有八九会得到下面这个形状——它之所以是标准答案，
        是因为它把 4.4 节的所有要求都落实了：
      </p>
      <CodeBlock code={AI_JS_SAMPLE} language="javascript" filename="load-posts.js" source="AI 生成 · 典型形状" />
      <Table
        head={["逐段拆解", "对应的知识点"]}
        rows={[
          [<><code>loading.value = true</code> 先置加载态</>, "三状态设计的第一步：先让用户「看见等待」（4.4 节）"],
          [<><code>if (!res.ok) throw</code></>, "HTTP 错误检查——fetch 不会自动抛（4.4 节的坑 1）"],
          [<><code>catch → error.value = 人话</code></>, "网络失败的兜底 + 用户可读文案（4.4 节的坑 2）"],
          [<><code>finally → loading = false</code></>, "成功失败都必须退出加载态；finally 是唯一保证执行的收尾位置"],
        ]}
      />
      <Callout tone="ai" title="向 AI 追问的正确姿势">
        AI 默认产出通常「只写 happy path」。拿到代码后追问三连：「断网时界面会怎样？」「接口返回 401 时代码走到哪？」「快速连续点击会发生什么？」
        ——三个问题能筛掉大半线上事故。
      </Callout>

      <H2>4.7 自测</H2>
      <Quiz id="quiz-ch4" questions={QUIZ} />
    </>
  );
}
