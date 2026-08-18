export interface Project {
  name: string;
  description: string;
  tech: string[];
  href: string;
  featured?: boolean;
  year: string;
}

export const projects: Project[] = [
  {
    name: "拼豆图纸生成器 Perler",
    description:
      "上传图片一键生成拼豆底稿：支持 MARD 221 色色卡、CIEDE2000 色差匹配、三种抖动算法、AI 本地抠图去背景，自动统计用豆数量并下载图纸。在线使用：perler.marsmz.top（源码 GitHub: Marszht/preler-webapp）",
    tech: ["Node.js", "Express", "Jimp", "AI 抠图"],
    href: "https://perler.marsmz.top",
    featured: true,
    year: "2026",
  },
  {
    name: "Mars Site",
    description:
      "本站：基于 Next.js + Tailwind CSS 的个人网站，含户外运动、足迹动态流与博客，Docker + Caddy 一键部署，全站免费 HTTPS。",
    tech: ["Next.js", "Tailwind CSS", "TypeScript", "Docker"],
    href: "https://github.com/Marszht/mars-site",
    featured: true,
    year: "2026",
  },
  {
    name: "dsh-web-ui",
    description:
      "一个面向开发者的 Web UI 界面库/工具项目，正在持续迭代中。",
    tech: ["TypeScript", "React", "Web UI"],
    href: "https://github.com/Marszht/dsh-web-ui",
    featured: true,
    year: "2026",
  },
  {
    name: "个人数据看板",
    description:
      "汇总天气、行情与资讯的每日早报小工具，定时推送到企业微信，代码量不大但很实用。",
    tech: ["Node.js", "定时任务", "企业微信 API"],
    href: "https://github.com/Marszht",
    year: "2026",
  },
  {
    name: "户外足迹记录",
    description:
      "记录骑行里程、徒步线路与运动日志的小应用，统计里程、爬升与进步曲线，用数据见证每一次出发。",
    tech: ["SQLite", "数据可视化"],
    href: "https://github.com/Marszht",
    year: "2026",
  },
];
