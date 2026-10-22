"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/date";
import type { PostMeta } from "@/lib/posts";

export function BlogSearch({ posts }: { posts: PostMeta[] }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return posts.filter((p) => {
      return (
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [q, posts]);

  return (
    <div>
      <div className="relative">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索文章标题、摘要或标签…"
          aria-label="搜索文章"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pl-10 text-sm outline-none transition focus:border-forest-500 focus:ring-2 focus:ring-forest-200 dark:border-stone-700 dark:bg-stone-800 dark:focus:ring-forest-500/20"
        />
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
      </div>

      {q.trim() && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-stone-400">
            找到 {results.length} 篇{results.length === 0 ? "（没有匹配，换个关键词？）" : ""}
          </p>
          {results.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card group block p-4">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="font-bold group-hover:text-forest-700 dark:group-hover:text-forest-300">
                  {post.title}
                </h3>
                <time className="text-xs text-stone-400" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
