"use client";

import {
  BadgeCheck,
  Eye,
  Layers,
  MonitorSmartphone,
  PenTool,
  Rocket,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Callout, StepList } from "@/components/course/blocks";
import { COURSE_SUBTITLE, PARTS, chaptersOfPart } from "@/lib/course/registry";

interface HomeViewProps {
  onNavigate: (id: string) => void;
}

const AUDIENCES = [
  {
    icon: Wrench,
    title: "有编程基础，想补前端",
    desc: "会 Python / Java 等任一语言，但没写过前端。课程跳过变量循环等通识，直接从浏览器与三件套讲起。",
  },
  {
    icon: Sparkles,
    title: "让 AI 生成过前端，看不懂代码",
    desc: "AI 十分钟能生成一个应用，但你改不动它。课程以「读懂 AI 产出」为第二条主线，每个知识点都配 AI 产出精读。",
  },
  {
    icon: BadgeCheck,
    title: "需要评估 AI 产出的负责人",
    desc: "不必亲自写代码，但要能判断 AI 生成的前端项目质量：结构是否合理、有没有埋坑、该往哪个方向追问。",
  },
];

const LADDER = [
  {
    tag: "第一篇 · 地基篇",
    chapters: "第 1-5 章 · 项目一复盘 · 落地一",
    product: "响应式作品集网站",
    path: "白纸 → HTML → CSS → JavaScript → 工程化",
  },
  {
    tag: "第二篇 · 框架篇",
    chapters: "第 6-9 章 · 项目二复盘 · 落地二",
    product: "任务管理应用",
    path: "React 组件 → Hooks → 路由与状态 → 样式方案",
  },
  {
    tag: "第三篇 · 全栈篇",
    chapters: "第 10-12 章 · 项目三复盘 · 落地三",
    product: "全栈博客平台",
    path: "REST API → Express 后端 → JWT 鉴权 → 部署",
  },
  {
    tag: "第四篇 · 独立项目篇",
    chapters: "项目四 · 项目五复盘",
    product: "数据看板 + 2D 射击游戏",
    path: "ECharts 可视化 · Canvas 游戏循环 · 逐句复盘",
  },
];

const HOW_TRUE = [
  {
    icon: PenTool,
    title: "先手造，再用轮子",
    desc: "三个抽象工具各配一次「手造实验」：30 行迷你 JSX 渲染器、30 行 hash 路由、20 行 fetchJSON 封装。亲手造过，轮子就不再是魔法。",
  },
  {
    icon: Eye,
    title: "看得见机器的面板",
    desc: "每个实验区自带控制台与网络面板：console 输出、真实的请求方法、状态码与耗时全部可见。编译对照、终端回放、虚拟文件树贯穿全书。",
  },
  {
    icon: MonitorSmartphone,
    title: "每篇末落地一次",
    desc: "在线实验负责零门槛，三次本地落地实验负责打通最后一环：双击打开作品集、本地跑 Vite 看 HMR、启动 Express 亲手排一次 CORS 错。",
  },
];

