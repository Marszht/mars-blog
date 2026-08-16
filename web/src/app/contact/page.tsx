import type { Metadata } from "next";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "联系我" };

export default function ContactPage() {
  const contactCards = [
    {
      emoji: "📧",
      title: "邮箱",
      value: site.email,
      href: `mailto:${site.email}`,
      desc: "工作交流、技术探讨，优先回这个",
    },
    {
      emoji: "💬",
      title: "GitHub",
      value: "github.com/zhu1090093659",
      href: site.github,
      desc: "看看代码，一起维护开源项目",
    },
    {
      emoji: "🏸",
      title: "约球",
      value: site.location,
      href: `mailto:${site.email}?subject=${encodeURIComponent("约球！")}`,
      desc: "广州球友，欢迎约一场双打",
    },
  ];

  return (
    <div className="container-page py-14 sm:py-20">
      <p className="section-title">Contact</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">联系我</h1>
      <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
        不管是技术问题、合作机会，还是想约一场球，都很欢迎！直接发邮件最快，
        或者用下面的表单——它会帮你生成一封邮件。
      </p>

      {/* 联系卡片 */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {contactCards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="card group p-6"
          >
            <span className="text-3xl">{c.emoji}</span>
            <h2 className="mt-3 font-bold group-hover:text-forest-700">{c.title}</h2>
            <p className="mt-1 text-sm font-medium text-forest-700">{c.value}</p>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{c.desc}</p>
          </a>
        ))}
      </div>

      {/* 留言表单 */}
      <section className="mt-12 rounded-3xl border border-stone-200 bg-stone-50 p-6 dark:border-stone-800 dark:bg-stone-900/50 sm:p-10">
        <h2 className="text-xl font-bold">留个言 👋</h2>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          填好后会直接打开你的邮件客户端发送到 {site.email}。
        </p>
        <ContactForm />
      </section>
    </div>
  );
}
