"use client";

import { Callout, DevNote, H2, StepList, Table } from "@/components/course/blocks";
import { DownloadButton } from "@/components/course/download-button";
import { PACK_LAND2 } from "@/lib/course/packs";

export function Land2() {
  return (
    <>
      <p>
        第二篇的 React 实验跑在浏览器内转译沙箱里。落地环节把它换成<strong>真实的 Vite 工程</strong>：
        安装 Node、npm install、npm run dev——并且亲眼见证 HMR。这是三篇落地实验里「工具含量」最高的一次，
        附录 B 有环境安装的手把手指引。
      </p>

      <H2>下载工程包</H2>
      <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
        <DownloadButton folderName="task-app" files={PACK_LAND2} label="下载 Vite 工程包" />
        <span className="text-xs text-muted-foreground">package.json / vite.config.ts / src 组件，与项目二复盘完全一致</span>
      </div>

      <H2>三条命令跑起来</H2>
      <StepList
        items={[
          <>安装 Node.js LTS 版（附录 B 有各平台安装指引），终端执行 <code>node -v</code> 能打印版本即成功。</>,
          <>解压工程包，终端进入目录，执行 <code>npm install</code>——首次需联网，完成后出现 node_modules 目录。</>,
          <>执行 <code>npm run dev</code>，终端给出本地地址（默认 http://localhost:5173），浏览器打开。</>,
        ]}
      />
      <DevNote>
        {"// 注：npm install 的输出行数、耗时因网络而异；只要最后没有 ERR 字样、node_modules 目录生成，即为成功。\n// 命令报「command not found」说明 Node 未安装或终端 PATH 未刷新（Windows 需重开终端）。"}
      </DevNote>

      <H2>HMR 核对清单</H2>
      <Table
        head={["#", "操作", "应看到的现象", "它证明了什么"]}
        rows={[
          ["1", "打开 src/App.tsx，改一句文案并保存（Ctrl+S）", "浏览器不刷新，文字瞬间变化；终端打印 hmr update", "Vite 开发服务器按需编译 + 热替换（第 5 章 5.3）"],
          ["2", "改文字前先在页面的输入框里打几个字", "替换后输入框的内容还在", "HMR 保留组件状态，整页刷新会丢——这就是两者区别"],
          ["3", "把 App.tsx 里删掉一个括号再保存", "终端报错，浏览器出现错误覆盖层", "开发期的即时反馈闭环；修好后自动恢复"],
          ["4", "终端执行 npm run build，然后 npm run preview", "dist/ 目录生成，页面经产物模式正常打开", "开发与交付的两条链路（第 5 章 5.3）"],
          ["5", "打开 dist/assets/ 目录观察文件名", "js/css 文件名带内容哈希后缀", "缓存策略（第 5 章 5.8 自测第 5 题）"],
        ]}
      />

      <Callout tone="warn" title="常见问题排查">
        <strong>npm install 很慢或失败</strong>：网络问题。可切换镜像源（附录 B 表格），或重试。
        <strong>npm run dev 报端口占用</strong>：上一次的 dev server 还在跑，Ctrl+C 停掉再启动，或按提示换端口。
        <strong>类型报错一片红</strong>：确认编辑器装了 TypeScript 与 ESLint 插件（附录 B），并执行过 npm install。
      </Callout>

      <Callout tone="info" title="第二篇毕业标准">
        HMR 清单五项全勾、任务应用在你电脑上完成一次完整的「添加 → 筛选 → 刷新不丢 → 删除」流程。
        自此，你开发 React 用的就是真实工具链——不再是沙箱。
      </Callout>
    </>
  );
}
