---
title: "阿里云服务器答疑实录：部署、HTTPS 与 SSH 加固踩坑记"
date: "2026-08-17"
excerpt: "从零把个人网站部署到阿里云轻量服务器，全流程答疑整理：复用已有 nginx 而不是 Caddy、Let's Encrypt 免费证书、浏览器提示不安全其实是混合内容、SSH 密钥登录加固，以及 fail2ban 误封自己怎么自救。"
tags: ["部署", "阿里云", "SSH", "fail2ban", "HTTPS", "踩坑"]
---

这篇是把最近一次"部署 + 加固 + 踩坑 + 自救"的完整答疑过程整理成文，给以后（和同样在做这件事的人）一份带注释的实操记录。所有命令都标注了"为什么这么做"，方便理解而不是照抄。

## 一、服务器上有现成 nginx 时，别再用 Caddy

### 问题

项目里原本配好了 Caddy（自动 HTTPS 一把梭），结果 `docker compose up` 起不来——**80/443 端口被占用**。

### 原因

服务器 `/opt` 下已经有一套成熟的 docker-compose 在跑，其中 `nginx` 容器已经占用了 80/443 端口，还管着 `ai.marsmz.com`、`perler.marsmz.top` 等多个站点。Caddy 也要绑 80/443，直接冲突。

### 结论

**复用现有 nginx 反代体系**，把新站点加进去，完全不碰已有服务：

```nginx
# /opt/nginx-conf/marsmz.top.conf
# 注意：这个文件是挂载进 nginx 容器的（/opt/nginx-conf -> /etc/nginx/conf.d）

# 80 端口：除了 ACME 验证路径，其余全部 301 跳到 https
server {
    listen 80;
    listen [::]:80;
    server_name marsmz.top www.marsmz.top;

    # ACME 验证目录：acme.sh 申请证书时要在这里放验证文件
    # root 指向宿主机 /opt/certbot/www（容器内挂载为 /var/www/certbot）
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        default_type "text/plain";
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# 443 端口：SSL + 反代到应用容器
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name marsmz.top www.marsmz.top;

    # 证书由 acme.sh 自动续期后覆盖到这两个文件
    ssl_certificate     /etc/nginx/certs/marsmz.top.pem;
    ssl_certificate_key /etc/nginx/certs/marsmz.top.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    server_tokens off;

    location / {
        proxy_pass http://mars-site:3000;   # 反代到 mars-site 容器（opt_default 网络内）
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> **坑**：旧版 nginx（1.21.5）不支持 `http2 on;` 指令，要用 `listen 443 ssl http2;` 的写法，否则 `nginx -t` 直接报 `unknown directive "http2"`。

应用容器要加入现有 nginx 所在的 docker 网络，nginx 才能通过服务名访问它：

```yaml
# /opt/mars-site/docker-compose.yml
services:
  mars-site:
    build:
      context: ./web
      dockerfile: ../deploy/Dockerfile
    image: mars-site:latest
    restart: unless-stopped
    expose:
      - "3000"                    # 只暴露给网络内，不映射宿主机端口
    networks:
      - opt_default               # 加入现有网络

networks:
  opt_default:
    external: true                # 复用已有网络，不是新建
```

## 二、免费 HTTPS：acme.sh + webroot 模式

### 问题

服务器上没装 certbot，也没有现成工具。

### 方案

装 **acme.sh**（比 certbot 更轻量，纯 shell），用 **webroot 模式**申请 Let's Encrypt 证书——好处是**不需要停 nginx**（nginx 本来就占着 80，standalone 模式反而没法用）。

```bash
# 1. 安装 acme.sh（装到 /root/.acme.sh，自动配好续期 cron）
curl https://get.acme.sh | sh -s email=你的邮箱

# 2. 申请证书：--webroot 指向 nginx 能访问到的验证目录
#    nginx 配置里 root /var/www/certbot，宿主机对应 /opt/certbot/www
/root/.acme.sh/acme.sh --issue \
  -d marsmz.top -d www.marsmz.top \
  --webroot /opt/certbot/www \
  --server letsencrypt

