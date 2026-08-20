# `deploy-site-https.md` 完善方案

## 背景

现有文章以 Caddy 自动 HTTPS 为主线，但作者新增的小节和实际 Nginx 配置表明，最终部署方案已经改为 Docker Compose + Nginx + acme.sh。文章需要统一技术路线，补齐从服务器连接、域名解析、HTTP 验证到 HTTPS 上线和证书续期的完整过程。

## 方案对比

1. **保留 Caddy 主线，仅附加 Nginx 配置**：改动最少，但文章前后技术栈冲突，读者难以判断应采用哪套方案。
2. **同时讲解 Caddy 与 Nginx 两套方案**：覆盖面广，但会显著拉长文章，也偏离个人部署记录的定位。
3. **统一为 Nginx + acme.sh（采用）**：与作者补充的真实配置一致，流程清晰，也便于解释先 HTTP、后 HTTPS 的渐进式部署。

## 内容设计

文章按实际操作顺序组织：

1. 说明最终架构：Next.js 容器提供应用，Nginx 容器负责反向代理和 TLS，acme.sh 在宿主机申请及续期证书。
2. 介绍通过 VS Code Remote - SSH 连接服务器，并给出安全组端口要求。
3. 给出域名 A 记录配置，说明根域名与 `www` 均需解析到服务器公网 IP。
4. 给出 Docker Compose 配置和常用部署、日志、重启命令。
5. 先提供仅支持 IP/HTTP 访问的 Nginx 配置，用于确认容器网络和应用工作正常。
6. 创建 ACME webroot，使用 acme.sh 为 `marsmz.top` 和 `www.marsmz.top` 申请同一张证书。
7. 写入最终 Nginx 配置：保留 ACME challenge 路径、将其他 HTTP 请求重定向到 HTTPS，并通过 HTTPS 反向代理到 `mars-site:3000`。
8. 配置 `acme.sh --install-cert` 的复制和 reload 命令，说明自动续期依赖。
9. 增加验证命令、故障排查和常见坑。

## 写作原则

- 保留第一人称部署记录的语气，不写成纯手册。
- 命令和配置尽量做到可复制，同时明确其中需要按实际项目调整的路径、服务名和邮箱。
- 不虚构仓库中尚未确认的目录结构；Docker Compose 示例采用与 Nginx 配置一致的 `mars-site` 服务名。
- 不保留与最终方案冲突的 Caddy 描述。
- 对 `listen ... http2` 的兼容性不做过度展开，以作者提供、可运行的配置为准。

## 验收标准

- 标题、摘要、标签和正文统一为 Docker + Nginx + acme.sh。
- 用户补充的全部小节均被扩写，而不是删除。
- 完整收录并解释用户提供的 Nginx HTTPS 配置。
- 流程覆盖首次 HTTP 验证、证书申请、HTTPS 切换、自动续期和排错。
- Markdown frontmatter 与代码块格式正确，文章中不再出现把 Caddy 当作当前部署组件的叙述。
