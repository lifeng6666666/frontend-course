import { NextRequest } from "next/server";

/** 读取实验沙箱文档（见 /api/sandbox 的说明） */

interface SandboxStore {
  map: Map<string, { html: string; createdAt: number }>;
  seq: number;
}

declare global {
  var __courseSandboxStore: SandboxStore | undefined;
}

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const store = globalThis.__courseSandboxStore;
  const entry = store?.map.get(id);
  if (!entry) {
    return new Response("沙箱已过期，请回到课程页重新「运行」。", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(entry.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
