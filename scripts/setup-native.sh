#!/usr/bin/env bash
# JuvorAI 本地运行脚本（无需 Docker）
# 使用 SQLite 数据库，单文件即可运行
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BIN_DIR="$PROJECT_DIR/bin"
DATA_DIR="$PROJECT_DIR/data"
LOG_DIR="$PROJECT_DIR/logs"
PID_FILE="$PROJECT_DIR/.juvorai.pid"
ENV_FILE="$PROJECT_DIR/.env"

# 默认 release 版本（与上游 new-api 同步）
JUVORAI_RELEASE="${JUVORAI_RELEASE:-v1.0.0-rc.25}"
GITHUB_RELEASE_BASE="https://github.com/QuantumNous/new-api/releases/download/${JUVORAI_RELEASE}"

cd "$PROJECT_DIR"

load_env() {
  if [ -f "$ENV_FILE" ]; then
    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
  fi
}

detect_platform() {
  local os arch
  os="$(uname -s | tr '[:upper:]' '[:lower:]')"
  arch="$(uname -m)"

  case "$os" in
    darwin)
      if [ "$arch" = "x86_64" ]; then
        echo "macos-intel"
      elif [ "$arch" = "arm64" ]; then
        echo "macos-arm64"
      else
        echo "macos"
      fi
      ;;
    linux)
      if [ "$arch" = "aarch64" ] || [ "$arch" = "arm64" ]; then
        echo "linux-arm64"
      else
        echo "linux"
      fi
      ;;
    mingw*|msys*|cygwin*)
      echo "windows"
      ;;
    *)
      echo "unknown"
      ;;
  esac
}

get_download_url() {
  local platform="$1"
  case "$platform" in
    macos|macos-arm64) echo "${GITHUB_RELEASE_BASE}/new-api-macos-${JUVORAI_RELEASE}" ;;
    macos-intel)       echo "" ;;  # Intel Mac 无预编译包，需源码构建
    linux)      echo "${GITHUB_RELEASE_BASE}/new-api-${JUVORAI_RELEASE}" ;;
    linux-arm64) echo "${GITHUB_RELEASE_BASE}/new-api-arm64-${JUVORAI_RELEASE}" ;;
    windows)    echo "${GITHUB_RELEASE_BASE}/new-api-${JUVORAI_RELEASE}.exe" ;;
    *)          return 1 ;;
  esac
}

try_download() {
  local url="$1" bin_path="$2"
  if command -v curl &>/dev/null; then
    curl -fL --retry 5 --retry-delay 10 --connect-timeout 30 --max-time 7200 -C - -o "$bin_path" "$url"
  elif command -v wget &>/dev/null; then
    wget -c -O "$bin_path" "$url"
  else
    return 1
  fi
}

get_binary_name() {
  local platform="$1"
  if [ "$platform" = "windows" ]; then
    echo "juvorai.exe"
  else
    echo "juvorai"
  fi
}

download_binary() {
  local platform url bin_name bin_path min_size
  platform="$(detect_platform)"
  if [ "$platform" = "unknown" ]; then
    echo "❌ 不支持的操作系统: $(uname -s) $(uname -m)"
    exit 1
  fi

  url="$(get_download_url "$platform")"
  bin_name="$(get_binary_name "$platform")"
  bin_path="$BIN_DIR/$bin_name"
  min_size=100000000  # 完整包约 132MB

  mkdir -p "$BIN_DIR"

  # Intel Mac 无官方预编译包
  if [ "$platform" = "macos-intel" ]; then
    echo "ℹ️  检测到 Intel Mac (x86_64)"
    echo "   官方 macOS 运行包仅支持 Apple Silicon，无法直接使用"
    echo ""
    echo "   请从源码构建（需 Node.js + 约 10 分钟）："
    echo "   ./scripts/build-intel-mac.sh"
    echo ""
    echo "   构建完成后启动："
    echo "   ./scripts/setup-native.sh start"
    exit 1
  fi

  if [ -f "$bin_path" ]; then
    local size
    size="$(wc -c < "$bin_path" | tr -d ' ')"
    if [ "$size" -gt "$min_size" ] && "$bin_path" --version &>/dev/null; then
      echo "✅ 已存在可执行文件: $bin_path"
      return 0
    fi
    if [ "$size" -gt 0 ]; then
      echo "⚠️  检测到不完整的运行包 (${size} bytes)，继续下载..."
    else
      rm -f "$bin_path"
    fi
  fi

  echo "📥 正在下载 JuvorAI 运行包 (${JUVORAI_RELEASE}, ${platform})..."
  echo "   完整大小约 132MB，支持断点续传"
  echo ""

  # 镜像列表（GitHub 直连慢时可自动切换）
  local mirrors=(
    "$url"
    "https://ghfast.top/${url}"
    "https://mirror.ghproxy.com/${url}"
  )

  local mirror ok=0
  for mirror in "${mirrors[@]}"; do
    echo "   尝试: $mirror"
    if try_download "$mirror" "$bin_path"; then
      ok=1
      break
    fi
    echo "   ⚠️  此源失败，尝试下一个..."
  done

  if [ "$ok" -eq 0 ]; then
    echo ""
    echo "❌ 所有下载源均失败。请手动下载："
    echo "   $url"
    echo ""
    echo "   下载后执行："
    echo "   mv ~/Downloads/new-api-macos-${JUVORAI_RELEASE} $bin_path"
    echo "   chmod +x $bin_path"
    echo "   ./scripts/setup-native.sh start"
    rm -f "$bin_path"
    exit 1
  fi

  if [ "$platform" != "windows" ]; then
    chmod +x "$bin_path"
  fi

  if ! "$bin_path" --version &>/dev/null; then
    echo "❌ 下载的运行包无法执行（可能仍不完整）"
    echo "   请重试: ./scripts/setup-native.sh setup"
    rm -f "$bin_path"
    exit 1
  fi

  echo "✅ 下载完成: $bin_path"
}

