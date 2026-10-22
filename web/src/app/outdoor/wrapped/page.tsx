import type { Metadata } from "next";
import Link from "next/link";
import {
  wrappedYear,
  wrappedStats,
  wrappedHighlights,
  wrappedFacts,
  wrappedGoalsNext,
} from "@/lib/wrapped";
import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${wrappedYear} 户外年度报告`,
  description: `Mars 的 ${wrappedYear} 户外年度总结：骑行、爬升、徒步与球场的一年。`,
};

export default function WrappedPage() {
  return (
    <div className="container-page pb-24 pt-12 sm:pt-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${wrappedYear} 户外年度报告`,
          description: `Mars 的 ${wrappedYear} 户外年度总结`,
          url: `${siteUrl}/outdoor/wrapped`,
          inLanguage: "zh-CN",
        }}
      />

      {/* Hero */}
      <header className="text-center">
        <p className="eyebrow justify-center">OUTDOOR WRAPPED</p>
        <h1 className="mt-4 font-serif text-5xl leading-[1] tracking-[-0.03em] sm:text-7xl">
          {wrappedYear}<br />
          <i className="font-normal text-rust">这一年，去了野外。</i>
        </h1>
        <p className="mx-auto mt-6 max-w-md leading-7 text-stone-500 dark:text-stone-400">
          骑车、爬山、打球。一年到头，回头看看身体和双腿走过的路。
        </p>
      </header>

      {/* 数据卡 */}
      <section className="mt-16 grid gap-5 sm:grid-cols-2">
        {wrappedStats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-700/60 dark:bg-stone-900/60"
          >
            <p className="text-xs text-stone-400">{s.label}</p>
            <p className="mt-3 font-serif text-5xl text-forest-700 dark:text-forest-300">
              {s.value}
              {s.unit && (
                <span className="ml-1 font-sans text-sm text-stone-400">{s.unit}</span>
              )}
            </p>
            {typeof s.pct === "number" && (
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-forest-500 to-khaki-500"
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            )}
            {s.note && <p className="mt-3 text-xs leading-5 text-stone-400">{s.note}</p>}
          </div>
        ))}
      </section>

      {/* 时间线 */}
      <section className="mt-16">
        <h2 className="font-serif text-3xl">这一年，发生过</h2>
        <div className="mt-8 space-y-0">
          {wrappedHighlights.map((h, i) => (
            <div
              key={h.month}
              className="grid grid-cols-[3rem_2.5rem_1fr] items-start gap-4"
            >
              <span className="pt-1 font-mono text-xs text-stone-400">{h.month}</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-lg dark:border-stone-700">
                {h.emoji}
              </span>
              <div className={`pb-8 ${i === wrappedHighlights.length - 1 ? "" : "border-b border-stone-200 dark:border-stone-800"}`}>
                <h3 className="font-semibold">{h.title}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-500 dark:text-stone-400">
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 有趣事实 */}
      <section className="mt-16 rounded-2xl bg-ink px-6 py-10 text-paper sm:px-10">
        <h2 className="font-serif text-3xl">一些有趣的数字</h2>
        <ul className="mt-6 space-y-4">
          {wrappedFacts.map((f) => (
            <li key={f} className="flex items-start gap-3 leading-7 text-stone-300">
              <span className="mt-0.5 text-sand">✦</span>
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* 明年目标 */}
      <section className="mt-16">
        <h2 className="font-serif text-3xl">明年，继续</h2>
        <ul className="mt-6 space-y-3">
          {wrappedGoalsNext.map((g) => (
            <li
              key={g}
              className="flex items-start gap-3 rounded-xl border border-stone-200 px-5 py-3 text-sm leading-6 text-stone-700 dark:border-stone-700 dark:text-stone-300"
            >
              <span className="mt-0.5 font-bold text-rust">→</span>
              {g}
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-16 border-t border-stone-200 pt-6 text-center text-sm text-stone-400 dark:border-stone-800">
        想看看这一年具体去了哪？{" "}
        <Link href="/outdoor" className="font-medium text-forest-700 hover:underline dark:text-forest-300">
          去户外版块 →
        </Link>
      </footer>
    </div>
  );
}
