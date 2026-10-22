export interface WrappedStat {
  label: string;
  value: string;
  unit?: string;
  note?: string;
  /** 相对最大值的 0-100，用于进度条 */
  pct?: number;
}

export interface WrappedHighlight {
  month: string;
  title: string;
  desc: string;
  emoji: string;
}

/** 2026 户外年度数据（手动维护，年底更新一次） */
export const wrappedYear = "2026";

export const wrappedStats: WrappedStat[] = [
  { label: "骑行里程", value: "1680", unit: "km", pct: 56, note: "目标 3000km，完成 56%" },
  { label: "总爬升", value: "6200", unit: "m", pct: 62, note: "南昆山一个人贡献 900m" },
  { label: "徒步线路", value: "14", unit: "条", pct: 47, note: "目标 10 条，已超额 4 条" },
  { label: "打球次数", value: "46", unit: "次", pct: 77, note: "几乎每周两练，风雨无阻" },
];

export const wrappedHighlights: WrappedHighlight[] = [
  { month: "03", title: "重新开始认真运动", desc: "羽毛球先入坑，一周两练成为固定日程。", emoji: "🏸" },
  { month: "05", title: "第一次 100km+", desc: "沿珠江骑到顺德，回程逆风，腿是软的，心是满的。", emoji: "🚴" },
  { month: "07", title: "南昆山 900m 爬升", desc: "第一次连续 12km 爬坡，登顶的风值回全部腿酸。", emoji: "⛰️" },
  { month: "08", title: "火凤线拉练", desc: "18km 穿越线，后半程无遮荫，学会了按 2L/人 备水。", emoji: "🥾" },
  { month: "09", title: "建了这个网站", desc: "把骑行、徒步和日常都搬到了 marsmz.top。", emoji: "🏔️" },
];

export const wrappedFacts = [
  "骑得最多的一条线：大夫山环线（28km），骑了 23 次",
  "爬升最多的一天：南昆山 900m",
  "最早的出发时间：06:12（赶在大夫山开园前）",
  "吃得最香的一顿：火凤线终点的大排档炒粉",
  "最遗憾的一次：台风天取消的溯溪，明年补上",
];

export const wrappedGoalsNext = [
  "年骑行里程突破 3000km",
  "完成一次两日重装徒步露营",
  "羽毛球业余赛打进八强 🏆",
  "解锁一条外省的经典长线",
];
