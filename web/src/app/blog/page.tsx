import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata: Metadata = { title: "博客" };

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container-page py-14 sm:py-20">
      <p className="section-title">Blog</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">技术博客</h1>
      <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
        记录踩过的坑、学到的东西和一些思考。共 {posts.length} 篇文章，欢迎交流。
      </p>

      <div className="mt-10 space-y-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card group block p-6">
            <div className="flex flex-wrap items-center gap-3">
              <time className="text-sm font-medium text-forest-700">
                {formatDate(post.date)}
              </time>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
            <h2 className="mt-2 text-xl font-bold group-hover:text-forest-700">
              {post.title}
            </h2>
            <p className="mt-2 leading-7 text-stone-600 dark:text-stone-400">
              {post.excerpt}
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-forest-700">
              阅读全文 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