ensure_env() {
  mkdir -p "$DATA_DIR" "$LOG_DIR"

  if [ ! -f "$ENV_FILE" ]; then
    cp .env.native.example "$ENV_FILE"
    echo "✅ 已创建配置文件: .env"
  fi

  load_env

  # 确保使用 SQLite，不依赖外部数据库
  export SQLITE_PATH="${SQLITE_PATH:-./data/juvorai.db}"
  export MEMORY_CACHE_ENABLED="${MEMORY_CACHE_ENABLED:-true}"
  export TZ="${TZ:-Asia/Shanghai}"
  export PORT="${PORT:-3000}"
  export ERROR_LOG_ENABLED="${ERROR_LOG_ENABLED:-true}"
  export BATCH_UPDATE_ENABLED="${BATCH_UPDATE_ENABLED:-true}"

  # 清除可能冲突的外部数据库配置
  unset SQL_DSN REDIS_CONN_STRING 2>/dev/null || true
}

is_running() {
  if [ -f "$PID_FILE" ]; then
    local pid
    pid="$(cat "$PID_FILE")"
    if kill -0 "$pid" 2>/dev/null; then
      return 0
    fi
    rm -f "$PID_FILE"
  fi
  return 1
}

wait_for_ready() {
  local port="${PORT:-3000}"
  echo -n "⏳ 等待服务启动"
  for _ in {1..30}; do
    if curl -sf "http://localhost:${port}/api/status" >/dev/null 2>&1; then
      echo ""
      return 0
    fi
    sleep 1
    echo -n "."
  done
  echo ""
  return 1
}

cmd_setup() {
  echo "========================================"
  echo "  JuvorAI 本地部署（无需 Docker）"
  echo "========================================"
  echo ""

  download_binary
  ensure_env

  echo ""
  echo "✅ 环境准备完成！"
  echo ""
  echo "  启动命令:  ./scripts/setup-native.sh start"
  echo "  停止命令:  ./scripts/setup-native.sh stop"
  echo "  查看状态:  ./scripts/setup-native.sh status"
  echo ""
  echo "  数据目录:  $DATA_DIR"
  echo "  日志目录:  $LOG_DIR"
  echo ""
}

cmd_start() {
  ensure_env

  local platform bin_name bin_path port
  platform="$(detect_platform)"
  bin_name="$(get_binary_name "$platform")"
  bin_path="$BIN_DIR/$bin_name"
  port="${PORT:-3000}"

  if [ ! -f "$bin_path" ] || ! "$bin_path" --version &>/dev/null 2>&1; then
    if [ -f "$bin_path" ]; then
      echo "⚠️  运行包不完整或损坏，重新下载..."
    else
      echo "⚠️  未找到运行包 ($bin_path)，正在自动下载..."
    fi
    download_binary
  fi

  if is_running; then
    echo "✅ JuvorAI 已在运行 (PID: $(cat "$PID_FILE"))"
    echo "   访问: http://localhost:${port}"
    exit 0
  fi

  echo "🚀 启动 JuvorAI..."
  echo "   数据库: SQLite ($SQLITE_PATH)"
  echo "   端口:   ${port}"

  nohup "$bin_path" --port "$port" --log-dir "$LOG_DIR" > "$LOG_DIR/stdout.log" 2>&1 &
  echo $! > "$PID_FILE"

  if wait_for_ready; then
    echo ""
    echo "========================================"
    echo "  ✅ JuvorAI 启动成功！"
    echo "========================================"
    echo ""
    echo "  访问地址:  http://localhost:${port}"
    echo "  默认账号:  root"
    echo "  默认密码:  123456"
    echo ""
    echo "  ⚠️  请立即登录并："
    echo "  1. 修改默认密码"
    echo "  2. 系统设置 → 站点信息 → 系统名称改为 JuvorAI"
    echo "  3. 渠道管理 → 添加你的 Agent"
    echo ""
    echo "  查看日志: tail -f $LOG_DIR/stdout.log"
    echo ""
  else
    echo "❌ 启动超时，请查看日志:"
    echo "   tail -f $LOG_DIR/stdout.log"
    exit 1
  fi
}

