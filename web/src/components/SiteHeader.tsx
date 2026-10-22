"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const panelId = useId();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: PointerEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-300/80 bg-paper/85 backdrop-blur-md dark:border-stone-800 dark:bg-night/85">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm"
      >
        跳到正文
      </a>
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="group flex min-h-11 items-center gap-3">
          <span className="font-serif text-xl font-bold tracking-tight">{site.shortName}</span>
          <span className="h-4 w-px bg-rust" />
          <span className="font-mono text-[9px] leading-tight tracking-widest text-stone-400">CODE<br />&amp; MOTION</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-2 py-3 text-xs font-medium transition ${
                isActive(item.href)
                  ? "text-rust after:absolute after:inset-x-2 after:bottom-1 after:h-px after:bg-rust"
                  : "text-stone-600 hover:text-rust dark:text-stone-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden" ref={menuRef}>
          <ThemeToggle />
          <button
            type="button"
            id={buttonId}
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-600 dark:border-stone-700 dark:text-stone-300"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          {open && (
            <nav
              id={panelId}
              aria-labelledby={buttonId}
              className="absolute right-5 top-16 w-44 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl dark:border-stone-700 dark:bg-stone-900"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-forest-50 text-forest-700 dark:bg-forest-500/15 dark:text-forest-300"
                      : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
