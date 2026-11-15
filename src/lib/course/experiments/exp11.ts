import type { Experiment } from "./types";

const STEP1_BODY = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>JWT 第一步：登录换取 Token</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    input { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; width: 180px; margin-right: 8px; }
    button { padding: 10px 18px; border-radius: 8px; border: none; background: #059669; color: #fff; cursor: pointer; }
    pre { background: #0f172a; color: #e2e8f0; padding: 14px; border-radius: 10px; font-size: 12.5px; white-space: pre-wrap; min-height: 80px; }
    .tip { color: #6b7280; font-size: 13px; }
  </style>
</head>
<body>
  <h2>登录 <span class="tip">（演示账号：demo / demo123）</span></h2>
  <form id="f">
    <input id="user" placeholder="用户名" value="demo" />
    <input id="pass" type="password" placeholder="密码" value="demo123" />
    <button>登录</button>
  </form>
  <pre id="out">（登录结果会打印在这里）</pre>

  <script>
    // 课程站的真实登录接口：POST /api/auth/login
    // 凭证正确 → 服务器签发一个 JWT（三段式的字符串）
    const out = document.getElementById("out");

    document.getElementById("f").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: document.getElementById("user").value,
            password: document.getElementById("pass").value,
          }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();

        // TODO 1：把 token 存进 localStorage，键名用 "token"
        localStorage.setItem("token", data.token);

        // 拆开 JWT 看看里面到底装了什么（它只是三段 Base64，前两段可以直接读）
        const parts = data.token.split(".");
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));  // base64url → base64
        out.textContent =
          "登录成功，拿到 JWT：\\n" +
          data.token.slice(0, 40) + "…\\n\\n" +
          "它有三段（用 . 分隔）：\\n" +
          "  第 1 段 HEADER（算法声明）\\n" +
          "  第 2 段 PAYLOAD（内容）：" + JSON.stringify(payload) + "\\n" +
          "  第 3 段 SIGNATURE（签名，防伪造）\\n\\n" +
          "现在进入第②步，带着它去敲受保护接口的门。";
      } catch (err) {
        out.textContent = "登录失败：" + err.message + "\\n提示：换一个密码试试（比如 demo456），观察 401。";
      }
    });
  </script>
</body>
</html>
`;

const STEP2_BODY = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>JWT 第二步：带着 Token 调受保护接口</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    button { padding: 10px 16px; border-radius: 8px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; margin: 4px 8px 4px 0; }
    pre { background: #0f172a; color: #e2e8f0; padding: 14px; border-radius: 10px; font-size: 12.5px; white-space: pre-wrap; min-height: 100px; }
  </style>
</head>
<body>
  <h2>受保护接口 /api/me</h2>
  <button id="no-token">① 不带 Token 请求</button>
  <button id="with-token">② 带 Token 请求</button>
  <button id="bad-token">③ 带伪造 Token 请求</button>
  <pre id="out">先去第①步登录拿 Token，再回到这里做实验。（如果直接做②会失败——顺序就是真实用户的顺序）</pre>

  <script>
    const out = document.getElementById("out");

    async function callMe(withHeader) {
      const headers = {};
      const token = localStorage.getItem("token");
      if (withHeader === "with" && token) {
        // 关键一行：Authorization 头 + Bearer 方案——所有受保护接口都认它
        headers.Authorization = "Bearer " + token;
      }
      if (withHeader === "bad") {
        // 把签名段篡改一位，模拟伪造
        const parts = token.split(".");
        parts[2] = parts[2].slice(0, -2) + "xx";
        headers.Authorization = "Bearer " + parts.join(".");
      }
      const res = await fetch("/api/me", { headers: headers });
      out.textContent =
        "请求头：" + (headers.Authorization ? "Authorization: Bearer …" : "（无）") + "\\n" +
        "状态码：" + res.status + "\\n";
      if (res.ok) {
        const data = await res.json();
        out.textContent += "响应体：" + JSON.stringify(data, null, 2);
      } else {
        out.textContent += "响应体：" + JSON.stringify(await res.json());
      }
    }

    document.getElementById("no-token").onclick = () => callMe("no");
    document.getElementById("with-token").onclick = () => callMe("with");
    document.getElementById("bad-token").onclick = () => callMe("bad");
  </script>
</body>
</html>
`;

export const EXPERIMENT_11: Experiment = {
  id: "exp11",
  badge: "真实鉴权流程",
  title: "实验 11 · 登录 → 拿 Token → 调受保护接口",
  intro:
    "课程站实现了真实的 JWT 鉴权：/api/auth/login 签发 Token，/api/me 校验 Token。整个流程与真实项目完全一致——先登录，再带着 Token 敲受保护的门，并亲眼看看不带 Token、伪造 Token 时的下场。",
  tasks: [
    "步骤①：用 demo / demo123 登录，把返回的 JWT 三段结构抄到笔记本上",
    "步骤①：故意把密码改成 demo456 再登录，在网络面板确认 401 与错误信息",
    "步骤②：依次点三个按钮，在网络面板对比三次 /api/me 请求的响应状态码（401 / 200 / 401）",
    "步骤②：想一想：伪造 Token 为什么会被识破？（答案：签名段对不上，服务器一算就露馅）",
    "思考：Token 存在 localStorage 里，关掉浏览器再打开还在——那「退出登录」该怎么实现？（清掉它）",
  ],
  steps: [
    {
      id: "step1",
      label: "① 登录换取 Token",
      brief: "完成 TODO 1 后，Token 就存进了 localStorage。仔细读控制台打印的三段结构——JWT 没有魔法，只是「内容 + 签名」。",
      code: STEP1_BODY,
    },
    {
      id: "step2",
      label: "② 受保护接口的三种结局",
      brief: "不带 Token → 401；带真 Token → 200 并返回用户信息；带伪造 Token → 401。三种结局都去网络面板核对一遍。",
      code: STEP2_BODY,
    },
  ],
  files: [
    { name: "login.html", content: STEP1_BODY },
    { name: "protected.html", content: STEP2_BODY },
  ],
  readme: "第 11 章参考答案。需要网络与课程站接口；双击本地打开时接口请求会失败（无跨域服务），用法见篇末落地实验三。",
  console: true,
  net: true,
};
