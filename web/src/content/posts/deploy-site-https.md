---
title: "部署个人网站：Docker + Nginx 免费 HTTPS 实战"
date: "2026-08-15"
excerpt: "记录 marsmz.top 从 Docker 部署、Nginx 反向代理到使用 acme.sh 免费申请和自动续期 HTTPS 证书的完整过程。"
tags: ["部署", "Docker", "Nginx", "HTTPS", "acme.sh", "Next.js"]
series: "deploy"
seriesTitle: "部署系列"
---

拿到一台阿里云服务器和 `marsmz.top` 这个域名之后，第一件事就是把个人网站跑起来。这次采用了更容易按自己习惯定制的 **Docker Compose + Nginx + acme.sh**：Next.js 运行在容器内，Nginx 负责公网入口、反向代理和 HTTPS，acme.sh 负责申请、安装和续期证书。

整条链路可以概括为：

```text
浏览器 → Nginx（80 / 443）→ mars-site:3000（Next.js 容器）
                 └→ /.well-known/acme-challenge/（acme.sh 验证文件）
```

Let’s Encrypt 提供免费的公开 TLS 证书；使用 acme.sh 的 webroot 模式时，验证服务器会访问域名下的 `/.well-known/acme-challenge/` 文件。因此域名解析、80 端口和这个 Nginx 路径必须先准备好。

## 服务器连接与准备

我平时用 VS Code 的 **Remote - SSH** 插件连接服务器，免去频繁在本地终端里手输 SSH 命令。先在本机 `~/.ssh/config` 增加一段配置：

```sshconfig
Host mars-server
    HostName <服务器公网 IP>
    User root
    IdentityFile ~/.ssh/<你的私钥文件>
```

随后在 VS Code 中执行 `Remote-SSH: Connect to Host...`，选择 `mars-server` 即可直接打开服务器上的项目目录。

在阿里云安全组中，至少放行下面几个 TCP 端口：

| 端口 | 用途 |
| --- | --- |
| 22 | SSH 连接服务器 |
| 80 | HTTP 访问、ACME HTTP-01 验证，以及 HTTP 跳转到 HTTPS |
| 443 | HTTPS 访问 |

如果服务器在中国大陆，网站还需要符合当地的备案要求；否则即使容器和 Nginx 都正常，公网访问仍可能受限。

## 域名解析

在域名控制台添加两条 **A 记录**，都指向服务器公网 IP：

| 主机记录 | 记录类型 | 记录值 |
| --- | --- | --- |
| `@` | A | `<服务器公网 IP>` |
| `www` | A | `<服务器公网 IP>` |

这样 `marsmz.top` 与 `www.marsmz.top` 都能访问同一台服务器，也可以一起写进同一张证书。DNS 生效后可以先检查：

```bash
nslookup marsmz.top
nslookup www.marsmz.top
```

返回的地址应当是服务器公网 IP。解析尚未生效时申请证书，大概率会失败。

## Docker Compose 一把梭

项目中的服务器 Compose 文件是 [`deploy/docker-compose.server.yml`](../../../deploy/docker-compose.server.yml)。它只运行 `mars-site` 一个 Next.js 服务：镜像通过 standalone 构建产物启动，暴露容器内的 `3000` 端口，并加入已有的 `opt_default` Docker 网络。

```yaml
services:
  mars-site:
    build:
      context: ./web
      dockerfile: ../deploy/Dockerfile
    image: mars-site:latest
    restart: unless-stopped
    expose:
      - "3000"
    networks:
      - opt_default

networks:
  opt_default:
    external: true
```

这里的 `expose` 不会把 `3000` 直接暴露给公网；它只让同一个 Docker 网络中的 Nginx 能通过服务名 `mars-site:3000` 访问 Next.js。也就是说，公网流量始终从 Nginx 的 80/443 端口进入。

在项目根目录启动或更新服务：

```bash
docker compose -f deploy/docker-compose.server.yml up -d --build
```

### Docker 常用命令

为了避免反复输入 Compose 文件路径，我会先定义一个变量；下面的命令都默认在项目根目录执行：

```bash
COMPOSE="docker compose -f deploy/docker-compose.server.yml"
```

| 场景 | 命令 |
| --- | --- |
| 首次部署或更新代码 | `$COMPOSE up -d --build` |
| 查看服务状态 | `$COMPOSE ps` |
| 查看最近日志 | `$COMPOSE logs --tail=100 mars-site` |
| 持续追踪日志 | `$COMPOSE logs -f mars-site` |
| 重启应用容器 | `$COMPOSE restart mars-site` |
| 只重新构建镜像 | `$COMPOSE build --no-cache mars-site` |
| 停止并删除本 Compose 创建的容器 | `$COMPOSE down` |

