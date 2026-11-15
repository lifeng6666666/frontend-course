"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { html as htmlLang } from "@codemirror/lang-html";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  ListChecks,
  Network,
  Play,
  RotateCcw,
  Terminal,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useHydrated } from "@/hooks/use-hydrated";
import { useProgress } from "@/lib/course/progress";
import { injectProbe, buildReactDoc, buildTailwindDoc } from "@/lib/course/sandbox";
import type { Experiment, ExperimentStep, StepMode } from "@/lib/course/experiments/types";

interface LogEntry {
  level: string;
  text: string;
}
interface NetEntry {
  url: string;
  method: string;
  status: number;
  dur: number;
  type: string;
}

/** 部署在子路径（如 GitHub Pages 项目页 /repo/）时，请求自动补上 base path */
const BASE_PATH =
  typeof window !== "undefined"
    ? window.location.pathname.replace(/\/[^/]*$/, "")
    : "";
const apiUrl = (p: string) =>
  BASE_PATH && p.startsWith("/") && !p.startsWith("//") ? BASE_PATH + p : p;

function docFor(step: ExperimentStep, fallback: StepMode | undefined): string {
  const mode = step.mode ?? fallback ?? "html";
  if (mode === "react") return injectProbe(buildReactDoc(step.code));
  if (mode === "tailwind") return injectProbe(buildTailwindDoc(step.code));
  return injectProbe(step.code);
}

