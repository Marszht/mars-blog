import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSeries, getSeriesByKey } from "@/lib/posts";
import { formatDate } from "@/lib/date";

interface PageProps {
  params: Promise<{ key: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ key: s.key }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { key } = await params;
  const series = getSeriesByKey(key);
  if (!series) return { title: "系列不存在" };
  return {
    title: series.title,
    description: `「${series.title}」系列文章，共 ${series.posts.length} 篇。`,
  };
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { key } = await params;
  const series = getSeriesByKey(key);
  if (!series) notFound();

  return (
    <div className="container-page py-14 sm:py-20">
      <Link href="/blog/series" className="text-sm font-medium text-forest-700 hover:underline">
        ← 全部系列
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold">{series.title}</h1>
      <p className="mt-3 text-stone-500 dark:text-stone-400">
        共 {series.posts.length} 篇 · 建议按顺序阅读
      </p>

      <ol className="mt-10 space-y-4">
        {series.posts.map((post, i) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="card group flex items-center gap-4 p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-50 font-mono text-sm font-bold text-forest-700 dark:bg-forest-500/15 dark:text-forest-300">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-bold group-hover:text-forest-700 dark:group-hover:text-forest-300">
                  {post.title}
                </h2>
                <time className="text-xs text-stone-400" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              <span className="text-stone-300 transition group-hover:translate-x-1 group-hover:text-forest-500 dark:text-stone-600" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
