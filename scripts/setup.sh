#!/usr/bin/env bash
# JuvorAI 一键部署脚本（自动选择 Docker 或本地模式）
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "========================================"
echo "  JuvorAI 智能体集成平台 - 部署脚本"
echo "========================================"
echo ""

cd "$PROJECT_DIR"

# 优先使用 Docker；未安装则自动切换到本地模式
if command -v docker &>/dev/null && docker compose version &>/dev/null; then
  echo "🐳 检测到 Docker，使用 Docker 模式部署"
  echo ""

  mkdir -p data logs

  if [ ! -f .env ] && [ -f .env.juvorai.example ]; then
    cp .env.juvorai.example .env
    echo "✅ 已创建 .env 配置文件"
  fi

  echo "🚀 启动 JuvorAI 服务..."
  docker compose up -d

  echo ""
  echo "⏳ 等待服务就绪..."
  for i in {1..30}; do
    if curl -sf http://localhost:3000/api/status >/dev/null 2>&1; then
      echo ""
      echo "========================================"
      echo "  ✅ JuvorAI 部署成功！（Docker 模式）"
      echo "========================================"
      echo ""
      echo "  访问地址:  http://localhost:3000"
      echo "  默认账号:  root"
      echo "  默认密码:  123456"
      echo ""
      exit 0
    fi
    sleep 2
    echo -n "."
  done

  echo ""
  echo "⚠️  服务启动超时，请检查日志:"
  echo "   docker compose logs -f juvorai"
  exit 1
else
  echo "💻 未检测到 Docker，自动切换到本地模式（无需 Docker）"
  echo ""
  exec "$SCRIPT_DIR/setup-native.sh" setup
  echo ""
  exec "$SCRIPT_DIR/setup-native.sh" start
fi
