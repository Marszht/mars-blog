import type { Metadata } from "next";
import Link from "next/link";
import { gearList } from "@/lib/outdoor";

export const metadata: Metadata = {
  title: "装备清单",
  description: "骑行、徒步与羽毛球装备的使用记录与真实评价。",
};

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`评分 ${value}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "text-rust" : "text-stone-200 dark:text-stone-700"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function GearPage() {
  return (
    <div className="container-page pb-24 pt-12 sm:pt-20">
      <p className="section-title">Gear</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">装备清单</h1>
      <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
        骑行、徒步、羽毛球的家伙什。价格和感受都真实记录，帮自己复盘，也供同好参考。
      </p>

      <div className="mt-10 space-y-6">
        {gearList.map((g) => (
          <article
            key={g.name}
            className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-700/60 dark:bg-stone-900/60"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-2xl dark:bg-forest-500/10">
                  {g.emoji}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold">{g.name}</h2>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                      {g.category}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-stone-400">
                    <Rating value={g.rating ?? 0} />
                    {g.price && <span>{g.price}</span>}
                    {g.bought && <span>入手 {g.bought}</span>}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-stone-600 dark:text-stone-400">{g.desc}</p>

            {(g.pros?.length || g.cons?.length) && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {g.pros && g.pros.length > 0 && (
                  <ul className="rounded-xl bg-forest-50/60 p-3 text-sm dark:bg-forest-500/10">
                    {g.pros.map((p) => (
                      <li key={p} className="flex items-start gap-2 leading-6 text-forest-800 dark:text-forest-300">
                        <span className="mt-0.5">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                {g.cons && g.cons.length > 0 && (
                  <ul className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-stone-800/60">
                    {g.cons.map((c) => (
                      <li key={c} className="flex items-start gap-2 leading-6 text-stone-500 dark:text-stone-400">
                        <span className="mt-0.5">✗</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-stone-400">
        想聊聊装备或约一次出行？{" "}
        <Link href="/contact" className="font-medium text-forest-700 hover:underline dark:text-forest-300">
          联系我 →
        </Link>
      </p>
    </div>
  );
}
