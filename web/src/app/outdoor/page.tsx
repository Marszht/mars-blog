import type { Metadata } from "next";
import {
  sports,
  routes,
  activityLogs,
  gearList,
  outdoorGoals,
} from "@/lib/outdoor";

export const metadata: Metadata = { title: "户外运动" };

const routeTypeColor: Record<string, string> = {
  骑行: "bg-forest-100 text-forest-700 dark:bg-forest-500/15 dark:text-forest-300",
  徒步: "bg-khaki-100 text-khaki-700 dark:bg-khaki-500/15 dark:text-khaki-300",
};

export default function OutdoorPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-forest-50 via-paper to-khaki-100/60 p-8 dark:border-stone-700/60 dark:from-forest-900/40 dark:via-stone-900 dark:to-khaki-700/10 sm:p-12">
        <span className="absolute -right-6 -top-6 select-none text-[120px] opacity-[0.08] sm:text-[170px]">⛰️</span>
        <p className="section-title">Outdoor</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          户外运动 <span className="text-gradient">到自然里去</span>
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-300">
          工作是谋生，户外是生活。骑行、徒步、羽毛球——把身体交给风、山路和球场，
          是我给自己最好的充电方式。这里记录我的运动数据、路线和每一次出发。
        </p>
      </div>

      {/* 三大运动 */}
      <section className="mt-14">
        <h2 className="section-title">三大运动</h2>
        <div className="mt-5 space-y-6">
          {sports.map((s) => (
            <div key={s.id} className="outdoor-card">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-2xl dark:bg-forest-500/10">
                  {s.emoji}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{s.name}</h3>
                  <p className="text-sm text-stone-400 dark:text-stone-500">{s.tagline}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-400">
                {s.desc}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {s.stats.map((st) => (
                  <div
                    key={st.label}
                    className="rounded-xl bg-stone-50 px-3 py-2.5 text-center dark:bg-stone-800/70"
                  >
                    <p className="text-lg font-extrabold text-forest-700 dark:text-forest-300">
                      {st.value}
                      {st.unit && (
                        <span className="ml-0.5 text-xs font-medium text-stone-400">{st.unit}</span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 路线 */}
      <section className="mt-14">
        <h2 className="section-title">经典路线</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {routes.map((r) => (
            <div key={r.name} className="outdoor-card">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    routeTypeColor[r.type] ?? "bg-stone-100 text-stone-600"
                  }`}
                >
                  {r.type}
                </span>
                {r.featured && (
                  <span className="text-xs text-khaki-700 dark:text-khaki-300">★ 推荐</span>
                )}
              </div>
              <h3 className="mt-3 text-lg font-bold">{r.name}</h3>
              <p className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">{r.region}</p>
              <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                {r.desc}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-500 dark:text-stone-400">
                <span>🚴 {r.distance}</span>
                <span>⏱ {r.duration}</span>
                {r.elevation && <span>⛰ {r.elevation}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 运动日志 */}
      <section className="mt-14">
        <h2 className="section-title">运动日志</h2>
        <div className="mt-5 space-y-4">
          {activityLogs.map((log) => (
            <article key={log.date} className="outdoor-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-forest-700 dark:text-forest-300">
                  {log.date}
                </span>
                {log.tag && (
                  <span className="rounded-full bg-forest-50 px-2 py-0.5 text-xs text-forest-700 dark:bg-forest-500/15 dark:text-forest-300">
                    {log.tag}
                  </span>
                )}
                <h3 className="font-bold">{log.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                {log.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 装备 + 目标 */}
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="section-title">我的装备</h2>
          <div className="mt-5 space-y-4">
            {gearList.map((g) => (
              <div key={g.name} className="outdoor-card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-xl dark:bg-forest-500/10">
                    {g.emoji}
                  </span>
                  <h3 className="font-bold">{g.name}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">立个 flag 🎯</h2>
          <ul className="mt-5 space-y-3 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-700/60 dark:bg-stone-900/60">
            {outdoorGoals.map((g) => (
              <li
                key={g}
                className="flex items-start gap-2 text-sm leading-6 text-stone-700 dark:text-stone-300"
              >
                <span className="mt-0.5 font-bold text-forest-600 dark:text-forest-300">✓</span>
                {g}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-stone-400 dark:text-stone-500">
            日常的动态都会发在
            <a href="/footprints" className="mx-1 font-medium text-forest-600 hover:underline dark:text-forest-300">
              足迹
            </a>
            里，欢迎围观 👀
          </p>
        </section>
      </div>
    </div>
  );
}
