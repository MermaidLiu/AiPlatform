import type { NewsItem } from '@/types';

export const newsItems: NewsItem[] = [
  {
    id: 'news-1',
    title: 'OpenAI 发布 GPT-5 预览版，多模态推理能力再升级',
    summary:
      '新版模型在代码生成与长文档理解上表现突出，企业 API 已开放限量试用，定价策略待官方公布。',
    publishedAt: '2026-08-27T09:00:00.000Z',
    dateLabel: '8月27 · 周四',
    source: 'OpenAI 官方',
    status: 'published',
  },
  {
    id: 'news-2',
    title: 'Anthropic Claude 4 支持 200K 上下文窗口',
    summary:
      'Claude 4 系列面向企业客户开放更长上下文，适合法律、研报等长文档场景，API 按 token 计费。',
    publishedAt: '2026-08-27T08:30:00.000Z',
    dateLabel: '8月27 · 周四',
    source: 'Anthropic',
    status: 'published',
  },
  {
    id: 'news-3',
    title: 'Google Gemini 2.5 图像编辑功能向开发者开放',
    summary:
      'Gemini API 新增局部重绘与风格迁移接口，可与现有电商主图工作流对接，目前处于公测阶段。',
    publishedAt: '2026-08-26T10:00:00.000Z',
    dateLabel: '8月26 · 周三',
    source: 'Google DeepMind',
    status: 'published',
  },
  {
    id: 'news-4',
    title: 'AgentFlow Guide 正式上线，覆盖办公、短漫剧、电商三大品类',
    summary:
      '首期收录 25+ AI 工具与 15 条场景化流程，支持自研工具透明披露与第三方并列对比。',
    publishedAt: '2026-08-20T10:00:00.000Z',
    dateLabel: '8月20 · 周三',
    source: 'AgentFlow Guide',
    status: 'published',
  },
  {
    id: 'news-5',
    title: '电商出海内容生产 Agent 支持多语言主图与详情页一键生成',
    summary:
      '面向出海卖家的多语言商品内容生产方案更新，可与 KickArt 等代理工具组合使用。',
    publishedAt: '2026-08-18T08:30:00.000Z',
    dateLabel: '8月18 · 周一',
    source: 'AgentFlow 自研团队',
    status: 'published',
  },
  {
    id: 'news-6',
    title: '短漫剧创作流程向导新增「全自研链路」标识',
    summary:
      '当流程每一步均有自研工具可胜任时，流程卡将展示「全自研链路」徽章，便于快速识别。',
    publishedAt: '2026-08-15T14:00:00.000Z',
    dateLabel: '8月15 · 周五',
    source: 'AgentFlow Guide',
    status: 'published',
  },
  {
    id: 'news-7',
    title: 'Token 聚合服务双区域版开放企业试用',
    summary:
      'ReachAPI + SusToken 双区域调度方案，帮助企业降低多模型 API 调用成本。',
    publishedAt: '2026-08-10T09:00:00.000Z',
    dateLabel: '8月10 · 周日',
    source: 'AgentFlow 自研团队',
    status: 'published',
  },
];
