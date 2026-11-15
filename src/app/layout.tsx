import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/course/theme-provider";
import { StaticApiBridge } from "@/components/course/static-api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 时代前端开发学习讲义 · 从零到一的可运行实验课",
  description:
    "写给会用 AI 生成前端应用、却想真正看懂代码的你：四篇 12 章、12 个在线实验、5 个项目复盘、3 次本地落地实验，浏览器里即写即跑。",
  keywords: [
    "前端学习",
    "React",
    "TypeScript",
    "在线实验",
    "AI 编程",
    "HTML",
    "CSS",
    "JavaScript",
    "Express",
    "ECharts",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <StaticApiBridge />
        <Toaster />
      </body>
    </html>
  );
}
