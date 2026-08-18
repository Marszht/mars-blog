# ⛰️ Mars Site — 个人网站

基于 **Next.js + Tailwind CSS** 的个人网站，部署在阿里云服务器，域名 **marsmz.top**，全站免费 HTTPS（Let's Encrypt，acme.sh 自动续期 + nginx 反代）。

## 功能板块

| 路径 | 板块 | 说明 |
| --- | --- | --- |
| `/` | 首页 | 个人简介、能力标签、最近足迹、最近博客、精选项目 |
| `/about` | 关于我 | 技能栈、时间线、座右铭 |
| `/outdoor` | 户外运动 | 骑行 / 徒步 / 羽毛球三大运动、经典路线、运动日志、装备与目标 |
| `/footprints` | 足迹 | 朋友圈式动态流：短文字 + 图片九宫格 + 地点 + 标签，可关联博客/路线 |
| `/blog` | 技术博客 | Markdown 驱动的文章列表 + 详情页（SEO 友好） |
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
- **博客文章**：在 `web/src/content/posts/` 新建 `.md`，带 frontmatter：

  ```markdown
  ---
  title: "文章标题"
  date: "2026-08-15"
  excerpt: "一句话摘要"
  tags: ["标签"]
  ---

  正文用 Markdown 写
  ```

  > ⚠️ **文件名（slug）请用英文/数字/连字符**（如 `my-post.md`），不要用中文。
  > Next.js 对含非 ASCII 字符的动态路由静态页有 bug（构建能过、访问 404），已踩过坑。

- **足迹动态**：在 `web/src/content/footprints/` 新建 `.md`，带 frontmatter：

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

## 从 Hexo 旧博客迁移（已完成）

旧博客（`/Users/zhu_mars/workspace/Blog/blog`，Hexo）的 **16 篇文章**已迁移到
`web/src/content/posts/`，并做了转换：

- frontmatter 从 Hexo 格式转为本站格式（日期规范化、`categories`+`tags` 合并去重、摘要逐篇人工润色）
- 移除 Hexo 的 `<!-- more -->` 分页标记
- 文件名改成英文 slug（避开中文 slug 的 404 bug）

### 图片已全部自托管（重要）

旧文章原本引用外部图床，存在两个问题：

1. **语雀 CDN（`cdn.nlark.com`）有防盗链**——带 `Referer: marsmz.top` 请求返回 **403**。
   这是图床主动拒绝，**服务器上加任何 nginx 配置都解决不了**。
2. **路过图床（`s2.ax1x.com`）已关站**，图片永久丢失。

处理结果：

- **24 张存活图片已下载到 `web/public/images/blog/`**，正文引用改为本地路径 `/images/blog/xxx`
  （绕过防盗链的关键：下载时**不带 Referer**）
- **7 张失效图片**（图床关站）的引用已从正文删除，文字保留
- 图片现在完全自己托管，不再受防盗链或图床跑路影响

> 以后新文章配图，建议直接放进 `web/public/images/blog/` 并用 `/images/blog/xxx` 引用，别用外部图床。

## 部署到阿里云（免费 HTTPS）

> ⚠️ **服务器实际情况**：目标服务器（8.148.181.40）上 **80/443 已被现有 nginx 反代占用**（管理着 ai.marsmz.com、perler.marsmz.top、qinglong 等站点），因此本站**复用现有 nginx 反代体系**，用 `deploy/docker-compose.server.yml` 部署（只跑站点容器，不含 Caddy）。

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

## 访问统计（百度统计，免费）

主站已配置统计 ID（`deploy/.env.example` 与本地 `web/.env.local` 已填入 `b20d77ed3d94cfe964b20eeb5c99667e`）。
网站在未配置统计 ID 时**不加载任何统计脚本**。启用/更换 ID 的步骤：

**1. 拿到统计 ID**

登录 [百度统计](https://tongji.baidu.com/) → 「管理」→「网站列表」→ 找到 marsmz.top → 「获取代码」，
代码形如：

```html
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?abc123def456789...";  // ← 问号后这串就是统计 ID
  ...
})();
</script>
```

**只需要问号后面那串 32 位字符**，不用复制整段代码（站点已内置注入逻辑）。

**2. 填入配置**

- 本地：`web/.env.local` 写 `NEXT_PUBLIC_BAIDU_ANALYTICS_ID=你的ID`（当前已填好）
- 服务器：`/opt/mars-site/.env` 写同一行（或直接用 `./deploy.sh` 同步，它会带上 `web/.env.local`）

**3. 重新构建（关键）**

```bash
docker compose up -d --build
```

> ⚠️ `NEXT_PUBLIC_*` 变量是 **构建时内联** 到 JS 里的，改了环境变量**不重新 build 不会生效**。

**4. 验证**

浏览器打开网站 → F12 →「网络」筛 `hm.js`，能看到对 `hm.baidu.com/hm.js?你的ID` 的请求即成功；
百度统计后台在「实时访客」里通常几分钟内出现数据（首次接入可能需要等 20 分钟左右）。

> 按国内规定，建议 ICP 备案通过后再启用统计。

### perler.marsmz.top（拼豆图纸生成器）的统计

拼豆站点是独立的 Node.js 单页应用（仓库 `Marszht/preler-webapp`），配置方式：

1. 在 [百度统计](https://tongji.baidu.com/) 「管理 → 网站列表」里**新增一个站点**（域名写 `perler.marsmz.top`），拿到它自己的统计 ID（两个站点 ID 不同）
2. 在服务器上给拼豆容器的环境变量加上 `BAIDU_ANALYTICS_ID=你的ID`（在 compose 文件的 `perler-webapp` 服务的 `environment` 里加一行），然后 `docker compose up -d --build` 重建容器
3. 验证：打开 https://perler.marsmz.top → F12 → 网络筛 `hm.js`

## 设计

「自然极简」风格：米白/暖灰打底，深墨绿（forest）+ 卡其（khaki）点缀，呼应户外主题。支持明暗双主题。

## 技术栈

Next.js 15 · React 19 · Tailwind CSS 4 · TypeScript · next-themes（暗色模式）· gray-matter + react-markdown（博客/足迹）· Docker · nginx
