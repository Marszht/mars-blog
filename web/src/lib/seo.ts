import { site } from "@/lib/site";

export const siteUrl = `https://${site.domain}`;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const defaultOgImage = "/og.svg";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: siteUrl,
    email: site.email,
    jobTitle: "全栈工程师",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
      addressCountry: "CN",
    },
    sameAs: [site.github],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: siteUrl,
    description: site.description,
    inLanguage: "zh-CN",
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: absoluteUrl(`/blog/${post.slug}`),
    inLanguage: "zh-CN",
    keywords: post.tags.join(", "),
    author: {
      "@type": "Person",
      name: site.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: site.name,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}
