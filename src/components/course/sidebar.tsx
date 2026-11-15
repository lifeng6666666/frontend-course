"use client";

import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  FolderOpen,
  HardDriveDownload,
  Home,
  FlaskConical,
} from "lucide-react";
import { COURSE_TITLE, PARTS, CHAPTERS, chaptersOfPart } from "@/lib/course/registry";
import { useProgress } from "@/lib/course/progress";
import { Button } from "@/components/ui/button";

interface SidebarContentProps {
  currentId: string;
  onNavigate: (id: string) => void;
}

export function SidebarContent({ currentId, onNavigate }: SidebarContentProps) {
  const visited = useProgress((s) => s.visited);
  const experiments = useProgress((s) => s.experiments);
  const resetProgress = useProgress((s) => s.resetProgress);

  const visitedCount = CHAPTERS.filter((c) => visited[c.id]).length;
  const expTotal = CHAPTERS.filter((c) => c.experimentId).length;
  const expDone = Object.keys(experiments).length;

  const itemCls = (active: boolean) =>
    `flex w-full items-center gap-2 rounded-md px-2.5 py-[7px] text-left transition-colors ${
      active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
    }`;

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-3" aria-label="课程目录">
        <button
          onClick={() => onNavigate("home")}
          className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-medium transition-colors ${
            currentId === "home"
              ? "bg-primary/10 text-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Home className="h-4 w-4 shrink-0" aria-hidden />
          课程首页
        </button>

        {PARTS.map((part) => {
          const items = chaptersOfPart(part.id);
          return (
            <div key={part.id} className="mt-4">
              <div className="px-2.5">
                <p className="text-[11px] font-bold tracking-wide text-foreground/70">
                  {part.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground/80">
                  {part.desc}
                </p>
              </div>
              <div className="mt-2 space-y-0.5">
                {items.map((c) => {
                  const active = currentId === c.id;
                  const isVisited = Boolean(visited[c.id]);
                  const KindIcon =
                    c.kind === "project"
                      ? FolderOpen
                      : c.kind === "land"
                        ? HardDriveDownload
                        : c.kind === "appendix"
                          ? Bookmark
                          : BookOpen;
                  return (
                    <button
                      key={c.id}
                      onClick={() => onNavigate(c.id)}
                      className={itemCls(active)}
                      title={c.subtitle}
                    >
                      <span className="w-[72px] shrink-0 text-[11px] font-medium text-muted-foreground/80">
                        {c.label}
                      </span>
                      <span className="flex-1 truncate text-[13px]">{c.title}</span>
                      {isVisited ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-label="已读" />
                      ) : (
                        <KindIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" aria-label="可学习" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FlaskConical className="h-3.5 w-3.5 text-primary" aria-hidden />
          <span>
            已读 {visitedCount}/{CHAPTERS.length} 章 · 实验 {expDone}/{expTotal}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1.5 h-7 px-2 text-xs text-muted-foreground"
          onClick={resetProgress}
        >
          重置学习进度
        </Button>
      </div>
    </div>
  );
}
