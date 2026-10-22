export interface NowItem {
  emoji: string;
  title: string;
  meta: string;
  note?: string;
}

export const nowUpdated = "2026-09";

export const nowReading: NowItem[] = [
  {
    emoji: "📖",
    title: "《重来 3：跳出疯狂的忙碌》",
    meta: "Rework · 正在读",
    note: "讲怎么把工作做得更慢、更清醒。",
  },
  {
    emoji: "📄",
    title: "React 19 官方文档",
    meta: "README · 常翻",
    note: "Server Components 和 Actions 值得再啃一遍。",
  },
];

export const nowListening: NowItem[] = [
  {
    emoji: "🎧",
    title: "后摇 / 民谣 / Lo-fi",
    meta: "写代码背景音",
    note: "最近在听 Explosions in the Sky 和 惘闻。",
  },
];

export const nowUsing: NowItem[] = [
  { emoji: "⌨️", title: "HHKB Pro 2", meta: "键盘", note: "静电容，打字这件事本身就有快感。" },
  { emoji: "💻", title: "M2 MacBook Air", meta: "主力机", note: "16G 内存，写代码 + 剪短视频都够。" },
  { emoji: "📷", title: "GR IIIx", meta: "随身相机", note: "揣兜里就能拍，记录骑行路上的人。" },
  { emoji: "🎒", title: "20L 轻量徒步背包", meta: "周末进山", note: "一日线标配，透气背负。" },
];
