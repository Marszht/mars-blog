export interface SportStat {
  label: string;
  value: string;
  unit?: string;
}

export interface GearItem {
  emoji: string;
  name: string;
  desc: string;
}

export interface Route {
  name: string;
  type: "骑行" | "徒步";
  region: string;
  distance: string;
  duration: string;
  elevation?: string;
  desc: string;
  featured?: boolean;
}

export interface ActivityLog {
  date: string;
  title: string;
  detail: string;
  tag?: string;
  sport: string;
}

/* ===== 三大运动总览 ===== */
export const sports = [
  {
    id: "cycling",
    emoji: "🚴",
    name: "骑行",
    tagline: "风从耳边过，路在脚下伸",
    desc: "公路 + 城市绿道混骑，周末最长单日 120km。喜欢爬坡的节奏感，也喜欢下坡的风。",
    stats: [
      { label: "单日最长", value: "120", unit: "km" },
      { label: "月均里程", value: "300+", unit: "km" },
      { label: "座驾", value: "公路车", unit: "" },
      { label: "爬坡", value: "2", unit: "次/月" },
    ] as SportStat[],
  },
  {
    id: "hiking",
    emoji: "🥾",
    name: "徒步",
    tagline: "山不过来，我就过去",
    desc: "周末进山，喜欢轻装的一日线，也计划挑战两日重装露营。看云海、看日出，是充电的最好方式。",
    stats: [
      { label: "完成线路", value: "30+", unit: "条" },
      { label: "最长单日", value: "25", unit: "km" },
      { label: "最高海拔", value: "1900", unit: "m" },
      { label: "徒步频率", value: "1", unit: "次/月" },
    ] as SportStat[],
  },
  {
    id: "badminton",
    emoji: "🏸",
    name: "羽毛球",
    tagline: "挥拍与热爱，球场见真章",
    desc: "每周固定练球，喜欢双打的后场杀球与网前小球。雨天不能出门的日子，球场就是我的户外。",
    stats: [
      { label: "球龄", value: "5+", unit: "年" },
      { label: "每周打球", value: "2", unit: "次" },
      { label: "主打", value: "双打", unit: "" },
      { label: "打法", value: "后场杀球", unit: "" },
    ] as SportStat[],
  },
];

/* ===== 路线 ===== */
export const routes: Route[] = [
  {
    name: "大夫山环线",
    type: "骑行",
    region: "广州番禺",
    distance: "28km",
    duration: "约 1.5h",
    desc: "绿道环绕，周末清晨人少车少，练有氧的经典线路。",
    featured: true,
  },
  {
    name: "南昆山爬坡",
    type: "骑行",
    region: "广州增城",
    distance: "38km",
    duration: "约 3h",
    elevation: "爬升 900m",
    desc: "广州周边少有的长爬坡，练腿力的圣地，风景绝佳。",
  },
  {
    name: "火炉山-凤凰山穿越",
    type: "徒步",
    region: "广州天河",
    distance: "18km",
    duration: "约 6h",
    desc: "经典一日穿越线，路况丰富，适合周末拉练。",
    featured: true,
  },
  {
    name: "白云山经典线",
    type: "徒步",
    region: "广州白云",
    distance: "12km",
    duration: "约 4h",
    desc: "城市里的绿肺，下班后也能快速进山，看日落很方便。",
  },
];

/* ===== 运动日志 ===== */
export const activityLogs: ActivityLog[] = [
  {
    date: "2026-08-14",
    sport: "骑行",
    title: "周末晨骑 · 大夫山 28km",
    detail:
      "六点半出门，凉风习习。第一圈热身，第二圈提速，平均心率 148。回来的路上在河边吃了个肠粉，完美周末。",
    tag: "骑行",
  },
  {
    date: "2026-08-09",
    sport: "徒步",
    title: "火凤线穿越 18km",
    detail:
      "从火炉山到凤凰山，一路土路+台阶，后半段有点晒。山顶的风很大，站在那觉得一周的疲惫都散了。",
    tag: "徒步",
  },
  {
    date: "2026-08-06",
    sport: "羽毛球",
    title: "反手后场：终于有感觉了",
    detail:
      "练了 1 小时反手。核心是转体带动小臂内旋，放松手腕爆发。高远球稳定率从 40% 提到 65%，下周继续。",
    tag: "训练",
  },
];

/* ===== 装备 ===== */
export const gearList: GearItem[] = [
  {
    emoji: "🚴",
    name: "公路车 · 碳架整备",
    desc: "52 尺码，耐力几何，日常通勤 + 周末长距离两相宜。",
  },
  {
    emoji: "🥾",
    name: "徒步鞋 · 中帮防水",
    desc: "抓地稳、防水，一日线标配，重装前再升级。",
  },
  {
    emoji: "🏸",
    name: "主战拍 · 疾光 NF 800",
    desc: "4U 85g，26 磅，头轻速攻，主打连贯与网前。",
  },
  {
    emoji: "🎒",
    name: "背包 · 20L 轻量款",
    desc: "一日徒步装备全装下，背负透气，爬坡不闷。",
  },
];

/* ===== 年度目标 ===== */
export const outdoorGoals = [
  "年骑行里程突破 3000km",
  "完成一次两日重装徒步露营",
  "打卡 10 条新的徒步线路",
  "羽毛球业余赛打进八强 🏆",
];
