import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src", "content", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  /** 系列 key（英文 slug，如 "deploy"） */
  series?: string;
  /** 系列显示名（如 "部署系列"） */
  seriesTitle?: string;
}

export interface Post extends PostMeta {
  content: string;
}

function parsePost(file: string, withContent: boolean): Post {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(postsDirectory, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    series: (data.series as string) ?? undefined,
    seriesTitle: (data.seriesTitle as string) ?? undefined,
    content: withContent ? content : "",
  };
}

function listMarkdownFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
}

function byDateDesc(a: PostMeta, b: PostMeta) {
  return a.date < b.date ? 1 : -1;
}

export function getAllPosts(): PostMeta[] {
  return listMarkdownFiles()
    .map((file) => parsePost(file, false))
    .sort(byDateDesc);
}

export function getPostBySlug(slug: string): Post | undefined {
  const file = `${slug}.md`;
  const full = path.join(postsDirectory, file);
  if (!fs.existsSync(full)) return undefined;
  return parsePost(file, true);
}

export function getRelatedPosts(post: PostMeta, limit = 3): PostMeta[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const scored = others
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1));
  const related = scored.filter((s) => s.score > 0).slice(0, limit);
  if (related.length >= limit) return related.map((s) => s.post);
  const fallback = others.filter(
    (p) => !related.some((r) => r.post.slug === p.slug),
  );
  return [...related.map((s) => s.post), ...fallback].slice(0, limit);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}

export interface Series {
  key: string;
  title: string;
  posts: PostMeta[];
}

export function getAllSeries(): Series[] {
  const map = new Map<string, Series>();
  for (const post of getAllPosts()) {
    if (!post.series) continue;
    const existing = map.get(post.series);
    if (existing) {
      existing.posts.push(post);
    } else {
      map.set(post.series, {
        key: post.series,
        title: post.seriesTitle ?? post.series,
        posts: [post],
      });
    }
  }
  return [...map.values()]
    .map((s) => ({ ...s, posts: s.posts.sort(byDateDesc) }))
    .sort((a, b) => b.posts.length - a.posts.length);
}

export function getSeriesByKey(key: string): Series | undefined {
  return getAllSeries().find((s) => s.key === key);
}

export { formatDate } from "@/lib/date";
