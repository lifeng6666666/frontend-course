import type { Experiment } from "./types";

const IMPERATIVE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>写法一：命令式 · 手动操作 DOM</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 560px; margin: 28px auto; padding: 0 16px; color: #1f2937; }
    li { display: flex; justify-content: space-between; align-items: center; padding: 8px 4px; border-bottom: 1px solid #eee; }
    button { cursor: pointer; }
    #add-form input { padding: 8px; width: 220px; margin-right: 8px; }
    #stats { color: #6b7280; font-size: 13px; }
  </style>
</head>
<body>
  <h2>待办（命令式）</h2>
  <form id="add-form"><input id="input" placeholder="新增待办" /><button>添加</button></form>
  <p id="stats"></p>
  <ul id="list"></ul>

  <script>
    // 状态藏在 DOM 里：有几条、分别是什么，要问 ul 才知道
    function refreshStats() {
      document.getElementById("stats").textContent =
        "共 " + document.querySelectorAll("#list li").length + " 条";
    }

    document.getElementById("add-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const input = document.getElementById("input");
      if (!input.value.trim()) return;

      // 手动创建节点 → 设置内容 → 挂删除按钮 → 插入 DOM → 更新统计
      const li = document.createElement("li");
      li.textContent = input.value;
      const del = document.createElement("button");
      del.textContent = "删除";
      del.addEventListener("click", function () {
        li.remove();      // 删除也要手动同步
        refreshStats();   // 统计也要手动同步
      });
      li.appendChild(del);
      document.getElementById("list").appendChild(li);
      input.value = "";
      refreshStats();     // 添加也要手动同步
    });

    refreshStats();
  </script>
</body>
</html>
`;

const DECLARATIVE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>写法二：声明式 · 数据驱动视图</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 560px; margin: 28px auto; padding: 0 16px; color: #1f2937; }
    li { display: flex; justify-content: space-between; align-items: center; padding: 8px 4px; border-bottom: 1px solid #eee; }
    button { cursor: pointer; }
    #add-form input { padding: 8px; width: 220px; margin-right: 8px; }
    #stats { color: #6b7280; font-size: 13px; }
  </style>
</head>
<body>
  <h2>待办（声明式）</h2>
  <form id="add-form"><input id="input" placeholder="新增待办" /><button>添加</button></form>
  <p id="stats"></p>
  <ul id="list"></ul>

  <script>
    // 唯一的数据源：视图是数据的函数 —— state 一变，重新 render 就对了
    let todos = ["读完第 6 章", "做实验 6"];

    function render() {
      document.getElementById("list").innerHTML = todos
        .map(function (t, i) {
          return "<li><span>" + t + '</span><button data-i="' + i + '">删除</button></li>';
        })
        .join("");
      document.getElementById("stats").textContent = "共 " + todos.length + " 条";
    }

    document.getElementById("add-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const input = document.getElementById("input");
      if (!input.value.trim()) return;
      todos = todos.concat(input.value.trim()); // 1. 改数据
      render();                                  // 2. 重画视图
      input.value = "";
    });

    document.getElementById("list").addEventListener("click", function (e) {
      if (e.target.tagName !== "BUTTON") return;
      const i = Number(e.target.dataset.i);
      todos = todos.filter(function (_, idx) { return idx !== i; }); // 1. 改数据
      render();                                                       // 2. 重画视图
    });

    render();
  </script>
</body>
</html>
`;

export const EXPERIMENT_6: Experiment = {
  id: "exp6",
  badge: "真实浏览器渲染",
  title: "实验 6 · 同一个需求，两种写法",
  intro:
    "同一个「待办清单」：左边两步先运行感受结果，再对照代码。命令式把状态藏在 DOM 里、每一步都手动同步；声明式把状态抽出来，视图只是数据的函数。",
  tasks: [
    "步骤①：添加 3 条待办，再随机删 1 条——功能正常，但想想：程序是怎么知道「现在有几条」的？",
    "步骤②：同样玩一遍。这回「有几条」存在哪个变量里？删除时改的是 DOM 还是数据？",
    "对比两份代码：如果现在要加「按 Enter 快速添加」，哪种写法要改的地方更多？",
    "思考：声明式写法每次都 innerHTML 全量重画，会有什么代价？（答案在第 6.3 节的虚拟 DOM）",
  ],
  steps: [
    {
      id: "step1",
      label: "① 命令式：手动操作 DOM",
      brief: "先玩再说。添加、删除都正常。然后看代码：每次增删都要「手动补一刀」——li.remove()、refreshStats()。漏一刀就出 bug。",
      code: IMPERATIVE,
    },
    {
      id: "step2",
      label: "② 声明式：数据驱动视图",
      brief: "操作步骤一样，但代码结构完全不同：所有操作都是「改数据 → 调 render()」。DOM 怎么变？那是 render 的事，业务代码不用管。",
      code: DECLARATIVE,
    },
  ],
  files: [
    { name: "imperative.html", content: IMPERATIVE },
    { name: "declarative.html", content: DECLARATIVE },
  ],
  readme: "第 6 章两种写法的对照示例，双击即可打开。",
  console: true,
};
