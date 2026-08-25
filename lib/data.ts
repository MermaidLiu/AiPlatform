import { applyVerificationToTools } from '@/lib/verification';
import { tools } from '@/data/tools';
import { flows } from '@/data/flows';
import { categories } from '@/data/categories';
import { newsItems } from '@/data/news';
import { defaultAdminConfig } from '@/data/admin-config';
import type { Category, Tool } from '@/types';

let cachedTools: Tool[] | null = null;

export function getAllTools(): Tool[] {
  if (!cachedTools) {
    cachedTools = applyVerificationToTools(tools);
  }
  return cachedTools;
}

export function invalidateToolsCache() {
  cachedTools = null;
}

export function getAllFlows() {
  return flows;
}

export function getAllCategories() {
  return categories;
}

export function getAllNews() {
  return newsItems;
}

export function getAdminConfig() {
  return defaultAdminConfig;
}

export function getToolById(id: string): Tool | undefined {
  return getAllTools().find((t) => t.id === id);
}

export function getFlowById(id: string) {
  return flows.find((f) => f.id === id);
}

export function getOwnedTools(): Tool[] {
  return getAllTools().filter((t) => t.owned);
}

export function getAgencyTools(): Tool[] {
  return getAllTools().filter((t) => t.agencyDiscount);
}

export function getToolsByCategory(category: Category): Tool[] {
  return getAllTools().filter((t) => t.category.includes(category));
}

export function getPublicTools(): Tool[] {
  return getAllTools().filter((t) => !t.ageRestricted);
}

export function getLatestTools(limit = 8): Tool[] {
  return getPublicTools()
    .sort(
      (a, b) =>
        new Date(b.lastVerified).getTime() - new Date(a.lastVerified).getTime()
    )
    .slice(0, limit);
}

export function getHotTools(limit = 10): Tool[] {
  return getPublicTools()
    .sort((a, b) => {
      if (a.boostWeight !== b.boostWeight) return b.boostWeight - a.boostWeight;
      if (a.owned !== b.owned) return a.owned ? -1 : 1;
      return (
        new Date(b.lastVerified).getTime() - new Date(a.lastVerified).getTime()
      );
    })
    .slice(0, limit);
}

export function isToolNew(tool: Tool): boolean {
  const days =
    (Date.now() - new Date(tool.lastVerified).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 45;
}
