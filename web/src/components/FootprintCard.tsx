import Link from "next/link";
import { site } from "@/lib/site";
import type { Footprint } from "@/lib/footprints";
import { formatDate } from "@/lib/date";
import { PhotoGrid } from "@/components/PhotoGrid";

function ImageGrid({ images }: { images: string[] }) {
  return <PhotoGrid images={images} altPrefix="动态配图" />;
}

export function FootprintCard({ item }: { item: Footprint }) {
  return (
    <article className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-forest-600 to-forest-800 text-base font-bold text-khaki-100 shadow-sm">
          {site.shortName[0]}
        </div>
        <span className="mt-2 w-px flex-1 bg-stone-200 dark:bg-stone-700" />
      </div>

      <div className="flex-1 pb-8">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-stone-800 dark:text-stone-100">
            {site.name}
          </span>
          <time className="text-xs text-stone-400 dark:text-stone-500" dateTime={item.date}>
            {formatDate(item.date)}
          </time>
        </div>

        <p className="mt-2 whitespace-pre-line text-[15px] leading-7 text-stone-700 dark:text-stone-300">
          {item.content}
        </p>

        <ImageGrid images={item.images} />

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {item.location && (
            <span className="inline-flex items-center gap-1 text-stone-500 dark:text-stone-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {item.location}
            </span>
          )}
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-forest-50 px-2 py-0.5 font-medium text-forest-700 dark:bg-forest-500/10 dark:text-forest-300"
            >
              #{t}
            </span>
          ))}
        </div>

        {item.link && (
          <Link
            href={item.link}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-forest-700 transition hover:border-forest-300 hover:bg-forest-50 dark:border-stone-700 dark:bg-stone-900 dark:text-forest-300 dark:hover:bg-stone-800"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
              <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
            </svg>
            {item.linkLabel ?? item.link}
            <span aria-hidden>→</span>
          </Link>
        )}

        <Link
          href={`/contact?ref=footprint:${item.slug}`}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-stone-400 transition hover:text-forest-600 dark:text-stone-500 dark:hover:text-forest-300"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          评论（邮件）
        </Link>
      </div>
    </article>
  );
}
