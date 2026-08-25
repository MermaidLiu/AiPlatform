import { categories, getCategoryLabel } from '@/data/categories';
import { getAdminConfig, getToolById } from '@/lib/data';
import type { Category, Tool } from '@/types';

export function isOwnedSectionEnabled(): boolean {
  return getAdminConfig().ownedSectionEnabled;
}

/** 首页专区：5 个自研工具，排除成人向 */
export function getHomepageOwnedTools(): Tool[] {
  const config = getAdminConfig();
  if (!config.ownedSectionEnabled) return [];

  return config.ownedToolIds
    .map((id) => getToolById(id))
    .filter((t): t is Tool => Boolean(t && !t.ageRestricted));
}

/** 自研落地页：全部 5 个，含成人向 */
export function getAllOwnedToolsOrdered(): Tool[] {
  const config = getAdminConfig();
  return config.ownedToolIds
    .map((id) => getToolById(id))
    .filter((t): t is Tool => Boolean(t));
}

export function getEnterpriseOwnedTools(): Tool[] {
  return getAllOwnedToolsOrdered().filter(
    (t) => t.ownedGroup === 'enterprise' || t.category.length >= 2
  );
}

export function getOwnedToolsByCategory(category: Category): Tool[] {
  return getAllOwnedToolsOrdered().filter((t) =>
    t.category.includes(category)
  );
}

export function getOwnedPageGroups(): {
  enterprise: Tool[];
  categories: { id: Category; name: string; tools: Tool[] }[];
} {
  const allOwned = getAllOwnedToolsOrdered();

  const enterprise = allOwned.filter((t) => t.ownedGroup === 'enterprise');

  const categoryGroups = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    tools: allOwned.filter((t) => t.category.includes(cat.id)),
  }));

  return { enterprise, categories: categoryGroups };
}

export function parseOwnedDesc(ownedDesc: string): {
  affiliation: string;
  recommendation: string;
} {
  const parts = ownedDesc.split(/[。！？]/).filter(Boolean);
  if (parts.length >= 2) {
    return {
      affiliation: parts[0] + '。',
      recommendation: parts.slice(1).join('。') + (ownedDesc.endsWith('。') ? '' : ''),
    };
  }
  return { affiliation: ownedDesc, recommendation: '' };
}

export function getCategoryLabelsForTool(tool: Tool): string {
  return tool.category.map((c) => getCategoryLabel(c)).join(' · ');
}
