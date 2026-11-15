"use client";

import { Compass, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Callout,
  H2,
  H3,
  KVTable,
  StepList,
} from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { DownloadButton } from "@/components/course/download-button";
import { EXPERIMENT_1 } from "@/lib/course/experiments";

const TRIO_SNIPPET = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>三件套各就各位</title>
  <style>                       /* ← CSS：管长相 */
    h1 { color: seagreen; }
    #msg { font-size: 14px; color: gray; }
  </style>
</head>
<body>
  <h1>你好，前端</h1>            <!-- ← HTML：管内容 -->
  <p id="msg">这是初始文字。</p>
  <button id="btn">改文字</button>
  <script>                      /* ← JavaScript：管行为 */
    document.getElementById("btn")
      .addEventListener("click", () => {
        document.getElementById("msg")
          .textContent = "JavaScript 刚刚修改了我！";
      });
  </script>
</body>
</html>
`;

const FIRST_PAGE_SNIPPET = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>页面标题（显示在浏览器标签上）</title>
</head>
<body>
  <h1>一级标题：页面最大的那个字</h1>
  <p>这是一个段落。文字写在这里。</p>
  <a href="https://developer.mozilla.org/">这是一个链接</a>
</body>
</html>
`;

const AI_SAMPLE = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>张三的简历</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header>
      <h1>张三</h1>
      <p>前端开发工程师 · 正在学习 AI 协作开发</p>
    </header>
    <main>
      <section id="skills">
        <h2>技能</h2>
        <ul>
          <li>Python（熟练）</li>
          <li>前端（学习中）</li>
        </ul>
      </section>
      <section id="contact">
        <h2>联系我</h2>
        <a href="mailto:zhangsan@example.com">zhangsan@example.com</a>
      </section>
    </main>
    <footer>
      <p>© 2026 张三</p>
    </footer>
  </body>
