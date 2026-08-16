import Link from "next/link";
import { site } from "@/lib/site";
import { getAllPosts, formatDate } from "@/lib/posts";
import { getAllFootprints, formatFeedDate } from "@/lib/footprints";
import { projects } from "@/lib/projects";

const featureCards = [
  {
    emoji: "💻",
    title: "写代码",
    desc: "全栈开发者，热爱 TypeScript、React 与后端工程，持续折腾各种技术。",
    href: "/projects",
  },
  {
    emoji: "⛰️",
    title: "去户外",
    desc: "骑行、徒步、羽毛球——把身体交给风、山路和球场，是我充电的方式。",
    href: "/outdoor",
  },
  {
    emoji: "📷",
    title: "记足迹",
    desc: "像朋友圈一样记录生活瞬间：每次出发、每段风景、每个小进步。",
    href: "/footprints",
  },
];

const tags = [
  "TypeScript",
  "React",
  "Next.js",
  "骑行",
  "徒步",
  "羽毛球",
  "户外",
];

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);
  const recentFootprints = getAllFootprints().slice(0, 3);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_50%_0%,rgba(73,98,71,0.08),transparent),radial-gradient(45%_40%_at_85%_20%,rgba(169,151,114,0.10),transparent)]" />
        <div className="container-page grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-3 py-1 text-xs font-medium text-forest-700 dark:border-forest-500/30 dark:bg-forest-500/10 dark:text-forest-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-forest-600" />
              </span>
              广州 · 周末常在山里 / 在路上
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              你好，我是 <span className="text-gradient">Mars</span> 👋
            </h1>
            <p className="mt-4 text-lg text-stone-600 dark:text-stone-300 sm:text-xl">
              {site.tagline}。白天写代码，周末去山里和路上——把热爱过得具体一点。
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/footprints"
                className="rounded-xl bg-forest-700 px-6 py-3 text-sm font-semibold text-khaki-100 shadow-lg shadow-forest-800/20 transition hover:bg-forest-600"
              >
                看我的足迹 →
              </Link>
              <Link
                href="/outdoor"
                className="rounded-xl border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                户外运动 ⛰️
              </Link>
            </div>
          </div>

          {/* 右侧卡片 */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-forest-500/15 via-khaki-500/15 to-forest-700/15 blur-xl" />
            <div className="relative rounded-3xl border border-stone-200 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-stone-700 dark:bg-stone-900/80">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 text-3xl shadow-md">
                  ⛰️
                </div>
                <div>
                  <p className="text-lg font-bold">{site.name}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {site.tagline}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["💻", "全栈工程师"],
                  ["🚴", "年骑行 3000km+"],
                  ["🥾", "徒步 30+ 条线路"],
                  ["🏸", "羽毛球 5 年球龄"],
                ].map(([e, t]) => (
                  <div
                    key={t}
                    className="rounded-xl bg-stone-50 px-3 py-2.5 dark:bg-stone-800/70"
                  >
                    <span className="mr-1.5">{e}</span>
                    <span className="text-stone-600 dark:text-stone-300">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 三大板块 ===== */}
      <section className="container-page py-10">
        <div className="grid gap-5 sm:grid-cols-3">
          {featureCards.map((c) => (
            <Link key={c.title} href={c.href} className="card group p-6">
              <span className="text-3xl">{c.emoji}</span>
              <h3 className="mt-3 text-lg font-bold group-hover:text-forest-700 dark:group-hover:text-forest-300">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                {c.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 最近足迹 ===== */}
      {recentFootprints.length > 0 && (
        <section className="container-page py-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="section-title">最近足迹</h2>
            <Link
              href="/footprints"
              className="text-sm font-medium text-forest-700 hover:underline dark:text-forest-300"
            >
              全部动态 →
            </Link>
          </div>
          <div className="mx-auto max-w-2xl space-y-6">
            {recentFootprints.map((item) => (
              <div key={item.slug} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-forest-600 to-forest-800 text-sm font-bold text-khaki-100">
                  {site.shortName[0]}
                </div>
                <div className="card flex-1 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-forest-700 dark:text-forest-300">
                      {formatFeedDate(item.date)}
                    </span>
                    {item.location && (
                      <span className="text-xs text-stone-400">{item.location}</span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                    {item.content}
                  </p>
                  {item.images.length > 0 && (
                    <div className="mt-3 flex gap-1.5">
                      {item.images.slice(0, 3).map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={`${src}-${i}`}
                          src={src}
                          alt=""
                          className="h-16 w-16 rounded-lg border border-stone-200 object-cover dark:border-stone-700"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
                  {item.link && (
                    <Link
                      href={item.link}
                      className="mt-3 inline-block text-xs font-medium text-forest-700 hover:underline dark:text-forest-300"
                    >
                      {item.linkLabel ?? "查看详情"} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== 最近博客 ===== */}
      {recentPosts.length > 0 && (
        <section className="container-page py-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="section-title">最近博客</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-forest-700 hover:underline dark:text-forest-300"
            >
              全部文章 →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card group p-5">
                <p className="text-xs text-stone-400">{formatDate(post.date)}</p>
                <h3 className="mt-2 text-base font-bold leading-snug group-hover:text-forest-700 dark:group-hover:text-forest-300">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600 dark:text-stone-400">
                  {post.excerpt}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== 精选项目 ===== */}
      {featuredProjects.length > 0 && (
        <section className="container-page py-10 pb-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="section-title">精选项目</h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-forest-700 hover:underline dark:text-forest-300"
            >
              全部项目 →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredProjects.map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noreferrer" className="card group p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold group-hover:text-forest-700 dark:group-hover:text-forest-300">
                    {p.name}
                  </h3>
                  <span className="text-xs text-stone-400">{p.year}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600 dark:text-stone-400">
                  {p.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
