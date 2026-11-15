"use client";

import { Callout, DevNote, H2, StepList, Table } from "@/components/course/blocks";
import { DownloadButton } from "@/components/course/download-button";
import { PACK_LAND3 } from "@/lib/course/packs";

export function Land3() {
  return (
    <>
      <p>
        最后一次落地：在本机同时跑起 Express 后端与前端页面，然后<strong>亲手制造一次 CORS 报错并修复它</strong>。
        十年前的前端工程师就是这样入行的——这个报错值得亲历一次。
      </p>

      <H2>下载并启动</H2>
      <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
        <DownloadButton folderName="mini-blog" files={PACK_LAND3} label="下载全栈工程包" />
        <span className="text-xs text-muted-foreground">server.js（Express）+ public/index.html（前端页）+ README</span>
      </div>
      <StepList
        items={[
          <><strong>终端 1（后端）：</strong>进入工程目录，<code>npm install</code>，然后 <code>node server.js</code>——看到「博客 API 已就绪: http://localhost:3000」。</>,
          <><strong>终端 2（前端）：</strong><code>cd public</code>，执行 <code>npx serve -l 5500</code>（一个极简静态服务器），浏览器打开 http://localhost:5500。</>,
          <>页面上发布、删除几篇文章，确认一切正常——注意此时前端（5500）与后端（3000）<strong>端口不同，本就是跨域</strong>，为什么没报错？因为 server.js 里的 CORS 中间件开着。</>,
        ]}
      />
      <DevNote>
        {"// 注：npx serve 首次运行会临时下载一个静态服务器；也可以用任何静态服务器替代。\n// 目的只是让前端页有「源」——直接双击打开 public/index.html 会以 file:// 协议运行，\n// Origin 为 null，同样会触发 CORS 判定，可以作为进阶观察。"}
      </DevNote>

      <H2>亲手制造并修复 CORS 报错</H2>
      <StepList
        items={[
          <>打开 server.js，顶部找到 <code>const CORS_MIDDLEWARE = true;</code>，改成 <code>false</code>，保存。</>,
          <>终端 1 里 Ctrl+C 停掉后端，重新 <code>node server.js</code>。</>,
          <>刷新前端页面——<strong>红色报错来了</strong>：控制台提示被 CORS 策略拦截；Network 面板里 POST 请求的状态是 (CORS error)。</>,
          <>观察细节：Network 里其实<strong>有</strong>一条 OPTIONS 预检请求，服务器没有按浏览器期望的那样应答允许头。</>,
          <>把开关改回 <code>true</code>，重启后端，刷新——恢复正常。你现在拥有了「看见 CORS」的完整经验。</>,
        ]}
      />

      <H2>核对清单</H2>
      <Table
        head={["#", "验收项", "对应知识"]}
        rows={[
          ["1", "两个终端分别跑起 3000 与 5500 服务", "Node 服务器（第 10 章 10.3）"],
          ["2", "前端能发布 / 删除文章，Network 可见 POST 与 DELETE", "REST 方法与状态码（第 10 章 10.2）"],
          ["3", "亲手制造并修复过一次 CORS 报错", "同源策略与 CORS（第 10 章 10.4）"],
          ["4", "能向别人解释：CORS 是浏览器的机制，不是服务器或前端库的 bug", "第 10 章自测第 3 题"],
        ]}
      />

      <Callout tone="warn" title="常见问题排查">
        <strong>端口被占用</strong>：换一个端口（serve -l 5501），或结束占用进程。
        <strong>node server.js 报Cannot find module 'express'</strong>：没执行 npm install，或 install 时不在工程目录。
        <strong>前端页面完全空白</strong>：确认是在 5500 端口的服务里打开（而不是双击文件），Console 里通常写明了原因。
      </Callout>

      <Callout tone="info" title="三篇毕业，进入第四篇">
        三次落地实验（双击打开 → Vite HMR → Express + CORS 排错）已经把你在线上学到的一切都验证过了。
        第四篇没有新章节——两个独立项目的复盘，是给你的「读码能力」的结业考试。
      </Callout>
    </>
  );
}
