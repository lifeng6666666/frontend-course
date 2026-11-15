import { NextRequest, NextResponse } from "next/server";

/** 笔记接口（教学用）：GET 列表 / POST 新建 —— 数据存在服务器内存中，重启后重置 */

interface Note {
  id: number;
  title: string;
  done: boolean;
  createdAt: number;
}

interface NoteStore {
  notes: Note[];
  nextId: number;
}

declare global {
  var __courseNoteStore: NoteStore | undefined;
}

const store = (globalThis.__courseNoteStore ??= {
  notes: [
    { id: 1, title: "读完第 10 章并用 fetchJSON 完成 CRUD", done: false, createdAt: 1 },
    { id: 2, title: "把作品集网站发给朋友看", done: true, createdAt: 2 },
    { id: 3, title: "尝试给课程站提一个 Issue（练习）", done: false, createdAt: 3 },
  ],
  nextId: 4,
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET() {
  await sleep(120 + Math.random() * 150);
  return NextResponse.json({ data: store.notes }, { headers: { "X-Course-Api": "notes" } });
}

export async function POST(req: NextRequest) {
  await sleep(150 + Math.random() * 150);
  let body: { title?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体必须是合法 JSON" }, { status: 400 });
  }
  const title = (body.title ?? "").trim();
  if (!title || title.length > 60) {
    return NextResponse.json({ error: "title 必填且不超过 60 字" }, { status: 400 });
  }
  const note: Note = { id: store.nextId++, title, done: false, createdAt: Date.now() };
  store.notes.push(note);
  return NextResponse.json({ data: note }, { status: 201 });
}
