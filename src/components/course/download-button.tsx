"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExperimentFile } from "@/lib/course/experiments";

interface DownloadButtonProps {
  folderName: string;
  files: ExperimentFile[];
  readme?: string;
  label?: string;
  variant?: "default" | "outline";
}

export function DownloadButton({
  folderName,
  files,
  readme,
  label = "下载本章代码",
  variant = "outline",
}: DownloadButtonProps) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setBusy(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const folder = zip.folder(folderName) ?? zip;
      for (const f of files) {
        folder.file(f.name, f.content);
      }
      folder.file("README.md", readme ?? "");
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={busy} variant={variant} className="gap-2">
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Download className="h-4 w-4" aria-hidden />
      )}
      {busy ? "打包中…" : done ? "已开始下载" : label}
    </Button>
  );
}
