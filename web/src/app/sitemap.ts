import type { MetadataRoute } from "next";
import { getAllPosts, getAllSeries } from "@/lib/posts";
import { getAllFootprints } from "@/lib/footprints";
import { routes } from "@/lib/outdoor";
import { parseDate } from "@/lib/date";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const footprints = getAllFootprints();
  const latestPost = posts[0]?.date;
  const latestFootprint = footprints[0]?.date;

  const staticRoutes: { path: string; lastModified?: string }[] = [
    { path: "", lastModified: latestPost },
    { path: "/about" },
    { path: "/outdoor" },
    { path: "/outdoor/wrapped" },
    { path: "/outdoor/map" },
    { path: "/outdoor/gear" },
    { path: "/footprints", lastModified: latestFootprint },
    { path: "/timeline" },
    { path: "/blog", lastModified: latestPost },
    { path: "/blog/series" },
    { path: "/now" },
    { path: "/projects" },
    { path: "/contact" },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${siteUrl}${r.path}`,
      lastModified: parseDate(r.lastModified ?? "") ?? undefined,
    })),
    ...routes.map((r) => ({
      url: `${siteUrl}/outdoor/${r.slug}`,
    })),
    ...getAllSeries().map((s) => ({
      url: `${siteUrl}/blog/series/${s.key}`,
    })),
    ...posts.flatMap((p) => {
      const d = parseDate(p.date);
      if (!d) return [];
      return [{ url: `${siteUrl}/blog/${p.slug}`, lastModified: d }];
    }),
  ];
}
