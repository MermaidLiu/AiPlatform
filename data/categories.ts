import type { CategoryInfo } from '@/types';

export const categories: CategoryInfo[] = [
  {
    id: 'office',
    name: '办公效率',
    description: '汇报演示、文档写作、会议纪要、表格数据、邮件沟通等日常办公 AI 场景',
    icon: 'Briefcase',
    scenarios: [
      '汇报演示',
      '文档写作',
      '会议纪要',
      '表格数据',
      '邮件沟通',
      '日程笔记',
      '文档润色翻译',
    ],
  },
  {
    id: 'comic',
    name: '短漫剧创作',
    description: '从剧本大纲到分镜、出图、转视频、配音字幕的一体化短漫剧创作流程',
    icon: 'Clapperboard',
    scenarios: [
      '剧本大纲',
      '分镜',
      '角色一致性出图',
      '分镜转视频',
      '配音字幕',
    ],
  },
  {
    id: 'ecommerce',
    name: '电商资产设计室',
    description: '商品主图、详情页、营销海报、种草短视频与品牌视觉等电商内容生产',
    icon: 'ShoppingBag',
    scenarios: [
      '商品主图',
      '详情页',
      '营销海报',
      '种草短视频',
      '品牌视觉',
    ],
  },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.id, c])
) as Record<string, CategoryInfo>;

export function getCategoryLabel(id: string): string {
  return categoryMap[id]?.name ?? id;
}
