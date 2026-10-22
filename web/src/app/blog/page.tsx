import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllSeries, getAllTags } from "@/lib/posts";
import { formatDate } from "@/lib/date";
import { BlogSearch } from "@/components/BlogSearch";

export const metadata: Metadata = {
  title: "博客",
  description: "技术思考、工程实践，以及一些踩坑之后才明白的事。",
};

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { tag } = await searchParams;
  const allPosts = getAllPosts();
  const posts = tag ? allPosts.filter((p) => p.tags.includes(tag)) : allPosts;
  const tags = getAllTags();
  const series = getAllSeries();

  return (
    <div className="container-page py-14 sm:py-20">
      <p className="section-title">Blog</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
        {tag ? `#${tag}` : "技术博客"}
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
        {tag
          ? `标签「${tag}」下共 ${posts.length} 篇。`
          : `记录踩过的坑、学到的东西和一些思考。共 ${posts.length} 篇文章，欢迎交流。`}
        {tag && (
          <>
            {" "}
            <Link href="/blog" className="font-medium text-forest-700 hover:underline">
              查看全部
            </Link>
          </>
        )}
      </p>

      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/blog/series"
            className="rounded-full border border-forest-300 px-3 py-1 text-xs font-medium text-forest-700 transition hover:bg-forest-50 dark:border-forest-500/40 dark:text-forest-300 dark:hover:bg-forest-500/10"
          >
            系列（{series.length}）→
          </Link>
          {tags.map(({ tag: t, count }) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className={`rounded-full px-3 py-1 text-xs transition ${
                tag === t
                  ? "bg-forest-700 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-forest-50 hover:text-forest-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-forest-500/15 dark:hover:text-forest-300"
              }`}
            >
              #{t}
              <span className={`ml-1 ${tag === t ? "text-white/70" : "text-stone-400"}`}>
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10">
        <BlogSearch posts={allPosts} />
      </div>

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
