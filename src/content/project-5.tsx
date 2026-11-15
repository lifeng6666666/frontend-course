"use client";

import { Callout, H2, H3, StepList, Table } from "@/components/course/blocks";
import { CodeBlock } from "@/components/course/code-block";
import { Quiz } from "@/components/course/quiz";
import { ParamLab } from "@/components/course/param-lab";
import { DownloadButton } from "@/components/course/download-button";
import { EXPERIMENT_P5 } from "@/lib/course/experiments/expP5";
import { PACK_P5 } from "@/lib/course/packs";

const PROMPT = `请帮我开发一个「2D 太空射击游戏」，单文件 HTML + 原生 Canvas，不用任何游戏库。

【玩法】
1. 玩家飞船在底部，方向键或 A/D 左右移动；空格键发射子弹（有射击间隔）。
2. 敌机从顶部随机位置生成、匀速下落，被子弹击中即爆炸消失并计 10 分。
3. 敌机落底扣一条命，命 3 条，扣完游戏结束，可重新开始。
4. 星空背景缓慢下移，营造飞行感。

【手感参数】
把「敌机速度、射击间隔、生成间隔、飞船速度」做成一个 CFG 配置对象放代码顶部，
我想通过改这几个数字调整难度，不要把它们散落在逻辑里。

【技术要求】
- 游戏循环用 requestAnimationFrame + delta time（帧率无关），禁止 setInterval。
- 碰撞用矩形 AABB 检测；子弹、敌机、粒子用数组管理，出界或销毁后从数组移除。
- 分数、生命画在页面上而不是 canvas 里（DOM 与 Canvas 各司其职）。

【约束】注释用中文；画面对象简洁（三角形飞船、倒三角敌机、粒子爆炸），重点是手感与结构。`;

const LOOP_SAMPLE = `// 游戏的心脏：每一帧只做两件事 —— update（改状态）→ draw（画出来）
let lastT = performance.now();

function loop(now) {
  // dt = 距上一帧的秒数。封顶 0.05s：切到别的标签页再回来时，
  // 现实间隔可能很大，不封顶的话敌机会"瞬移"穿屏
  const dt = Math.min((now - lastT) / 1000, 0.05);
  lastT = now;

  if (state === "playing") update(dt, now);   // 状态机：只有 playing 才推进
  draw(now);

  requestAnimationFrame(loop);                // 向浏览器预约下一帧（第 4 章的异步家族）
}
requestAnimationFrame(loop);

// 为什么不用 setInterval(fn, 16)？
// ① 与显示器刷新率不同步（撕裂）② 标签页隐藏时照样狂跑 ③ 不提供时间戳，dt 要自己攒。`;

const HIT_SAMPLE = `// AABB 碰撞检测：两个矩形的中心距在两个轴上都小于「半宽之和」即重叠
function hit(a, b) {
  return Math.abs(a.x - b.x) * 2 < (a.w + b.w)
      && Math.abs(a.y - b.y) * 2 < (a.h + b.h);
}

// 敌机的更新与移除：filter 生成新数组 —— 和第 8 章的不可变更新一模一样
enemies = enemies.filter((e) => {
  const shot = bullets.find((b) => hit(b, e));
  if (shot) {
    score += 10;
    boom(e.x, e.y);                                   // 粒子爆炸
    bullets = bullets.filter((b) => b !== shot);      // 子弹也销毁
    return false;                                     // 该敌机从数组中消失
  }
  if (e.y > H + 20) {                                 // 落底：扣命
    lives--;
    if (lives <= 0) gameOver();
    return false;
  }
  return true;                                        // 留下
});`;

