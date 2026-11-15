"use client";

import { Callout, H2, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { EXPERIMENT_2 } from "@/lib/course/experiments";

const SEMANTIC_AI = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8" /><title>个人主页</title></head>
<body>
  <header>
    <nav>
      <a href="#about">关于</a><a href="#work">作品</a><a href="#contact">联系</a>
    </nav>
  </header>
  <main>
    <section id="about">
      <h1>关于我</h1>
      <p>……</p>
    </section>
    <section id="work">
      <h2>作品</h2>
      <article><h3>项目 A</h3><p>……</p></article>
    </section>
  </main>
  <footer><p>© 2026 · 联系方式在 #contact</p></footer>
</body>
</html>
`;

const FORM_SAMPLE = `<form id="signup">
  <label for="email">邮箱（label 的 for 要和 input 的 id 对上）</label>
  <input id="email" name="email" type="email" required
         placeholder="you@example.com" />

  <label for="level">前端水平</label>
  <select id="level" name="level">
    <option value="beginner">刚入门</option>
    <option value="learning">学习中</option>
  </select>

  <fieldset>
    <legend>你想加强的方向</legend>
    <label><input type="checkbox" name="dir" value="css" /> CSS 布局</label>
    <label><input type="checkbox" name="dir" value="js" /> JavaScript</label>
  </fieldset>

  <button type="submit">提交</button>
</form>
`;

const QUIZ = [
  {
    question: "以下哪组标签都是「语义化」标签？",
    options: [
      "div / span / p",
      "header / main / article / footer",
      "table / tr / td",
      "script / style / link",
    ],
    answerIndex: 1,
    explanation:
      "语义化标签自带含义，浏览器、搜索引擎与读屏软件都能理解。div 和 span 是无语义容器，仅在确实没有合适语义标签时才使用。",
  },
  {
    question: "锚点跳转 <a href=\"#contact\"> 的前提是什么？",
    options: [
      "页面里存在 id=\"contact\" 的元素",
      "必须引入 JavaScript",
      "必须放在 <nav> 里",
      "服务器要支持 # 路由",
    ],
    answerIndex: 0,
    explanation:
      "#contact 是「页面内锚点」，浏览器会滚动到 id 为 contact 的元素处。锚点跳转是纯 HTML 行为，不需要 JS。第 8 章你会看到 hash 还有第二重身份：SPA 路由。",
  },
  {
    question: "关于 <label> 的作用，正确的是？",
    options: [
      "只是让文字变粗",
      "把文字和输入控件关联起来：点文字也能聚焦控件，读屏软件也会念出它",
      "表单必须校验的标记",
      "用来代替 placeholder",
    ],
    answerIndex: 1,
    explanation:
      "label 通过 for 属性（对应控件的 id）建立关联，这是可访问性的基本功：点击面积变大、读屏软件可正确播报。",
  },
  {
    question: "一张图片 alt=\"产品工作台截图\" 的价值是？",
    options: [
      "图片加载失败时显示这段文字，同时让读屏用户知道图片内容",
      "提高图片清晰度",
      "让图片支持搜索",
      "只是注释，没有任何作用",
    ],
    answerIndex: 0,
    explanation:
      "alt 有两个作用：加载失败的占位说明 + 读屏软件的图片播报。空 alt（alt=\"\"）表示「装饰性图片，可跳过」——也是有效的用法。",
  },
  {
    question: "一个页面里使用多个 <h1>，最佳判断是？",
    options: [
      "完全没问题，想用几个用几个",
      "惯例是每个页面一个 h1 作为主标题，分区标题从 h2 开始逐级递减",
      "标题层级和 SEO、读屏都无关",
      "h1 必须写在 <head> 里",
    ],
    answerIndex: 1,
    explanation:
      "标题层级是文档的目录结构。混乱的层级（比如 h2 后面直接跳 h5）会让读屏用户与搜索引擎难以理解页面骨架。",
  },
];

export function Chapter2() {
  return (
    <>
      <p>
        第 1 章的页面只有「一个标题加一段文字」。这一章我们给作品集搭出完整的骨架：
        页头、导航、三个内容分区、页脚——并且让每一个标签都「名正言顺」。学完本章你将能够：
      </p>
      <StepList
        items={[
          <>说出语义化标签（header / main / section / article / footer）各自的含义与用法；</>,
          <>用列表、表格与多媒体组织内容；</>,
          <>写出带 label 与校验的表单；</>,
          <>完成无障碍（可访问性）的四项基本功；</>,
          <><strong>亲手搭出作品集的完整骨架</strong>（实验 2）。</>,
        ]}
      />

      <H2>2.1 语义化：给每块内容一个「正当职业」</H2>
      <p>
        早年很多网页通篇都是 <code>&lt;div&gt;</code>：导航是 div，正文是 div，页脚还是 div——
        结构上完全等价，机器却「读不懂」。语义化标签的出现就是为了解决这个问题：
        <strong>让标签的名字本身说明这块内容是什么</strong>。
      </p>
      <KVTable
        head={["标签", "语义与使用要点"]}
        rows={[
          { k: "<header>", v: <>页头（或区块的头部）。放 logo、站点名、主标题</> },
          { k: "<nav>", v: <>导航。一组主要链接；锚点跳转常用它</> },
          { k: "<main>", v: <>页面主体。每个页面只应有一个</> },
          { k: "<section>", v: <>一个主题分区。通常配一个标题（h2 等）</> },
          { k: "<article>", v: <>独立完整的内容块。一篇博客、一张项目卡片</> },
          { k: "<aside>", v: <>次要、辅助信息。侧栏、相关推荐</> },
          { k: "<footer>", v: <>页脚。版权、备案、次要链接</> },
        ]}
      />
      <p>典型的 AI 生成骨架就是这样的结构（本章 2.6 节会精读它）：</p>
      <CodeBlock code={SEMANTIC_AI} language="html" filename="portfolio.html" source="AI 生成 · 典型骨架" />
      <Callout tone="info" title="为什么值得认真对待">
        语义化的收益有三层：搜索引擎更懂你的页面（SEO）；读屏软件能按结构导航（可访问性）；
        你自己和 AI 都更容易维护——<code>&lt;footer&gt;</code> 一眼就知道是页脚，<code>&lt;div class="footer"&gt;</code> 还要去猜。
      </Callout>

      <H2>2.2 列表、表格与多媒体</H2>
      <p>
        三类高频内容各有专属标签。列表分两种：<code>&lt;ul&gt;</code>（无序）与
        <code>&lt;ol&gt;</code>（有序），列表项一律用 <code>&lt;li&gt;</code>。
        表格由 <code>&lt;table&gt;</code>、<code>&lt;tr&gt;</code>（行）、
        <code>&lt;th&gt;</code>（表头格）、<code>&lt;td&gt;</code>（数据格）组成。
      </p>
      <p>
        多媒体注意两件事：图片必带 <code>alt</code> 说明；<code>img</code> 记得写
        <code> width / height</code>（或用 CSS 控制），否则图片加载前后页面会跳动——
        这正是第 1 章渲染流程里「布局」被反复触发导致的。
      </p>
      <CodeBlock
        code={`<ul>
  <li>技能：Python</li>
  <li>正在学：前端三件套</li>
</ul>

<table>
  <tr><th>项目</th><th>状态</th></tr>
  <tr><td>作品集</td><td>搭建中</td></tr>
</table>

<img src="me.jpg" alt="张小凡的工作台照片" width="320" height="200" />`}
        language="html"
        filename="content-tags.html"
      />

      <H2>2.3 表单：用户输入的入口</H2>
      <p>
        表单是页面里少数「用户能改变数据」的地方，也是第 4 章 JavaScript 登场的主舞台。
        先掌握 HTML 层的三件事：控件类型、label 关联、浏览器自带的校验：
      </p>
      <CodeBlock code={FORM_SAMPLE} language="html" filename="form.html" />
      <StepList
        items={[
          <><code>type</code> 决定控件行为：<code>email</code> 自带格式校验、<code>password</code> 隐藏输入、<code>date</code> 弹出日期选择器。</>,
          <><code>required</code>、<code>minlength</code> 等属性让浏览器在提交前自动拦截不合法输入——一行不用写 JS。</>,
          <><code>label</code> 的 <code>for</code> 对应控件的 <code>id</code>：点文字即可聚焦，读屏软件也能正确播报。</>,
        ]}
      />
      <Callout tone="warn" title="前端校验不是安全防线">
        HTML 校验只是「提示善意用户」。任何请求都可以绕过页面直接发给服务器，
        所以服务器必须再校验一次——第 10 章的 Express 接口里你会亲手写这道防线。
      </Callout>

      <H2>2.4 无障碍四项基本功</H2>
      <p>
        可访问性（Accessibility，常缩写为 a11y）让所有用户——包括使用读屏软件、键盘导航的用户——都能用你的页面。
        入门只需要四条，成本低到可以成为肌肉记忆：
      </p>
      <StepList
        items={[
          <>图片写 <code>alt</code>（装饰图写空 <code>alt=""</code>）。</>,
          <>表单控件配 <code>label</code>。</>,
          <>一个页面一个 <code>h1</code>，标题层级不跳级。</>,
          <>交互元素用 <code>&lt;a&gt;</code> / <code>&lt;button&gt;</code> 等原生标签——它们天生支持键盘操作。</>,
        ]}
      />

      <H2>2.5 实验 2：搭出作品集的完整骨架</H2>
      <p>
        现在把第 1 章的「半个页面」升级为结构完整的作品集。先读骨架示范，再动手改出你自己的版本：
      </p>
      <Playground experiment={EXPERIMENT_2} />
      <p>
        完成后自查两个细节：导航的三个锚点是否都能跳转（id 拼写与 href 完全一致）；
        每张项目卡片是否独立包在 <code>&lt;article&gt;</code> 里。
      </p>

      <H2>2.6 AI 产出精读：骨架里的「默认最佳实践」</H2>
      <p>
        回看 2.1 节那段 AI 生成的骨架，它默默做了四件对的事，也是你检查 AI 产出结构时的对照清单：
      </p>
      <Table
        head={["AI 的默认动作", "为什么是对的"]}
        rows={[
          [<><code>header + nav + main + footer</code> 一应俱全</>, "语义分区完整，读屏软件可以按区跳转"],
          [<><code>main</code> 只出现一次</>, "主体唯一是规范要求，多个 main 会让辅助技术困惑"],
          [<>锚点 <code>href="#about"</code> 与 <code>id</code> 成对出现</>, "页面内跳转是纯 HTML 行为，可靠且可分享"],
          [<>每个 section 配了标题</>, "section 的语义就是「带标题的主题分区」，无标题的 section 会被降级为普通容器"],
        ]}
      />
      <Callout tone="ai" title="挑错练习">
        AI 偶尔也会犯错。试着在生成结果里找这三类高频结构错误：重复的 <code>id</code>（锚点会跳错位置）；
        <code>label</code> 没写 <code>for</code>；<code>&lt;a&gt;</code> 没有 <code>href</code>（键盘不可聚焦）。找到了就理直气壮地让 AI 修。
      </Callout>

      <H2>2.7 自测</H2>
      <Quiz id="quiz-ch2" questions={QUIZ} />
    </>
  );
}
