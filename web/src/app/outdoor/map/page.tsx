import type { Metadata } from "next";
import Link from "next/link";
import { routes } from "@/lib/outdoor";

export const metadata: Metadata = {
  title: "旅程地图",
  description: "把走过的路线标记在一张图上。",
};

/** 广州周边路线的示意坐标（0-100 的抽象画布，非真实经纬度） */
const routePoints: Record<string, { x: number; y: number }> = {
  "dafushan-loop": { x: 30, y: 78 },
  "nankun-climb": { x: 88, y: 24 },
  "huofeng-traverse": { x: 52, y: 50 },
  "baiyun-classic": { x: 22, y: 34 },
};

const routeTypeColor: Record<string, string> = {
  骑行: "bg-forest-100 text-forest-700 dark:bg-forest-500/15 dark:text-forest-300",
  徒步: "bg-khaki-100 text-khaki-700 dark:bg-khaki-500/15 dark:text-khaki-300",
};

export default function OutdoorMapPage() {
  return (
    <div className="container-page pb-24 pt-12 sm:pt-20">
      <p className="section-title">Map</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">旅程地图</h1>
      <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
        广州周边的山和路，用脚和车轮丈量过的地方。点标记看详情。
      </p>

      {/* 示意图（纯装饰，抽象广州地势） */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-b from-khaki-100/40 to-forest-50 dark:border-stone-700/60 dark:from-stone-900 dark:to-forest-900/30">
        <svg viewBox="0 0 100 80" className="block w-full" role="img" aria-label="广州周边路线示意图">
          <path d="M0 62 Q25 50 50 58 T100 54 L100 80 L0 80 Z" fill="#cdd8c9" opacity="0.6" />
          <path d="M0 72 Q30 64 60 70 T100 68 L100 80 L0 80 Z" fill="#a9bda3" opacity="0.7" />
          {/* 河流 */}
          <path d="M0 40 Q30 35 55 42 T100 36" fill="none" stroke="#80997b" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
          {routes.map((r) => {
            const p = routePoints[r.slug] ?? { x: 50, y: 40 };
            return (
              <g key={r.slug}>
                <circle cx={p.x} cy={p.y} r="2.2" fill="#a54b2a" />
                <circle cx={p.x} cy={p.y} r="4" fill="none" stroke="#a54b2a" strokeWidth="0.4" opacity="0.4" />
                <text
                  x={p.x + 3}
                  y={p.y - 2}
                  fontSize="3"
                  fill="#3a4f3a"
                  fontFamily="sans-serif"
                >
                  {r.name}
                </text>
              </g>
            );
          })}
          <text x="2" y="5" fontSize="3" fill="#80997b" fontFamily="monospace">GUANGZHOU · 示意</text>
        </svg>
      </div>

      {/* 路线列表 */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {routes.map((r) => {
          const p = routePoints[r.slug] ?? { x: 50, y: 40 };
          return (
            <Link
              key={r.slug}
              href={`/outdoor/${r.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-stone-700/60 dark:bg-stone-900/60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest-600 to-forest-800 text-base text-white">
                {r.type === "骑行" ? "🚴" : "🥾"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-bold">{r.name}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${routeTypeColor[r.type] ?? ""}`}>
                    {r.type}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-stone-400">
                  {r.region} · {r.distance} · {r.duration}
                </p>
              </div>
              <span className="font-mono text-[10px] text-stone-400">
                {Math.round(p.x * 1.13 + 110)}°E
                <br />
                {Math.round((80 - p.y) * 0.54 + 22)}°N
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
