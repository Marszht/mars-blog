import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "健身训练",
  description: "Mars 的健身训练记录板块，正在准备中。",
};

export default function FitnessPage() {
  return (
    <div className="container-page pb-24 pt-12 sm:pt-20">
      <header className="editorial-rule grid gap-10 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="eyebrow">TRAINING LOG / SOON</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl">
            练得更强，<br /><i className="font-normal text-rust">也活得更稳。</i>
          </h1>
        </div>
        <p className="max-w-md text-base leading-8 text-stone-600 dark:text-stone-400">
          这里的内容正在重新整理，之后的训练记录会以更真实、更有数据的方式呈现。
        </p>
      </header>

      <section className="flex min-h-[36vh] flex-col items-center justify-center py-16 text-center">
        <span className="text-6xl" aria-hidden>🏋️</span>
        <h2 className="mt-6 font-serif text-3xl">训练板块施工中</h2>
        <p className="mt-4 max-w-md leading-7 text-stone-500 dark:text-stone-400">
          之前的训练计划和三大项数据是早期占位内容，暂时先撤下。
          等积累了一段真实的训练数据，会重新开张。
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/outdoor"
            className="inline-flex min-h-11 items-center rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            先看看户外 →
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center border-b border-rust text-sm font-semibold text-rust"
          >
            或者聊聊训练
          </a>
        </div>
      </section>
    </div>
  );
}
