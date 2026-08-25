'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { buildFilterSearchParams, parseFilterFromSearchParams } from '@/lib/filter';
import { cn } from '@/lib/utils';

const filterItems = [
  { key: 'free', label: '免费' },
  { key: 'chinese', label: '有中文' },
  { key: 'tutorial', label: '有教程' },
  { key: 'mobile', label: '手机可用' },
  { key: 'agencyDiscount', label: '代理优惠' },
] as const;

export function ToolsFilter({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseFilterFromSearchParams(searchParams);

  function updateFilter(key: string, value: boolean) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) {
      next.set(key, 'true');
    } else {
      next.delete(key);
    }
    router.push(`/tools?${next.toString()}`);
  }

  function togglePrioritizeOwned() {
    const next = new URLSearchParams(searchParams.toString());
    const current = filters.prioritizeOwned !== false;
    if (current) {
      next.set('prioritizeOwned', 'false');
    } else {
      next.delete('prioritizeOwned');
    }
    router.push(`/tools?${next.toString()}`);
  }

  function clearFilters() {
    const q = searchParams.get('q');
    router.push(q ? `/tools?q=${encodeURIComponent(q)}` : '/tools');
  }

  const hasActiveFilters =
    filterItems.some((item) => filters[item.key]) ||
    filters.prioritizeOwned === false;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">筛选</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-primary hover:underline"
          >
            清除
          </button>
        )}
      </div>

      <div className="space-y-2">
        {filterItems.map((item) => (
          <label
            key={item.key}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
          >
            <input
              type="checkbox"
              checked={Boolean(filters[item.key])}
              onChange={(e) => updateFilter(item.key, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            {item.label}
          </label>
        ))}
      </div>

      <div className="border-t pt-4">
        <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
          <span className="font-medium">优先自研</span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.prioritizeOwned !== false}
            onClick={togglePrioritizeOwned}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
              filters.prioritizeOwned !== false ? 'bg-primary' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform',
                filters.prioritizeOwned !== false && 'translate-x-5'
              )}
            />
          </button>
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          关闭后排序恢复中立，第三方工具不会被隐藏
        </p>
      </div>
    </div>
  );
}

export function buildToolsUrl(options: Parameters<typeof buildFilterSearchParams>[0]) {
  const params = buildFilterSearchParams(options);
  const qs = params.toString();
  return qs ? `/tools?${qs}` : '/tools';
}
