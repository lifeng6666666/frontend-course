import type { Experiment } from "./types";

const STEP1_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>暗色模式与事件委托</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 32px auto; padding: 0 16px; line-height: 1.7; color: #1f2937; transition: background 0.3s, color 0.3s; }
    body[data-theme="dark"] { background: #111827; color: #e5e7eb; }
    body[data-theme="dark"] .tip { color: #9ca3af; }
    button { font-size: 14px; padding: 8px 16px; border-radius: 8px; border: 1px solid #d1d5db; cursor: pointer; }
    ul { padding-left: 20px; }
    li { padding: 6px 10px; border-radius: 6px; cursor: pointer; }
    li.active { background: #059669; color: #fff; }
  </style>
</head>
<body>
  <button id="theme-btn">切换暗色模式</button>
  <h2>我的三个爱好 <span class="tip">（点击列表项试试）</span></h2>
  <ul id="hobby-list">
    <li>踢足球</li>
    <li>看科幻小说</li>
    <li>折腾 AI 工具</li>
  </ul>

  <script>
    // ---------- 暗色模式：改一个属性，CSS 过渡动画自动补间 ----------
    const body = document.body;
    document.getElementById("theme-btn").addEventListener("click", () => {
      body.dataset.theme = body.dataset.theme === "dark" ? "" : "dark";
    });

    // ---------- 事件委托：只在父元素上挂一个监听器 ----------
    // 点击发生在 li 上，但事件会“冒泡”到父级 ul，所以这里能统一接住。
    document.getElementById("hobby-list").addEventListener("click", (e) => {
      // TODO 1：e.target 是真正被点的元素。只有当它确实是 LI 时才处理
      //         （提示：e.target.tagName === "LI"）
      // TODO 2：给它切换 active 类：
      //         e.target.classList.toggle("active")
    });
  </script>
</body>
</html>
`;

const STEP2_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>名言卡片 · 调用真实接口</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 680px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    #status { color: #6b7280; font-size: 14px; min-height: 24px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; margin: 12px 0; }
    .card blockquote { margin: 0; font-size: 15px; }
    .card cite { display: block; margin-top: 8px; color: #059669; font-style: normal; font-size: 13px; }
    .error { background: #fef2f2; border-color: #fca5a5; color: #b91c1c; padding: 12px 16px; border-radius: 10px; font-size: 14px; }
  </style>
</head>
<body>
  <h2>名言卡片</h2>
  <button id="reload-btn">重新加载</button>
  <p id="status"></p>
  <div id="cards"></div>

  <script>
    const statusEl = document.getElementById("status");
    const cardsEl = document.getElementById("cards");

    async function loadQuotes() {
      statusEl.textContent = "加载中…";
      try {
        // 课程站的真实接口：返回 JSON 数组（打开网络面板看这条请求）
        const res = await fetch("/api/quotes");
        // TODO 1：HTTP 层面的失败（如 500）不会抛异常，要自己检查 res.ok，
        //         不满足就 throw new Error("HTTP " + res.status)
        const data = await res.json();
        render(data.data);
        statusEl.textContent = "共 " + data.data.length + " 条名言";
      } catch (err) {
        // TODO 2：把「加载中…」替换成用户能看懂的错误提示，并给卡片容器渲染一个 .error 提示块
        console.error("加载失败：", err);
        statusEl.textContent = "出了点问题";
      }
    }

    function render(list) {
      cardsEl.innerHTML = list
        .map((q) =>
          '<div class="card"><blockquote>“' + q.text + '”</blockquote><cite>—— ' + q.author + "</cite></div>"
        )
        .join("");
    }

    document.getElementById("reload-btn").addEventListener("click", loadQuotes);
    loadQuotes();
  </script>
</body>
</html>
`;

const STEP3_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>提交你的名言（POST）</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 680px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    form { display: flex; gap: 8px; margin: 16px 0; }
    input { flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; }
    button { padding: 10px 18px; border-radius: 8px; border: none; background: #059669; color: #fff; font-size: 14px; cursor: pointer; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    #status { color: #6b7280; font-size: 14px; min-height: 22px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; margin: 10px 0; font-size: 14px; }
  </style>
</head>
<body>
  <h2>写一条名言，交给服务器</h2>
  <form id="quote-form">
    <input id="text-input" placeholder="写下你的名言" maxlength="50" />
    <button type="submit" id="submit-btn">提交</button>
  </form>
  <p id="status"></p>
  <div id="cards"></div>

  <script>
    const form = document.getElementById("quote-form");
    const input = document.getElementById("text-input");
    const btn = document.getElementById("submit-btn");
    const statusEl = document.getElementById("status");
    const cardsEl = document.getElementById("cards");

    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // 阻止表单默认的“整页提交跳转”
      const text = input.value.trim();
      if (!text) {
        statusEl.textContent = "先写点什么再提交";
        return;
      }

      btn.disabled = true;
      statusEl.textContent = "提交中…";
      try {
        const res = await fetch("/api/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text, author: "我" }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        input.value = "";
        statusEl.textContent = "提交成功（状态码 " + res.status + "）";
        loadQuotes(); // 重新拉取列表
      } catch (err) {
        statusEl.textContent = "提交失败：" + err.message;
      } finally {
        btn.disabled = false;
      }
    });

    async function loadQuotes() {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      cardsEl.innerHTML = data.data
        .map((q) => '<div class="card">“' + q.text + "” —— " + q.author + "</div>")
        .join("");
    }
    loadQuotes();
  </script>
</body>
</html>
`;

export const EXPERIMENT_4: Experiment = {
  id: "exp4",
  badge: "真实接口 · 真实请求",
  title: "实验 4 · 暗色模式、事件委托与动态数据",
  intro:
    "这一章的实验第一次联网：下方的名言卡片接口（/api/quotes）就架在课程站上，是货真价实的 HTTP 服务。每一步操作都可以在下方的网络面板里看到请求、状态码与耗时。",
  tasks: [
    "步骤①：完成 TODO 1、2，实现「点列表项高亮」——注意体会为什么只需要一个监听器",
    "步骤①：点击暗色模式按钮，想想：JS 改的是哪个属性？样式变化是谁完成的？",
    "步骤②：先点「重新加载」，再打开网络面板看这条 GET 请求的状态码与耗时",
    "步骤②：完成两个 TODO，把临时接口 /api/quotes?fail=1 写进 fetch 路径，验证错误处理生效",
    "步骤③：提交一条你自己的名言，在网络面板里找到那条 POST，确认状态码是 201",
  ],
  steps: [
    {
      id: "step1",
      label: "① 暗色模式与事件委托",
      brief: "两个 TODO 都在事件委托那段。完成后点几个列表项，再点「切换暗色模式」——样式切换只用了 body 的一个 data-theme 属性，视觉变化全交给 CSS transition。",
      code: STEP1_CODE,
    },
    {
      id: "step2",
      label: "② fetch 真实接口",
      brief: "点「重新加载」→ 看网络面板 → 完成两个 TODO → 把 fetch 路径临时改成 /api/quotes?fail=1 再运行，验证错误分支。改回正常路径再跑一次。",
      code: STEP2_CODE,
      mode: "html",
    },
    {
      id: "step3",
      label: "③ POST 提交名言",
      brief: "写一条名言提交。观察网络面板里多出的那条 POST /api/quotes：请求体是 JSON，响应状态码是 201（已创建）。",
      code: STEP3_CODE,
    },
  ],
  files: [
    { name: "theme-delegation.html", content: STEP1_CODE },
    { name: "quotes-fetch.html", content: STEP2_CODE },
    { name: "quotes-post.html", content: STEP3_CODE },
  ],
  readme: "第 4 章三个练习的参考答案。均为单文件 HTML，双击即可在浏览器打开；其中 quotes 两个文件需要网络（接口架在课程站，本地打开时会因找不到接口而走错误分支——正好用来检验错误处理）。",
  console: true,
  net: true,
};
