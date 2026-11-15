import type { Experiment } from "./types";

const STEP1_BODY = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>SSE 打字机：服务器推，浏览器收</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    button { padding: 10px 16px; border-radius: 8px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; margin: 4px 8px 4px 0; }
    #chat { margin-top: 16px; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; min-height: 160px; white-space: pre-wrap; line-height: 1.8; font-size: 14.5px; }
    #chat.streaming { border-color: #059669; }
    .cursor { display: inline-block; width: 2px; height: 1em; background: #059669; animation: blink 1s infinite; vertical-align: middle; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <h2>AI 流式输出体验 <span style="font-size:13px;color:#6b7280">（课程站真实 SSE 接口 /api/stream）</span></h2>
  <button id="start">开始提问</button>
  <button id="stop">中途打断</button>
  <div id="chat">（点「开始提问」，AI 的回答会一个字一个字地“流”出来——就像 ChatGPT）</div>

  <script>
    const chat = document.getElementById("chat");
    let es = null; // EventSource 实例，留着中途关闭

    document.getElementById("start").onclick = () => {
      es && es.close();
      chat.textContent = "";
      chat.classList.add("streaming");

      // SSE：浏览器原生对象，一行创建，不需要任何库
      es = new EventSource("/api/stream");
      es.onmessage = (e) => {
        if (e.data === "[DONE]") {
          es.close();
          chat.classList.remove("streaming");
          chat.innerHTML += " <span class=\\"cursor\\"></span>";
          console.log("流结束，共收到", chat.textContent.length, "个字符");
          return;
        }
        chat.textContent += e.data; // 每次推送一小段，追加到界面 → 打字机效果
      };
      es.onerror = () => {
        chat.classList.remove("streaming");
        console.warn("连接断开（流已结束或网络异常）");
      };
    };

    document.getElementById("stop").onclick = () => {
      if (es) { es.close(); chat.classList.remove("streaming"); console.log("已手动断开——服务器会收到连接关闭的通知"); }
    };
  </script>
</body>
</html>
`;

const STEP2_BODY = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>fetch + ReadableStream：另一种流式姿势</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    button { padding: 10px 16px; border-radius: 8px; border: none; background: #059669; color: #fff; cursor: pointer; }
    #out { margin-top: 16px; background: #0f172a; color: #e2e8f0; padding: 14px; border-radius: 10px; font-family: monospace; font-size: 12.5px; min-height: 140px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h2>底层视角：流到底长什么样</h2>
  <button id="go">用 fetch 读流</button>
  <pre id="out">（每一块数据到达时都会打印）</pre>

  <script>
    const out = document.getElementById("out");

    document.getElementById("go").onclick = async () => {
      out.textContent = "";
      const res = await fetch("/api/stream");
      const reader = res.body.getReader();       // 拿到流的“读取器”
      const decoder = new TextDecoder();          // 字节 → 文本

      let chunkCount = 0;
      while (true) {
        const { done, value } = await reader.read(); // 每次读一块
        if (done) {
          out.textContent += "\\n[流结束] 共收到 " + chunkCount + " 块数据";
          break;
        }
        chunkCount++;
        const text = decoder.decode(value);
        out.textContent += "第 " + chunkCount + " 块（" + value.length + " 字节）：" + text.replace(/\\n/g, " ") + "\\n";
      }
    };
  </script>
</body>
</html>
`;

export const EXPERIMENT_12: Experiment = {
  id: "exp12",
  badge: "真实 SSE 流式接口",
  title: "实验 12 · 流式输出：从打字机到底层字节",
  intro:
    "课程站提供真实的 SSE（Server-Sent Events）接口 /api/stream，服务器会把一段回答逐块推送给你——ChatGPT 的打字机效果用的正是这套机制。步骤②直接打开流的底层，看每一块原始字节。",
  tasks: [
    "步骤①：点「开始提问」，观察文字逐段出现；中途点「打断」，体验「断开也是协议的一部分」",
    "步骤①：打开控制台，看流结束时打印的字符总数",
    "步骤②：点「用 fetch 读流」，观察数据是分块到达的——「流」不是一次性响应，而是一条持续的水流",
    "思考：为什么 AI 应用都爱用流式？（提示：首字延迟——等 3 秒出全文，还是 0.3 秒出第一个字？）",
  ],
  steps: [
    {
      id: "step1",
      label: "① EventSource 打字机",
      brief: "浏览器原生 EventSource 对象，一行创建连接，onmessage 收推送。注意观察：是服务器推一段、界面长一段，而不是等全部完成。",
      code: STEP1_BODY,
    },
    {
      id: "step2",
      label: "② 底层字节流",
      brief: "EventSource 是封装好的「高层接口」。这一步用 fetch + ReadableStream 直接读原始字节，看清流的本质：分块、有序、可中断。",
      code: STEP2_BODY,
    },
  ],
  files: [
    { name: "sse-typewriter.html", content: STEP1_BODY },
    { name: "sse-raw-stream.html", content: STEP2_BODY },
  ],
  readme: "第 12 章参考答案。需要网络与课程站 SSE 接口；双击本地打开时接口不可达，onerror 分支会接管。",
  console: true,
};
