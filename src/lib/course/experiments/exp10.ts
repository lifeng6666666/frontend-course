import type { Experiment } from "./types";

const STEP1_BODY = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>手写 fetchJSON：统一封装请求层</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    button { padding: 8px 16px; border-radius: 8px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; margin-right: 8px; }
    #out { margin-top: 16px; background: #0f172a; color: #e2e8f0; border-radius: 10px; padding: 14px; font-family: monospace; font-size: 12.5px; min-height: 120px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h2>fetchJSON(method, url, body)</h2>
  <p>第 4 章我们每次 fetch 都要写一遍 res.ok 检查、JSON 解析、错误处理。封装一次，永久受益：</p>
  <button id="get-btn">GET /api/notes</button>
  <button id="post-btn">POST /api/notes</button>
  <button id="err-btn">GET /api/quotes?fail=1</button>
  <pre id="out">（请求结果会打印在这里）</pre>

  <script>
    const out = document.getElementById("out");
    function log(msg) { out.textContent += msg + "\\n"; }

    // ---------- 手写 fetchJSON ----------
    async function fetchJSON(method, url, body) {
      const res = await fetch(url, {
        method: method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        // TODO：把 HTTP 错误变成可捕获的异常——
        //       throw new Error("HTTP " + res.status + " " + res.statusText)
      }
      return res.status === 204 ? null : res.json(); // 204 = 无内容（删除成功常用）
    }

    document.getElementById("get-btn").onclick = async () => {
      try {
        const data = await fetchJSON("GET", "/api/notes");
        out.textContent = "";
        log("GET 成功，共 " + data.data.length + " 条笔记：");
        data.data.forEach((n) => log("  #" + n.id + " " + n.title + (n.done ? " ☑" : " ☐")));
      } catch (err) { log("✕ " + err.message); }
    };

    document.getElementById("post-btn").onclick = async () => {
      try {
        const created = await fetchJSON("POST", "/api/notes", { title: "用 fetchJSON 建的第 " + new Date().toLocaleTimeString() + " 条笔记" });
        out.textContent = "";
        log("POST 成功，状态码 201，服务器返回：");
        log(JSON.stringify(created, null, 2));
      } catch (err) { log("✕ " + err.message); }
    };

    document.getElementById("err-btn").onclick = async () => {
      out.textContent = "";
      log("故意请求一个会 500 的接口，检验错误分支…");
      try {
        await fetchJSON("GET", "/api/quotes?fail=1");
        log("竟然成功了？（不应该走到这里）");
      } catch (err) {
        log("✕ 正确捕获：" + err.message);
      }
    };
  </script>
</body>
</html>
`;

const STEP2_BODY = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>笔记 CRUD · 前端调后端</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 32px auto; padding: 0 16px; color: #1f2937; }
    form { display: flex; gap: 8px; margin-bottom: 12px; }
    input { flex: 1; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; }
    button { padding: 8px 14px; border-radius: 8px; border: none; background: #059669; color: #fff; cursor: pointer; font-size: 14px; }
    button.del { background: #fee2e2; color: #b91c1c; padding: 4px 10px; }
    li { display: flex; justify-content: space-between; align-items: center; padding: 10px 4px; border-bottom: 1px solid #eee; }
    li.done span { text-decoration: line-through; color: #9ca3af; }
    #loading { color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <h2>我的笔记 <span style="font-size:13px;color:#6b7280">（数据存在课程站服务器上）</span></h2>
  <form id="f"><input id="input" placeholder="写一条笔记，回车保存" /><button>保存</button></form>
  <p id="loading"></p>
  <ul id="list"></ul>

  <script>
    const listEl = document.getElementById("list");
    const loadingEl = document.getElementById("loading");

    async function fetchJSON(method, url, body) {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.status === 204 ? null : res.json();
    }

    // ---------- 读：渲染列表 ----------
    async function load() {
      loadingEl.textContent = "加载中…";
      try {
        const data = await fetchJSON("GET", "/api/notes");
        listEl.innerHTML = data.data
          .map((n) =>
            '<li class="' + (n.done ? "done" : "") + '">' +
              '<span>' + n.title + '</span>' +
              '<span>' +
                '<button data-toggle="' + n.id + '">' + (n.done ? "取消完成" : "标为完成") + '</button> ' +
                '<button class="del" data-del="' + n.id + '">删除</button>' +
              '</span>' +
            '</li>'
          )
          .join("");
      } catch (err) {
        listEl.innerHTML = '<li style="color:#b91c1c">加载失败：' + err.message + "</li>";
      } finally {
        loadingEl.textContent = "";
      }
    }

    // ---------- 增 ----------
    document.getElementById("f").addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = document.getElementById("input");
      const title = input.value.trim();
      if (!title) return;
      // TODO 1：POST { title } 到 /api/notes，成功后清空输入框并 load()
    });

    // ---------- 改 / 删：事件委托 + 两个分支 ----------
    listEl.addEventListener("click", async (e) => {
      const delId = e.target.dataset.del;
      const toggleId = e.target.dataset.toggle;
      try {
        if (delId) {
          // TODO 2：DELETE /api/notes/<id>
        } else if (toggleId) {
          // TODO 3：PATCH /api/notes/<id>，请求体 { done: ? } —— 把当前状态取反
          // 提示：先在渲染时把 n.done 存到 dataset 里
        }
      } catch (err) {
        alert("操作失败：" + err.message);
      }
    });

    load();
  </script>
</body>
</html>
`;

export const EXPERIMENT_10: Experiment = {
  id: "exp10",
  badge: "真实 REST API",
  title: "实验 10 · 手写 fetchJSON，并完成一次完整 CRUD",
  intro:
    "课程站上跑着一台真实的 Node 服务器，暴露了笔记接口 /api/notes（GET 列表、POST 新建、PATCH 修改、DELETE 删除）。你的前端代码将像真实项目一样对它完成一次全流程增删改查。",
  tasks: [
    "步骤①：补全 fetchJSON 的 TODO，然后依次点三个按钮验证：正常请求、成功请求、错误捕获各是什么样",
    "步骤②：在网络面板中找到 GET /api/notes，记下状态码与耗时",
    "步骤②：完成 TODO 1（POST 保存）——写一条自己的笔记",
    "步骤②：完成 TODO 2、3（DELETE 与 PATCH），全部在网络面板里核对状态码：200 / 204",
    "刷新页面（点运行）后笔记还在吗？——在，因为这次数据在服务器上，不在你的浏览器里",
  ],
  steps: [
    {
      id: "step1",
      label: "① 手写 fetchJSON",
      brief: "第 10.5 节会逐行精讲这个封装。这里先补全 TODO 并用三个按钮验收：它能同时处理成功（JSON）、空内容（204）与失败（throw）。",
      code: STEP1_BODY,
    },
    {
      id: "step2",
      label: "② 完整 CRUD",
      brief: "补全三个 TODO。每完成一个，就去网络面板确认对应请求的状态码——这是前后端联调的日常动作。",
      code: STEP2_BODY,
    },
  ],
  files: [
    { name: "fetch-json.html", content: STEP1_BODY },
    { name: "notes-crud.html", content: STEP2_BODY },
  ],
  readme: "第 10 章参考答案。两个文件均需网络（接口架在课程站）；双击本地打开时请求会失败——正好检验错误分支是否写对。",
  console: true,
  net: true,
};
