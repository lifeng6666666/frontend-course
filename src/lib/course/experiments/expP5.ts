import type { LabParam } from "./expP4";

export const P5_PARAMS: LabParam[] = [
  { key: "enemySpeed", label: "敌机下落速度", type: "range", min: 40, max: 240, step: 10, def: 110, unit: "px/s" },
  { key: "fireInterval", label: "射击间隔", type: "range", min: 120, max: 600, step: 20, def: 260, unit: "ms" },
  { key: "spawnInterval", label: "敌机生成间隔", type: "range", min: 400, max: 2000, step: 100, def: 900, unit: "ms" },
  { key: "playerSpeed", label: "飞船移动速度", type: "range", min: 150, max: 500, step: 10, def: 280, unit: "px/s" },
];

const GAME_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>2D 太空射击</title>
  <style>
    body { margin: 0; background: #0b1020; display: flex; flex-direction: column; align-items: center; font-family: system-ui, sans-serif; }
    #hud { color: #93a3c8; font-size: 13px; padding: 8px 0 2px; }
    #hud b { color: #67e8f9; }
    canvas { background: #0b1020; border-radius: 8px; }
    #over { position: absolute; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center; background: rgba(7,10,22,0.82); color: #e2e8f0; border-radius: 8px; }
    #over h2 { margin: 0 0 6px; font-size: 26px; }
    #over button { margin-top: 14px; padding: 10px 22px; border: none; border-radius: 8px; background: #059669; color: #fff; font-size: 15px; cursor: pointer; }
  </style>
</head>
<body>
  <div id="hud">得分 <b id="score">0</b> · 生命 <b id="lives">♥♥♥</b> · 方向键 / A D 移动 · 空格射击</div>
  <div style="position:relative">
    <canvas id="cv" width="440" height="560"></canvas>
    <div id="over"><h2>GAME OVER</h2><p id="final"></p><button id="restart">再来一局</button></div>
  </div>

  <script>
    // ===== 课程页传入的参数（拖动滑杆会注入这里）=====
    var CFG = __CFG__;

    var cv = document.getElementById("cv");
    var ctx = cv.getContext("2d");
    var W = cv.width, H = cv.height;

    // ===== 状态机：playing / over（第 8 章的思想：状态驱动界面）=====
    var state = "playing";
    var score = 0, lives = 3;
    var player = { x: W / 2, y: H - 46, w: 34, h: 26 };
    var bullets = [];   // 对象池思想：每颗子弹是一个对象，出界就移除
    var enemies = [];
    var parts = [];     // 爆炸粒子
    var stars = [];
    for (var i = 0; i < 60; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, s: Math.random() * 1.6 + 0.4 });
    }

    var keys = {};
    document.addEventListener("keydown", function (e) {
      keys[e.code] = true;
      if (e.code === "Space") e.preventDefault();
    });
    document.addEventListener("keyup", function (e) { keys[e.code] = false; });

    var lastFire = 0, lastSpawn = 0, lastT = performance.now();

    function spawnEnemy() {
      enemies.push({
        x: Math.random() * (W - 30) + 15,
        y: -16,
        s: 28,               // 边长（近似方形敌机，碰撞检测用矩形）
        vy: CFG.enemySpeed * (0.85 + Math.random() * 0.4),
      });
    }

    function fire() {
      bullets.push({ x: player.x, y: player.y - 18, w: 4, h: 12 });
    }

    function boom(x, y) {
      for (var i = 0; i < 14; i++) {
        parts.push({
          x: x, y: y,
          vx: (Math.random() - 0.5) * 220,
          vy: (Math.random() - 0.5) * 220,
          life: 0.5 + Math.random() * 0.3,
        });
      }
    }

    // AABB 矩形碰撞检测：两个矩形的中心距在两个轴上都小于「半宽之和」就算撞上
    function hit(a, b) {
      return Math.abs(a.x - b.x) * 2 < (a.w + b.w) && Math.abs(a.y - b.y) * 2 < (a.h + b.h);
    }

    function update(dt, now) {
      // —— 输入 → 移动（速度 × 时间，帧率无关）——
      if (keys.ArrowLeft || keys.KeyA) player.x -= CFG.playerSpeed * dt;
      if (keys.ArrowRight || keys.KeyD) player.x += CFG.playerSpeed * dt;
      player.x = Math.max(20, Math.min(W - 20, player.x));

      if (now - lastFire > CFG.fireInterval) { fire(); lastFire = now; }
      if (now - lastSpawn > CFG.spawnInterval) { spawnEnemy(); lastSpawn = now; }

      // —— 子弹：位置更新 + 出界移除（filter 生成新数组）——
      bullets = bullets
        .map(function (b) { b.y -= 420 * dt; return b; })
        .filter(function (b) { return b.y > -14; });

      // —— 敌机：下落 + 被击中判定 + 落底扣命 ——
      enemies.forEach(function (e) { e.y += e.vy * dt; });

      enemies = enemies.filter(function (e) {
        var shot = bullets.find(function (b) { return hit(b, e); });
        if (shot) {
          score += 10;
          boom(e.x, e.y);
          bullets = bullets.filter(function (b) { return b !== shot; });
          return false;
        }
        if (e.y > H + 20) {
          lives--;
          updateHud();
          if (lives <= 0) gameOver();
          return false;
        }
        return true;
      });

      // —— 粒子衰减 ——
      parts = parts
        .map(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; return p; })
        .filter(function (p) { return p.life > 0; });

      document.getElementById("score").textContent = score;
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      // 星空
      ctx.fillStyle = "#26314f";
      stars.forEach(function (s) {
        var y = (s.y + t * 0.02 * s.s) % H;
        ctx.fillRect(s.x, y, s.s, s.s);
      });
      // 子弹
      ctx.fillStyle = "#67e8f9";
      bullets.forEach(function (b) { ctx.fillRect(b.x - 2, b.y - 6, b.w, b.h); });
      // 敌机（倒三角）
      ctx.fillStyle = "#f87171";
      enemies.forEach(function (e) {
        ctx.beginPath();
        ctx.moveTo(e.x, e.y + 12);
        ctx.lineTo(e.x - 13, e.y - 12);
        ctx.lineTo(e.x + 13, e.y - 12);
        ctx.closePath();
        ctx.fill();
      });
      // 粒子
      parts.forEach(function (p) {
        ctx.fillStyle = "rgba(251,191,36," + Math.max(p.life, 0) * 1.6 + ")";
        ctx.fillRect(p.x, p.y, 3, 3);
      });
      // 玩家飞船（正三角）
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - 16);
      ctx.lineTo(player.x - 16, player.y + 12);
      ctx.lineTo(player.x + 16, player.y + 12);
      ctx.closePath();
      ctx.fill();
    }

    function updateHud() {
      document.getElementById("lives").textContent = lives > 0 ? new Array(lives + 1).join("♥") : "";
    }

    function gameOver() {
      state = "over";
      document.getElementById("final").textContent = "最终得分：" + score;
      document.getElementById("over").style.display = "flex";
    }

    document.getElementById("restart").onclick = function () {
      score = 0; lives = 3; enemies = []; bullets = []; parts = [];
      player.x = W / 2;
      state = "playing";
      document.getElementById("over").style.display = "none";
      updateHud();
    };

    // ===== 游戏循环：requestAnimationFrame + delta time =====
    // 每帧做两件事：update（改状态）→ draw（画出来）。永不使用 setInterval。
    function loop(now) {
      var dt = Math.min((now - lastT) / 1000, 0.05); // 秒；封顶防止切标签页后跳帧
      lastT = now;
      if (state === "playing") update(dt, now);
      draw(now);
      requestAnimationFrame(loop);
    }
    updateHud();
    requestAnimationFrame(loop);
  </script>
</body>
</html>
`;

export const EXPERIMENT_P5 = {
  id: "expP5",
  title: "实验 · 可玩的太空射击（Canvas）",
  badge: "真实游戏引擎循环",
  intro:
    "一个完整可玩的 2D 射击游戏，无任何游戏库，只用 Canvas + requestAnimationFrame。重点不是打游戏，而是拖动下面的参数再重启：游戏手感 = 游戏循环里的数值。",
  params: P5_PARAMS,
  html: GAME_HTML,
  tasks: [
    "玩一局（方向键 / A D 移动，空格射击），确认核心循环：移动 → 射击 → 击中 → 得分",
    "把「敌机下落速度」调到 240 再来一局：难度曲线为什么陡了？（数值直接进入 update 的位置计算）",
    "把「射击间隔」调到 600：体会 fireInterval 在代码里控制了什么",
    "打开实现注释里的完整源码，找到 requestAnimationFrame 与 hit() 碰撞检测",
    "思考：切到别的标签页再回来，游戏不会「瞬移」——封顶 dt 的那一行是干嘛的？",
  ],
  height: 640,
  console: true,
};
