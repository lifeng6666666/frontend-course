# 部署指南

本课程站支持两类部署方式，**全部 12 个在线实验在两类方式下均可完整运行**：

- **纯静态托管**（GitHub Pages / Cloudflare Pages / Netlify / Vercel 静态模式）：零服务器成本，实验沙箱与教学接口由浏览器内置兼容层（`public/sw.js`）托管；
- **Node 服务器**（自有服务器 / Railway / Render 等）：`/api/*` 由真实 Node 进程提供服务。

---

## 方式一：纯静态托管（推荐，免费）

### 构建命令（通用）

```bash
npm install
npm run build:static        # 等价于 STATIC_EXPORT=1 next build
```

构建产物在 `out/` 目录（纯静态文件）。Windows 下请在 Git Bash 或 WSL 中执行，或先 `set STATIC_EXPORT=1`（cmd）/ `$env:STATIC_EXPORT="1"`（PowerShell）再 `npm run build`。

### A. Cloudflare Pages（推荐）

1. 把本项目推送到 GitHub 仓库；
2. Cloudflare 控制台 → Workers & Pages → Create → Pages → Connect to Git；
3. 构建设置：
   - Framework preset：**None**（不要选 Next.js，避免启用服务端适配器）
   - Build command：`npm run build:static`
   - Build output directory：`out`
4. 部署完成后获得 `https://<项目名>.pages.dev`。

也可以不用 Git：本地 `npm run build:static` 后，直接把 `out` 文件夹拖进 Cloudflare Pages 的 Direct Upload。

### B. GitHub Pages

项目已内置工作流 `.github/workflows/deploy-pages.yml`：

1. 推送到 GitHub 仓库；
2. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**；
3. 之后每次 push 到 main 分支自动部署。

说明：
- 项目页（`用户名.github.io/仓库名/`）的子路径前缀由工作流自动设置（`NEXT_PUBLIC_BASE_PATH`），无需手工配置；
- 用户主页仓库（`用户名.github.io`）部署在根路径，同样自动处理。

### C. Netlify / Vercel（静态模式）

- Netlify：Build command `npm run build:static`，Publish directory `out`；
- Vercel：Framework Preset 选 **Other**，Build Command `STATIC_EXPORT=1 npm run build`，Output Directory `out`。

### 本地预览静态产物

```bash
npx serve out
```

---

## 方式二：Node 服务器（全功能模式）

```bash
npm install
npm run build               # standalone 模式
npm start                   # 默认监听 3000 端口（可用 PORT 环境变量覆盖）
```

适用于 Railway / Render / 阿里云 / 腾讯云等。此模式下 `/api/*` 与实验沙箱由真实 Node 进程提供服务，数据库为内置 SQLite（`db/custom.db`），无需额外配置。

---

## 两种模式的行为差异

| 能力 | 纯静态托管 | Node 服务器 |
| --- | --- | --- |
| 课程正文 / 目录 / 自测 / 代码下载 | 完整可用 | 完整可用 |
| 12 个在线实验（写代码、运行、控制台、网络面板） | 完整可用 | 完整可用 |
| 教学接口（名言 / 登录 / 笔记 / 流式） | 浏览器内置兼容层提供（真实 HTTP 请求与状态码） | 真实 Node 服务提供 |
| 实验数据保存位置 | 访客浏览器本地 | 服务器进程内 |
| HTTPS | 平台自带 | 需自行配置 |

两种模式下实验步骤、返回数据、错误演练（如 401 / 500）完全一致，学习体验没有差别。

## 常见问题

- **构建时下载字体失败**：构建需要联网（Google Fonts 下载 Geist 字体），离线机器可先把字体改为系统字体栈；
- **部署在子路径但页面白屏**：确认构建时设置了 `NEXT_PUBLIC_BASE_PATH=/子路径`（GitHub Pages 工作流已自动处理）；
- **实验区提示「沙箱已过期」**：重新点击「运行」即可（沙箱文档有 1 小时有效期，防止无限累积）；
- **更新课程后实验显示旧内容**：静态托管强刷新一次（Ctrl+Shift+R），或等浏览器自动更新 Service Worker。
