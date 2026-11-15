"use client";

import { Callout, H2, KVTable, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Playground } from "@/components/course/playground";
import { Quiz } from "@/components/course/quiz";
import { EXPERIMENT_12 } from "@/lib/course/experiments";

const SSE_FORMAT = `# SSE 报文长这样（纯文本，一行一个事件字段）

HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8
Cache-Control: no-cache

data: 你好，我是流式接口。

data: 你现在看到的每一个字，

data: 都不是一次性到达的。

data: [DONE]                          ← 自定义的结束标记（约定，非协议强制）

# 每条消息以 data: 开头、空行结尾。
# 浏览器端 EventSource 自动解析，把 data: 后面的内容交给 onmessage 回调。`;

const EVENTSOURCE_SAMPLE = `// 前端收流：浏览器原生对象，五行代码
const es = new EventSource("/api/stream");

es.onmessage = (e) => {
  if (e.data === "[DONE]") {
    es.close();                  // 收到结束标记，主动断开
    return;
  }
  output.textContent += e.data;  // 追加渲染 → 打字机效果
};
es.onerror = () => es.close();   // SSE 会自动重连；不需要时可手动关

// 中途打断：
// es.close() 后服务器端会收到连接关闭通知，可据此停止生成（省算力）`;

const STREAM_FETCH_SAMPLE = `// 更底层：fetch + ReadableStream 直接读原始字节
const res = await fetch("/api/stream");
const reader = res.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();   // 每次读一块
  if (done) break;
  const text = decoder.decode(value);            // 字节 → 字符串
  output.textContent += text;
}
// EventSource 是"高层封装"；ReadableStream 让你看到流的本质：分块、有序、可中断。
// AI 应用常需要自定义请求头/请求体，所以生产代码多用这种姿势。`;

const LLM_SAMPLE = `// 大模型 API 的对话形态（以 OpenAI 兼容接口为例）：其实就是一个 POST 请求
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [
      { role: "system", content: "你是一个前端学习助教" },   // 人设
      { role: "user", content: "为什么列表要加 key？" },      // 用户
      { role: "assistant", content: "因为 diff 需要…" },      // 历史（多轮对话 = 数组追加）
      { role: "user", content: "那 key 能用下标吗？" },
    ],
    stream: true,        // 开启流式：响应变成 SSE
  }),
});
// 剩下的就是第 12.1 节的收流代码：把每个 chunk 的 delta 拼接起来
// 关键认知：AI 对话 = 带上下文数组的 HTTP 请求，没有魔法`;

const QUIZ = [
  {
    question: "SSE 与「轮询」相比的核心优势是？",
    options: [
      "服务器实现更复杂",
      "服务器有新内容时主动推送，客户端无需反复发问，延迟低且省请求",
      "SSE 支持双向通信",
      "轮询已被浏览器禁用",
    ],
    answerIndex: 1,
    explanation:
      "轮询 = 客户端定时问「有新的吗」。SSE 建立长连接后服务器主动推，实时性更高、开销更低。双向通信则是 WebSocket 的领域。",
  },
  {
    question: "SSE 连接中断后，默认行为是？",
    options: [
      "连接永久断开",
      "EventSource 自动重连（可监听 onerror 或指定 retry 间隔）",
      "必须刷新页面",
      "浏览器弹窗提示",
    ],
    answerIndex: 1,
    explanation:
      "SSE 内置自动重连机制——这也是它比裸 fetch 流更「皮实」的地方。不需要重连时要手动 es.close()。",
  },
  {
    question: "AI 应用对话接口的 messages 数组里，多轮对话是怎么表达的？",
    options: [
      "每次请求只发最新一句，服务端自动记住历史",
      "把历史对话逐条放进数组（system / user / assistant 交替），一起发给模型",
      "历史存在浏览器 Cookie 里",
      "用 WebSocket 会话维持",
    ],
    answerIndex: 1,
    explanation:
      "模型服务默认无状态：所谓「上下文」就是客户端把完整历史重新发一遍。这也是长对话会越来越贵、越来越慢的原因。",
  },
  {
    question: "「中途打断 AI 回答」在前端的实现是？",
    options: [
      "只隐藏界面文字",
      "断开流（es.close() 或 AbortController abort），服务器收到连接关闭后停止生成",
      "清空 messages 数组",
      "刷新页面",
    ],
    answerIndex: 1,
    explanation:
      "流式连接是双向感知的：客户端断开，服务端能收到通知并停止后续生成——省下真金白银的算力。EventSource 与 fetch 流都支持这种打断。",
  },
  {
    question: "什么场景必须升级到 WebSocket？",
    options: [
      "AI 打字机效果",
      "双向高频通信：聊天室、协同编辑、多人游戏——客户端也要频繁向服务器推送",
      "加载新闻列表",
      "表单提交",
    ],
    answerIndex: 1,
    explanation:
      "SSE 是「服务器→客户端」的单向流。需要客户端频繁上行时（聊天室发言、协同光标），用 WebSocket 这条真正的双向通道。",
  },
];

