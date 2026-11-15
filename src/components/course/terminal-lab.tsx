"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ListChecks, RotateCcw, SkipForward } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/course/progress";
import {
  EXP5_TASKS,
  TERMINAL_SCRIPT,
  VITE_PROJECT_TREE,
  type TerminalLine,
  type TreeNode,
} from "@/lib/course/experiments/exp05";

const LINE_DELAY = 130;
const CMD_DELAY = 420;

/** 实验 5：终端回放 + 虚拟文件树 */
export function TerminalLab() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [done, setDone] = useState(false);
  const [openFile, setOpenFile] = useState<TreeNode | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);
  const markExperiment = useProgress((s) => s.markExperiment);

  const flat = useMemo(() => TERMINAL_SCRIPT, []);

  useEffect(() => {
    let i = 0;
    const step = () => {
      if (i >= flat.length) {
        setDone(true);
        return;
      }
      const line = flat[i];
      setLines((l) => [...l, line]);
      i++;
      timerRef.current = window.setTimeout(step, line.kind === "cmd" ? CMD_DELAY : LINE_DELAY);
    };
    timerRef.current = window.setTimeout(step, 300);
    return () => window.clearTimeout(timerRef.current);
  }, [flat]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const skip = () => {
    window.clearTimeout(timerRef.current);
    setLines(flat);
    setDone(true);
  };

  const restart = () => {
    setLines([]);
    setDone(false);
    let i = 0;
    const step = () => {
      if (i >= flat.length) {
        setDone(true);
        return;
      }
      const line = flat[i];
      setLines((l) => [...l, line]);
      i++;
      timerRef.current = window.setTimeout(step, line.kind === "cmd" ? CMD_DELAY : LINE_DELAY);
    };
    timerRef.current = window.setTimeout(step, 200);
  };

  useEffect(() => {
    if (done && openFile) markExperiment("exp5");
  }, [done, openFile, markExperiment]);

  return (
    <section className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
        <h3 className="text-[15px] font-semibold">实验 5 · 终端跟练：npm create vite 到 npm run dev</h3>
        <Badge
          variant="outline"
          className="border-amber-500/60 bg-amber-500/10 text-[11px] font-medium text-amber-700 dark:text-amber-400"
        >
          回放
        </Badge>
        <div className="ml-auto flex gap-2">
          {!done ? (
            <Button size="sm" variant="ghost" onClick={skip} className="h-7 gap-1.5 px-2.5 text-xs">
              <SkipForward className="h-3.5 w-3.5" aria-hidden />
              跳到结果
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={restart} className="h-7 gap-1.5 px-2.5 text-xs">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              重新回放
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-[14px] leading-7 text-muted-foreground">
          下面是创建一个 Vite 工程的完整终端过程。逐行跟读，重点关注：每条命令分别干了什么、成功后终端给了什么线索。
        </p>

        {/* 终端窗口 */}
        <div className="mt-4 overflow-hidden rounded-lg border border-zinc-700/50">
          <div className="flex items-center gap-1.5 bg-zinc-800 px-3.5 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 font-mono text-[11px] text-zinc-400">终端 — bash</span>
          </div>
          <div
            ref={bodyRef}
            className="h-[300px] overflow-y-auto bg-zinc-950 px-4 py-3 font-mono text-[12.5px] leading-6 text-zinc-200"
          >
            {lines.map((l, i) => (
              <p
                key={i}
                className={
                  l.kind === "cmd"
                    ? "font-semibold text-emerald-400"
                    : l.kind === "ok"
                      ? "text-cyan-400"
                      : l.kind === "warn"
                        ? "text-amber-400/90"
                        : "text-zinc-300"
                }
              >
                {l.kind === "cmd" ? "$ " : ""}
                {l.text || " "}
              </p>
            ))}
            {!done && <p className="animate-pulse text-zinc-500">▍</p>}
          </div>
        </div>

        {/* 虚拟文件树 + 文件查看器 */}
        {done && (
          <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
            <div className="rounded-lg border border-border p-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">虚拟文件树（点击文件查看内容）</p>
              <TreeNodeView node={VITE_PROJECT_TREE} depth={0} onOpen={(n) => setOpenFile(n)} selected={openFile?.name} />
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="border-b border-border bg-muted/50 px-3 py-1.5 font-mono text-xs text-muted-foreground">
                {openFile ? openFile.name : "（点击左侧文件查看内容）"}
              </div>
              <pre className="h-[300px] overflow-auto bg-card px-4 py-3 font-mono text-[12px] leading-6 text-foreground/85">
                {openFile?.content ?? ""}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-lg border border-dashed border-border p-4">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" aria-hidden />
            <span className="text-sm font-semibold">任务清单</span>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {EXP5_TASKS.map((t, i) => (
              <li key={i} className="flex gap-2 text-[13.5px] leading-6 text-muted-foreground">
                <span className="shrink-0 font-mono text-primary">{i + 1}.</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TreeNodeView({
  node,
  depth,
  onOpen,
  selected,
}: {
  node: TreeNode;
  depth: number;
  onOpen: (n: TreeNode) => void;
  selected?: string;
}) {
  const [openDirs, setOpenDirs] = useState<Record<string, boolean>>({});
  const isDir = Boolean(node.children);
  const expanded = isDir ? openDirs[node.name] ?? true : true;

  return (
    <div>
      <button
        onClick={() =>
          isDir ? setOpenDirs((o) => ({ ...o, [node.name]: !expanded })) : onOpen(node)
        }
        className={`flex w-full items-center gap-1.5 rounded px-1.5 py-[3px] text-left font-mono text-[12.5px] ${
          selected === node.name
            ? "bg-primary/10 font-semibold text-primary"
            : isDir
              ? "text-foreground/80 hover:bg-muted"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        style={{ paddingLeft: 6 + depth * 14 }}
      >
        {isDir ? (expanded ? "▾" : "▸") : "•"}
        <span className="truncate">{node.name}</span>
        {node.content?.includes("入口") && (
          <span className="ml-auto rounded bg-emerald-500/10 px-1 text-[10px] text-emerald-600">入口</span>
        )}
      </button>
      {isDir &&
        expanded &&
        node.children?.map((c) => (
          <TreeNodeView key={c.name} node={c} depth={depth + 1} onOpen={onOpen} selected={selected} />
        ))}
    </div>
  );
}