export function HomeView({ onNavigate }: HomeViewProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <article>
      {/* Hero */}
      <section>
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
          v1.0 · 全部章节上线
        </Badge>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          AI 时代前端开发学习讲义
        </h1>
        <p className="mt-4 max-w-2xl text-[15.5px] leading-8 text-muted-foreground">
          {COURSE_SUBTITLE}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["React 19", "TypeScript", "Vite", "Node.js + Express", "ECharts", "Canvas 游戏"].map((t) => (
            <Badge key={t} variant="secondary" className="font-medium">
              {t}
            </Badge>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          四篇 12 章 · 12 个在线实验 · 5 个项目复盘 · 3 次本地落地实验 · 3 个附录
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => onNavigate("ch1")} className="gap-2">
            <Rocket className="h-4 w-4" aria-hidden />
            开始学习第 1 章
          </Button>
          <Button variant="outline" onClick={() => scrollTo("design")}>
            这门课怎么「做真」实验
          </Button>
          <Button variant="ghost" onClick={() => scrollTo("structure")}>
            查看课程结构
          </Button>
        </div>
      </section>

      {/* 适合谁 */}
      <section className="mt-14">
        <h2 className="text-xl font-bold tracking-tight">这本讲义适合谁</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="rounded-xl border border-border p-5">
              <a.icon className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="mt-3 text-[15px] font-semibold">{a.title}</h3>
              <p className="mt-2 text-[13.5px] leading-6 text-muted-foreground">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 学习主线 */}
      <section className="mt-14">
        <h2 className="text-xl font-bold tracking-tight">一条主线，四级台阶</h2>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-7 text-muted-foreground">
          全书只「造四样东西」，且每个实验的产出就是下一个实验的原材料。每篇毕业作品都配一份逐句复盘，
          每篇末尾都有一次把你电脑变成开发机的落地实验。
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {LADDER.map((l, i) => (
            <div key={l.tag} className="flex flex-col rounded-xl border border-border p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">{l.tag}</span>
                <Layers className="h-4 w-4 text-muted-foreground/50" aria-hidden />
              </div>
              <p className="mt-3 text-lg font-bold">{l.product}</p>
              <p className="mt-1 text-xs text-muted-foreground">{l.chapters}</p>
              <p className="mt-3 border-t border-dashed border-border pt-3 text-[13px] leading-6 text-muted-foreground">
                {l.path}
              </p>
              <span className="mt-3 text-xs font-medium text-emerald-600">
                台阶 {i + 1} · 已上线
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 怎么做真实验 */}
      <section id="design" className="mt-14 scroll-mt-20">
        <h2 className="text-xl font-bold tracking-tight">在线实验是怎么「做真」的</h2>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-7 text-muted-foreground">
          在线实验的目标是把「写代码 → 看结果」的循环缩短到几秒，同时不让任何环节变成点一下就跑的魔术。三条机制保证这一点：
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {HOW_TRUE.map((d) => (
            <div key={d.title} className="rounded-xl border border-border p-5">
              <div className="flex items-center gap-2.5">
                <d.icon className="h-5 w-5 text-primary" aria-hidden />
                <h3 className="text-[15px] font-semibold">{d.title}</h3>
              </div>
              <p className="mt-2.5 text-[13.5px] leading-6 text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </div>
        <Callout tone="info" title="课程站自带真实后端">
          第 4 章起调用的 /api/quotes、/api/notes、登录鉴权与流式接口，全部架设在本课程站上，
          是货真价实的 HTTP 服务——你在网络面板里看到的就是真实请求。
        </Callout>
      </section>

      {/* 课程结构 */}
      <section id="structure" className="mt-14 scroll-mt-20">
        <h2 className="text-xl font-bold tracking-tight">课程结构</h2>
        <Accordion type="single" collapsible defaultValue="part1" className="mt-5">
          {PARTS.map((part) => {
            const items = chaptersOfPart(part.id);
            return (
              <AccordionItem key={part.id} value={part.id}>
                <AccordionTrigger className="text-left">
                  <span>
                    <span className="font-semibold">{part.title}</span>
                    <span className="ml-3 hidden text-xs font-normal text-muted-foreground sm:inline">
                      {part.desc}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {items.map((c) => (
                      <li key={c.id}>
                        <button
                          onClick={() => onNavigate(c.id)}
                          className="flex w-full items-center gap-3 rounded-lg border border-border px-3.5 py-2.5 text-left transition-colors hover:border-primary/50 hover:bg-muted/50"
                        >
                          <span className="w-20 shrink-0 text-xs text-muted-foreground">{c.label}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-medium">{c.title}</span>
                            {c.subtitle && (
                              <span className="block truncate text-xs text-muted-foreground">{c.subtitle}</span>
                            )}
                          </span>
                          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                            {c.experimentId ? "含实验" : "正文"}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* 如何使用 */}
      <section className="mt-14">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <MonitorSmartphone className="h-5 w-5 text-primary" aria-hidden />
          如何使用本课程
        </h2>
        <StepList
          items={[
            <>
              <strong>在线实验即写即跑：</strong>
              每章的实验区左边是编辑器、右边是预览窗格，改完代码点「运行」就能看到结果，不需要安装任何环境。
            </>,
            <>
              <strong>每章代码可下载：</strong>
              实验代码与参考答案都能打包带走。第一篇的实验解压后双击 index.html 即可运行。
            </>,
            <>
              <strong>篇末真机落地：</strong>
              每篇结尾有本地落地实验（双击打开 / npm run dev / node server.js），附录 B 有手把手环境手册。
            </>,
            <>
              <strong>自测与进度：</strong>
              每章末有自测题，答对自动标记；侧边栏记录你读过的章节和完成的实验，下次打开接着学。
            </>,
          ]}
        />
      </section>
    </article>
  );
}