export function Chapter12() {
  return (
    <>
      <p>
        最后一章，给应用装上「实时」与「AI」两个引擎——它们恰好是当下 AI 应用最常用的两项前端能力，
        而它们的底层只是你早已掌握的 HTTP 流。学完你将能够：
      </p>
      <StepList
        items={[
          <>说清 SSE 的报文格式与自动重连机制，写出打字机效果；</>,
          <>用 fetch + ReadableStream 读取原始字节流；</>,
          <>判断什么时候用 SSE、什么时候必须上 WebSocket；</>,
          <>理解大模型 API 的对话形态：messages 数组与流式输出；</>,
          <><strong>对接课程站的真实 SSE 接口，完成一次流式输出体验</strong>（实验 12）。</>,
        ]}
      />

      <H2>12.1 SSE：服务器主动推的HTTP 流</H2>
      <p>
        传统的请求-响应是「一问一答」。但 AI 回答、行情推送这类场景，内容是<strong>逐步产生</strong>的：
        总不能让用户干等全部生成完。<strong>SSE（Server-Sent Events）</strong>就是为此而生：
        一次请求，服务器持续把新内容推过来——本质是一条不断写入的 HTTP 响应：
      </p>
      <CodeBlock code={SSE_FORMAT} language="bash" filename="sse-protocol.txt" />
      <CodeBlock code={EVENTSOURCE_SAMPLE} language="javascript" filename="event-source.js" />
      <KVTable
        head={["能力", "SSE", "WebSocket"]}
        rows={[
          { k: "方向", v: "服务器 → 客户端（单向）", v2: "双向" },
          { k: "协议", v: "普通 HTTP 流，纯文本事件", v2: "独立协议（http 升级握手）" },
          { k: "自动重连", v: "内置", v2: "需自行实现" },
          { k: "典型场景", v: "AI 流式回答、通知推送、进度更新", v2: "聊天室、协同编辑、多人游戏" },
          { k: "代理/防火墙友好度", v: "高（就是 HTTP）", v2: "一般（需支持 Upgrade）" },
        ]}
      />

      <H2>12.2 底层视角：fetch + ReadableStream</H2>
      <p>
        EventSource 是封装好的高层接口。想看流的本质（也为了支持自定义请求头），可以直接用 fetch 读流：
      </p>
      <CodeBlock code={STREAM_FETCH_SAMPLE} language="javascript" filename="stream-fetch.js" />
      <Callout tone="info" title="两种姿势怎么选">
        只要收、不定制请求 → EventSource（简单）；要带鉴权头、发请求体、精细控制 → fetch 流
        （AI 应用的主流选择，因为对话请求必须 POST messages）。
      </Callout>

      <H2>12.3 大模型 API 的对话形态</H2>
      <p>
        拆开神秘感：调用大模型 API 就是一个带 <code>stream: true</code> 的 POST 请求。
        前端的全部职责是<strong>维护 messages 数组</strong>（多轮 = 数组追加历史）并<strong>收流拼接</strong>：
      </p>
      <CodeBlock code={LLM_SAMPLE} language="javascript" filename="chat.js" />
      <Callout tone="ai" title="AI 应用前端的三个状态">
        流式 UI 比普通请求多一个状态：<strong>等待中</strong>（已发出、未收到首字）→
        <strong>生成中</strong>（首字已到，持续追加 + 光标动画）→ <strong>完成/中断</strong>。
        生成中要提供「停止」按钮（断开流），等待中要防止用户重复提问。
      </Callout>

      <H2>12.4 实验 12：流式输出体验</H2>
      <Playground experiment={EXPERIMENT_12} />

      <H2>12.5 AI 产出精读：流式 UI 的评审要点</H2>
      <Table
        head={["检查项", "典型问题"]}
        rows={[
          [<><strong>首字延迟的反馈</strong></>, "没有等待态：用户以为卡死又点一次，发出重复请求"],
          [<><strong>中断能力</strong></>, "只能眼睁睁看它流完：缺 AbortController / es.close()"],
          [<><strong>错误恢复</strong></>, "断流后没有提示与重试入口，内容缺一块没人知道"],
          [<><strong>渲染性能</strong></>, "每个 chunk 都触发重渲染 + 滚动，长回答卡顿；应节流或 rAF 合帧"],
        ]}
      />
      <Callout tone="info" title="全书收官">
        至此三篇完结：三件套 → 框架 → 全栈。接下来的第四篇不再有新章节，
        而是用两个独立项目检验你的「AI 产出精读能力」——数据可视化看板与 2D 射击游戏。
      </Callout>

      <H2>12.6 自测</H2>
      <Quiz id="quiz-ch12" questions={QUIZ} />
    </>
  );
}
