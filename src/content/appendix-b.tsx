"use client";

import { Callout, H2, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Quiz } from "@/components/course/quiz";

const VERIFY_CMD = `# 三条验证命令，全部成功才算 Node 就绪
node -v          # 应输出 v20.x.x 或 v22.x.x（LTS 版本）
npm -v           # 应输出 10.x 或更高
npx --version    # npx 随 npm 附带`;

const QUIZ = [
  {
    question: "npm install 很慢，最先应检查的是？",
    options: [
      "重启电脑",
      "网络与镜像源配置（可临时切换到国内镜像）",
      "卸载 Node 重装",
      "删除 package.json",
    ],
    answerIndex: 1,
    explanation:
      "npm 默认从官方源下载。国内网络环境建议配置镜像源（见本附录命令表），这是安装速度问题的第一嫌疑。",
  },
  {
    question: "为什么 .env 文件不能提交到 Git？",
    options: [
      "它太大",
      "它常包含本地密钥与配置；应提交 .env.example 模板，真实文件加入 .gitignore",
      "Git 不支持该格式",
      "会影响构建速度",
    ],
    answerIndex: 1,
    explanation:
      "密钥一旦进入提交历史就很难彻底清除。业界惯例：模板入库（.env.example），真实环境文件本地保管。",
  },
  {
    question: "npx serve 的作用是？",
    options: [
      "安装并临时运行一个静态文件服务器（用完即弃或缓存复用）",
      "Node 自带的数据库",
      "部署到云端",
      "压缩代码",
    ],
    answerIndex: 0,
    explanation:
      "npx = 临时执行一个包提供的命令。落地实验三用它给前端目录提供 http://localhost:5500 的「源」。",
  },
];

export function AppendixB() {
  return (
    <>
      <p>
        三次落地实验（双击打开 / Vite HMR / Express + CORS）都依赖本附录的环境。
        全程一次性配好约需 20 分钟，之后一劳永逸。
      </p>

      <H2>一、安装 Node.js（LTS）</H2>
      <Table
        head={["平台", "推荐方式", "验证"]}
        rows={[
          ["Windows", "官网下载 LTS 安装包（nodejs.org），一路下一步；安装完成后<strong>重开终端</strong>", <><code>node -v</code> 打印版本</>],
          ["macOS", "官网安装包，或 Homebrew：<code>brew install node@22</code>", <><code>node -v</code></>],
          ["Linux", "包管理器或 nvm（推荐 nvm 便于切换版本）", <><code>node -v && npm -v</code></>],
        ]}
      />
      <CodeBlock code={VERIFY_CMD} language="bash" filename="verify.sh" />
      <Callout tone="warn" title="版本选择">
        认准 LTS（Long Term Support）版本——偶数大版本（20 / 22）。奇数版本是实验线，工具链兼容性不保证。
      </Callout>

      <H2>二、VSCode 与推荐插件</H2>
      <Table
        head={["插件", "作用"]}
        rows={[
          ["ESLint", "实时标出代码质量问题（第二篇起必装）"],
          ["Prettier", "保存即格式化，团队风格统一"],
          ["Tailwind CSS IntelliSense", "原子类自动补全（第 9 章起）"],
          ["Error Lens", "把报错直接显示在行内，新手排错利器"],
          ["GitLens（可选）", "看每行代码是谁、何时、为何提交"],
        ]}
      />
      <p>编辑器设置建议：开启「保存自动格式化」与「自动保存」，减少与格式相关的无谓 diff。</p>

      <H2>三、常用命令速查</H2>
      <CodeBlock
        code={`# Node / npm
node -v                    # 查看版本
npm install                # 按 package.json 安装依赖
npm install <pkg>          # 安装新依赖（--save-dev 进 devDependencies）
npm run dev                # 开发服务器（Vite）
npm run build              # 构建产物 dist/
npm run preview            # 本地预览构建产物

# 静态服务器
npx serve -l 5500          # 把当前目录跑成 http://localhost:5500

# 镜像源（网络慢时）
npm config set registry https://registry.npmmirror.com
npm config get registry    # 查看当前源

# Git 三板斧（第 5 章 5.4）
git init                   # 初始化仓库（一次）
git add .                  # 暂存改动
git commit -m "说明"        # 存档
git log --oneline          # 历史`}
        language="bash"
        filename="cheatsheet.sh"
      />

      <H2>四、环境文件与安全</H2>
      <p>
        第 11 章的 <code>.env</code> 文件遵循「模板入库、真实文件隔离」的惯例：
      </p>
      <CodeBlock
        code={`# .gitignore 里必须有：
.env
.env.local

# 提交一份模板（不含真实密钥）：
# .env.example
# VITE_API_BASE=/api`}
        language="bash"
        filename="env-git.md"
      />

      <H2>五、常见安装问题排查</H2>
      <Table
        head={["症状", "原因与处理"]}
        rows={[
          [<><code>node: command not found</code></>, "安装后未重开终端（Windows 常见），或 PATH 未包含 Node 安装目录"],
          [<><code>npm install</code> 报 EACCES 权限错误</>, "不要用 sudo 装 npm 包；重装 Node 到用户目录或使用 nvm"],
          [<><code>npm run dev</code> 端口被占用</>, "结束旧进程（Ctrl+C），或按提示改用其他端口"],
          [<><code>执行策略禁止脚本（Windows PowerShell）</code></>, "以管理员运行 Set-ExecutionPolicy RemoteSigned，或改用 Git Bash"],
          [<><code>install 成功但 require('express') 报错</code></>, "确认在工程目录内执行了 install；node_modules 是否真的生成"],
        ]}
      />

      <H2>六、自测</H2>
      <Quiz id="quiz-ax-b" questions={QUIZ} />
    </>
  );
}
