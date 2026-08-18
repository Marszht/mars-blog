import fs from "fs";
import path from "path";
import matter from "gray-matter";

const footprintsDirectory = path.join(
  process.cwd(),
  "src",
  "content",
  "footprints",
);

export interface Footprint {
  slug: string;
  date: string;
  location: string;
  tags: string[];
  images: string[];
  link?: string;
  linkLabel?: string;
  content: string;
}

export function getAllFootprints(): Footprint[] {
  if (!fs.existsSync(footprintsDirectory)) return [];
  const files = fs
    .readdirSync(footprintsDirectory)
    .filter((f) => f.endsWith(".md"));

  const footprints = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(footprintsDirectory, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      date: (data.date as string) ?? "",
      location: (data.location as string) ?? "",
      tags: (data.tags as string[]) ?? [],
      images: (data.images as string[]) ?? [],
      link: (data.link as string) ?? undefined,
      linkLabel: (data.linkLabel as string) ?? undefined,
      content: content.trim(),
    };
  });

  return footprints.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatFeedDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) {
    return "今天";
  } else if (diffDays === 1) {
    return "昨天";
  } else if (diffDays < 7) {
    return `${diffDays} 天前`;
  }
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}
