export interface LabParam {
  key: string;
  label: string;
  type: "range" | "switch" | "select";
  min?: number;
  max?: number;
  step?: number;
  def: number | boolean;
  unit?: string;
  options?: { v: number; l: string }[];
}

export const P4_PARAMS: LabParam[] = [
  {
    key: "months",
    label: "时间范围",
    type: "select",
    def: 12,
    options: [
      { v: 6, l: "近 6 个月" },
      { v: 12, l: "近 12 个月" },
    ],
  },
  { key: "showBar", label: "显示销售额柱状图", type: "switch", def: true },
  { key: "smooth", label: "利润折线平滑", type: "switch", def: true },
];

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>销售数据看板</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; background: #f6f7f9; }
    .wrap { max-width: 720px; margin: 20px auto; padding: 0 12px; }
    .kpis { display: flex; gap: 12px; margin-bottom: 12px; }
    .kpi { flex: 1; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px; }
    .kpi .v { font-size: 22px; font-weight: 700; color: #111827; }
    .kpi .l { font-size: 12px; color: #6b7280; margin-top: 2px; }
    .kpi .u { font-size: 12px; margin-top: 4px; }
    #chart { width: 100%; height: 340px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="kpis">
      <div class="kpi"><div class="v" id="k1">-</div><div class="l">总销售额</div><div class="u" id="k1u"></div></div>
      <div class="kpi"><div class="v" id="k2">-</div><div class="l">总利润</div><div class="u" id="k2u"></div></div>
      <div class="kpi"><div class="v" id="k3">-</div><div class="l">利润率</div><div class="u" id="k3u"></div></div>
    </div>
    <div id="chart"></div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script>
  <script>
    // ===== 由课程页传入的配置（改参数会注入这里）=====
    var CFG = __CFG__;

    // ===== 数据层：真实项目中由后端接口返回（第 10 章）=====
    var MONTHS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
    var SALES  = [42, 48, 51, 47, 58, 63, 59, 66, 71, 68, 75, 82];   // 销售额（万元）
    var PROFIT = [12, 15, 16, 14, 19, 23, 21, 25, 28, 26, 30, 34];   // 利润（万元）

    var N = CFG.months;
    var m = MONTHS.slice(12 - N), s = SALES.slice(12 - N), p = PROFIT.slice(12 - N);

    // ===== KPI 卡片：reduce 聚合（第 3 章学过的数组方法）=====
    var sumS = s.reduce(function (a, b) { return a + b; }, 0);
    var sumP = p.reduce(function (a, b) { return a + b; }, 0);
    document.getElementById("k1").textContent = sumS + " 万";
    document.getElementById("k1u").textContent = "环比 +" + Math.round((s[s.length-1] / s[0] - 1) * 100) + "%";
    document.getElementById("k2").textContent = sumP + " 万";
    document.getElementById("k2u").textContent = "环比 +" + Math.round((p[p.length-1] / p[0] - 1) * 100) + "%";
    document.getElementById("k3").textContent = Math.round(sumP / sumS * 100) + "%";
    document.getElementById("k3u").textContent = "利润 / 销售额";

    // ===== 图表层：ECharts 只需要一个「option 配置对象」=====
    var series = [];
    if (CFG.showBar) {
      series.push({
        name: "销售额", type: "bar", data: s,
        itemStyle: { color: "#059669", borderRadius: [4, 4, 0, 0] },
        barWidth: "38%",
      });
    }
    series.push({
      name: "利润", type: "line", data: p,
      smooth: CFG.smooth,
      lineStyle: { color: "#f59e0b", width: 2.5 },
      itemStyle: { color: "#f59e0b" },
      symbolSize: 6,
    });

    var chart = echarts.init(document.getElementById("chart"));
    chart.setOption({
      tooltip: { trigger: "axis" },              // 联动提示：悬停一根柱，整组数据一起亮
      legend: { data: CFG.showBar ? ["销售额", "利润"] : ["利润"] },
      grid: { left: 42, right: 16, top: 36, bottom: 28 },
      xAxis: { type: "category", data: m },
      yAxis: { type: "value", name: "万元" },
      series: series,
    });

    // 容器尺寸变化时重算布局——响应式图表的关键一行
    window.addEventListener("resize", function () { chart.resize(); });
  </script>
</body>
</html>
`;

export const EXPERIMENT_P4 = {
  id: "expP4",
  title: "实验 · 可运行的销售看板（ECharts）",
  badge: "真实图表库渲染",
  intro:
    "这是一个完整的可运行看板：KPI 卡片 + 折柱混合图。数据是本地数组（真实项目中换成 /api 接口返回即可，第 10 章的 fetchJSON 直接适用）。改下面的参数并重启，观察配置对象如何驱动图表。",
  params: P4_PARAMS,
  html: DASHBOARD_HTML,
  tasks: [
    "切换「近 6 个月 / 近 12 个月」，观察 slice 怎么裁剪数据（代码里搜 CFG.months）",
    "关掉柱状图再打开——series 数组少了一项，option 其余部分原封不动",
    "切换折线平滑，找到 CFG.smooth 出现的两处位置",
    "悬停图表任意月份，观察 tooltip 的「联动」：这是 trigger: 'axis' 的效果",
    "把浏览器窗口拉窄再拉宽：图表自适应靠的是最后一行 chart.resize()",
  ],
  height: 520,
  console: true,
};
