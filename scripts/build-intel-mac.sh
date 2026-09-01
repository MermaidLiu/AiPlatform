#!/usr/bin/env bash
# 为 Intel Mac (x86_64) 从源码构建 JuvorAI
# 官方预编译包仅支持 Apple Silicon，Intel Mac 必须本地编译
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
GO_DIR="${GO_DIR:-/tmp/go-local/go}"
GO_VERSION="${GO_VERSION:-1.25.1}"
BIN_PATH="$PROJECT_DIR/bin/juvorai"

cd "$PROJECT_DIR"

echo "========================================"
echo "  JuvorAI Intel Mac 源码构建"
echo "  架构: $(uname -m)"
echo "========================================"
echo ""

if [ "$(uname -m)" != "x86_64" ]; then
  echo "ℹ️  当前不是 Intel Mac，可尝试: ./scripts/setup-native.sh setup"
fi

# 1. 准备 Go
if ! "$GO_DIR/bin/go" version &>/dev/null 2>&1; then
  echo "📥 下载 Go ${GO_VERSION} (darwin-amd64)..."
  mkdir -p "$(dirname "$GO_DIR")"
  curl -fL -o /tmp/go.tar.gz "https://go.dev/dl/go${GO_VERSION}.darwin-amd64.tar.gz"
  rm -rf "$(dirname "$GO_DIR")/go"
  tar -C "$(dirname "$GO_DIR")" -xzf /tmp/go.tar.gz
fi

export PATH="$GO_DIR/bin:$PATH"
export GOPROXY="${GOPROXY:-https://goproxy.cn,direct}"
echo "✅ $(go version)"

# 2. 检查 Node
if ! command -v npm &>/dev/null; then
  echo "❌ 需要 Node.js/npm，请安装: https://nodejs.org/"
  exit 1
fi
echo "✅ Node $(node --version)"

# 3. 构建前端
echo ""
echo "📦 安装前端依赖（使用国内镜像加速）..."
cd "$PROJECT_DIR/web"
npm config set registry https://registry.npmmirror.com
npm install

echo "🔨 构建前端..."
DISABLE_ESLINT_PLUGIN=true npm run build

# 4. 编译后端
echo ""
echo "🔨 编译 JuvorAI (Intel Mac)..."
cd "$PROJECT_DIR"
mkdir -p bin
CGO_ENABLED=0 go build -ldflags "-s -w" -o "$BIN_PATH" .

chmod +x "$BIN_PATH"
echo ""
echo "========================================"
echo "  ✅ 构建成功！"
echo "========================================"
echo ""
echo "  运行包: $BIN_PATH"
file "$BIN_PATH"
"$BIN_PATH" --version
echo ""
echo "  启动: ./scripts/setup-native.sh start"
echo ""
