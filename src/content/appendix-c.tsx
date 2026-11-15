"use client";

import { H2, Table } from "@/components/course/blocks";

interface Term {
  t: string;
  d: string;
  src: string;
}

const P1: Term[] = [
  { t: "前端 / 后端", d: "运行在浏览器、负责界面与交互的部分 / 运行在服务器、负责数据与业务逻辑的部分", src: "1.1" },
  { t: "三件套", d: "HTML（结构）、CSS（表现）、JavaScript（行为）", src: "1.2" },
  { t: "DOM", d: "浏览器解析 HTML 后生成的树状对象模型，JS 操作页面的接口", src: "1.2 / 4.1" },
  { t: "渲染流水线", d: "解析 → DOM/CSSOM → 渲染树 → 布局 → 绘制", src: "1.3" },
  { t: "重排 / 重绘", d: "重新计算几何位置（贵）/ 只重画像素（相对便宜）", src: "1.3 / 项目一" },
  { t: "DevTools", d: "浏览器开发者工具（F12）：Elements / Console / Network 三面板", src: "1.4" },
  { t: "HTTP", d: "浏览器与服务器之间的请求-响应协议", src: "1.5" },
  { t: "状态码", d: "200 成功、301 重定向、404 找不到（客户端侧）、500 服务器错误", src: "1.5" },
  { t: "语义化标签", d: "header/nav/main/section/article/footer 等自带含义的标签", src: "2.1" },
  { t: "锚点跳转", d: "href=\"#id\" 的页面内跳转；hash 路由的前身", src: "2.1 / 8.3" },
  { t: "盒模型", d: "content + padding + border + margin 四层结构", src: "3.1" },
  { t: "box-sizing: border-box", d: "让 width 包含 padding 与 border，尺寸计算不再失灵", src: "3.1" },
  { t: "层叠与优先级", d: "多规则冲突时的裁决：ID > 类 > 标签，同权重后者赢", src: "3.2" },
  { t: "Flex", d: "一维布局方案：主轴对齐 justify-content、交叉轴 align-items、间距 gap", src: "3.3" },
  { t: "Grid", d: "二维布局方案：repeat(auto-fill, minmax(200px, 1fr)) 自动换行网格", src: "3.4" },
  { t: "媒体查询", d: "@media 按屏宽等条件切换样式；移动优先用 min-width 增强", src: "3.5" },
  { t: "clamp()", d: "clamp(最小, 首选, 最大)：随视口平滑缩放且带上下限", src: "3.5 / 项目一" },
  { t: "CSS 变量", d: "--name 自定义属性 + var() 引用；换肤机制的基础", src: "3.1 / 项目一" },
  { t: "事件委托", d: "把监听器挂在父元素，靠冒泡统一处理子元素事件", src: "4.2" },
  { t: "事件循环", d: "JS 单线程调度机制：同步跑完再从队列取回调", src: "4.3" },
  { t: "Promise / async-await", d: "异步结果占位凭证 / 以同步写法处理异步并统一 try/catch", src: "4.3" },
  { t: "XSS", d: "跨站脚本攻击：innerHTML 渲染不可信输入导致脚本执行；用 textContent 防御", src: "4.1" },
  { t: "ES Modules", d: "import/export 模块体系：独立作用域 + 显式依赖", src: "5.1" },
  { t: "npm / package.json", d: "包管理器与项目说明书（scripts、依赖、版本）", src: "5.2" },
  { t: "语义化版本", d: "大.小.补丁（19.1.0）；^ 表示接受同大版本更新", src: "5.2" },
  { t: "Vite", d: "开发服务器（按需编译 + HMR）与构建工具（打包 + 内容哈希）", src: "5.3" },
  { t: "HMR", d: "热模块替换：只换被改模块、保留页面状态，不整页刷新", src: "5.3" },
  { t: "内容哈希", d: "产物文件名含指纹（app.3f9c2a.js），缓存随内容失效", src: "5.8" },
];

const P2: Term[] = [
  { t: "命令式 / 声明式", d: "逐步指挥 DOM / 声明「视图是数据的函数」由框架同步", src: "6.1-6.2" },
  { t: "虚拟 DOM", d: "内存中的轻量树描述；diff 后最小化更新真实 DOM", src: "6.3" },
  { t: "组件", d: "props 进、界面出的独立复用单元", src: "6.4 / 7.3" },
  { t: "JSX", d: "JS 的 XML 语法糖，编译后是 createElement/jsx 函数调用", src: "7.2" },
  { t: "props", d: "父传子的只读配置；单向数据流", src: "7.3" },
  { t: "state", d: "组件内部可变数据；必须通过 setState/useState 修改函数更新", src: "8.1" },
  { t: "不可变更新", d: "concat/map/filter/展开生成新数据而非修改旧数据；React 靠引用变化判断重渲染", src: "8.1" },
  { t: "useState", d: "Hooks：声明组件的「记忆」，返回 [值, 修改函数]", src: "8.1" },
  { t: "useEffect", d: "处理副作用（定时器/请求/存储），依赖数组控制触发，返回清理函数", src: "8.2" },
  { t: "状态提升", d: "把多个组件共享的数据放到最近公共父组件", src: "8.1 / 项目二" },
  { t: "受控组件", d: "输入值由 state 驱动（value + onChange）的表单控件", src: "8.1 / 项目二" },
  { t: "key", d: "列表渲染的稳定身份标识；用稳定 id，禁用数组下标", src: "7.4" },
  { t: "hash 路由", d: "读 hash → 查路由表 → 换视图；SPA 无刷新换页的原理", src: "8.3" },
  { t: "React Router", d: "工业级路由：HashRouter/Routes/Route/Link/NavLink", src: "8.4" },
  { t: "localStorage", d: "浏览器本地键值存储（约 5MB、字符串），前端持久化第一站", src: "8.5" },
  { t: "派生值", d: "能从现有 state 计算出的值不另存 state，现算即可", src: "项目二" },
  { t: "原子类（Tailwind）", d: "预置的单一职责类（p-4、rounded-xl）直接组合", src: "9.2" },
  { t: "dark: 孪生类", d: "暗色模式下与亮色类成对出现的变体类", src: "9.3" },
  { t: "可访问性（a11y）", d: "原生交互元素、aria 标注、焦点可见三纪律", src: "2.4 / 9.4" },
];

