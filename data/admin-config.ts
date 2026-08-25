import type { AdminConfig } from '@/types';

export const defaultAdminConfig: AdminConfig = {
  ownedSectionEnabled: true,
  categoryGrayScale: {
    office: true,
    comic: true,
    ecommerce: true,
  },
  ownedToolIds: [
    'token-aggregator',
    'wanxiang-enterprise',
    'ecommerce-agent',
    'emotional-lab',
    'ai-trust',
  ],
  boostWeights: {
    'token-aggregator': 100,
    'wanxiang-enterprise': 90,
    'ecommerce-agent': 95,
    'emotional-lab': 70,
    'ai-trust': 85,
  },
};
