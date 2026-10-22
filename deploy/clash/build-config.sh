#!/bin/bash
# 从订阅配置生成最终 clash 配置（只代理 OpenAI/Codex）
# 用法：bash build-config.sh && docker restart clash
SUB="/opt/clash/subscription.yaml"
OUT="/opt/clash/config.yaml"

# 下载最新订阅
curl -sL --connect-timeout 15 'https://45.137.181.201/666/9i5rx1nlgnngMlz?clash=1' -o "$SUB"

# 取头部 + proxies + proxy-groups（到 rules 之前）
sed -n "1,563p" "$SUB" > "$OUT"

# 追加自定义规则（使用订阅中的代理组名 ⭐️ Auto）
cat >> "$OUT" << 'RULES'
rules:
  # OpenAI
  - DOMAIN-SUFFIX,openai.com,⭐️ Auto
  - DOMAIN-SUFFIX,oaistatic.com,⭐️ Auto
  - DOMAIN-SUFFIX,oaiusercontent.com,⭐️ Auto
  - DOMAIN-KEYWORD,openai,⭐️ Auto
  - DOMAIN-SUFFIX,chatgpt.com,⭐️ Auto
  - DOMAIN-SUFFIX,oaistorage.com,⭐️ Auto
  # Google Cloud Code (Codey / Gemini Code Assist)
  - DOMAIN-SUFFIX,googleapis.com,⭐️ Auto
  - DOMAIN-KEYWORD,cloudcode,⭐️ Auto
  - DOMAIN-KEYWORD,codex,⭐️ Auto
  # xAI / Grok
  - DOMAIN-SUFFIX,x.ai,⭐️ Auto
  - DOMAIN-SUFFIX,grok.com,⭐️ Auto
  # 其余直连
  - MATCH,DIRECT
RULES

echo "Config built: $(wc -l < "$OUT") lines"