const P3: Term[] = [
  { t: "HTTP 四要素", d: "方法、路径、请求头、请求体（响应同构：状态行+头+体）", src: "10.1" },
  { t: "REST", d: "名词进路径、动词进方法、状态码表达结果的接口风格", src: "10.2" },
  { t: "JSON", d: "前后端通用的键值/数组数据格式；parse/stringify 转换", src: "10.2" },
  { t: "Express", d: "Node.js Web 框架：路由 + 中间件 + res.json 三件套", src: "10.3" },
  { t: "中间件", d: "请求到达处理函数前的加工环节（如 express.json()）", src: "10.3" },
  { t: "同源策略", d: "浏览器默认禁止读取不同源响应的安全机制", src: "10.4" },
  { t: "CORS", d: "跨域资源共享：服务器声明允许的来源；预检请求 OPTIONS", src: "10.4" },
  { t: "开发代理", d: "Vite server.proxy 把 /api 转发到后端，开发期绕开跨域", src: "11.1" },
  { t: "环境变量", d: ".env 配置与代码分离；VITE_ 前缀才会暴露给前端——密钥绝不放这里", src: "11.1" },
  { t: "JWT", d: "三段式令牌（header.payload.signature）：签名防伪造，非加密", src: "11.3" },
  { t: "Bearer Token", d: "Authorization 头的令牌方案：Authorization: Bearer <token>", src: "11.3" },
  { t: "authFetch", d: "自动挂 Token、统一处理 401 的请求封装（fetchJSON 的升级）", src: "11.3 / 项目三" },
  { t: "SSE", d: "Server-Sent Events：服务器→客户端的 HTTP 单向流，自动重连", src: "12.1" },
  { t: "ReadableStream", d: "fetch 响应体的字节流读取器；流的底层视角", src: "12.2" },
  { t: "WebSocket", d: "真正的双向通信协议：聊天室、协同编辑等高频上行场景", src: "12.1" },
  { t: "messages 数组", d: "大模型 API 的对话载体：system/user/assistant 逐条追加", src: "12.3" },
  { t: "AbortController", d: "中断进行中的请求/流；「停止生成」的实现基础", src: "12.5" },
];

const P4: Term[] = [
  { t: "静态托管", d: "把 dist/ 交给静态服务器（Pages/Netlify 等），无后端逻辑", src: "11.4" },
  { t: "反向代理", d: "服务器入口把 /api 与静态资源分发到不同进程（生产期「同源部署」的实现）", src: "11.4" },
  { t: "multipart/form-data", d: "文件上传的请求编码格式，配合 input[type=file] 与后端 multer", src: "项目三 追问" },
  { t: "降采样", d: "大数据量图表按策略抽点（如 LTTB），保形状减负载", src: "项目四 追问" },
  { t: "游戏循环", d: "requestAnimationFrame + update/draw 的帧驱动模式", src: "项目五" },
  { t: "delta time", d: "帧间隔秒数；位移 = 速度 × dt，实现帧率无关手感", src: "项目五" },
  { t: "AABB 碰撞", d: "轴对齐包围盒检测：中心距小于半宽之和即重叠", src: "项目五" },
  { t: "对象数组管理", d: "子弹/敌机/粒子用数组 + filter 生灭，避免遍历中删除", src: "项目五" },
  { t: "状态机", d: "playing/over/paused 等有限状态与迁移规则；状态驱动界面", src: "项目五" },
  { t: "接口契约", d: "前后端先约定函数签名/接口文档再并行开发（api.js 是其代码形态）", src: "项目三" },
  { t: "五段式复盘", d: "提示词原文 → 逐句拆解 → 代码精讲 → 技术点回溯 → 追问迭代", src: "全部项目篇" },
];

function TermTable({ items }: { items: Term[] }) {
  return (
    <Table
      head={["术语", "一句话解释", "首次出现"]}
      rows={items.map((x) => [<strong key="t">{x.t}</strong>, x.d, <code key="s" className="text-xs">{x.src}</code>])}
    />
  );
}

export function AppendixC() {
  return (
    <>
      <p>
        全书术语按篇章归档。每个词条给出一句话解释与首次出现的章节号——忘了就按号跳回那一节，
        通常重读两分钟就能接上。
      </p>

      <H2>第一篇 · 地基篇（HTML / CSS / JS / 工程化）</H2>
      <TermTable items={P1} />

      <H2>第二篇 · 框架篇（React）</H2>
      <TermTable items={P2} />

      <H2>第三篇 · 全栈篇（HTTP / Express / 鉴权 / 实时）</H2>
      <TermTable items={P3} />

      <H2>项目与工程篇</H2>
      <TermTable items={P4} />

      <H2>检索建议</H2>
      <p>
        遇到陌生词汇时的固定动作：①本表查一句话解释 → ②按章节号跳回原文 → ③在那一节的实验里亲手复现一次。
        三步之后，这个术语就属于你了。
      </p>
    </>
  );
}
