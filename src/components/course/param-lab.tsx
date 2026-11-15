"use client";

import { useEffect, useState } from "react";
import { ListChecks, Play, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/course/progress";
import { injectProbe } from "@/lib/course/sandbox";
import type { LabParam } from "@/lib/course/experiments/expP4";

interface ParamLabProps {
  id: string;
  title: string;
  badge: string;
  intro: string;
  params: LabParam[];
  html: string;
  tasks: string[];
  height?: number;
  console?: boolean;
}

/** 参数实验室：拖动/切换参数 → 注入 __CFG__ → 重启 iframe */
export function ParamLab({
  id,
  title,
  badge,
  intro,
  params,
  html,
  tasks,
  height = 520,
  console: withConsole,
}: ParamLabProps) {
  const [cfg, setCfg] = useState<Record<string, number | boolean>>(() =>
    Object.fromEntries(params.map((p) => [p.key, p.def]))
  );
  const [appliedCfg, setAppliedCfg] = useState<Record<string, number | boolean>>(cfg);
  const [runId, setRunId] = useState(0);
  const [logs, setLogs] = useState<{ level: string; text: string }[]>([]);
  const markExperiment = useProgress((s) => s.markExperiment);

  // 应用参数时才重建沙箱（拖动滑杆不重启，点「应用」才生效）
  const srcDoc = injectProbe(html.replace("__CFG__", JSON.stringify(appliedCfg)));

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { __lab?: number; kind?: string; level?: string; text?: string };
      if (!d || d.__lab !== 1 || d.kind !== "log" || d.text === undefined) return;
      setLogs((l) => [...l.slice(-99), { level: d.level ?? "log", text: d.text! }]);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const apply = () => {
    setAppliedCfg(cfg);
    setLogs([]);
    setRunId((n) => n + 1);
    markExperiment(id);
  };

  return (
    <section className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
        <h3 className="text-[15px] font-semibold">{title}</h3>
        <Badge
          variant="outline"
          className="border-emerald-500/60 bg-emerald-500/10 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
        >
          {badge}
        </Badge>
        {withConsole && (
          <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
            <Terminal className="h-3 w-3" aria-hidden />
            控制台已就位
          </span>
        )}
      </div>

      <div className="px-4 py-4">
        <p className="text-[14px] leading-7 text-muted-foreground">{intro}</p>

        {/* 参数区 */}
        <div className="mt-4 rounded-lg border border-dashed border-border p-4">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
            {params.map((p) => (
              <div key={p.key} className="min-w-[220px] flex-1">
                <div className="mb-1.5 flex items-center justify-between text-[13px]">
                  <span className="font-medium text-foreground/85">{p.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {p.type === "switch"
                      ? cfg[p.key]
                        ? "开"
                        : "关"
                      : `${cfg[p.key]}${p.unit ?? ""}`}
                  </span>
                </div>
                {p.type === "range" && (
                  <input
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={cfg[p.key] as number}
                    onChange={(e) => setCfg((c) => ({ ...c, [p.key]: Number(e.target.value) }))}
                    className="w-full accent-emerald-600"
                    aria-label={p.label}
                  />
                )}
                {p.type === "switch" && (
                  <button
                    role="switch"
                    aria-checked={Boolean(cfg[p.key])}
                    onClick={() => setCfg((c) => ({ ...c, [p.key]: !c[p.key] }))}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      cfg[p.key] ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                        cfg[p.key] ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                )}
                {p.type === "select" && (
                  <select
                    value={String(cfg[p.key])}
                    onChange={(e) => setCfg((c) => ({ ...c, [p.key]: Number(e.target.value) }))}
                    className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-[13px]"
                    aria-label={p.label}
                  >
                    {p.options?.map((o) => (
                      <option key={o.v} value={o.v}>
                        {o.l}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            <Button onClick={apply} className="h-9 gap-1.5 px-4">
              <Play className="h-3.5 w-3.5" aria-hidden />
              应用参数并重启
            </Button>
          </div>
        </div>

        {/* 游戏区 */}
        <div className="mt-4 flex justify-center">
          <iframe
            title={title}
            className="rounded-lg border border-border bg-white"
            style={{ height, width: "100%", maxWidth: 640 }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
            srcDoc={srcDoc}
            key={runId}
          />
        </div>

        {withConsole && logs.length > 0 && (
          <div className="mt-3 max-h-28 overflow-y-auto rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-[11.5px] leading-5">
            {logs.map((l, i) => (
              <p key={i} className={l.level === "error" ? "text-red-600" : "text-foreground/80"}>
                <span className="mr-1.5 text-muted-foreground/70">›</span>
                {l.text}
              </p>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-lg border border-dashed border-border p-4">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" aria-hidden />
            <span className="text-sm font-semibold">任务清单</span>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {tasks.map((t, i) => (
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
