export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return "";
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return "";
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export function readingTime(content: string): string {
  const text = content.replace(/```[\s\S]*?```/g, " ").replace(/[#>*`[\]()]/g, " ");
  const cn = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const en = (text.match(/[A-Za-z0-9]+/g) ?? []).length;
  const minutes = Math.max(1, Math.round((cn + en * 5) / 400));
  return `${minutes} 分钟阅读`;
}