对应的可复制命令如下：

```bash
# 首次部署或更新代码：构建最新镜像并在后台启动
$COMPOSE up -d --build

# 查看服务状态、最近 100 行日志，或持续追踪日志
$COMPOSE ps
$COMPOSE logs --tail=100 mars-site
$COMPOSE logs -f mars-site

# 应用临时卡住时重启；需要彻底重新构建时跳过 Docker 构建缓存
$COMPOSE restart mars-site
$COMPOSE build --no-cache mars-site
$COMPOSE up -d

# 停止并删除本 Compose 创建的容器（不会删除镜像或外部网络）
$COMPOSE down
```

另外几条排查容器与网络的原生命令也很有用：

```bash
# 列出正在运行的容器，并显示名称、镜像和端口
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'

# 查看 mars-site 容器的详细配置与网络信息
docker inspect mars-site

# 确认外部网络中同时存在 Nginx 和 mars-site
docker network inspect opt_default
```

> `mars-site` 必须和 Nginx 加入同一个 `opt_default` 网络，否则 Nginx 无法解析 `mars-site` 这个容器服务名。若 Nginx 安装在宿主机而不是容器内，应改为发布应用端口并代理到 `127.0.0.1:<端口>`，不能直接使用 `mars-site:3000`。

## 先让 HTTP / IP 访问跑通

在接 HTTPS 前，我会先用最小配置确认三件事：Nginx 正常运行、它能访问 `mars-site:3000`，并且浏览器可以通过服务器 IP 看到网站。

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://mars-site:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

将配置写入 Nginx 的站点配置目录后，先测试语法，再无中断重载：

```bash
# Nginx 运行在 Docker 容器时
NGINX_CONTAINER=nginx
docker exec "$NGINX_CONTAINER" nginx -t
docker exec "$NGINX_CONTAINER" nginx -s reload

# 如果 Nginx 直接安装在宿主机，则使用
# sudo nginx -t && sudo systemctl reload nginx
```

现在访问 `http://<服务器公网 IP>`。如果这里还无法打开网站，先通过 `docker compose ... logs -f mars-site` 和 Nginx 错误日志排查，不要急着申请证书。

## 用 acme.sh 申请免费证书

### 准备 ACME 验证目录

acme.sh 的 webroot 模式会在指定目录下创建验证文件。这个目录必须与 Nginx 中 `root` 指向的路径一致，并且要挂载或映射到 Nginx 实际可读取的位置：

```bash
sudo mkdir -p /var/www/certbot
sudo mkdir -p /etc/nginx/certs
sudo chmod 755 /var/www/certbot /etc/nginx/certs
```

然后将 Nginx 的 HTTP 配置替换为下面最终配置中的第一个 `server` 块，先保留 80 端口提供验证文件和跳转。此时 443 块中的证书文件还不存在，**不要立刻加载 443 配置**；先完成下一步申请和安装证书。

### 安装并签发证书

以下命令以 root 用户为例；`<你的邮箱>` 要替换为能接收证书到期通知的真实邮箱。安装完成后建议重新打开终端，或者直接使用 `~/.acme.sh/acme.sh` 的完整路径执行命令。

```bash
curl https://get.acme.sh | sh -s email=<你的邮箱>

# 明确使用 Let's Encrypt 作为证书颁发机构
~/.acme.sh/acme.sh --set-default-ca --server letsencrypt

# 为根域名和 www 申请同一张证书
~/.acme.sh/acme.sh --issue \
  -d marsmz.top \
  -d www.marsmz.top \
  -w /var/www/certbot
```

申请成功后，证书先保存在 acme.sh 自己的工作目录中。不要让 Nginx 直接引用 `~/.acme.sh/` 内的文件；应使用 `--install-cert` 将证书复制到 Nginx 的正式目录，并把重载命令保存给后续自动续期使用。

## Nginx 最终 HTTPS 配置

下面是我现在使用的站点配置。80 端口只对 ACME 验证路径返回文件，其余请求全部跳转 HTTPS；443 端口加载证书，再将请求反向代理到 `mars-site:3000`。

```nginx
# marsmz.top - 个人网站（mars-site）
server {
    listen 80;
    listen [::]:80;

    server_name marsmz.top www.marsmz.top;

    # ACME 验证目录（acme.sh webroot 模式）
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        default_type "text/plain";
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name marsmz.top www.marsmz.top;

    ssl_certificate     /etc/nginx/certs/marsmz.top.pem;
    ssl_certificate_key /etc/nginx/certs/marsmz.top.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    server_tokens off;

    location / {
        proxy_pass http://mars-site:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 10s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
```

### Nginx 常用命令

修改 Nginx 配置后，**先执行语法检查，再重载**；`reload` 会平滑加载新配置，通常不会中断正在处理的请求。本文的部署中 Nginx 运行在容器内，先设置实际容器名：

