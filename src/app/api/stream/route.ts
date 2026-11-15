import { NextRequest } from "next/server";

/**
 * SSE 流式接口（教学用）：GET /api/stream
 * 服务器逐块推送一段文字，模拟大模型流式回答。浏览器用 EventSource 接收。
 */
export const dynamic = "force-dynamic";

const SENTENCE =
  "你好，我是课程站的流式接口。你现在看到的每一个字，都不是一次性到达的，而是服务器通过 SSE 一块一块推送过来的。SSE 的报文格式非常朴素：每个事件以 data: 开头，以两个换行结尾。浏览器端的 EventSource 对象负责解析它们，并在 onmessage 回调里把内容交给你。ChatGPT 的打字机效果、大模型应用的流式输出，底层用的都是同一类机制。理解了流，你就理解了 AI 应用的前端如何与模型对话。";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  // 把句子切成若干小块，每块 6~14 个字
  const chunks: string[] = [];
  let i = 0;
  while (i < SENTENCE.length) {
    const size = 6 + Math.floor(Math.random() * 9);
    chunks.push(SENTENCE.slice(i, i + size));
    i += size;
  }

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        if (req.signal.aborted) break; // 客户端断开（点「中途打断」）就停止推送
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        await new Promise((r) => setTimeout(r, 110));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
