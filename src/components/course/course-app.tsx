"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/course/header";
import { SidebarContent } from "@/components/course/sidebar";
import { HomeView } from "@/content/home";
import { CONTENT } from "@/content";
import {
  CHAPTER_MAP,
  CHAPTERS,
  COURSE_TITLE,
  getChapter,
  PARTS,
} from "@/lib/course/registry";
import { useProgress } from "@/lib/course/progress";

const ORDER = ["home", ...CHAPTERS.map((c) => c.id)];

function parseHash(): string {
  const h = window.location.hash.replace(/^#\/?/, "");
  return h && CHAPTER_MAP[h] ? h : "home";
}

/* ---------------- 章节头 ---------------- */
function ChapterHeader({ meta }: { meta: NonNullable<ReturnType<typeof getChapter>> }) {
  const part = PARTS.find((p) => p.id === meta.partId);
  return (
    <div className="border-b border-border pb-6">
      <p className="text-xs font-medium text-muted-foreground">
        {part?.title}
        <span className="mx-2 text-border">/</span>
        <span className="text-foreground/60">{meta.label}</span>
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-[28px]">
        {meta.title}
      </h1>
      {meta.subtitle && (
        <p className="mt-2 text-[15px] text-muted-foreground">{meta.subtitle}</p>
      )}
    </div>
  );
}

/* ---------------- 前后章导航 ---------------- */
function ChapterNav({
  currentId,
  onNavigate,
}: {
  currentId: string;
  onNavigate: (id: string) => void;
}) {
  const idx = ORDER.indexOf(currentId);
  const prevId = idx > 0 ? ORDER[idx - 1] : null;
  const nextId = idx < ORDER.length - 1 ? ORDER[idx + 1] : null;
  const labelOf = (id: string) =>
    id === "home" ? "课程首页" : `${CHAPTER_MAP[id].label} · ${CHAPTER_MAP[id].title}`;

  return (
    <div className="mt-12 flex items-stretch justify-between gap-3 border-t border-border pt-6">
      {prevId ? (
        <Button
          variant="outline"
          onClick={() => onNavigate(prevId)}
          className="h-auto max-w-[46%] flex-col items-start gap-0.5 px-4 py-3"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="h-3 w-3" aria-hidden />
            上一节
          </span>
          <span className="truncate text-[13px] font-medium">{labelOf(prevId)}</span>
        </Button>
      ) : (
        <span />
      )}
      {nextId ? (
        <Button
          variant="outline"
          onClick={() => onNavigate(nextId)}
          className="h-auto max-w-[46%] flex-col items-end gap-0.5 px-4 py-3 text-right"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            下一节
            <ArrowRight className="h-3 w-3" aria-hidden />
          </span>
          <span className="truncate text-[13px] font-medium">{labelOf(nextId)}</span>
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}

/* ---------------- 根组件 ---------------- */
export function CourseApp() {
  const [view, setView] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const markVisited = useProgress((s) => s.markVisited);

  useEffect(() => {
    const apply = () => setView(parseHash());
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    markVisited(view);
  }, [view, markVisited]);

  const navigate = useCallback((id: string) => {
    window.location.hash = id === "home" ? "/" : `/${id}`;
    setMobileOpen(false);
  }, []);

  const meta = view === "home" ? null : getChapter(view);
  const Content = view === "home" ? null : CONTENT[view];

  return (
    <div className="flex min-h-dvh flex-col">
      <Header onOpenSidebar={() => setMobileOpen(true)} currentLabel={meta ? `${meta.label} · ${meta.title}` : undefined} />

      <div className="flex flex-1">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[300px] shrink-0 border-r border-border lg:block">
          <SidebarContent currentId={view} onNavigate={navigate} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[300px] p-0">
            <SheetTitle className="border-b border-border px-4 py-3 text-sm font-semibold">
              {COURSE_TITLE} · 目录
            </SheetTitle>
            <SidebarContent currentId={view} onNavigate={navigate} />
          </SheetContent>
        </Sheet>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-8 md:py-10">
            {view === "home" ? (
              <HomeView onNavigate={navigate} />
            ) : Content ? (
              <article>
                <ChapterHeader meta={meta!} />
                <div className="course-prose mt-8">
                  <Content />
                </div>
                <ChapterNav currentId={view} onNavigate={navigate} />
              </article>
            ) : null}
          </div>

          <footer className="mt-auto border-t border-border bg-muted/30">
            <div className="mx-auto max-w-4xl px-4 py-6 text-center text-xs leading-6 text-muted-foreground md:px-8">
              {COURSE_TITLE} · v1.0
              <br />
              在线实验均在你的浏览器本地运行，学习进度保存在本机，不上传任何数据。
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