export function Playground({ experiment }: { experiment: Experiment }) {
  const markExperiment = useProgress((s) => s.markExperiment);
  const { resolvedTheme } = useTheme();
  const mounted = useHydrated();

  const [activeIdx, setActiveIdx] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(experiment.steps.map((s) => [s.id, s.code]))
  );
  const [previewUrl, setPreviewUrl] = useState<string>("about:blank");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [nets, setNets] = useState<NetEntry[]>([]);
  const [panel, setPanel] = useState<"console" | "net">("console");
  const [width, setWidth] = useState("100%");

  const activeStep = experiment.steps[activeIdx];
  const stepMode: StepMode = activeStep.mode ?? experiment.mode ?? "html";
  const height = experiment.height ?? 460;
  const editorHeight = `${height}px`;
  const showPanels = Boolean(experiment.console || experiment.net);

  // 捕获 iframe 内探针上报的消息
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { __lab?: number; kind?: string; level?: string; text?: string; entry?: NetEntry };
      if (!d || d.__lab !== 1) return;
      if (d.kind === "log" && d.text !== undefined) {
        setLogs((l) => [...l.slice(-299), { level: d.level ?? "log", text: d.text! }]);
      } else if (d.kind === "net" && d.entry) {
        setNets((n) => [...n.slice(-99), d.entry!]);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const clearPanels = useCallback(() => {
    setLogs([]);
    setNets([]);
  }, []);

  // 把沙箱文档推送到课程站的沙箱托管路由，得到真实 URL 再交给 iframe
  // （真实地址保证 location/origin 正常：react-router、fetch、localStorage 均按真实网页运行）
  const pushSandbox = useCallback(async (doc: string): Promise<string> => {
    const post = async (): Promise<string> => {
      const res = await fetch(apiUrl("/api/sandbox"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: doc }),
      });
      if (!res.ok) throw new Error(`sandbox store failed (${res.status})`);
      const data = (await res.json()) as { url?: string };
      return (data.url ?? "about:blank") + "?r=" + Date.now();
    };
    try {
      return await post();
    } catch {
      // 兼容 Service Worker 尚未就绪的短暂窗口：稍候重试一次
      await new Promise((r) => setTimeout(r, 350));
      try {
        return await post();
      } catch {
        return "about:blank";
      }
    }
  }, []);

  // 首次挂载 + 切换步骤时加载对应沙箱
  useEffect(() => {
    let alive = true;
    pushSandbox(docFor(experiment.steps[activeIdx], experiment.mode)).then((url) => {
      if (alive) setPreviewUrl(url);
    });
    return () => {
      alive = false;
    };
  }, [activeIdx, pushSandbox]);

  const run = () => {
    clearPanels();
    pushSandbox(docFor(activeStep, experiment.mode)).then((url) => setPreviewUrl(url));
    markExperiment(experiment.id);
  };

  const resetStep = () => {
    setDrafts((d) => ({ ...d, [activeStep.id]: activeStep.code }));
    clearPanels();
    pushSandbox(docFor(activeStep, experiment.mode)).then((url) => setPreviewUrl(url));
  };

  const switchStep = (idx: number) => {
    setActiveIdx(idx); // 加载由 activeIdx 变化的副作用统一处理
  };

  const editorExtensions = useMemo(() => {
    if (stepMode === "html") return [htmlLang({ autoCloseTags: true })];
    return [jsLang({ jsx: true })];
  }, [stepMode]);

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  };

  const editorKey = `${activeStep.id}-${stepMode}`;

  return (
    <section className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      {/* 实验区头部 */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
        <h3 className="text-[15px] font-semibold">{experiment.title}</h3>
        <Badge
          variant="outline"
          className="border-emerald-500/60 bg-emerald-500/10 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
        >
          {experiment.badge}
        </Badge>
        {showPanels && (
          <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
            <Terminal className="h-3 w-3" aria-hidden />
            控制台
            {experiment.net && (
              <>
                <span className="mx-0.5">·</span>
                <Network className="h-3 w-3" aria-hidden />
                网络面板
              </>
            )}
            已就位
          </span>
        )}
      </div>

      <div className="px-4 py-4">
        <p className="text-[14px] leading-7 text-muted-foreground">{experiment.intro}</p>

        {/* 步骤切换 */}
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="实验步骤">
          {experiment.steps.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === activeIdx}
              onClick={() => switchStep(i)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                i === activeIdx
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mt-2.5 rounded-lg bg-muted/50 px-3.5 py-2.5 text-[13.5px] leading-6 text-muted-foreground">
          {activeStep.brief}
        </p>

        {/* 编辑器 + 预览 */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div onKeyDown={handleEditorKeyDown}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {stepMode === "html" ? "index.html" : "App.jsx"}
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={run} className="h-7 gap-1.5 px-3">
                  <Play className="h-3.5 w-3.5" aria-hidden />
                  运行
                </Button>
                <Button size="sm" variant="outline" onClick={resetStep} className="h-7 gap-1.5 px-3">
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  重置本步
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              {mounted ? (
                <CodeMirror
                  key={editorKey}
                  value={drafts[activeStep.id]}
                  height={editorHeight}
                  theme={resolvedTheme === "dark" ? oneDark : undefined}
                  extensions={editorExtensions}
                  onChange={(v) => setDrafts((d) => ({ ...d, [activeStep.id]: v }))}
                  basicSetup={{
                    foldGutter: false,
                    highlightActiveLine: false,
                    autocompletion: false,
                  }}
                />
              ) : (
                <Skeleton className="w-full rounded-none" style={{ height: editorHeight }} />
              )}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              直接在编辑器里改代码，改完点「运行」刷新右侧预览（Ctrl + Enter 也可以）。
            </p>
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">预览</span>
              {experiment.widthCtl && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  宽度
                  {[
                    ["375", "375px"],
                    ["640", "640px"],
                    ["820", "820px"],
                    ["100%", "100%"],
                  ].map(([label, val]) => (
                    <button
                      key={val}
                      onClick={() => setWidth(val)}
                      className={`rounded px-1.5 py-0.5 font-mono ${
                        width === val
                          ? "bg-primary/15 font-semibold text-primary"
                          : "hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mx-auto w-full" style={{ width, maxWidth: "100%" }}>
              <iframe
                title="实验预览"
                name="exp-preview"
                className="w-full rounded-lg border border-border bg-white"
                style={{ height }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                src={previewUrl}
              />
            </div>

            {/* 控制台 / 网络面板 */}
            {showPanels && (
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5">
                  <div className="flex gap-1">
                    {experiment.console && (
                      <button
                        onClick={() => setPanel("console")}
                        className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                          panel === "console" || !experiment.net
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Terminal className="h-3 w-3" aria-hidden />
                        控制台
                      </button>
                    )}
                    {experiment.net && (
                      <button
                        onClick={() => setPanel("net")}
                        className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                          panel === "net" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Network className="h-3 w-3" aria-hidden />
                        网络面板
                        {nets.length > 0 && (
                          <span className="rounded-full bg-primary/15 px-1.5 text-[10px]">{nets.length}</span>
                        )}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={clearPanels}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    aria-label="清空面板"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden />
                    清空
                  </button>
                </div>
                <div className="h-[132px] overflow-y-auto px-3 py-2 font-mono text-[11.5px] leading-5">
                  {panel === "console" || !experiment.net ? (
                    logs.length === 0 ? (
                      <p className="text-muted-foreground/60">（暂无输出。代码里的 console.log 会显示在这里。）</p>
                    ) : (
                      logs.map((l, i) => (
                        <p
                          key={i}
                          className={
                            l.level === "error"
                              ? "text-red-600 dark:text-red-400"
                              : l.level === "warn"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-foreground/85"
                          }
                        >
                          <span className="mr-1.5 text-muted-foreground/70">
                            {l.level === "error" ? "✕" : l.level === "warn" ? "!" : "›"}
                          </span>
                          {l.text}
                        </p>
                      ))
                    )
                  ) : nets.length === 0 ? (
                    <p className="text-muted-foreground/60">
                      （暂无请求。页面发出的每个 fetch 都会记录在这里：方法、状态码、耗时。）
                    </p>
                  ) : (
                    <table className="w-full">
                      <tbody>
                        {nets.map((n, i) => (
                          <tr key={i} className="border-b border-border/40 last:border-0">
                            <td className="py-0.5 pr-2 font-semibold text-foreground/90">{n.method}</td>
                            <td className="max-w-[180px] truncate py-0.5 pr-2 text-muted-foreground">{n.url}</td>
                            <td
                              className={`py-0.5 pr-2 font-semibold ${
                                n.status >= 200 && n.status < 300
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : n.status === 0
                                    ? "text-red-600 dark:text-red-400"
                                    : n.status < 500
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {n.status === 0 ? "失败" : n.status}
                            </td>
                            <td className="py-0.5 pr-2 text-muted-foreground">{n.dur}ms</td>
                            <td className="hidden truncate py-0.5 text-muted-foreground/70 sm:table-cell">{n.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 任务清单 */}
        {experiment.tasks.length > 0 && (
          <div className="mt-5 rounded-lg border border-dashed border-border p-4">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-sm font-semibold">任务清单</span>
            </div>
            <ul className="mt-2.5 space-y-1.5">
              {experiment.tasks.map((t, i) => (
                <li key={i} className="flex gap-2 text-[13.5px] leading-6 text-muted-foreground">
                  <span className="shrink-0 font-mono text-primary">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
