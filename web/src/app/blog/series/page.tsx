import type { Metadata } from "next";
import Link from "next/link";
import { getAllSeries } from "@/lib/posts";

export const metadata: Metadata = {
  title: "文章系列",
  description: "按主题归类的博客系列文章。",
};

export default function SeriesPage() {
  const series = getAllSeries();

  return (
    <div className="container-page py-14 sm:py-20">
      <Link href="/blog" className="text-sm font-medium text-forest-700 hover:underline">
        ← 全部文章
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold">文章系列</h1>
      <p className="mt-3 text-stone-500 dark:text-stone-400">
        同一主题的文章归成一个系列，方便顺着读。
      </p>

      <div className="mt-10 space-y-4">
        {series.map((s) => (
          <Link
            key={s.key}
            href={`/blog/series/${s.key}`}
            className="card group block p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-bold group-hover:text-forest-700 dark:group-hover:text-forest-300">
                {s.title}
              </h2>
              <span className="text-xs text-stone-400">{s.posts.length} 篇</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.posts.map((p) => (
                <span
                  key={p.slug}
                  className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                >
                  {p.title}
                </span>
              ))}
            </div>
          </Link>
        ))}
        {series.length === 0 && (
          <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-400 dark:border-stone-700">
            还没有系列文章，后续会陆续整理。
          </p>
        )}
      </div>
    </div>
  );
}
