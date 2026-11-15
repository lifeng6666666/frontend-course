import { NextRequest, NextResponse } from "next/server";

/** 名言接口（教学用）：GET 列表 / POST 新建，支持 ?fail=1 触发 500 演练错误处理 */

interface Quote {
  id: number;
  text: string;
  author: string;
}

interface QuoteStore {
  quotes: Quote[];
  nextId: number;
}

declare global {
  var __courseQuoteStore: QuoteStore | undefined;
}

const SEED: Omit<Quote, "id">[] = [
  { text: "千里之行，始于足下。", author: "老子" },
  { text: "纸上得来终觉浅，绝知此事要躬行。", author: "陆游" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "程序写来终觉浅，绝知此码要躬行。", author: "本课程（教学改编）" },
  { text: "不积跬步，无以至千里。", author: "荀子" },
  { text: "学而不思则罔，思而不学则殆。", author: "孔子" },
  { text: "世上本没有路，走的人多了，也便成了路。", author: "鲁迅" },
];

const store = (globalThis.__courseQuoteStore ??= {
  quotes: SEED.map((q, i) => ({ ...q, id: i + 1 })),
  nextId: SEED.length + 1,
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(req: NextRequest) {
  await sleep(200 + Math.random() * 250); // 模拟真实网络延迟
  if (req.nextUrl.searchParams.get("fail") === "1") {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  return NextResponse.json(
    {
      data: store.quotes,
      meta: { server: "course-api", count: store.quotes.length, time: Date.now() },
    },
    { headers: { "X-Course-Api": "quotes" } }
  );
}

export async function POST(req: NextRequest) {
  await sleep(280 + Math.random() * 200);
  let body: { text?: string; author?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体必须是合法 JSON" }, { status: 400 });
  }
  const text = (body.text ?? "").trim();
  if (!text || text.length > 50) {
    return NextResponse.json({ error: "text 必填且不超过 50 字" }, { status: 400 });
  }
  const quote: Quote = {
    id: store.nextId++,
    text,
    author: (body.author ?? "我").trim() || "我",
  };
  store.quotes.push(quote);
  return NextResponse.json({ data: quote }, { status: 201 });
}
