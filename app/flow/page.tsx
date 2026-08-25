import type { Metadata } from 'next';
import { FlowCard } from '@/components/flows/flow-card';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/data/categories';
import { flows } from '@/data/flows';
import type { Category } from '@/types';

export const metadata: Metadata = {
  title: '流程向导',
  description: '按品类与场景浏览 AI 工作流，从步骤到工具一站搞定',
};

interface PageProps {
  searchParams: { category?: string; scenario?: string };
}

export default function FlowListPage({ searchParams }: PageProps) {
  const activeCategory = searchParams.category as Category | undefined;
  const activeScenario = searchParams.scenario;

  let filtered = [...flows];
  if (activeCategory) {
    filtered = filtered.filter((f) => f.category === activeCategory);
  }
  if (activeScenario) {
    filtered = filtered.filter((f) => f.scenario === activeScenario);
  }

  const scenarios = activeCategory
    ? categories.find((c) => c.id === activeCategory)?.scenarios ?? []
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">流程向导</h1>
      <p className="mt-2 text-muted-foreground">
        场景 → 步骤 → 候选工具，手把手走完任务（完整对比功能持续完善中）
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <FilterLink
          href="/flow"
          active={!activeCategory}
          label="全部品类"
        />
        {categories.map((cat) => (
          <FilterLink
            key={cat.id}
            href={`/flow?category=${cat.id}`}
            active={activeCategory === cat.id}
            label={cat.name}
          />
        ))}
      </div>

      {scenarios.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterLink
            href={`/flow?category=${activeCategory}`}
            active={!activeScenario}
            label="全部场景"
          />
          {scenarios.map((s) => (
            <FilterLink
              key={s}
              href={`/flow?category=${activeCategory}&scenario=${encodeURIComponent(s)}`}
              active={activeScenario === s}
              label={s}
            />
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((flow) => (
          <FlowCard key={flow.id} flow={flow} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          暂无匹配流程
        </div>
      )}
    </div>
  );
}

function FilterLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <a href={href}>
      <Badge
        variant={active ? 'default' : 'secondary'}
        className="cursor-pointer px-3 py-1"
      >
        {label}
      </Badge>
    </a>
  );
}
