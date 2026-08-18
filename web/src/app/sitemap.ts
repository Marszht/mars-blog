import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${site.domain}`;
  const staticRoutes = [
    "",
    "/about",
    "/outdoor",
    "/footprints",
    "/blog",
    "/projects",
    "/contact",
  ];
  const posts = getAllPosts()
    // 防御：过滤掉日期为空或无效的文章，避免 new Date(...).toISOString() 抛 RangeError
    .filter((p) => {
      if (!p.date) return false;
      const d = new Date(p.date);
      return !Number.isNaN(d.getTime());
    })
    .map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.date),
    }));

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r}`,
      lastModified: new Date(),
    })),
    ...posts,
  ];
}
