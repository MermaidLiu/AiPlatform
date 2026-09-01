#!/usr/bin/env bash
# 将 Token 底座接入 JuvorAI 渠道
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/config/token-base.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ 未找到 $ENV_FILE"
  echo "   请复制: cp config/token-base.env.example config/token-base.env"
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

JUVORAI_URL="${JUVORAI_URL:-http://localhost:3000}"
JUVORAI_USER="${JUVORAI_USER:-root}"
JUVORAI_PASS="${JUVORAI_PASS:-123456}"

for var in TOKEN_BASE_URL TOKEN_BASE_KEY TOKEN_BASE_MODEL; do
  if [ -z "${!var:-}" ]; then
    echo "❌ 配置缺失: $var"
    exit 1
  fi
done

TOKEN_BASE_NAME="${TOKEN_BASE_NAME:-Token底座-DeepSeek}"

echo "========================================"
echo "  接入 Token 底座到 JuvorAI"
echo "========================================"
echo ""

# 检查 JuvorAI 是否运行
if ! curl -sf "${JUVORAI_URL}/api/status" >/dev/null 2>&1; then
  echo "❌ JuvorAI 未运行，请先启动："
  echo "   ./scripts/setup-native.sh start"
  echo ""
  echo "   若尚未构建（Intel Mac）："
  echo "   ./scripts/build-intel-mac.sh"
  exit 1
fi

echo "✅ JuvorAI 已运行: $JUVORAI_URL"

# 测试上游连通性
echo "🔍 测试 Token 底座..."
UPSTREAM_TEST=$(curl -sS --connect-timeout 15 -X POST "${TOKEN_BASE_URL}/v1/chat/completions" \
  -H "Authorization: Bearer ${TOKEN_BASE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"${TOKEN_BASE_MODEL}\",\"messages\":[{\"role\":\"user\",\"content\":\"ping\"}],\"max_tokens\":5}" 2>&1) || true

if echo "$UPSTREAM_TEST" | grep -q '"object":"chat.completion"'; then
  echo "✅ Token 底座连通正常"
else
  echo "⚠️  Token 底座测试未返回预期结果，仍将继续添加渠道"
  echo "   响应: $(echo "$UPSTREAM_TEST" | head -c 200)"
fi

# 登录获取 access_token
echo "🔐 登录 JuvorAI..."
LOGIN_RESP=$(curl -sS -X POST "${JUVORAI_URL}/api/user/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${JUVORAI_USER}\",\"password\":\"${JUVORAI_PASS}\"}")

ACCESS_TOKEN=$(echo "$LOGIN_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('access_token',''))" 2>/dev/null || true)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ 登录失败，请检查账号密码"
  echo "$LOGIN_RESP" | head -c 300
  exit 1
fi
echo "✅ 登录成功"

# 添加渠道（OpenAI 兼容，base_url 不含 /v1）
echo "📡 添加渠道: $TOKEN_BASE_NAME"
ADD_RESP=$(curl -sS -X POST "${JUVORAI_URL}/api/channel/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$(python3 - <<PYEOF
import json
print(json.dumps({
    "mode": "single",
    "channel": {
        "type": 1,
        "name": "${TOKEN_BASE_NAME}",
        "key": "${TOKEN_BASE_KEY}",
        "base_url": "${TOKEN_BASE_URL}",
        "models": "${TOKEN_BASE_MODEL}",
        "group": "default",
        "weight": 1
    }
}))
PYEOF
)")

SUCCESS=$(echo "$ADD_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "False")

if [ "$SUCCESS" = "True" ]; then
  echo ""
  echo "========================================"
  echo "  ✅ Token 底座接入成功！"
  echo "========================================"
  echo ""
  echo "  渠道名称: $TOKEN_BASE_NAME"
  echo "  上游地址: $TOKEN_BASE_URL"
  echo "  模型:     $TOKEN_BASE_MODEL"
  echo ""
  echo "  下一步："
  echo "  1. 打开 ${JUVORAI_URL} → 令牌管理 → 创建 API 令牌"
  echo "  2. 选择模型 ${TOKEN_BASE_MODEL}"
  echo "  3. 用 JuvorAI 令牌调用："
  echo ""
  echo "  curl ${JUVORAI_URL}/v1/chat/completions \\"
  echo "    -H \"Authorization: Bearer sk-你的JuvorAI令牌\" \\"
  echo "    -H \"Content-Type: application/json\" \\"
  echo "    -d '{\"model\":\"${TOKEN_BASE_MODEL}\",\"messages\":[{\"role\":\"user\",\"content\":\"你好\"}]}'"
  echo ""
else
  echo "❌ 添加渠道失败"
  echo "$ADD_RESP"
  exit 1
fi
