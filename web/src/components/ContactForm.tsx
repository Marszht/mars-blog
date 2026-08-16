"use client";

import { site } from "@/lib/site";

export function ContactForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent(
      `[marsmz.top] ${fd.get("name") || "访客"} 的留言`,
    );
    const body = encodeURIComponent(
      `来自 ${fd.get("name") || "匿名"}（${fd.get("email") || "未留邮箱"}）：\n\n${fd.get("message")}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  const inputCls =
    "rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-forest-500 focus:ring-2 focus:ring-forest-200 dark:border-stone-700 dark:bg-stone-800 dark:focus:ring-forest-500/20";

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="你的称呼"
          className={inputCls}
        />
        <input
          name="email"
          type="email"
          placeholder="你的邮箱（选填）"
          className={inputCls}
        />
      </div>
      <textarea
        name="message"
        required
        rows={5}
        placeholder="想说的话..."
        className={`w-full resize-none ${inputCls}`}
      />
      <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-forest-800/20 transition hover:opacity-90"
      >
        发送邮件 →
      </button>
    </form>
  );
}
