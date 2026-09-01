# JuvorAI 智能体集成平台

> 基于 [New API](https://github.com/QuantumNous/new-api) 二次开发的统一智能体管理与 API 网关平台

JuvorAI 将你购买或自建的各类 AI Agent 集中到一个平台，提供统一的 API 入口、用户管理、用量统计和权限控制。

---

## 功能概览

| 功能 | 说明 |
|------|------|
| 多 Agent 集成 | 支持 OpenAI、Claude、Gemini、Dify、Coze、FastGPT 等 40+ 上游 |
| 统一 API | 所有 Agent 通过 OpenAI 兼容接口调用 |
| 用户管理 | 多用户、分组、配额、令牌管理 |
| 用量统计 | 请求日志、费用核算、数据看板 |
| 负载均衡 | 多渠道加权随机、失败自动重试 |
| 格式转换 | OpenAI ⇄ Claude ⇄ Gemini 自动转换 |

---

## 快速开始

### 方式一：本地运行（无需 Docker，推荐）

不需要安装 Docker、PostgreSQL 或 Redis，使用 SQLite 单文件数据库即可运行：

```bash
# 一键部署（无 Docker 时自动走本地模式）
chmod +x scripts/setup.sh
./scripts/setup.sh

# 或手动分步操作
chmod +x scripts/setup-native.sh
./scripts/setup-native.sh setup    # 下载运行包 + 初始化
./scripts/setup-native.sh start    # 启动服务
./scripts/setup-native.sh stop     # 停止服务
./scripts/setup-native.sh status   # 查看状态
```

**本地模式特点：**
- 无需 Docker / PostgreSQL / Redis
- 数据保存在 `./data/juvorai.db`
- 首次启动会自动从 GitHub 下载运行包（约 120MB）
- 登录后在 **系统设置 → 站点信息** 将系统名称改为 **JuvorAI**

如需包含 JuvorAI 源码级品牌定制，需从源码构建（需安装 Go + Bun）：

```bash
./scripts/setup-native.sh build
./scripts/setup-native.sh start
```

### 方式二：Docker Compose（可选）

```bash
# 需要已安装 Docker
docker compose up -d

# 查看日志
docker compose logs -f juvorai
```

启动后访问 **http://localhost:3000**

- 默认管理员账号：`root`
- 默认密码：`123456`
- **请立即登录并修改密码！**

---

## 集成你的 Agent

### 步骤 1：登录管理后台

访问 http://localhost:3000，使用管理员账号登录。

### 步骤 2：添加渠道（Channel）

进入 **渠道管理 → 添加渠道**，根据你购买的 Agent 类型选择：

| Agent 类型 | 渠道类型 | 需要填写 |
|-----------|---------|---------|
| OpenAI / GPT 系列 | OpenAI | API Key + Base URL |
| Claude | Anthropic | API Key |
| Google Gemini | Gemini | API Key |
| Dify 智能体 | Dify | API Key + App ID |
| Coze 机器人 | Coze | Personal Access Token |
| FastGPT 知识库 | FastGPT | API Key |
| 第三方 OpenAI 兼容 API | 自定义 | Base URL + API Key |
| 本地 Ollama 模型 | Ollama | Base URL (默认 localhost:11434) |

详细配置示例见 [`config/agents.example.yaml`](../config/agents.example.yaml)

### 步骤 3：创建 API 令牌

进入 **令牌管理 → 添加令牌**：

1. 设置令牌名称
2. 选择可用模型（或留空表示全部）
3. 设置配额限制（可选）
4. 复制生成的 API Key

### 步骤 4：调用 Agent

使用 OpenAI SDK 或 HTTP 请求调用：

```bash
curl http://localhost:3000/v1/chat/completions \
  -H "Authorization: Bearer sk-your-juvorai-token" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

Python 示例：

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-juvorai-token",
    base_url="http://localhost:3000/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好，请介绍一下你自己"}]
)
print(response.choices[0].message.content)
```

---

## 常见 Agent 接入指南

### Dify Agent

1. 在 Dify 平台创建 Agent 应用
2. 获取 API Key（应用设置 → API 访问）
3. JuvorAI 后台添加渠道：
   - 类型：**Dify**
   - Base URL：`https://api.dify.ai/v1`（或自建地址）
   - Key：Dify API Key
   - 模型名：自定义（如 `my-dify-agent`）

### Coze Bot

1. 在 Coze 平台创建 Bot
2. 获取 Personal Access Token
3. JuvorAI 后台添加渠道：
   - 类型：**Coze**
   - Base URL：`https://api.coze.com`
   - Key：PAT Token

### 第三方购买的 OpenAI 兼容 API

很多 Agent 服务商提供 OpenAI 兼容接口：

1. 渠道类型选 **OpenAI** 或 **自定义**
2. Base URL 填服务商提供的地址
3. API Key 填购买的密钥
4. 模型名填服务商文档中的 model ID

---

## 本地开发

### 环境要求

- Go 1.22+
- Bun（前端包管理）
- Docker（可选，用于数据库）

### 开发模式

```bash
# 后端
go run main.go

# 前端（另开终端）
cd web && bun install && bun run dev
```

前端开发服务器：http://localhost:5173  
后端 API：http://localhost:3000

### 从源码构建 Docker 镜像

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

---

## 项目结构

```
juvorAIPlatform/
├── common/           # 全局常量（SystemName = "JuvorAI"）
├── controller/       # API 控制器
├── relay/            # AI 请求转发（40+ 上游适配器）
│   └── channel/      # 各 Agent 提供商实现
├── web/              # React 前端
├── config/           # Agent 配置模板
├── scripts/          # 部署脚本
├── docs/             # 文档
└── docker-compose.yml
```

---

## 品牌定制

JuvorAI 品牌配置位置：

| 配置项 | 文件 |
|--------|------|
| 系统名称 | `common/constants.go` → `SystemName` |
| 前端默认名 | `web/src/lib/constants.ts` |
| 页面标题 | `web/index.html` |
| Logo | `web/public/logo.png`（替换此文件） |
| 运行时配置 | 管理后台 → 系统设置 → 站点信息 |

---

## 生产部署注意事项

1. **修改所有默认密码**（数据库、Redis、管理员）
2. **设置 SESSION_SECRET** 环境变量（随机字符串）
3. **配置 HTTPS**（Nginx / Caddy 反向代理）
4. **备份数据目录** `./data`

---

## 上游项目

本项目基于 [New API](https://github.com/QuantumNous/new-api)（AGPLv3 许可证）二次开发。

- 原项目文档：https://docs.newapi.pro
- 原项目 GitHub：https://github.com/QuantumNous/new-api

---

## 许可证

本项目继承 New API 的 [AGPLv3](LICENSE) 许可证。二次开发需保留原作者版权声明。
