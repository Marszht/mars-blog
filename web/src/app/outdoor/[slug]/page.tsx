import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRouteBySlug, routes } from "@/lib/outdoor";
import { PhotoGrid } from "@/components/PhotoGrid";
import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const routeTypeColor: Record<string, string> = {
  骑行: "bg-forest-100 text-forest-700 dark:bg-forest-500/15 dark:text-forest-300",
  徒步: "bg-khaki-100 text-khaki-700 dark:bg-khaki-500/15 dark:text-khaki-300",
};

export function generateStaticParams() {
  return routes.map((r) => ({ slug: r.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) return { title: "路线不存在" };
  return {
    title: `${route.name} · 户外`,
    description: route.desc,
    alternates: { canonical: `/outdoor/${route.slug}` },
    openGraph: {
      type: "article",
      title: `${route.name} · ${route.region}`,
      description: route.desc,
      url: `${siteUrl}/outdoor/${route.slug}`,
    },
  };
}

function Stats({ route }: { route: NonNullable<ReturnType<typeof getRouteBySlug>> }) {
  const items = [
    { label: "距离", value: route.distance },
    { label: "用时", value: route.duration },
    ...(route.elevation
      ? [{ label: "爬升", value: route.elevation.replace("爬升 ", "") }]
      : []),
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 dark:border-stone-700 dark:bg-stone-700 sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="bg-white px-5 py-4 dark:bg-stone-900">
          <dt className="text-xs text-stone-400">{it.label}</dt>
          <dd className="mt-1 font-serif text-2xl text-forest-700 dark:text-forest-300">
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default async function OutdoorRoutePage({ params }: PageProps) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) notFound();

  const index = routes.findIndex((r) => r.slug === slug);
  const prev = routes[(index - 1 + routes.length) % routes.length];
  const next = routes[(index + 1) % routes.length];

  return (
    <article className="container-page py-14 sm:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: route.name,
          description: route.desc,
          url: `${siteUrl}/outdoor/${route.slug}`,
          inLanguage: "zh-CN",
        }}
      />
      <Link
        href="/outdoor"
        className="text-sm font-medium text-forest-700 hover:underline"
      >
        ← 返回户外
      </Link>

      {/* Hero */}
      <header className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              routeTypeColor[route.type] ?? "bg-stone-100 text-stone-600"
            }`}
          >
            {route.type}
          </span>
          {route.featured && (
            <span className="text-xs text-khaki-700 dark:text-khaki-300">★ 推荐</span>
          )}
          {route.location && (
            <span className="text-xs text-stone-400">{route.location}</span>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
          {route.name}
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
          {route.desc}
        </p>
        <div className="mt-6">
          <Stats route={route} />
        </div>
      </header>

      {/* 故事正文 */}
      {route.story && (
        <section className="mt-10 max-w-3xl border-t border-stone-200 pt-8 dark:border-stone-800">
          <h2 className="text-xl font-bold">走这一趟</h2>
          <div className="mt-4 space-y-4 whitespace-pre-line leading-8 text-stone-700 dark:text-stone-300">
            {route.story}
          </div>
        </section>
      )}

      {/* 图片九宫格 */}
      {route.images && route.images.length > 0 && (
        <section className="mt-10 max-w-3xl border-t border-stone-200 pt-8 dark:border-stone-800">
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className="text-xl font-bold">沿途影像</h2>
            <span className="font-mono text-xs text-stone-400">{route.images.length} PICS</span>
          </div>
          <PhotoGrid images={route.images} altPrefix={route.name} sizes="(min-width: 768px) 220px, 33vw" />
        </section>
      )}

      {/* 实用贴士 */}
      {route.tips && route.tips.length > 0 && (
        <section className="mt-10 max-w-3xl border-t border-stone-200 pt-8 dark:border-stone-800">
          <h2 className="text-xl font-bold">实用贴士</h2>
          <ul className="mt-4 space-y-3">
            {route.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-3 leading-7 text-stone-600 dark:text-stone-400">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-50 text-xs font-bold text-forest-700 dark:bg-forest-500/15 dark:text-forest-300">
                  ✓
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 上下篇 */}
      <nav className="mt-12 grid gap-4 border-t border-stone-200 pt-6 sm:grid-cols-2 dark:border-stone-800">
        <Link
          href={`/outdoor/${prev.slug}`}
          className="group rounded-xl border border-stone-200 p-4 transition hover:border-forest-300 hover:bg-forest-50/50 dark:border-stone-700 dark:hover:bg-stone-900"
        >
          <span className="text-xs text-stone-400">← 上一条</span>
          <p className="mt-1 font-medium group-hover:text-forest-700 dark:group-hover:text-forest-300">
            {prev.name}
          </p>
        </Link>
        <Link
          href={`/outdoor/${next.slug}`}
          className="group rounded-xl border border-stone-200 p-4 text-right transition hover:border-forest-300 hover:bg-forest-50/50 sm:col-start-2 dark:border-stone-700 dark:hover:bg-stone-900"
        >
          <span className="text-xs text-stone-400">下一条 →</span>
          <p className="mt-1 font-medium group-hover:text-forest-700 dark:group-hover:text-forest-300">
            {next.name}
          </p>
        </Link>
      </nav>
    </article>
  );
}