```bash
# 查看容器名称后，按实际结果修改；例如 nginx 或 opt-nginx-1
docker ps --format 'table {{.Names}}\t{{.Image}}'
NGINX_CONTAINER=nginx
```

```bash
# 检查完整配置语法；有报错时不要重载
docker exec "$NGINX_CONTAINER" nginx -t

# 平滑重载配置（修改站点配置、替换证书后常用）
docker exec "$NGINX_CONTAINER" nginx -s reload

# 查看 Nginx 进程状态与最近日志
docker exec "$NGINX_CONTAINER" nginx -T
docker logs --tail=100 "$NGINX_CONTAINER"
docker logs -f "$NGINX_CONTAINER"

# 重启 Nginx 容器；只有容器异常或需要完整重启时才使用
docker restart "$NGINX_CONTAINER"

# 进入容器排查配置、证书和 ACME 验证文件
docker exec -it "$NGINX_CONTAINER" sh
```

如果 Nginx 直接安装在宿主机而非 Docker 容器中，则替换为系统服务命令：

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx --no-pager
sudo journalctl -u nginx -n 100 --no-pager
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
```

几个关键点：

- `location ^~ /.well-known/acme-challenge/` 必须放在 HTTP 服务中，并且不能被 HTTPS 跳转覆盖，否则 HTTP-01 验证无法读取文件。
- `proxy_pass http://mars-site:3000` 依赖 Docker 的服务发现，所以 Nginx 和 `mars-site` 必须位于相同网络。
- `Host`、`X-Real-IP` 和 `X-Forwarded-*` 请求头让 Next.js 能识别原始域名、用户 IP 与协议；尤其 `X-Forwarded-Proto` 可避免 HTTPS 场景中生成错误的 HTTP 链接。
- 示例同时为 `marsmz.top` 和 `www.marsmz.top` 提供服务。如果只打算使用根域名，请从 Nginx 和 acme.sh 命令中一并移除 `www.marsmz.top`。

## 安装证书并自动续期

证书签发完成后，执行一次安装命令。假设 Nginx 容器名为 `nginx`；如果实际名称不同，先用 `docker ps --format '{{.Names}}'` 找到并替换它。

```bash
NGINX_CONTAINER=nginx

~/.acme.sh/acme.sh --install-cert -d marsmz.top \
  --key-file /etc/nginx/certs/marsmz.top.key \
  --fullchain-file /etc/nginx/certs/marsmz.top.pem \
  --reloadcmd "docker exec ${NGINX_CONTAINER} nginx -s reload"
```

确认 `/etc/nginx/certs/` 中已生成 `.pem` 和 `.key` 文件后，加载完整 Nginx 配置：

```bash
docker exec "$NGINX_CONTAINER" nginx -t
docker exec "$NGINX_CONTAINER" nginx -s reload
```

acme.sh 安装时会创建定时任务，定期检查是否需要续期。`--install-cert` 保存的证书复制路径和 `--reloadcmd` 也会在续期后继续使用：证书更新后会被重新复制到 `/etc/nginx/certs/`，随后 Nginx 自动重载，从而读取新证书。

可以用以下命令检查当前证书记录和自动续期配置：

```bash
~/.acme.sh/acme.sh --info -d marsmz.top
```

## 上线验证与常见问题

最后依次验证 HTTP 跳转、HTTPS 连通性和证书信息：

```bash
# 应返回 301，并带有 https 地址
curl -I http://marsmz.top

# 应返回 200、301 或你的站点正常响应
curl -I https://marsmz.top

# 查看服务端实际返回的证书信息
openssl s_client -connect marsmz.top:443 -servername marsmz.top </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

常见问题基本集中在下面几项：

1. **80/443 没有在安全组或系统防火墙放行**：ACME 验证和用户访问都会失败。
2. **域名还没解析到当前服务器**：确认 `marsmz.top`、`www.marsmz.top` 都解析正确，再重新签发。
3. **ACME 路径被跳转或代理走了**：检查 `/.well-known/acme-challenge/` 是否命中 `root /var/www/certbot`，而不是进入 `location /`。
4. **Nginx 无法解析 `mars-site`**：检查两个容器是否都加入 `opt_default` 网络；宿主机 Nginx 则应代理到已发布的本地端口。
5. **证书已更新但浏览器仍显示旧证书**：检查 `--install-cert` 的复制路径、`--reloadcmd` 和 Nginx 配置测试是否成功。
6. **国内服务器无法通过公网访问 80 端口**：先排查备案状态、阿里云安全组和系统防火墙，不要只盯着 Docker 日志。

搞定之后，访问 `https://marsmz.top` 就能看到绿锁啦 🔒
