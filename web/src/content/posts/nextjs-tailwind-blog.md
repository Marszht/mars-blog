---
title: "用 Next.js + Tailwind 搭建个人博客：踩坑记录"
date: "2026-08-01"
excerpt: "从零手动搭建 Next.js 项目的全过程，包括 Tailwind v4 配置、Markdown 博客系统、暗色模式和 SEO 优化的一些坑。"
tags: ["Next.js", "Tailwind CSS", "博客"]
---

不用脚手架，手动搭一个 Next.js + Tailwind 项目，顺便把踩过的坑记录下来。

## Tailwind v4 的变化

v4 不再需要 `tailwind.config.js`，配置全部写在 CSS 里：

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

暗色模式用 `next-themes` 的 class 策略，HTML 上加 `suppressHydrationWarning` 避免首屏闪烁。

## Markdown 博客系统

核心就三个文件：

- `src/lib/posts.ts`：读 `src/content/posts/*.md`，用 `gray-matter` 解析 frontmatter
- `/blog`：文章列表页
- `/blog/[slug]`：用 `react-markdown` 渲染正文

所有页面在构建时静态生成，`generateStaticParams` 保证每个 slug 都会生成 HTML，SEO 友好。

## 关于暗色模式

`next-themes` + `@custom-variant dark` 是我觉得最省心的方案。注意：

- 服务端渲染和客户端首屏主题要一致，否则会闪白
- `transition-colors` 加在 body 上，切换更顺滑

## 结尾

整个过程最爽的是**没有依赖脚手架**，每个文件都知道是干嘛的，出问题一眼能找到。欢迎在留言板交流～
