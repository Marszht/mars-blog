import type { Metadata } from "next";
import { nowUpdated, nowReading, nowListening, nowUsing } from "@/lib/now";

export const metadata: Metadata = {
  title: "现在",
  description: "最近在读、在听、在用，以及此刻的状态。",
};

function Section({
  title,
  items,
}: {
  title: string;
  items: { emoji: string; title: string; meta: string; note?: string }[];
}) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-700/60 dark:bg-stone-900/60"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-xl dark:bg-stone-800">
              {item.emoji}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="font-semibold">{item.title}</h3>
                <span className="text-xs text-stone-400">{item.meta}</span>
              </div>
              {item.note && (
                <p className="mt-1 text-sm leading-6 text-stone-500 dark:text-stone-400">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function NowPage() {
  return (
    <div className="container-page pb-24 pt-12 sm:pt-20">
      <p className="section-title">NOW / {nowUpdated}</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">现在</h1>
      <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
        灵感来自 Derek Sivers 的 /now 运动——「我现在在做什么」。不定期更新。
      </p>

      <Section title="在读" items={nowReading} />
      <Section title="在听" items={nowListening} />
      <Section title="在用" items={nowUsing} />
    </div>
  );
}
