"use client";

import { BookMarked, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/course/theme-toggle";
import { COURSE_TITLE } from "@/lib/course/registry";

interface HeaderProps {
  onOpenSidebar: () => void;
  currentLabel?: string;
}

export function Header({ onOpenSidebar, currentLabel }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="打开课程目录"
        onClick={onOpenSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BookMarked className="h-4 w-4" aria-hidden />
        </span>
        <span className="truncate text-[15px] font-bold tracking-tight">
          {COURSE_TITLE}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {currentLabel && (
          <span className="hidden rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground md:inline">
            {currentLabel}
          </span>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
