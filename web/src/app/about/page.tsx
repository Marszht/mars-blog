import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "关于我" };

const skills = [
  { name: "TypeScript / JavaScript", level: 90 },
  { name: "React / Next.js", level: 88 },
  { name: "Node.js / 后端工程", level: 82 },
  { name: "数据库 / SQL", level: 75 },
  { name: "Docker / 部署运维", level: 70 },
];

const timeline = [
  {
    period: "2019",
    title: "开始写代码",
    desc: "从第一行 Hello World 到真正理解编程的乐趣。",
  },
  {
    period: "2021",
    title: "入坑全栈",
    desc: "前后端通吃，独立完成过多个小项目。",
  },
  {
    period: "2023",
    title: "开始认真运动",
    desc: "羽毛球先入坑，后来爱上骑行和徒步，周末开始往山里和路上跑。",
  },
  {
    period: "2026",
    title: "建站 marsmz.top",
    desc: "从零搭起自己的个人网站，记录技术与生活。",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <p className="section-title">About</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">关于我</h1>
      <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
        你好，我是 {site.name}，一名在 {site.location} 的全栈程序员。白天和代码打交道，
        周末去骑行、徒步、打羽毛球。这个网站是我的数字家园：写技术博客、记录运动与
        足迹、展示做过的项目——希望能在这里遇见有趣的你。
      </p>

      {/* 技能 */}
      <section className="mt-12">
        <h2 className="section-title">技能栈</h2>
        <div className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {skills.map((s) => (
            <div key={s.name}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-stone-400">{s.level}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-forest-600 to-forest-700"
                  style={{ width: `${s.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 时间线 */}
      <section className="mt-14">
        <h2 className="section-title">时间线</h2>
        <div className="mt-5 space-y-0">
          {timeline.map((t, i) => (
            <div key={t.title} className="relative flex gap-5 pb-8 last:pb-0">
              {i < timeline.length - 1 && (
                <span className="absolute left-[7px] top-5 h-full w-px bg-stone-200 dark:bg-stone-700" />
              )}
              <span className="relative mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-forest-600 bg-white dark:bg-stone-950" />
              <div>
                <p className="text-sm font-semibold text-forest-700">{t.period}</p>
                <h3 className="mt-0.5 font-bold">{t.title}</h3>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 座右铭 */}
      <section className="mt-14 rounded-2xl border border-khaki-300/60 bg-gradient-to-br from-khaki-100/60 to-forest-50 p-8 dark:border-forest-600/20 dark:from-khaki-500/10 dark:to-forest-500/10">
        <p className="text-lg font-semibold text-stone-800 dark:text-stone-100">
          “让代码有温度，让生活有节奏。”
        </p>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          写干净的代码，打尽兴的球，过认真的生活。
        </p>
      </section>
    </div>
  );
}
