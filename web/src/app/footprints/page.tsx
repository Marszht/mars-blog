import type { Metadata } from "next";
import { getAllFootprints } from "@/lib/footprints";
import { FootprintCard } from "@/components/FootprintCard";

export const metadata: Metadata = { title: "足迹" };

export default function FootprintsPage() {
  const footprints = getAllFootprints();

  return (
    <div className="container-page py-14 sm:py-20">
      <p className="section-title">Footprints</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">足迹</h1>
      <p className="mt-4 max-w-2xl leading-7 text-stone-600 dark:text-stone-400">
        像朋友圈一样的生活记录：骑行、徒步、羽毛球的日常瞬间。每条动态用一个 Markdown
        文件维护，配图会自动排成九宫格。共 {footprints.length} 条。
      </p>

      <div className="mx-auto mt-10 max-w-2xl">
        {footprints.map((item) => (
          <FootprintCard key={item.slug} item={item} />
        ))}
        <p className="pb-4 text-center text-xs text-stone-400 dark:text-stone-500">
          —— 没有更多了 ——
        </p>
      </div>
    </div>
  );
}
