#!/usr/bin/env bash
# ============================================================
# mars-site 一键部署/更新脚本（阿里云服务器）
# 用法：
#   ./deploy.sh                 # 默认部署到 8.148.181.40
#   SERVER=1.2.3.4 ./deploy.sh  # 指定服务器
#   REMOTE_USER=ubuntu ./deploy.sh  # 指定登录用户
#
# 前置条件：
#   1. 本机已配置 SSH 免密登录（或会提示输入密码）
#   2. 服务器已有 /opt/mars-site 与 /opt/nginx-conf（首次见 README 部署章节）
#   3. 服务器 80/443 由 nginx 占用，本站通过现有 nginx 反代（非 Caddy）
# ============================================================
set -euo pipefail

SERVER="${SERVER:-8.148.181.40}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_DIR="/opt/mars-site"
SSH_OPTS="-o StrictHostKeyChecking=accept-new -o ConnectTimeout=15"

# 脚本所在目录（项目根）
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_SRC="${PROJECT_DIR}/web"
DOCKERFILE_SRC="${PROJECT_DIR}/deploy/Dockerfile"
COMPOSE_SRC="${PROJECT_DIR}/deploy/docker-compose.server.yml"
NGINX_CONF_SRC="${PROJECT_DIR}/deploy/marsmz.top.conf"   # 可选，若存在则同步
NGINX_REMOTE="/opt/nginx-conf/marsmz.top.conf"

echo "==> [1/4] 同步 web 源码 -> ${REMOTE_USER}@${SERVER}:${REMOTE_DIR}/web"
rsync -az --delete \
  -e "ssh ${SSH_OPTS}" \
  --exclude node_modules --exclude .next --exclude .git --exclude .npm-cache \
  "${WEB_SRC}/" "${REMOTE_USER}@${SERVER}:${REMOTE_DIR}/web/"

echo "==> [2/4] 同步部署文件 -> ${REMOTE_DIR}/deploy"
ssh ${SSH_OPTS} "${REMOTE_USER}@${SERVER}" "mkdir -p ${REMOTE_DIR}/deploy"
rsync -az \
  -e "ssh ${SSH_OPTS}" \
  "${DOCKERFILE_SRC}" "${REMOTE_USER}@${SERVER}:${REMOTE_DIR}/deploy/Dockerfile"
scp ${SSH_OPTS} "${COMPOSE_SRC}" "${REMOTE_USER}@${SERVER}:${REMOTE_DIR}/docker-compose.yml"

# 可选：同步 nginx 配置（若本地存在）
if [ -f "${NGINX_CONF_SRC}" ]; then
  echo "==> [2.5] 同步 nginx 配置 -> ${NGINX_REMOTE}"
  scp ${SSH_OPTS} "${NGINX_CONF_SRC}" "${REMOTE_USER}@${SERVER}:${NGINX_REMOTE}"
  ssh ${SSH_OPTS} "${REMOTE_USER}@${SERVER}" \
    "docker exec opt-nginx-1 nginx -t && docker exec opt-nginx-1 nginx -s reload"
fi

echo "==> [3/4] 服务器上重新构建并启动容器"
ssh ${SSH_OPTS} "${REMOTE_USER}@${SERVER}" \
  "cd ${REMOTE_DIR} && docker compose up -d --build"

echo "==> [4/4] 验证"
ssh ${SSH_OPTS} "${REMOTE_USER}@${SERVER}" \
  "docker ps --filter name=mars-site --format '{{.Names}}  {{.Status}}'"

echo "✅ 部署完成：https://marsmz.top"
