---
title: "部署个人网站：从零到免费 HTTPS"
date: "2026-08-15"
excerpt: "拿到服务器和域名后，如何用 Docker + Caddy 部署一个 Next.js 网站，并且一分钱不花地拿到 HTTPS 证书。"
tags: ["部署", "Docker", "HTTPS", "Next.js"]
---

拿到一台阿里云服务器和 `marsmz.top` 这个域名之后，第一件事就是把这个个人网站跑起来。这篇记录一下整个部署流程，重点是**免费 HTTPS**。

## 为什么要用 Caddy

传统的做法是 Nginx + certbot，配置繁琐还要手动写续期 cron。而 **Caddy 内置了自动 HTTPS**：只要写好域名，它自动去 Let's Encrypt 申请证书、到期自动续期，你只需要一行配置：

```caddyfile
marsmz.top {
    reverse_proxy app:3000
}
```

Let's Encrypt 是一个非营利 CA，**完全免费**，个人站点放心用。

## Docker Compose 一把梭

我把整个站点做成了两个服务：

- `app`：Next.js standalone 构建产物
- `caddy`：反向代理 + 自动 HTTPS

启动命令就一条：

```bash
docker compose up -d
```

证书目录挂载到宿主机，重装服务器也不怕丢。

## 域名解析

记得先在阿里云控制台把域名 **A 记录** 解析到服务器公网 IP，并确保安全组放行 80/443 端口，否则 Caddy 申请证书会失败。

## 几个坑

1. 安全组默认只开 22 端口，**80/443 必须手动放行**
2. 阿里云国内服务器备案通过前，80 端口可能被拦截
3. Caddy 第一次申请证书要等几秒，别急着重启

搞定之后，访问 `https://marsmz.top` 就能看到绿锁啦 🔒