const QUIZ = [
  {
    question: "游戏循环必须用 requestAnimationFrame + delta time，其中 dt 的作用是？",
    options: [
      "让画面更流畅",
      "把「速度 × 帧间隔」作为位移，使移动速度在不同刷新率的屏幕上保持一致（帧率无关）",
      "统计分数",
      "减少 CPU 占用",
    ],
    answerIndex: 1,
    explanation:
      "若每帧固定移动 2px，144Hz 屏幕上速度就是 60Hz 屏幕的 2.4 倍。dt 让「速度」变成物理意义上的 px/s，手感在任何设备上都一致。",
  },
  {
    question: "提示词要求「手感参数集中在一个 CFG 对象」，这属于哪种工程实践？",
    options: [
      "状态提升",
      "配置与逻辑分离（数据分层思想的另一面）：调难度不需要读懂游戏逻辑",
      "服务端校验",
      "事件委托",
    ],
    answerIndex: 1,
    explanation:
      "与项目四的「数据源分层」同源：把会调的数值集中到一处。本篇实验的参数滑杆就是直接注入 CFG——你能亲手验证这条约束的价值。",
  },
  {
    question: "敌机被击中后从数组移除用的是 filter 而不是 splice，主要原因？",
    options: [
      "filter 更快",
      "与第 8 章一致的思维：在遍历过程中安全地重建集合，避免边遍历边删除导致的索引错乱",
      "splice 已废弃",
      "filter 能触发重绘",
    ],
    answerIndex: 1,
    explanation:
      "在 forEach 中 splice 正在遍历的数组会跳元素——经典 bug。filter 生成新数组的写法天然安全，且与 React 的不可变更新是同一种思维。",
  },
  {
    question: "「分数与生命画在页面上而不是 canvas 里」，这样拆分的理由是？",
    options: [
      "Canvas 不能画文字",
      "DOM 元素自带可访问性与样式系统（读屏可读、CSS 可控）；Canvas 只该负责高频重绘的游戏画面",
      "为了性能必然更快",
      "没有理由，只是习惯",
    ],
    answerIndex: 1,
    explanation:
      "职责分层：HUD（血条、分数）交给 DOM，语义与样式免费获得；画面交给 Canvas。混合方案在商业游戏前端里同样常见。",
  },
];

