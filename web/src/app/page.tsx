import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { getAllFootprints } from "@/lib/footprints";
import { formatDate, formatShortDate } from "@/lib/date";

const chapters = [
  { no: "01", title: "写代码", desc: "项目、工程实践，以及一些踩坑之后才明白的事。", href: "/projects", meta: "WORK / NOTES" },
  { no: "02", title: "去户外", desc: "骑行和徒步。用双脚重新认识广州，也重新认识自己。", href: "/outdoor", meta: "RIDE / HIKE" },
  { no: "03", title: "记日常", desc: "不一定重要，但值得留下来的生活切片。", href: "/footprints", meta: "LIFE / MOMENTS" },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);
  const footprints = getAllFootprints().slice(0, 2);

  return (
    <div className="pb-24">
      <section className="container-page grid min-h-[72vh] items-center gap-12 py-16 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <p className="eyebrow">MARS MZ / GUANGZHOU</p>
          <h1 className="mt-6 max-w-4xl font-serif text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.82] tracking-[-0.065em]">
            写代码，<br />也把生活<br /><i className="font-normal text-rust">练具体。</i>
          </h1>
        </div>
        <aside className="self-end border-l border-stone-300 pl-6 dark:border-stone-700">
          <p className="text-base leading-8 text-stone-600 dark:text-stone-400">
            全栈工程师。工作日跟系统较劲，空下来骑车、进山、举铁、打球。
          </p>
          <p className="mt-8 font-mono text-xs leading-6 text-stone-400">
            CURRENTLY<br />
            <span className="text-stone-700 dark:text-stone-300">在广州生活 / 保持训练 / 持续创造</span>
          </p>
        </aside>
      </section>

      <section className="border-y border-stone-300 dark:border-stone-700">
        <div className="container-page grid sm:grid-cols-2 lg:grid-cols-4">
          {chapters.map((item) => (
            <Link
              key={item.no}
              href={item.href}
              className="group border-b border-stone-300 py-7 sm:px-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0 dark:border-stone-700"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-stone-400">
                <span>{item.no}</span>
                <span>{item.meta}</span>
              </div>
              <h2 className="mt-10 font-serif text-3xl transition-colors group-hover:text-rust">{item.title}</h2>
              <p className="mt-3 min-h-14 text-sm leading-6 text-stone-500 dark:text-stone-400">{item.desc}</p>
              <span className="mt-7 inline-block text-xl transition-transform group-hover:translate-x-2" aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-paper">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow text-sand">RECENT WRITING</p>
            <h2 className="mt-4 font-serif text-4xl">最近写的</h2>
          </div>
          <div className="divide-y divide-white/15 border-t border-white/15">
            {posts.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-6">
                <span className="font-mono text-xs text-stone-500">0{i + 1}</span>
                <h3 className="text-base group-hover:text-sand">{post.title}</h3>
                <time className="hidden font-mono text-[10px] text-stone-500 sm:block" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {footprints.length > 0 && (
        <section className="container-page py-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow">LIFE LATELY</p>
              <h2 className="mt-3 font-serif text-4xl">生活近况</h2>
            </div>
            <Link href="/footprints" className="text-sm text-rust">全部足迹 →</Link>
          </div>
          <div className="grid gap-px bg-stone-300 md:grid-cols-2 dark:bg-stone-700">
            {footprints.map((item) => (
              <article key={item.slug} className="bg-paper p-6 dark:bg-night">
                <time className="font-mono text-[11px] text-stone-400" dateTime={item.date}>
                  {formatShortDate(item.date)}
                  {item.location ? ` / ${item.location}` : ""}
                </time>
                <p className="mt-5 line-clamp-3 text-sm leading-7 text-stone-600 dark:text-stone-400">
                  {item.content}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
