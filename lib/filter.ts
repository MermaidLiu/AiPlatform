import type { FilterOptions, Tool } from '@/types';

export function filterTools(tools: Tool[], options: FilterOptions): Tool[] {
  let result = [...tools];

  if (options.category) {
    result = result.filter((t) => t.category.includes(options.category!));
  }

  if (options.scenario) {
    result = result.filter((t) => t.scenarios.includes(options.scenario!));
  }

  if (options.free) {
    result = result.filter((t) => t.isFree);
  }

  if (options.chinese) {
    result = result.filter((t) => t.hasChinese);
  }

  if (options.tutorial) {
    result = result.filter((t) => t.hasTutorial);
  }

  if (options.mobile) {
    result = result.filter((t) => t.mobileReady);
  }

  if (options.agencyDiscount) {
    result = result.filter((t) => t.agencyDiscount);
  }

  return result;
}

export function parseFilterFromSearchParams(
  params: URLSearchParams
): FilterOptions {
  return {
    free: params.get('free') === 'true',
    chinese: params.get('chinese') === 'true',
    tutorial: params.get('tutorial') === 'true',
    mobile: params.get('mobile') === 'true',
    agencyDiscount: params.get('agencyDiscount') === 'true',
    prioritizeOwned: params.get('prioritizeOwned') !== 'false',
    category: (params.get('category') as FilterOptions['category']) || undefined,
    scenario: params.get('scenario') || undefined,
    query: params.get('q') || undefined,
  };
}

export function buildFilterSearchParams(
  options: FilterOptions
): URLSearchParams {
  const params = new URLSearchParams();
  if (options.query) params.set('q', options.query);
  if (options.free) params.set('free', 'true');
  if (options.chinese) params.set('chinese', 'true');
  if (options.tutorial) params.set('tutorial', 'true');
  if (options.mobile) params.set('mobile', 'true');
  if (options.agencyDiscount) params.set('agencyDiscount', 'true');
  if (options.prioritizeOwned === false) params.set('prioritizeOwned', 'false');
  if (options.category) params.set('category', options.category);
  if (options.scenario) params.set('scenario', options.scenario);
  return params;
}
