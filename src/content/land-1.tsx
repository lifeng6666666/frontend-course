"use client";

import { Callout, DevNote, H2, StepList, Table } from "@/components/course/blocks";
import { DownloadButton } from "@/components/course/download-button";
import { PACK_LAND1 } from "@/lib/course/packs";

export function Land1() {
  return (
    <>
      <p>
        第一篇的在线实验跑在课程站的预览窗格里。现在做最后一步：把它搬到<strong>你自己的电脑</strong>上。
        本篇的落地实验不需要安装任何软件——这也是三篇落地实验里唯一「零依赖」的一次。
      </p>

      <H2>下载并解压</H2>
      <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
        <DownloadButton folderName="portfolio-website" files={PACK_LAND1} label="下载落地包（多文件版）" />
        <span className="text-xs text-muted-foreground">index.html + css/style.css + js/main.js + README</span>
      </div>
      <DevNote>
        {"// 注：多文件版与在线实验的单文件版功能一致，但把三件套拆成了三个文件——这正是第 5 章模块化的雏形。拆开是为了让你在真实目录结构里体会「结构 / 表现 / 行为」各归其位。"}
      </DevNote>

      <H2>双击 index.html</H2>
      <StepList
        items={[
          <>解压后进入文件夹，<strong>双击 index.html</strong>——它会在你的默认浏览器里打开，无需服务器。</>,
          <>拖动浏览器窗口从宽到窄，观察导航在 640px 处变两行、卡片从多列变单列。</>,
          <>点「切换夜间 / 日间」按钮，确认过渡动画与在线实验一致。</>,
        ]}
      />

      <H2>F12 核对清单</H2>
      <p>按 F12 打开 DevTools，逐条完成：</p>
      <Table
        head={["#", "操作", "应看到的现象", "它证明了什么"]}
        rows={[
          ["1", "Elements 面板：找到 <h1>，双击改文字", "页面立即变化", "DOM 是活的；浏览器渲染的是解析结果而非源码（第 1 章 1.3）"],
          ["2", "Elements：找到 <html>，在 style 里加 [data-theme=\"dark\"] 之外的变量覆盖", "全站颜色联动变化", "CSS 变量与层叠（第 3 章 3.1）"],
          ["3", "Network 面板：刷新页面", "列出 index.html、style.css、main.js 三条请求", "浏览器按引用逐个加载文件；状态码应全为 200"],
          ["4", "Console 面板：输入 document.title", "返回页面标题字符串", "控制台就是 JS 的临时操场（第 1 章 1.4）"],
        ]}
      />

      <Callout tone="warn" title="常见问题排查">
        <strong>双击后样式全乱</strong>：多半是解压后单独移动了 index.html，css/js 的相对路径断了——三个文件必须保持原目录结构。
        <strong>Network 面板里 css 显示 404</strong>：同上，检查 css/style.css 是否还在。
        <strong>点按钮没反应</strong>：打开 Console 看红色报错，把报错信息（含行号）记下来——这就是你排错生涯的第一手数据。
      </Callout>

      <Callout tone="info" title="第一篇毕业标准">
        在线实验全部跑通、自测全部答对、落地核对清单四项全勾、作品集在自己电脑上稳稳打开。
        满足这四条，就带着完整的作品集网站进入第二篇的框架世界。
      </Callout>
    </>
  );
}
