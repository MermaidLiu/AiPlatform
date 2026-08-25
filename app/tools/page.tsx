import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchBar } from '@/components/search/search-bar';
import { ToolCard } from '@/components/tools/tool-card';
import { ToolsFilter } from '@/components/tools/tools-filter';
import { parseFilterFromSearchParams } from '@/lib/filter';
import { searchTools } from '@/lib/search';
import { getPublicTools } from '@/lib/data';

export const metadata: Metadata = {
  title: '工具库',
  description: '搜索与筛选 AI 工具，支持免费、中文、教程、手机可用、代理优惠等维度',
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function toURLSearchParams(
  params: Record<string, string | string[] | undefined>
): URLSearchParams {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string') sp.set(key, value);
  });
  return sp;
}

export default function ToolsPage({ searchParams }: PageProps) {
  const sp = toURLSearchParams(searchParams);
  const filters = parseFilterFromSearchParams(sp);
  const allTools = getPublicTools();
  const results = searchTools(allTools, filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 bg-[#f5f7fa] min-h-screen">
      <div className="mb-6 rounded-2xl border bg-white p-5">
        <h1 className="text-3xl font-bold">工具库</h1>
        <p className="mt-2 text-muted-foreground">
          搜索任务/工具/场景关键词，多维筛选，自研与第三方并列对比
        </p>
        <div className="mt-6 max-w-xl">
          <SearchBar defaultValue={filters.query ?? ''} />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-52 lg:shrink-0">
          <div className="rounded-xl border bg-white p-4 shadow-sm lg:sticky lg:top-24">
            <Suspense fallback={<p className="text-sm text-muted-foreground">加载筛选…</p>}>
              <ToolsFilter />
            </Suspense>
          </div>
        </aside>

        <div className="flex-1 rounded-2xl border bg-white p-4 sm:p-5">
          <p className="mb-4 text-sm text-muted-foreground">
            共 {results.length} 个工具
            {filters.query && (
              <span>
                {' '}
                · 搜索「<strong>{filters.query}</strong>」
              </span>
            )}
          </p>

          {results.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  variant="compact"
                  showOwnedRecommend={filters.prioritizeOwned !== false}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed bg-slate-50 p-12 text-center">
              <p className="font-medium">未找到匹配工具</p>
              <p className="mt-2 text-sm text-muted-foreground">
                试试调整关键词或清除部分筛选条件
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
