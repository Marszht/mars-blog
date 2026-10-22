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

export { formatDate, formatShortDate } from "@/lib/date";
