import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { formatDate, readingTime } from "@/lib/date";
import { Markdown } from "@/components/Markdown";
import { JsonLd } from "@/components/JsonLd";
import { blogPostingJsonLd, defaultOgImage } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "文章不存在" };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: defaultOgImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [defaultOgImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const related = getRelatedPosts(post);

  return (
    <article className="container-page py-14 sm:py-20">
      <JsonLd data={blogPostingJsonLd(post)} />
      <Link
        href="/blog"
        className="text-sm font-medium text-forest-700 hover:underline"
      >
        ← 返回博客
      </Link>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{readingTime(post.content)}</span>
          <span>·</span>
          <div className="flex flex-wrap gap-1.5">
            {post.series && (
              <Link
                href={`/blog/series/${post.series}`}
                className="rounded-full bg-forest-50 px-2 py-0.5 text-xs text-forest-700 hover:bg-forest-100 dark:bg-forest-500/15 dark:text-forest-300"
              >
                📚 {post.seriesTitle ?? post.series}
              </Link>
            )}
            {post.tags.map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500 hover:bg-forest-50 hover:text-forest-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-forest-500/15 dark:hover:text-forest-300"
              >
                #{t}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-8 max-w-3xl border-t border-stone-200 pt-8 dark:border-stone-800">
        <Markdown content={post.content} />
      </div>

      {related.length > 0 && (
        <section className="mt-12 max-w-3xl border-t border-stone-200 pt-8 dark:border-stone-800">
          <h2 className="text-lg font-bold">相关文章</h2>
          <ul className="mt-4 space-y-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/blog/${item.slug}`}
                  className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span className="font-medium group-hover:text-forest-700">
                    {item.title}
                  </span>
                  <time className="text-xs text-stone-400" dateTime={item.date}>
                    {formatDate(item.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 max-w-3xl border-t border-stone-200 pt-6 dark:border-stone-800">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          觉得有用的话，欢迎邮件与我交流 👋
        </p>
        <Link
          href="/contact"
          className="mt-2 inline-block text-sm font-medium text-forest-700 hover:underline"
        >
          去留言 →
        </Link>
      </div>
    </article>
  );
}
