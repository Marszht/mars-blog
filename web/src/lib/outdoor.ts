export interface SportStat {
  label: string;
  value: string;
  unit?: string;
}

export interface GearItem {
  emoji: string;
  name: string;
  desc: string;
  category: string;
  price?: string;
  bought?: string;
  rating?: number; // 1-5
  pros?: string[];
  cons?: string[];
}

export interface Route {
  slug: string;
  name: string;
  type: "骑行" | "徒步";
  region: string;
  distance: string;
  duration: string;
  elevation?: string;
  desc: string;
  featured?: boolean;
  /** 详情页长文（支持 \n 换行），不填则列表页 desc 兜底 */
  story?: string;
  /** 详情页九宫格配图，建议正方形 1:1（800×800），单图 4:3（1200×900） */
  images?: string[];
  /** 图片九宫格下方的位置标签，如 "广州 · 番禺" */
  location?: string;
  tips?: string[];
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
    slug: "dafushan-loop",
    name: "大夫山环线",
    type: "骑行",
    region: "广州番禺",
    distance: "28km",
    duration: "约 1.5h",
    desc: "绿道环绕，周末清晨人少车少，练有氧的经典线路。",
    featured: true,
    location: "广州 · 番禺大夫山",
    story:
      "大夫山是我在广州骑得最多的一条线。\n\n周末六点半出门，到门口刚开园，晨雾还没散。第一圈当热身，匀速绕湖；第二圈开始提速，把心率拉到 150 左右。园内机动车少，绿道完整，可以放心看风景。\n\n骑完在北门吃一份肠粉，是这条线最治愈的收尾。",
    tips: [
      "清晨 6:30-9:00 人最少，凉快且出片",
      "园内有两个补给点，夏天记得带水",
      "环湖一圈约 7km，适合热身 + 放松组合",
    ],
    images: [
      "/images/outdoor/dafushan-1.svg",
      "/images/outdoor/dafushan-2.svg",
      "/images/outdoor/dafushan-3.svg",
      "/images/outdoor/dafushan-4.svg",
      "/images/outdoor/dafushan-5.svg",
    ],
  },
  {
    slug: "nankun-climb",
    name: "南昆山爬坡",
    type: "骑行",
    region: "广州增城",
    distance: "38km",
    duration: "约 3h",
    elevation: "爬升 900m",
    desc: "广州周边少有的长爬坡，练腿力的圣地，风景绝佳。",
    location: "广州 · 增城南昆山",
    story:
      "南昆山是广州周边练爬坡的圣地。\n\n前 20km 沿河谷缓上，真正的大门坡从山脚开始，连续 12km 的爬升，平均坡度 6%。整个过程没有捷径，只有一步步把踏频稳住。\n\n登顶那一刻，山风扑面，回头看盘山路像一条带子缠在山腰——900m 的爬升都在脚下。",
    tips: [
      "山路弯多，下坡务必控速、走自己车道",
      "夏季正午暴晒，建议一早出发",
      "山上气温比市区低 5-6℃，带件风衣",
    ],
    images: [
      "/images/outdoor/nankun-1.svg",
      "/images/outdoor/nankun-2.svg",
      "/images/outdoor/nankun-3.svg",
      "/images/outdoor/nankun-4.svg",
    ],
  },
  {
    slug: "huofeng-traverse",
    name: "火炉山-凤凰山穿越",
    type: "徒步",
    region: "广州天河",
    distance: "18km",
    duration: "约 6h",
    desc: "经典一日穿越线，路况丰富，适合周末拉练。",
    featured: true,
    location: "广州 · 天河火凤线",
    story:
      "火凤线是广州驴友的入门必修课。\n\n从火炉山北门进，先是一段台阶热身，随后转入土路和碎石坡。全程几乎不重复路线，从火炉山一路向东北穿越到凤凰山，沿途有竹林、水库和视野开阔的山脊。\n\n后半段基本无遮荫，夏天走要备足 2L 水。山顶风大，站在山脊上，一周的疲惫都散了。",
    tips: [
      "全程约 6 小时，建议 8 点前出发",
      "后半段无补给，水按 2L/人 准备",
      "雨后土路湿滑，穿抓地好的徒步鞋",
    ],
    images: [
      "/images/outdoor/huofeng-1.svg",
      "/images/outdoor/huofeng-2.svg",
      "/images/outdoor/huofeng-3.svg",
      "/images/outdoor/huofeng-4.svg",
      "/images/outdoor/huofeng-5.svg",
      "/images/outdoor/huofeng-6.svg",
    ],
  },
  {
    slug: "baiyun-classic",
    name: "白云山经典线",
    type: "徒步",
    region: "广州白云",
    distance: "12km",
    duration: "约 4h",
    desc: "城市里的绿肺，下班后也能快速进山，看日落很方便。",
    location: "广州 · 白云山",
    story:
      "白云山是离家最近的山，也是我『加班补偿性进山』的首选。\n\n经典走法是从西门上、摩星岭下，台阶 + 缓坡组合，强度不大但出汗足够。傍晚走到摩星岭正好赶上看日落，整个广州在脚下慢慢亮灯。\n\n不需要完整假期，两三个小时就能完成一次『出城』。",
    tips: [
      "傍晚人多，想清静就工作日下午去",
      "摩星岭看日落绝佳，提前查好日落时间",
      "门票 5 元，支持扫码",
    ],
    images: [
      "/images/outdoor/baiyun-1.svg",
      "/images/outdoor/baiyun-2.svg",
      "/images/outdoor/baiyun-3.svg",
    ],
  },
];

export function getRouteBySlug(slug: string): Route | undefined {
  return routes.find((r) => r.slug === slug);
}

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
    category: "骑行",
    desc: "52 尺码，耐力几何，日常通勤 + 周末长距离两相宜。",
    price: "¥8,500",
    bought: "2025.06",
    rating: 5,
    pros: ["几何舒适，骑 4 小时不累", "整车重量 8.9kg，爬坡友好"],
    cons: ["原装轮组略重，升级后更轻"],
  },
  {
    emoji: "🥾",
    name: "徒步鞋 · 中帮防水",
    category: "徒步",
    desc: "抓地稳、防水，一日线标配，重装前再升级。",
    price: "¥1,200",
    bought: "2025.03",
    rating: 4,
    pros: ["防水靠谱，趟溪不湿", "中帮支撑好，碎石路稳"],
    cons: ["夏季闷热", "重量略大"],
  },
  {
    emoji: "🏸",
    name: "主战拍 · 疾光 NF 800",
    category: "羽毛球",
    desc: "4U 85g，26 磅，头轻速攻，主打连贯与网前。",
    price: "¥1,400",
    bought: "2026.01",
    rating: 4,
    pros: ["挥速快，平抽挡不吃亏", "网前小球好控制"],
    cons: ["杀球欠一锤定音", "磅数掉得快"],
  },
  {
    emoji: "🎒",
    name: "背包 · 20L 轻量款",
    category: "徒步",
    desc: "一日徒步装备全装下，背负透气，爬坡不闷。",
    price: "¥680",
    bought: "2025.08",
    rating: 5,
    pros: ["背负通风，夏天不闷背", "口袋分区合理"],
    cons: ["容量装不下重装露营装备"],
  },
];

/* ===== 年度目标 ===== */
export const outdoorGoals = [
  "年骑行里程突破 3000km",
  "完成一次两日重装徒步露营",
  "打卡 10 条新的徒步线路",
  "羽毛球业余赛打进八强 🏆",
];
