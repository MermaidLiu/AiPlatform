#!/usr/bin/env bash
# 将 JuvorAI 项目推送到你的 GitHub 仓库
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# 可修改为你的 GitHub 用户名和仓库名
GITHUB_USER="${GITHUB_USER:-Mermaid-Liu}"
GITHUB_REPO="${GITHUB_REPO:-juvorAIPlatform}"

echo "========================================"
echo "  上传 JuvorAI 到 GitHub"
echo "========================================"
echo ""

# 确保没有提交密钥
if git ls-files --error-unmatch config/token-base.env >/dev/null 2>&1; then
  echo "❌ config/token-base.env 已被跟踪，含 API 密钥，请先移除"
  exit 1
fi

# 检查是否有未提交更改
if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  echo "⚠️  检测到未提交的更改，正在提交..."
  git add -A
  git reset config/token-base.env 2>/dev/null || true
  /usr/local/bin/git commit -m "chore: update JuvorAI project files" || true
fi

# 将上游 new-api 远程改名为 upstream（保留以便后续同步）
CURRENT_ORIGIN=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$CURRENT_ORIGIN" == *"QuantumNous/new-api"* ]]; then
  echo "📎 保留上游仓库为 upstream..."
  git remote rename origin upstream
fi

# 设置你的 GitHub 远程
GITHUB_URL="https://github.com/${GITHUB_USER}/${GITHUB_REPO}.git"
if git remote get-url origin >/dev/null 2>&1; then
  ORIGIN_URL=$(git remote get-url origin)
  if [[ "$ORIGIN_URL" != "$GITHUB_URL" ]]; then
    echo "🔗 更新 origin 为: $GITHUB_URL"
    git remote set-url origin "$GITHUB_URL"
  fi
else
  echo "🔗 添加 origin: $GITHUB_URL"
  git remote add origin "$GITHUB_URL"
fi

echo ""
echo "📤 推送到 GitHub..."
echo "   仓库: https://github.com/${GITHUB_USER}/${GITHUB_REPO}"
echo ""

if /usr/local/bin/git push -u origin main 2>&1; then
  echo ""
  echo "========================================"
  echo "  ✅ 上传成功！"
  echo "========================================"
  echo ""
  echo "  仓库地址: https://github.com/${GITHUB_USER}/${GITHUB_REPO}"
  echo ""
else
  echo ""
  echo "❌ 推送失败。请先在 GitHub 创建空仓库，然后重试："
  echo ""
  echo "  1. 打开 https://github.com/new"
  echo "  2. 仓库名: ${GITHUB_REPO}"
  echo "  3. 选择 Private（建议）"
  echo "  4. 不要勾选 README / .gitignore"
  echo "  5. 创建后重新运行: ./scripts/push-github.sh"
  echo ""
  echo "  若用户名不是 ${GITHUB_USER}，请设置："
  echo "  GITHUB_USER=你的用户名 ./scripts/push-github.sh"
  exit 1
fi
