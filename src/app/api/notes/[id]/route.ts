import { NextRequest, NextResponse } from "next/server";

/** 笔记接口（教学用）：PATCH 修改 / DELETE 删除 */

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

const store = (globalThis.__courseNoteStore ??= { notes: [], nextId: 1 });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function resolveParams(params: Promise<{ id: string }>) {
  return params;
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await resolveParams(ctx.params);
  const note = store.notes.find((n) => n.id === Number(id));
  if (!note) {
    return NextResponse.json({ error: `笔记 #${id} 不存在` }, { status: 404 });
  }
  await sleep(120);
  const body = (await req.json().catch(() => ({}))) as { done?: boolean; title?: string };
  if (typeof body.done === "boolean") note.done = body.done;
  if (typeof body.title === "string" && body.title.trim()) note.title = body.title.trim();
  return NextResponse.json({ data: note });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await resolveParams(ctx.params);
  const idx = store.notes.findIndex((n) => n.id === Number(id));
  if (idx === -1) {
    return NextResponse.json({ error: `笔记 #${id} 不存在` }, { status: 404 });
  }
  await sleep(120);
  store.notes.splice(idx, 1);
  return new NextResponse(null, { status: 204 });
}
