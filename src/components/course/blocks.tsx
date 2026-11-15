"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Info, PenTool, Sparkles, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/** 章节二级标题（带编号） */
export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="course-h2">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="course-h3">{children}</h3>;
}

const CALLOUT_STYLES = {
  info: {
    icon: Info,
    wrapper: "border-l-4 border-l-emerald-500 bg-emerald-500/5",
    iconCls: "text-emerald-600",
    label: "说明",
  },
  warn: {
    icon: AlertTriangle,
    wrapper: "border-l-4 border-l-amber-500 bg-amber-500/5",
    iconCls: "text-amber-600",
    label: "注意",
  },
  ai: {
    icon: Sparkles,
    wrapper: "border-l-4 border-l-violet-500 bg-violet-500/5",
    iconCls: "text-violet-600",
    label: "AI 相关",
  },
  landing: {
    icon: Compass,
    wrapper: "border-l-4 border-l-sky-600 bg-sky-600/5",
    iconCls: "text-sky-700",
    label: "落地实验",
  },
} as const;

interface CalloutProps {
  tone?: keyof typeof CALLOUT_STYLES;
  title?: string;
  children: ReactNode;
}

export function Callout({ tone = "info", title, children }: CalloutProps) {
  const s = CALLOUT_STYLES[tone];
  const Icon = s.icon;
  return (
    <div className={`my-5 rounded-r-lg px-4 py-3 ${s.wrapper}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 shrink-0 ${s.iconCls}`} aria-hidden />
        <span className={`text-sm font-semibold ${s.iconCls}`}>
          {title ?? s.label}
        </span>
      </div>
      <div className="mt-1.5 text-[14.5px] leading-7 text-foreground/90">
        {children}
      </div>
    </div>
  );
}

/** 「模拟」徽标：凡是被模拟的环节必须显式标注（防黑盒原则四） */
export function SimBadge({ children = "模拟" }: { children?: ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="border-amber-500/60 bg-amber-500/10 text-[11px] font-medium text-amber-700 dark:text-amber-400"
    >
      {children}
    </Badge>
  );
}

/** 「真实」徽标 */
export function RealBadge({ children }: { children: ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="border-emerald-500/60 bg-emerald-500/10 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
    >
      {children}
    </Badge>
  );
}

/** 造轮子徽标 */
export function BuildBadge({ children }: { children: ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="border-violet-500/60 bg-violet-500/10 text-[11px] font-medium text-violet-700 dark:text-violet-400"
    >
      <PenTool className="mr-1 h-3 w-3" aria-hidden />
      {children}
    </Badge>
  );
}

interface KVRow {
  k: string;
  v: ReactNode;
  /** 可选第三列（例如“常用值/适用场景”） */
  v2?: ReactNode;
}

/** 两列信息表（行内含 v2 时自动升级为三列） */
export function KVTable({ rows, head }: { rows: KVRow[]; head?: string[] }) {
  const hasV2 = rows.some((r) => r.v2 !== undefined);
  const cols: string[] = hasV2
    ? head && head.length === 3
      ? head
      : [head?.[0] ?? "项目", head?.[1] ?? "说明", "备注"]
    : head && head.length === 2
      ? head
      : [head?.[0] ?? "项目", "说明"];
  return (
    <div className="my-5 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {cols.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0">
              <td className="px-3 py-2 align-top font-medium whitespace-nowrap text-foreground/90">{r.k}</td>
              <td className="px-3 py-2 align-top leading-6 text-muted-foreground">{r.v}</td>
              {hasV2 && (
                <td className="px-3 py-2 align-top leading-6 text-muted-foreground">{r.v2}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 有序步骤列表 */
export function StepList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="my-5 space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {i + 1}
          </span>
          <div className="text-[14.5px] leading-7 text-foreground/90">{item}</div>
        </li>
      ))}
    </ol>
  );
}

/**
 * 实现注释：与正文无关的环境/实现说明，以代码注释的形式折叠呈现。
 * 用法：<DevNote>// 注：终端输出为预录回放……</DevNote>
 */
export function DevNote({ children }: { children: ReactNode }) {
  return (
    <details className="my-4 rounded-lg border border-dashed border-border bg-muted/30">
      <summary className="cursor-pointer select-none px-3.5 py-2 font-mono text-[12px] text-muted-foreground transition-colors hover:text-foreground">
        {"// 实现注释（展开阅读）"}
      </summary>
      <div className="border-t border-dashed border-border px-3.5 py-2.5 font-mono text-[12px] leading-6 text-muted-foreground whitespace-pre-line">
        {children}
      </div>
    </details>
  );
}

/** 通用多列表格 */
export function Table({
  head,
  rows,
  className,
}: {
  head: ReactNode[];
  rows: ReactNode[][];
  className?: string;
}) {
  return (
    <div className={`my-5 overflow-x-auto rounded-lg border border-border ${className ?? ""}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {head.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0 align-top">
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 leading-6 ${
                    j === 0 ? "font-medium text-foreground/90" : "text-muted-foreground"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