cmd_stop() {
  if ! is_running; then
    echo "ℹ️  JuvorAI 未在运行"
    rm -f "$PID_FILE"
    exit 0
  fi

  local pid
  pid="$(cat "$PID_FILE")"
  echo "🛑 停止 JuvorAI (PID: $pid)..."
  kill "$pid" 2>/dev/null || true

  for _ in {1..10}; do
    if ! kill -0 "$pid" 2>/dev/null; then
      rm -f "$PID_FILE"
      echo "✅ 已停止"
      exit 0
    fi
    sleep 1
  done

  kill -9 "$pid" 2>/dev/null || true
  rm -f "$PID_FILE"
  echo "✅ 已强制停止"
}

cmd_status() {
  load_env
  local port="${PORT:-3000}"

  if is_running; then
    echo "✅ JuvorAI 运行中 (PID: $(cat "$PID_FILE"))"
    echo "   访问: http://localhost:${port}"
    if curl -sf "http://localhost:${port}/api/status" >/dev/null 2>&1; then
      echo "   健康检查: 正常"
    else
      echo "   健康检查: 异常（进程存在但 API 无响应）"
    fi
  else
    echo "⏹  JuvorAI 未运行"
    echo "   启动: ./scripts/setup-native.sh start"
  fi
}

cmd_build() {
  echo "========================================"
  echo "  从源码构建 JuvorAI（含品牌定制）"
  echo "========================================"
  echo ""

  # 检查 Go
  if ! command -v go &>/dev/null; then
    echo "❌ 未检测到 Go，请先安装:"
    echo "   macOS:  brew install go"
    echo "   或访问: https://go.dev/dl/"
    echo ""
    echo "💡 如果只想快速运行，请使用:"
    echo "   ./scripts/setup-native.sh setup && ./scripts/setup-native.sh start"
    exit 1
  fi

  # 检查 Bun 或 npm
  local pkg_mgr=""
  if command -v bun &>/dev/null; then
    pkg_mgr="bun"
  elif command -v npm &>/dev/null; then
    pkg_mgr="npm"
  else
    echo "❌ 未检测到 Bun 或 npm，请先安装其一:"
    echo "   Bun:  curl -fsSL https://bun.sh/install | bash"
    echo "   Node: brew install node"
    exit 1
  fi

  ensure_env
  mkdir -p "$BIN_DIR"

  echo "📦 构建前端 ($pkg_mgr)..."
  cd "$PROJECT_DIR/web"
  if [ "$pkg_mgr" = "bun" ]; then
    bun install
    DISABLE_ESLINT_PLUGIN=true bun run build
  else
    npm install
    DISABLE_ESLINT_PLUGIN=true npm run build
  fi

  echo "🔨 编译后端 (Go)..."
  cd "$PROJECT_DIR"
  CGO_ENABLED=0 go build -ldflags "-s -w" -o "$BIN_DIR/juvorai" .

  echo ""
  echo "✅ 构建完成: $BIN_DIR/juvorai"
  echo "   此版本已包含 JuvorAI 品牌定制"
  echo ""
  echo "   启动: ./scripts/setup-native.sh start"
}

usage() {
  cat <<EOF
JuvorAI 本地运行工具（无需 Docker）

用法:
  ./scripts/setup-native.sh setup    下载运行包并初始化环境
  ./scripts/setup-native.sh start    启动服务
  ./scripts/setup-native.sh stop     停止服务
  ./scripts/setup-native.sh status   查看运行状态
  ./scripts/setup-native.sh build    从源码构建（需 Go + Bun/npm，含 JuvorAI 品牌）
  ./scripts/setup-native.sh restart  重启服务

特点:
  - 无需 Docker、PostgreSQL、Redis
  - 使用 SQLite 单文件数据库
  - 数据保存在 ./data/ 目录

EOF
}

case "${1:-setup}" in
  setup)   cmd_setup ;;
  start)   cmd_start ;;
  stop)    cmd_stop ;;
  status)  cmd_status ;;
  build)   cmd_build ;;
  restart) cmd_stop; cmd_start ;;
  -h|--help|help) usage ;;
  *)
    echo "未知命令: $1"
    usage
    exit 1
    ;;
esac