# 3. 把证书"安装"到 nginx 挂载目录，并配置续期后自动 reload
/root/.acme.sh/acme.sh --install-cert \
  -d marsmz.top -d www.marsmz.top --ecc \
  --fullchain-file /opt/nginx-certs/marsmz.top.pem \
  --key-file /opt/nginx-certs/marsmz.top.key \
  --reloadcmd "docker exec opt-nginx-1 nginx -s reload"
```

acme.sh 会写入 cron（默认每天 4 个时段检查），到期前自动续期并执行 reloadcmd，**证书永久免费自动续**。

> **坑**：ACME 验证路径返回 301 而不是文件？检查验证文件是否真的放在 `root + URI` 拼接后的路径下，即 `/opt/certbot/www/.well-known/acme-challenge/xxx`，而不是 `/opt/certbot/www/xxx`。

## 三、浏览器提示"不安全"，但证书明明是对的

### 症状

`curl` 验证证书链完全正常（`Verify return code: 0 (ok)`），浏览器却显示"不安全"。

### 真相：混合内容（Mixed Content）

不是证书问题，是**页面里用 `http://` 加载了图片**。浏览器对 HTTPS 页面里加载的 http 资源一律降级为"不安全"。从 Hexo 老博客迁移过来的文章里有 7 张 `http://` 图床图片，就是元凶。

```bash
# 排查命令：抓取页面里所有 http 资源
curl -s https://marsmz.top/ | grep -oE '(src|href)="http://[^"]*"'

# 定位文章里的 http 图片
grep -rnE '!\[[^]]*\]\(http://' web/src/content/posts/
```

### 处理

逐个检查图片来源：
- **图床还活着且支持 https** → 直接把 `http://` 改成 `https://`
- **图床已死**（如 `image.talkmoney.cn` 已返回 403）→ 直接删掉（留着也是裂图）
- **普通超链接**（`<a href="http://...">`）→ **不用管**，浏览器只对"被加载的资源"（图片/CSS/JS/iframe）判定混合内容，跳转链接不影响锁图标

> 排查时发现旧图床 http/https 都返回 403，说明图床早就挂了，那些图本来就是坏的，删掉反而干净。

## 四、SSH 加固：从密码裸奔到密钥登录

### 第一步：本地生成专用密钥（带 passphrase）

```bash
# 生成本机专用密钥（ed25519 更安全更快，比 RSA 短）
ssh-keygen -t ed25519 -C "mars-aliyun" -f ~/.ssh/id_ed25519_mars
# 交互式设置 passphrase（推荐），私钥泄露也有最后一道防线
```

> **为什么不用已有的 id_rsa？** 那把 4 年前的 RSA 3072 位密钥没有 passphrase，且可能已用于 GitHub 等多处。专用密钥只服务这一台服务器，职责隔离，出事可单独吊销。

### 第二步：上传公钥并配置免密

```bash
# 服务器端：把公钥追加进 authorized_keys（权限必须严格）
echo 'ssh-ed25519 AAAAC3... mars-aliyun' >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

# 本机：配置 ssh config 别名，之后所有操作都变成 ssh mars
# ~/.ssh/config
Host mars
    HostName 8.148.181.40
    User root
    Port 22
    IdentityFile ~/.ssh/id_ed25519_mars
    ServerAliveInterval 30
```

首次连接会提示 host key 验证，把服务器真实指纹（`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`）和提示比对一致后确认即可（防中间人攻击的标准动作）。

### 第三步：验证密钥登录成功**之后**，再关密码登录