export function Project5() {
  return (
    <>
      <p>
        最后一个独立项目：2D 太空射击游戏。它和数据看板代表了两类「AI 擅长但初学者常觉得神秘」的领域——
        看板神秘在库 API 多，游戏神秘在「实时循环」。拆完你会发现：游戏前端的每一块零件，你都见过。
      </p>

      <H2>一、游戏前端的特殊性：从「事件驱动」到「帧驱动」</H2>
      <p>
        你写过的所有页面都是<strong>事件驱动</strong>：用户点了才有反应。游戏是<strong>帧驱动</strong>：
        每秒 60 次，每次都问「现在各物体在哪、该画什么」。这是唯一的新心智模型，其余全是旧知识——
        事件监听、数组管理、状态机、异步调度，全都出自前三篇。
      </p>

      <H2>二、Canvas 十分钟速览</H2>
      <p>
        Canvas 是一块「你说了算」的画布：拿到 2D 上下文后，每帧先清空、再重画。
        没有 retained 模式的元素树——画完即忘，所以每帧全量重绘就是它的正常工作方式：
      </p>
      <Table
        head={["API", "用途", "本项目里的用法"]}
        rows={[
          [<><code>getContext("2d")</code></>, "拿到绘图上下文", "一次获取，全项目复用"],
          [<><code>fillRect / clearRect</code></>, "矩形绘制与清屏", "子弹、粒子、清屏"],
          [<><code>beginPath / moveTo / fill</code></>, "路径绘制", "三角形飞船与敌机"],
          [<><code>fillStyle</code></>, "填充色（含 rgba 半透明）", "爆炸粒子的渐隐"],
          [<><code>requestAnimationFrame</code></>, "预约下一帧（第 4 章异步家族成员）", "游戏循环的驱动器"],
        ]}
      />

      <H2>三、提示词原文</H2>
      <CodeBlock code={PROMPT} language="text" filename="prompt.txt" source="第一轮提示词" />
      <Callout tone="ai" title="这份提示词的三个关键约束">
        <strong>CFG 配置对象</strong>（手感参数集中）——为本篇实验的滑杆铺路；
        <strong>rAF + dt</strong>（点名禁 setInterval）——挡掉新手最常见的帧率 bug；
        <strong>DOM 与 Canvas 各司其职</strong>——HUD 走 DOM 获得可访问性。
        好提示词 = 提前把「AI 容易做错的点」写成条款。
      </Callout>

      <H2>四、逐句拆解</H2>
      <Table
        head={["提示词原句", "AI 用了什么", "回溯"]}
        rows={[
          [<><code>方向键或 A/D 移动</code></>, "keydown/keyup 维护按键状态表 keys[]，update 里读表", "事件监听（第 1 章 1.2、第 4 章 4.2）"],
          [<><code>空格发射，有射击间隔</code></>, "now - lastFire > CFG.fireInterval 才 fire()", "异步与时间戳（第 4 章 4.3）"],
          [<><code>敌机随机生成、匀速下落</code></>, "spawn 定时器 + 位置更新 e.y += e.vy * dt", "帧驱动的位移公式"],
          [<><code>击中爆炸计分</code></>, "AABB 碰撞 + filter 移除 + 粒子数组", "数组方法（第 3 章）"],
          [<><code>命 3 条，扣完结束，可重来</code></>, "state 状态机 playing/over + restart 重置", "状态驱动界面（第 6/8 章）"],
          [<><code>星空背景缓慢下移</code></>, "60 颗星星坐标 + 取模循环滚动", "数学运算与视觉欺骗"],
          [<><code>rAF + delta time</code></>, "loop(now) 里 Math.min((now-lastT)/1000, 0.05)", "异步调度（第 4 章 4.3）"],
          [<><code>AABB 碰撞</code></>, "hit(a,b) 四行几何判断", "中学数学 + 布尔逻辑"],
          [<><code>CFG 配置对象</code></>, "速度/间隔四参数集中于顶部", "配置与逻辑分离"],
        ]}
      />

      <H2>五、代码精讲：循环与碰撞</H2>
      <H3>① 游戏循环：dt 与状态机</H3>
      <CodeBlock code={LOOP_SAMPLE} language="javascript" filename="loop.js" />
      <H3>② 碰撞检测与安全移除</H3>
      <CodeBlock code={HIT_SAMPLE} language="javascript" filename="hit.js" />
      <p>
        两段代码放在一起看：游戏逻辑 = <strong>数学 + 数组操作 + 时间</strong>，没有一行你读不懂的语法。
        「神秘感」的破除，就是复盘的意义。
      </p>

      <H2>六、技术点回溯</H2>
      <Table
        head={["技术点", "出自", "在本项目的形态"]}
        rows={[
          [<><strong>事件监听（键盘）</strong></>, "第 1/4 章", "keydown/keyup 维护 keys 表"],
          [<><strong>异步：rAF 与时间戳</strong></>, "第 4 章 4.3", "游戏循环与射击间隔"],
          [<><strong>数组方法 map/filter/find</strong></>, "第 3 章", "子弹/敌机/粒子的生灭"],
          [<><strong>不可变更新的思维</strong></>, "第 8 章 8.1", "filter 重建数组，避免遍历中删除"],
          [<><strong>状态机与状态驱动</strong></>, "第 6/8 章", "playing/over 两态 + 重开"],
          [<><strong>DOM 与语义</strong></>, "第 2 章", "HUD 用 DOM 展示，可读屏可样式化"],
          [<><strong>配置分层</strong></>, "第 10-11 章（契约思想）", "CFG 对象集中手感参数"],
        ]}
      />
      <Callout tone="info" title="首尾呼应">
        第 1 章的「点击计数器」与本章的「游戏循环」，用的都是同一个 addEventListener 与同一个异步事件循环。
        从计数器到游戏，差的不是语法，而是对「帧驱动」这一个概念的理解——现在你也懂了。
      </Callout>

      <H2>七、追问与迭代</H2>
      <StepList
        items={[
          <><strong>追问一（难度曲线）：</strong>「随时间推移，敌机速度与生成频率按分钟递增，封顶后保持。」——把 CFG 的值变成时间的函数，游戏循环的数值思维进阶版。</>,
          <><strong>追问二（音效）：</strong>「击中时播放短促音效。」——new Audio() + play()；注意浏览器要求用户先有交互才允许出声，所以要在第一次按键后初始化。</>,
          <><strong>追问三（暂停）：</strong>「P 键暂停：暂停时停止 update 但保留画面，恢复时 dt 要重置防止时间跳变。」——状态机加一态 + 循环封顶逻辑的实战应用。</>,
        ]}
      />

      <H2>八、实验：可玩游戏（改参数看手感）</H2>
      <p>
        玩一局，然后拖动滑杆改参数重启——亲手体会「游戏手感 = 循环里的数值」：
      </p>
      <ParamLab
        id={EXPERIMENT_P5.id}
        title={EXPERIMENT_P5.title}
        badge={EXPERIMENT_P5.badge}
        intro={EXPERIMENT_P5.intro}
        params={EXPERIMENT_P5.params}
        html={EXPERIMENT_P5.html}
        tasks={EXPERIMENT_P5.tasks}
        height={EXPERIMENT_P5.height}
        console={EXPERIMENT_P5.console}
      />

      <H2>九、自测</H2>
      <Quiz id="quiz-p5" questions={QUIZ} />

      <H2>十、带走这个项目</H2>
      <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
        <DownloadButton folderName="space-shooter" files={PACK_P5} label="下载项目五代码包" />
        <span className="text-xs text-muted-foreground">单文件游戏 + 三条改造建议</span>
      </div>
      <Callout tone="info" title="全书毕业">
        五个项目复盘完毕。你现在的能力清单：读懂任何 AI 产出的前端代码、按五段式定位提示词与技术点的因果、
        在浏览器与本地两种环境里验证与排错。附录 A 的提示词手册，是这套方法论的浓缩卡片——常回去翻。
      </Callout>
    </>
  );
}
