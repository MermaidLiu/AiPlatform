import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FlowCard } from '@/components/flows/flow-card';
import { SectionHeader } from '@/components/home/section-header';
import { ToolCard } from '@/components/tools/tool-card';
import { CategoryIcon } from '@/components/tools/tool-icon';
import { categoryMap, categories } from '@/data/categories';
import { getFlowsByCategory } from '@/data/flows';
import { getToolsByCategory } from '@/lib/data';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

interface PageProps {
  params: { category: string };
  searchParams: { scenario?: string };
}

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cat = categoryMap[params.category];
  if (!cat) return { title: '品类未找到' };
  return { title: cat.name, description: cat.description };
}

export default function CategoryPage({ params, searchParams }: PageProps) {
  const cat = categoryMap[params.category];
  if (!cat) notFound();

  const category = params.category as Category;
  const activeScenario = searchParams.scenario;
  const categoryFlows = getFlowsByCategory(category);
  const categoryTools = getToolsByCategory(category).filter(
    (t) => !t.ageRestricted
  );

  const filteredFlows = activeScenario
    ? categoryFlows.filter((f) => f.scenario === activeScenario)
    : categoryFlows;

  const filteredTools = activeScenario
    ? categoryTools.filter((t) => t.scenarios.includes(activeScenario))
    : categoryTools;

  return (
    <div className="bg-[#f5f7fa] min-h-screen">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-6 sm:px-6">
          <CategoryIcon category={category} icon={cat.icon} />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{cat.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        {/* 左侧场景导航 — ai-bot 分类侧栏风格 */}
        <aside className="hidden w-44 shrink-0 lg:block">
          <nav className="sticky top-24 rounded-xl border bg-white p-3 shadow-sm">
            <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              任务场景
            </p>
            <Link
              href={`/category/${category}`}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm transition-colors',
                !activeScenario
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              全部
            </Link>
            {cat.scenarios.map((scenario) => (
              <Link
                key={scenario}
                href={`/category/${category}?scenario=${encodeURIComponent(scenario)}`}
                className={cn(
                  'block rounded-lg px-3 py-2 text-sm transition-colors',
                  activeScenario === scenario
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {scenario}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          {/* 移动端场景横向滚动 */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <ScenarioChip
              href={`/category/${category}`}
              active={!activeScenario}
              label="全部"
            />
            {cat.scenarios.map((scenario) => (
              <ScenarioChip
                key={scenario}
                href={`/category/${category}?scenario=${encodeURIComponent(scenario)}`}
                active={activeScenario === scenario}
                label={scenario}
              />
            ))}
          </div>

          {/* 工具网格 — 优先展示 */}
          <section className="rounded-2xl border bg-white p-4 sm:p-5">
            <SectionHeader
              title="工具"
              href={`/tools?category=${category}`}
              linkLabel="工具库筛选"
            />
            {filteredTools.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} variant="compact" />
                ))}
              </div>
            ) : (
              <EmptyState message="该场景暂无匹配工具。" />
            )}
          </section>

          {/* 相关流程 */}
          <section className="rounded-2xl border bg-white p-4 sm:p-5">
            <SectionHeader title="相关流程" href="/flow" />
            {filteredFlows.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredFlows.map((flow) => (
                  <FlowCard key={flow.id} flow={flow} compact />
                ))}
              </div>
            ) : (
              <EmptyState message="该场景暂无流程。" />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function ScenarioChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'shrink-0 rounded-full border px-3 py-1 text-xs transition-colors',
        active
          ? 'border-primary bg-primary/10 font-medium text-primary'
          : 'border-slate-200 bg-white text-slate-600'
      )}
    >
      {label}
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-slate-50 p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
