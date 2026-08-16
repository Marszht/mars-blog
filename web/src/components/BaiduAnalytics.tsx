"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    _hmt?: unknown[];
  }
}

/**
 * 百度统计：通过 NEXT_PUBLIC_BAIDU_ANALYTICS_ID 环境变量开启。
 * 未配置该变量时不加载任何脚本，纯本地/无统计运行。
 *
 * id 即百度统计代码里 hm.js?后面的那串 32 位字符（统计 ID / siteId key）。
 */
export function BaiduAnalytics({ id }: { id: string }) {
  useEffect(() => {
    if (!id) return;
    if (typeof document === "undefined") return;
    if (document.getElementById("baidu-hm")) return;

    // 百度统计要求先声明 _hmt，再异步插入 hm.js
    window._hmt = window._hmt || [];

    const script = document.createElement("script");
    script.id = "baidu-hm";
    script.async = true;
    script.src = "https://hm.baidu.com/hm.js?" + encodeURIComponent(id);
    document.head.appendChild(script);
  }, [id]);

  return null;
}
