import Link from "next/link";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-stone-200/70 dark:border-stone-800">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-sm text-stone-500 dark:text-stone-400 sm:flex-row">
        <p>
          © {year} {site.name} ·{" "}
          <span className="font-medium text-stone-700 dark:text-stone-200">
            {site.domain}
          </span>
        </p>
        <nav className="flex flex-wrap items-center gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-forest-700 dark:hover:text-forest-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs">Powered by Next.js · 山在那里，我这就去 ⛰️</p>
      </div>
    </footer>
  );
}
