"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useHydrated } from "@/hooks/use-hydrated";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: "html" | "css" | "javascript" | "json" | "bash" | "text" | "jsx" | "tsx";
  /** 可选的文件名标签，显示在代码块右上角 */
  filename?: string;
  /** 标注这段代码的来源，例如“AI 生成” */
  source?: string;
}

export function CodeBlock({ code, language = "html", filename, source }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const mounted = useHydrated();
  const isDark = mounted && resolvedTheme === "dark";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // 剪贴板不可用时静默失败
    }
  };

  return (
    <div className="group relative my-5 overflow-hidden rounded-lg border border-border">
      {(filename || source) && (
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5">
          <span className="font-mono text-xs text-muted-foreground">
            {filename ?? ""}
          </span>
          {source && (
            <span className="text-xs text-muted-foreground/80">{source}</span>
          )}
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "13px",
          lineHeight: 1.7,
          padding: "14px 16px",
          background: isDark ? "transparent" : undefined,
        }}
        codeTagProps={{
          style: { fontFamily: "var(--font-geist-mono), monospace" },
        }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="复制代码"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}
