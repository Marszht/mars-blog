import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/posts";
import { Markdown } from "@/components/Markdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-page py-14 sm:py-20">
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
          <time>{formatDate(post.date)}</time>
          <span>·</span>
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
      </header>

      <div className="mt-8 max-w-3xl border-t border-stone-200 pt-8 dark:border-stone-800">
        <Markdown content={post.content} />
      </div>

      <div className="mt-12 max-w-3xl border-t border-stone-200 pt-6 dark:border-stone-800">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          觉得有用的话，欢迎在下方评论区 / 邮件与我交流 👋
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
