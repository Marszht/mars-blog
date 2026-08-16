import type { Metadata } from "next";
import { projects } from "@/lib/projects";

export const metadata: Metadata = { title: "项目" };

export default function ProjectsPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <p className="section-title">Projects</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">项目作品集</h1>
      <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
        一些自己做过的项目和正在折腾的东西，更多代码在 GitHub 上。
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className="card group flex flex-col p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold group-hover:text-forest-700">
                {p.name}
              </h2>
              <span className="text-xs text-stone-400">{p.year}</span>
            </div>
            <p className="mt-2 flex-1 text-sm leading-6 text-stone-600 dark:text-stone-400">
              {p.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
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

      <div className="mt-10 rounded-2xl border border-stone-200 bg-stone-50 p-6 dark:border-stone-800 dark:bg-stone-900/50">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          想了解更多或一起搞点事情？欢迎到 GitHub 看看，或者直接
          <a href="/contact" className="mx-1 font-medium text-forest-700 hover:underline">
            联系我
          </a>
          。
        </p>
      </div>
    </div>
  );
}