```bash
# 备份（后悔药）
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%Y%m%d)

# 加固关键项
sed -i "s|^PermitRootLogin yes|PermitRootLogin prohibit-password|" /etc/ssh/sshd_config
sed -i "s|^PasswordAuthentication yes|PasswordAuthentication no|" /etc/ssh/sshd_config
sed -i "s|^#MaxAuthTries 6|MaxAuthTries 3|" /etc/ssh/sshd_config
sed -i "s|^#LoginGraceTime 2m|LoginGraceTime 30s|" /etc/ssh/sshd_config

# 语法检查 + 平滑重载（reload 不断开现有连接）
sshd -t && systemctl reload sshd

# 验证：服务器返回的认证方法列表里已经没有 password
ssh -o PreferredAuthentications=password mars   # 应返回 Permission denied
```

> **顺序很重要**：先让密钥登录跑通，再关密码。否则可能把自己锁在门外。

## 五、fail2ban 防暴力破解（以及误封自救）

### 安装配置

```bash
yum install -y fail2ban

# /etc/fail2ban/jail.local
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1
bantime  = 1h        # 封禁时长
findtime = 10m       # 统计窗口
maxretry = 5         # 窗口内失败次数达到就封

[sshd]
enabled  = true
port     = ssh
logpath  = %(sshd_backend)s
maxretry = 5

systemctl enable --now fail2ban
```

### 验证封禁是否真的有效

故意用不存在的用户名连续登录（触发 `Invalid user`，默认规则能匹配）：

```bash
for i in 1 2 3 4 5 6; do
  ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no \
      -o User=nonexist_$i mars 'echo x'
done
```

**结果：连自己都被封了**（`Connection refused`）——说明封禁机制完全生效。

### 误封自救（重要）

封禁只封**那一个 IP**。自救方式按优先级：

1. **换出口 IP**（开代理 / 手机热点）→ 从新 IP 连上 → `fail2ban-client unban 旧IP`
2. **等自动解封**（bantime 到期自动解除）
3. **阿里云 ECS** 可用「云助手/发送命令」通道执行 `fail2ban-client unban`（不走 SSH/iptables，一定能执行）；**轻量服务器**没有这个入口，用前两种
4. VNC 远程连接（注意：VNC 有独立密码，不是 root 密码；重置实例密码后需重启实例才生效）

### 关于"代理 IP 多变会不会误封自己"

- 正常密钥登录**不会失败**，fail2ban 只数失败尝试，所以**开代理正常使用不会触发封禁**
- 唯一风险：代理出口 IP 是共享的，若**别人用同一 IP 暴力破解你的服务器**，你会被连累
- 对策：日常管理用直连（不开代理），需要代理时再开；真被封了就换 IP 解封

### 一个容易误解的点

密码认证关闭后，攻击者留下的日志是 `Connection closed by authenticating user` 而不是 `Failed password`，**默认 fail2ban 规则匹配不到这种记录**——但这没关系，因为攻击者根本进不到"试密码"阶段，攻击面已经在 sshd 层关死了。不要试图自定义规则把 `Connection closed` 也计为失败（会跟内置的 `F-NOFAIL` 逻辑冲突，纯属给自己添乱）。

## 六、日常运维方式总结

配好密钥后，日常操作变成：

| 操作 | 方式 |
| --- | --- |
| 改网站代码 | 本地编辑 + `./deploy.sh`（rsync 上传 + 服务器自动 rebuild） |
| 改服务器配置 | VS Code / Cursor Remote-SSH 连 `mars` 直接编辑 `/opt/nginx-conf/` 等 |
| 传单个文件 | `scp 本地文件 mars:/opt/xxx/` |
| 看日志 / 重启 | `ssh mars "docker logs -f 容器名"` 等 |

## 小结

这次踩坑的核心经验：

1. **部署前先摸清服务器现状**——已有服务占用了哪些端口，决定方案（复用 nginx vs Caddy）
2. **证书排查先分清楚是证书问题还是混合内容**——`curl` 验证链、grep 页面里的 http 资源
3. **SSH 加固顺序**：密钥先通 → 备份 → 关密码 → 验证双向
4. **fail2ban 验证要小心**——测试封禁会把自己也封了，提前想好自救路径（换 IP / 等解封）
5. **一切操作可逆**——sshd_config 有备份、fail2ban 可 unban、root 密码没动过，任何时刻都不会真正锁死自己
