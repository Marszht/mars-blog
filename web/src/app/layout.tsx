import type { Metadata } from "next";
import { site } from "@/lib/site";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BaiduAnalytics } from "@/components/BaiduAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: `https://${site.domain}/`,
    siteName: site.name,
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary",
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
};

// 百度统计开关：在 web/.env.local 配置 NEXT_PUBLIC_BAIDU_ANALYTICS_ID=你的统计ID
const analyticsId = process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-paper text-stone-800 antialiased transition-colors dark:bg-night dark:text-stone-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
        {analyticsId ? <BaiduAnalytics id={analyticsId} /> : null}
      </body>
    </html>
  );
}
