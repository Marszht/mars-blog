import type { Metadata } from "next";
import Link from "next/link";
import { activityLogs } from "@/lib/outdoor";
import { getAllFootprints } from "@/lib/footprints";
import { formatShortDate } from "@/lib/date";

export const metadata: Metadata = {
  title: "时间线",
  description: "户外运动日志与足迹动态合并成的一条时间线。",
};

type TimelineItem =
  | {
      kind: "log";
      date: string;
      sport: string;
      title: string;
      detail: string;
    }
  | {
      kind: "footprint";
      date: string;
      title: string;
      detail: string;
      slug: string;
    };

const sportEmoji: Record<string, string> = {
  骑行: "🚴",
  徒步: "🥾",
  羽毛球: "🏸",
  训练: "🏋️",
};

export default function TimelinePage() {
  const logs: TimelineItem[] = activityLogs.map((l) => ({
    kind: "log",
    date: l.date,
    sport: l.sport,
    title: l.title,
    detail: l.detail,
  }));
  const footprints: TimelineItem[] = getAllFootprints().map((f) => ({
    kind: "footprint",
    date: f.date,
    title: "足迹动态",
    detail: f.content,
    slug: f.slug,
  }));

  const items = [...logs, ...footprints]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 40);

  return (
    <div className="container-page pb-24 pt-12 sm:pt-20">
      <p className="section-title">Timeline</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">时间线</h1>
      <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
        户外日志和足迹动态按时间混排，看看最近都去了哪、做了什么。
      </p>

      <ol className="relative mt-12 space-y-8 border-l border-stone-200 pl-8 dark:border-stone-800">
        {items.map((item, i) => {
          const key = `${item.date}-${i}`;
          return (
            <li key={key} className="relative">
              <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full border-2 border-paper bg-forest-500 dark:border-night" />
              <div className="flex flex-wrap items-baseline gap-x-3">
                <time className="font-mono text-xs text-stone-400" dateTime={item.date}>
                  {formatShortDate(item.date)}
                </time>
                {item.kind === "log" ? (
                  <span className="rounded-full bg-forest-50 px-2 py-0.5 text-xs text-forest-700 dark:bg-forest-500/15 dark:text-forest-300">
                    {sportEmoji[item.sport] ?? "🏔️"} {item.sport}
                  </span>
                ) : (
                  <span className="rounded-full bg-khaki-100 px-2 py-0.5 text-xs text-khaki-700 dark:bg-khaki-500/15 dark:text-khaki-300">
                    足迹
                  </span>
                )}
              </div>
              {item.kind === "footprint" ? (
                <Link
                  href="/footprints"
                  className="mt-1 block font-semibold hover:text-forest-700 dark:hover:text-forest-300"
                >
                  {item.detail.length > 80 ? `${item.detail.slice(0, 80)}…` : item.detail}
                </Link>
              ) : (
                <>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-500 dark:text-stone-400">
                    {item.detail}
                  </p>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
