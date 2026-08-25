import type { Flow, FilterOptions, Tool } from '@/types';
import { filterTools } from './filter';

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

function toolMatchesQuery(tool: Tool, query: string): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;

  const haystack = [
    tool.name,
    tool.tagline,
    tool.description,
    ...tool.scenarios,
    ...tool.category,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

function flowMatchesQuery(flow: Flow, query: string): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;

  const haystack = [
    flow.title,
    flow.description,
    flow.scenario,
    ...flow.tags,
    ...flow.steps.map((s) => `${s.title} ${s.description}`),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

export function sortToolsByPriority(
  tools: Tool[],
  prioritizeOwned = true
): Tool[] {
  return [...tools].sort((a, b) => {
    if (prioritizeOwned) {
      if (a.owned !== b.owned) return a.owned ? -1 : 1;
      if (a.boostWeight !== b.boostWeight) return b.boostWeight - a.boostWeight;
    }
    return a.name.localeCompare(b.name, 'zh-CN');
  });
}

export function searchTools(
  tools: Tool[],
  options: FilterOptions
): Tool[] {
  let result = filterTools(tools, options);

  if (options.query) {
    result = result.filter((t) => toolMatchesQuery(t, options.query!));
  }

  return sortToolsByPriority(result, options.prioritizeOwned !== false);
}

export function searchFlows(flows: Flow[], query?: string): Flow[] {
  if (!query) return flows;
  return flows.filter((f) => flowMatchesQuery(f, query));
}

export function getOwnedTools(tools: Tool[]): Tool[] {
  return tools.filter((t) => t.owned);
}

export function getAgencyTools(tools: Tool[]): Tool[] {
  return tools.filter((t) => t.agencyDiscount);
}

export function getToolById(tools: Tool[], id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}

export function getFlowById(flows: Flow[], id: string): Flow | undefined {
  return flows.find((f) => f.id === id);
}

export function sortCandidateTools(
  toolIds: string[],
  tools: Tool[],
  prioritizeOwned = true
): Tool[] {
  const matched = toolIds
    .map((id) => tools.find((t) => t.id === id))
    .filter((t): t is Tool => Boolean(t));

  return sortToolsByPriority(matched, prioritizeOwned);
}
