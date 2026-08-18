export const site = {
  name: "Mars MZ",
  shortName: "MARS",
  domain: "marsmz.top",
  title: "Mars MZ · 程序员 & 户外爱好者",
  tagline: "写代码 · 骑行徒步 · 打羽毛球",
  description:
    "Mars MZ 的个人网站：一名热爱技术的程序员，也是户外与运动爱好者。记录技术思考、骑行徒步、羽毛球训练与日常足迹。",
  email: "hi@marsmz.top",
  github: "https://github.com/Marszht",
  location: "广州",
  keywords: [
    "程序员",
    "全栈",
    "户外",
    "骑行",
    "徒步",
    "羽毛球",
    "个人网站",
    "Mars MZ",
    "marsmz",
  ],
} as const;

export const nav = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于" },
  { href: "/outdoor", label: "户外" },
  { href: "/footprints", label: "足迹" },
  { href: "/blog", label: "博客" },
  { href: "/projects", label: "项目" },
  { href: "/contact", label: "联系" },
] as const;
