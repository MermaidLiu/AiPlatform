<div align="center">

![JuvorAI](/web/public/logo.svg)

# JuvorAI

**统一智能体集成与管理平台**

基于 [New API](https://github.com/QuantumNous/new-api) 二次开发，将你购买或自建的 AI Agent 集中到一个平台统一管理。

<p align="center">
  <a href="./docs/JUVORAI.md">📖 完整文档</a> •
  <a href="./config/agents.example.yaml">🤖 Agent 配置模板</a> •
  <a href="https://github.com/QuantumNous/new-api">上游项目</a>
</p>

</div>

---

## 快速开始

### 无需 Docker（推荐）

```bash
chmod +x scripts/setup-native.sh
./scripts/setup-native.sh setup
./scripts/setup-native.sh start
```

或一键脚本（自动检测 Docker，无 Docker 则走本地模式）：

```bash
chmod +x scripts/setup.sh && ./scripts/setup.sh
```

访问 **http://localhost:3000**（默认账号 `root` / `123456`）

### Docker 模式（可选）

```bash
docker compose up -d
```

---

## 核心能力

- **多 Agent 集成** — OpenAI、Claude、Gemini、Dify、Coze、FastGPT 等 40+ 上游
- **统一 API 网关** — 所有 Agent 通过 OpenAI 兼容接口调用
- **用户与权限** — 多用户、分组、配额、API 令牌管理
- **用量统计** — 请求日志、费用核算、可视化看板
- **智能路由** — 多渠道负载均衡、失败自动重试

---

## 集成 Agent 三步走

1. **登录后台** → http://localhost:3000
2. **添加渠道** → 渠道管理 → 选择 Agent 类型 → 填入 API Key
3. **创建令牌** → 令牌管理 → 生成 API Key → 用 OpenAI SDK 调用

详细指南：[docs/JUVORAI.md](./docs/JUVORAI.md)

---

## 项目结构

```
├── common/constants.go      # 品牌名 JuvorAI
├── relay/channel/           # 40+ Agent 上游适配器
├── web/                     # React 管理后台
├── config/agents.example.yaml  # Agent 配置参考
├── scripts/setup.sh         # 一键部署
└── docker-compose.yml       # Docker 编排
```

---

## 许可证

继承上游 [New API](https://github.com/QuantumNous/new-api) 的 AGPLv3 许可证。