</html>
`;

const QUIZ_QUESTIONS = [
  {
    question: "HTML、CSS、JavaScript 分别负责网页的什么？",
    options: [
      "结构 / 表现 / 行为",
      "表现 / 结构 / 行为",
      "行为 / 结构 / 表现",
      "三者都负责结构",
    ],
    answerIndex: 0,
    explanation:
      "HTML 决定「有什么内容」（结构），CSS 决定「长什么样」（表现），JavaScript 决定「做什么反应」（行为）。这个分工贯穿全书。",
  },
  {
    question: "浏览器解析 HTML 后生成的树状结构叫什么？",
    options: ["CSSOM", "DOM", "渲染树", "文件树"],
    answerIndex: 1,
    explanation:
      "DOM（文档对象模型）是 HTML 解析后的产物；渲染树是 DOM 与 CSSOM 合成之后的结果；文件树是磁盘上的目录结构，三者别混淆。",
  },
  {
    question: "HTTP 状态码 404 表示什么？",
    options: [
      "服务器内部出错",
      "请求成功",
      "请求的资源在服务器上找不到",
      "永久重定向",
    ],
    answerIndex: 2,
    explanation:
      "4xx 表示客户端侧的问题：404 = 资源不存在；5xx 才是服务器内部错误（如 500）；200 是成功；301 是永久重定向。",
  },
];

export function Chapter1() {
  return (
    <>
      <p>
        这是全书的第一章，也是所有后续内容的地基。学完本章，你将能够：
      </p>
      <StepList
        items={[
          <>说清楚前端和后端各自负责什么、在哪儿运行；</>,
          <>认识前端的「三件套」：HTML、CSS、JavaScript 如何分工；</>,
          <>理解浏览器把代码变成画面的完整流程；</>,
          <>知道 DevTools（F12）是什么、什么时候用；</>,
          <>
            <strong>亲手写出并运行你的第一个网页</strong>（实验 1）。
          </>,
        ]}
      />
      <H2>1.1 前端是什么：你看得见的部分</H2>
      <p>
        打开任何一个网站，实际上有两个世界在协同工作。<strong>一个在你眼前</strong>：浏览器把代码渲染成你看到的页面、按钮、动画；
        <strong>一个在远处的服务器上</strong>：它存储数据、处理业务逻辑，你看不见它，只能通过请求和它对话。
        前者就是<strong>前端（Front-end）</strong>，后者是<strong>后端（Back-end）</strong>。
      </p>
      <p>
        用餐厅打比方：前端是餐厅的门面、菜单、摆盘和服务员——你看得见、摸得着的一切；后端是后厨——食材怎么洗、菜怎么炒、库存怎么管，都在你看不见的地方发生。
        你点一道菜（发送请求），后厨做好（处理数据），服务员端上来（返回响应并展示）。
      </p>
      <KVTable
        rows={[
          { k: "前端", v: <>运行在<strong>用户浏览器</strong>里；负责界面展示与交互；技术：HTML / CSS / JavaScript 及各类框架（本课主线）</> },
          { k: "后端", v: <>运行在<strong>服务器</strong>上；负责数据存储与业务逻辑；技术：Node.js、Python、Java 等（第 10-11 章会用 Node.js 实战）</> },
          { k: "它们如何配合", v: <>通过 <strong>HTTP 请求</strong>传递数据（1.5 节初见，第 10 章深究）</> },
        ]}
      />
      <Callout tone="ai" title="和你日常的 AI 开发的关系">
        你用 AI 生成的前端应用，本质上是 AI 替你写好了「看得见的这一半」。学会本课，你就能打开这一半的引擎盖：看懂它为什么这么写、判断它写得对不对、改得动它任何一行。
      </Callout>

      <H2>1.2 三件套：结构、表现、行为</H2>
      <p>
        每个网页——从最简单的个人主页到最复杂的在线办公套件——都由三种语言分工合作完成。它们就是传说中的<strong>前端三件套</strong>：
      </p>
      <KVTable
        rows={[
          { k: "HTML", v: <><strong>结构（Structure）</strong>。定义页面上有什么内容：一个标题、一段文字、一张图片、一个按钮。类比：骨架。</> },
          { k: "CSS", v: <><strong>表现（Presentation）</strong>。定义内容长什么样：颜色、字体、大小、间距、布局、动画。类比：皮肤。</> },
          { k: "JavaScript", v: <><strong>行为（Behavior）</strong>。定义页面做什么反应：点击按钮后发生什么、数据怎么加载、表单怎么校验。类比：肌肉。</> },
        ]}
      />
      <p>
        三件套可以写在同一个文件里。下面这份代码三部分齐全——现在看不懂细节没关系，先建立「每一段属于谁」的感觉：
      </p>
      <CodeBlock
        code={TRIO_SNIPPET}
        language="html"
        filename="trio-demo.html"
        source="人手写示例"
      />
      <p>
        这份代码运行后：<code>&lt;h1&gt;</code> 的文字来自 <strong>HTML</strong>；它是绿色的，因为 <strong>CSS</strong> 里写了
        <code> color: seagreen</code>；点按钮后灰色文字会变，因为 <strong>JavaScript</strong> 在监听点击并修改了页面。
        你可以在本章实验区的第①步代码里亲手找到这三段。
      </p>

      <H2>1.3 浏览器如何把代码变成画面</H2>
      <p>
        在「输入网址」和「看见页面」之间，浏览器做了一件相当精巧的事。理解这条流水线，后面你才明白为什么改 CSS 会导致页面跳动、为什么 AI 生成的页面有时会「闪一下」：
      </p>
      <StepList
        items={[
          <><strong>解析 HTML → 生成 DOM 树。</strong> DOM（文档对象模型）是页面的「家族族谱」：每个标签成为一个节点，层级关系和标签嵌套一致。后续 JS 修改页面，本质就是在改这棵树。</>,
          <><strong>解析 CSS → 生成 CSSOM。</strong> 把所有样式规则整理成一张「规则速查表」。</>,
          <><strong>合成渲染树。</strong> 把「有什么」（DOM）和「长什么样」（CSSOM）对上号：哪个节点该用什么样式、是否显示。</>,
          <><strong>布局（Layout）。</strong> 计算每个元素的位置和大小——第 3 章讲的盒模型就在这一步生效。</>,
          <><strong>绘制（Paint）。</strong> 逐像素把页面画出来。你改个颜色，浏览器只需重绘（很快）；你改个宽度，就要重新布局（慢一些）。</>,
        ]}
      />
      <Callout tone="info" title="为什么要懂这个流程">
        这不是让你去实现浏览器，而是为了建立<strong>因果感</strong>：代码 → 流水线 → 画面。第 3 章的布局抖动、第 9 章的性能优化、乃至你以后看 AI 生成的代码「为什么闪烁」，都需要这条流水线做解释。
      </Callout>

      <H2>1.4 DevTools：网页的体检仪</H2>
      <p>
        在任何网页上按 <kbd>F12</kbd>（Mac 上 <kbd>Cmd + Option + I</kbd>），会打开浏览器的开发者工具（DevTools）。它是前端开发中使用频率最高的工具，没有之一。你只需要先认识三个面板：
      </p>
      <KVTable
        rows={[
          { k: "Elements", v: <>查看页面的 DOM 树，并且可以<strong>实时修改</strong>：双击文字直接改、改样式立即生效。适合「研究别人网页」和「调试自己页面」。</> },
          { k: "Console", v: <>控制台：看报错信息（红字）、打日志、临时执行 JS。AI 生成的代码出了问题，第一站就是来这里看红色报错。</> },
          { k: "Network", v: <>网络面板：记录页面发出的每一个请求。第 10-11 章讲前后端配合时，它会成为主角；本课程实验区的「网络透视面板」原型就是它。</> },
        ]}
      />
      <Callout tone="info" title="在线实验的边界">
        本课程实验区的预览窗格暂不集成完整 DevTools。1.10 节的落地实验会对着下载到本机的代码按 F12，亲自操作 Elements 面板。
      </Callout>

      <H2>1.5 HTTP 初见：按下回车后发生了什么</H2>
      <p>
        前后端之间「对话」的方式叫 <strong>HTTP</strong>（超文本传输协议）。协议听起来吓人，其实就是一套固定的对话格式。当你在地址栏敲下回车：
      </p>
      <StepList
        items={[
          <><strong>DNS 查询：</strong>把域名（如 example.com）翻译成服务器的 IP 地址——类似查通讯录。</>,
          <><strong>建立连接：</strong>浏览器和服务器之间建立一条可靠的通道（TCP）。</>,
          <><strong>发送 HTTP 请求：</strong>浏览器问：「请给我 / 这个路径的内容」（请求由方法、路径、请求头等组成）。</>,
          <><strong>服务器响应：</strong>服务器回答：「200，给你」并附上 HTML 文本；找不到就回答「404」。</>,
          <><strong>渲染并继续请求：</strong>浏览器渲染 HTML，发现里面还引用了 CSS、JS、图片，就再发一轮请求——所以 Network 面板里通常有很多条记录。</>,
        ]}
      />
      <KVTable
        head={["状态码", "含义"]}
        rows={[
          { k: "200", v: "成功。要的东西拿到了。" },
          { k: "301", v: "永久重定向。你要的地址换了，去新地址。" },
          { k: "404", v: "找不到。地址写错了或资源不存在——客户端侧的问题。" },
          { k: "500", v: "服务器内部错误——服务端的代码崩了。" },
        ]}
      />
      <Callout tone="info" title="呼应后文">
        第 10 章你将亲手用 Express 写一个真正的 HTTP 服务器，亲手制造一次 404 和一次 CORS 报错，再把它们修好。现在记住「请求—响应」这个形状就够了。
      </Callout>

      <H2>1.6 第一个页面：HTML 的最小骨架</H2>
      <p>任何一个网页，最小的合法骨架长这样：</p>
      <CodeBlock
        code={FIRST_PAGE_SNIPPET}
        language="html"
        filename="first-page.html"
        source="人手写示例"
      />
      <p>逐行解释：</p>
      <KVTable
        rows={[
          { k: "<!DOCTYPE html>", v: <>声明「这是现代 HTML 文档」，浏览器会以标准模式渲染。没有它，浏览器可能进入古董兼容模式，样式全乱。</> },
          { k: "<html lang=\"zh-CN\">", v: "根元素，包裹整个页面；lang 声明语言为中文，影响翻译提示与读屏软件发音。" },
          { k: "<head>…</head>", v: "给浏览器看的信息区：字符编码（防乱码）、页面标题等，用户看不到正文。" },
          { k: "<body>…</body>", v: "给用户看的内容区：页面上所有看得见的东西都写在这里。" },
        ]}
      />
      <p>标签的三条语法规则：</p>
      <StepList
        items={[
          <>绝大多数标签<strong>成对出现</strong>：<code>&lt;p&gt;内容&lt;/p&gt;</code>，开头和结尾差一个斜杠。</>,
          <>标签可以带<strong>属性</strong>，写在开标签里：<code>&lt;a href="https://..."&gt;</code>——href 就是属性名，引号里是属性值。</>,
          <>少数标签<strong>自闭合</strong>（没有内容）：<code>&lt;meta /&gt;</code>、<code>&lt;img /&gt;</code>。另外：缩进不是语法要求，但是必备的代码习惯。</>,
        ]}
      />
      <KVTable
        head={["常用标签", "用途"]}
        rows={[
          { k: "<h1> ~ <h6>", v: "六级标题，h1 最大。每个页面通常只有一个 h1。" },
          { k: "<p>", v: "段落。" },
          { k: "<a href=\"…\">", v: "链接。加 target=\"_blank\" 会在新标签页打开。" },
          { k: "<img src=\"…\" alt=\"…\">", v: "图片。alt 是图片的文字说明（加载失败时显示，也是无障碍要求）。" },
          { k: "<ul> <li>", v: "无序列表和列表项（有序列表用 <ol>）。" },
          { k: "<button>", v: "按钮，通常配合 JavaScript 使用。" },
          { k: "<div> <span>", v: "无语义的容器（块级 / 行内），只用来打包分组。第 2 章会讲为什么不能滥用它们。" },
        ]}
      />

      <H2>1.7 实验 1：解剖网页，写出第一个页面</H2>
      <p>
        <FlaskConical className="mr-1 inline h-4 w-4 text-primary" aria-hidden />
        现在轮到你动手。实验区左侧是编辑器，右侧是预览窗格。按步骤完成 5 个小任务：
      </p>
      <Playground experiment={EXPERIMENT_1} />
      <p>
        完成后回到第③步对照参考答案，重点关注两个细节：<code>&lt;a&gt;</code> 是否加了
        <code> target=&quot;_blank&quot;</code>；计数变量 <code>count</code> 是否声明在函数<strong>外面</strong>（想想：如果放在函数里面会发生什么？——每次点击都从 0 开始）。
      </p>

      <H2>1.8 AI 产出精读：AI 默认会写什么</H2>
      <p>
        本课程每章都有这一节：读一段<strong>典型的 AI 生成代码</strong>。目标不是背语法，而是让你下次面对 AI 产出时，能指着每一行说「我知道这是干嘛的」，并能判断它对不对。
        下面是让 AI「生成一个简历页面」时最典型的产出：
      </p>
      <CodeBlock
        code={AI_SAMPLE}
        language="html"
        filename="index.html"
        source="AI 生成 · 典型首页"
      />
      <KVTable
        head={["AI 的默认动作", "背后的原因"]}
        rows={[
          { k: "<!DOCTYPE html>", v: "永远会写。声明标准渲染模式，漏了它样式会进入古董模式。" },
          { k: "lang=\"zh-CN\"", v: "语言声明。你用中文提示词，AI 就写 zh-CN——这是好习惯。" },
          { k: "meta charset=\"UTF-8\"", v: "防止中文乱码。没有它，某些环境下页面会变成「æµ‹è¯•」这样的乱码。" },
          { k: "meta viewport", v: "让手机按真实尺寸显示页面而不整体缩小——这是「响应式」的前提（第 3 章展开）。" },
          { k: "header / main / section / footer", v: "语义化标签：用有含义的标签代替一堆 <div>。第 2 章的主题，AI 默认就用。" },
          { k: "link rel=\"stylesheet\"", v: "CSS 放独立文件而不是塞在 HTML 里——大型工程的惯例，第 5 章工程化的伏笔。" },
        ]}
      />
      <Callout tone="ai" title="本节怎么用">
        把这段代码和 1.6 节的最小骨架对比：骨架长出来「头、身、脚」了。AI 不是在炫技，这些全是它从海量真实项目中统计出的默认最佳实践。看懂它们，你就看懂了 AI 的「出厂设置」。
      </Callout>

      <H2>1.10 落地实验：把本章代码跑在自己的电脑上</H2>
      <p>
        <Compass className="mr-1 inline h-4 w-4 text-sky-700" aria-hidden />
        这是本章的落地环节——把在线体验变成 100% 真实的本机实践。所需时间：5 分钟，不需要安装任何软件：
      </p>
      <StepList
        items={[
          <>点击下面的按钮，下载并解压本章代码包（内含参考答案 index.html 与说明文件）。</>,
          <><strong>双击 index.html</strong>——它会在你的浏览器里直接打开，效果和在线实验第③步的预览一样。</>,
          <>在打开的页面上按 <kbd>F12</kbd> 打开 DevTools → Elements 面板，找到你写的 <code>&lt;h1&gt;</code>，双击修改文字，观察页面立即变化——这就是「DOM 是活的东西」。</>,
        ]}
      />
      <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
        <DownloadButton
          folderName="ch01-exp01-first-page"
          files={EXPERIMENT_1.files}
          readme={EXPERIMENT_1.readme}
          label="下载本章代码包"
        />
        <span className="text-xs text-muted-foreground">
          含 index.html（参考答案）与落地实验说明；解压即可，无需安装环境
        </span>
      </div>
      <Callout tone="landing" title="落地核对清单">
        <StepList
          items={[
            <>双击打开的页面和在线预览一致；</>,
            <>F12 的 Elements 里能找到 &lt;h1&gt; 并实时修改成功；</>,
            <>Console 面板没有红色报错（有就截图，这是你调试生涯的第一课）。</>,
          ]}
        />
      </Callout>

      <H2>1.11 自测</H2>
      <Quiz id="quiz-ch1" questions={QUIZ_QUESTIONS} />
    </>
  );
}
