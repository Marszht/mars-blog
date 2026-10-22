# ⛰️ Mars Site — 个人网站

基于 **Next.js + Tailwind CSS** 的个人网站，部署在阿里云服务器，域名 **marsmz.top**，全站免费 HTTPS（Let's Encrypt，acme.sh 自动续期 + nginx 反代）。

## 功能板块

| 路径 | 板块 | 说明 |
| --- | --- | --- |
| `/` | 首页 | 个人简介、能力标签、最近足迹、最近博客、精选项目 |
| `/about` | 关于我 | 技能栈、时间线、座右铭 |
| `/outdoor` | 户外运动 | 骑行 / 徒步 / 羽毛球三大运动、经典路线（详情页 + 九宫格图）、运动日志、装备与目标 |
| `/outdoor/wrapped` | 户外年度报告 | 一年的里程 / 爬升 / 线路 / 打球汇总，年底更新 |
| `/outdoor/map` | 旅程地图 | 广州周边路线示意地图，点击进详情 |
| `/outdoor/gear` | 装备清单 | 骑行 / 徒步 / 羽毛球装备的价格、评分与真实评价 |
| `/footprints` | 足迹 | 朋友圈式动态流：短文字 + 图片九宫格 + 地点 + 标签，可关联博客/路线 |
| `/timeline` | 时间线 | 户外日志与足迹按日期混排的一条时间线 |
| `/blog` | 技术博客 | Markdown 驱动的文章列表 + 详情页（SEO 友好），支持搜索 / 标签 / 系列 |
| `/blog/series` | 文章系列 | 同主题文章归类成系列（frontmatter 加 `series` / `seriesTitle`） |
| `/now` | 现在 | 最近在读 / 在听 / 在用（灵感来自 /now 运动） |
| `/projects` | 项目作品集 | 项目卡片网格 |
| `/contact` | 联系我 | 联系方式 + 留言表单（唤起邮件） |

## 项目结构

```
mars-site/
├── web/                     # Next.js 应用
│   ├── src/app/             # 页面与路由
│   │   ├── page.tsx         # 首页
│   │   ├── about/           # 关于我
│   │   ├── outdoor/         # 户外运动
│   │   ├── footprints/      # 足迹（朋友圈式动态流）
│   │   ├── blog/            # 博客
│   │   ├── projects/        # 项目
│   │   └── contact/         # 联系
│   ├── src/components/      # 通用组件
│   ├── src/lib/             # 数据与工具（site / outdoor / footprints / posts / projects）
│   ├── src/content/posts/       # 博客 Markdown 文章
│   ├── src/content/footprints/  # 足迹动态 Markdown 文件
│   ├── public/images/blog/       # 博客配图（旧文章图片已自托管，见迁移章节）
│   └── public/images/footprints/ # 足迹配图（占位 SVG，可替换为真实照片）
└── deploy/                  # 部署配置
    ├── Dockerfile                  # 多阶段构建（standalone 精简产物）
    ├── docker-compose.server.yml   # 阿里云服务器用（复用现有 nginx，不带 Caddy）
    └── marsmz.top.conf             # 站点的 nginx 反代配置
```

## 本地开发

```bash
cd web
npm install
npm run dev
# 打开 http://localhost:3000
```

## 改内容

- **个人信息 / 导航 / 邮箱**：改 `web/src/lib/site.ts`
- **户外数据（运动/路线/日志/装备/目标）**：改 `web/src/lib/outdoor.ts`
  - 每条路线有 `slug`，自动生成 `/outdoor/<slug>` 详情页（正文、九宫格图片、实用贴士、上下篇）
  - 配图放 `web/public/images/outdoor/`，建议**正方形 1:1（800×800）**用于九宫格、单图用 **4:3（1200×900）**；SVG 占位或 JPG/WebP 均可，JPG/WebP 会自动走 next/image 压缩
  - 路线字段：`story`（换行正文）、`images[]`（九宫格，1/2/4 张有专门布局）、`tips[]`（实用贴士）、`location`
- **博客文章**：在 `web/src/content/posts/` 新建 `.md`，带 frontmatter。列表页可按标签筛选、站内搜索，文章页有相关推荐；订阅地址：`/rss.xml`。同一主题的文章加 `series: "deploy"` 和 `seriesTitle: "部署系列"` 即可归成一个系列。

  ```markdown
  ---
  title: "文章标题"
  date: "2026-08-15"
  excerpt: "一句话摘要"
  tags: ["标签"]
  series: "deploy"        # 可选：系列 key（英文 slug）
  seriesTitle: "部署系列"  # 可选：系列显示名
  ---

  正文用 Markdown 写
  ```

  > ⚠️ **文件名（slug）请用英文/数字/连字符**（如 `my-post.md`），不要用中文。
  > Next.js 对含非 ASCII 字符的动态路由静态页有 bug（构建能过、访问 404），已踩过坑。

- **足迹动态**：在 `web/src/content/footprints/` 新建 `.md`，带 frontmatter。配图建议与户外路线一致：九宫格用正方形 1:1（800×800），单图 4:3（1200×900）。

  ```markdown
  ---
  date: "2026-08-14"
  location: "广州 · 大夫山"
  tags: ["骑行", "周末"]
  images:
    - /images/footprints/xxx.svg   # 图片自动排成九宫格（1/2/4 有专门布局）
  link: "/outdoor"                 # 可选：关联博客/路线
  linkLabel: "大夫山环线 · 28km"
  ---

  动态正文，支持换行
  ```

- **项目列表**：改 `web/src/lib/projects.ts`
- **关于我**：改 `web/src/app/about/page.tsx`

## 部署到阿里云（免费 HTTPS）


### 阿里云服务器（复用现有 nginx 反代）

前置准备：

1. 域名 A 记录解析到服务器公网 IP
2. 阿里云**安全组放行 80 / 443 端口**
3. 国内服务器需 **ICP 备案**通过（备案前 80/443 常被拦截）
4. 服务器已有 Docker 与现有 nginx 反代（`/opt/nginx-conf`、`/opt/nginx-certs`）

一键部署 / 更新（本机执行）：

```bash
./deploy.sh                 # 默认 8.148.181.40 / root
SERVER=1.2.3.4 ./deploy.sh  # 指定服务器
```

脚本会：同步 `web/` 源码 → 同步 Dockerfile 与 `docker-compose.server.yml` → 服务器上 `docker compose up -d --build` → 验证容器。

服务器上的落地结构：

```
/opt/mars-site/
├── web/                  # 站点源码
├── deploy/Dockerfile     # 多阶段构建（standalone）
└── docker-compose.yml    # 由 deploy/docker-compose.server.yml 同步而来
```

nginx 反代配置同步自 `deploy/marsmz.top.conf`（80→301，443 SSL 反代 `mars-site:3000`），证书为 Let's Encrypt（acme.sh 自动续期，证书在 `/opt/nginx-certs/marsmz.top.{pem,key}`）。


## 设计

「自然极简」风格：米白/暖灰打底，深墨绿（forest）+ 卡其（khaki）点缀，呼应户外主题。支持明暗双主题。

## 技术栈

Next.js 15 · React 19 · Tailwind CSS 4 · TypeScript · next-themes（暗色模式）· gray-matter + react-markdown（博客/足迹）· Docker · nginx
