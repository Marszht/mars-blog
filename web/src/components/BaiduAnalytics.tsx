"use client";

import { useEffect } from "react";

/**
 * 百度统计：通过 NEXT_PUBLIC_BAIDU_ANALYTICS_ID 环境变量开启。
 * 未配置该变量时不加载任何脚本，纯本地/无统计运行。
 */
export function BaiduAnalytics({ id }: { id: string }) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("baidu-hm")) return;

    const script = document.createElement("script");
    script.id = "baidu-hm";
    script.async = true;
    script.src = `https://hm.baidu.com/hm.js?${id}`;
    document.head.appendChild(script);
  }, [id]);

  return null;
}
