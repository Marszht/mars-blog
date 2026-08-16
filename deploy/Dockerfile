# ---- 构建阶段 ----
FROM node:22-alpine AS builder
WORKDIR /app

# 百度统计 ID（构建期内联，可选）。默认空 = 不加载统计
ARG NEXT_PUBLIC_BAIDU_ANALYTICS_ID=""
ENV NEXT_PUBLIC_BAIDU_ANALYTICS_ID=$NEXT_PUBLIC_BAIDU_ANALYTICS_ID

# 先装依赖，利用缓存
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# 再拷源码构建
COPY . .
RUN npm run build

# ---- 运行阶段：standalone 精简产物 ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 非 root 运行更安全
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
