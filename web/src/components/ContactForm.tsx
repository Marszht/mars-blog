"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export function ContactForm() {
  const [copied, setCopied] = useState(false);

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

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
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
          autoComplete="name"
          className={inputCls}
        />
        <input
          name="email"
          type="email"
          placeholder="你的邮箱（选填）"
          autoComplete="email"
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
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-forest-800/20 transition hover:opacity-90"
        >
          发送邮件 →
        </button>
        <button
          type="button"
          onClick={copyEmail}
          className="rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-600 transition hover:border-forest-400 hover:text-forest-700 dark:border-stone-700 dark:text-stone-300"
        >
          {copied ? "已复制邮箱" : `复制 ${site.email}`}
        </button>
      </div>
      <p className="text-xs text-stone-400">
        如果没有打开邮件客户端，直接把内容发到 {site.email} 即可。
      </p>
    </form>
  );
}
