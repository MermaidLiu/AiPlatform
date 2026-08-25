import type { NewsItem } from '@/types';

export const newsItems: NewsItem[] = [
  {
    id: 'news-1',
    title: 'AgentFlow Guide 正式上线，覆盖办公、短漫剧、电商三大品类',
    summary:
      '首期收录 25+ AI 工具与 15 条场景化流程，支持自研工具透明披露与第三方并列对比。',
    publishedAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: 'news-2',
    title: '电商出海内容生产 Agent 支持多语言主图与详情页一键生成',
    summary:
      '面向出海卖家的多语言商品内容生产方案更新，可与 KickArt 等代理工具组合使用。',
    publishedAt: '2026-08-18T08:30:00.000Z',
  },
  {
    id: 'news-3',
    title: '短漫剧创作流程向导新增「全自研链路」标识',
    summary:
      '当流程每一步均有自研工具可胜任时，流程卡将展示「全自研链路」徽章，便于快速识别。',
    publishedAt: '2026-08-15T14:00:00.000Z',
  },
  {
    id: 'news-4',
    title: 'Token 聚合服务双区域版开放企业试用',
    summary:
      'ReachAPI + SusToken 双区域调度方案，帮助企业降低多模型 API 调用成本。',
    publishedAt: '2026-08-10T09:00:00.000Z',
  },
];
