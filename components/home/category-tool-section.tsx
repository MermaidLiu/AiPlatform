import { SectionHeader } from '@/components/home/section-header';
import { ToolCard } from '@/components/tools/tool-card';
import { getCategoryLabel } from '@/data/categories';
import { getToolsByCategory } from '@/lib/data';
import type { Category } from '@/types';

interface CategoryToolSectionProps {
  category: Category;
  limit?: number;
}

export function CategoryToolSection({
  category,
  limit = 12,
}: CategoryToolSectionProps) {
  const tools = getToolsByCategory(category)
    .filter((t) => !t.ageRestricted)
    .slice(0, limit);

  return (
    <section className="rounded-2xl border bg-white p-4 sm:p-5">
      <SectionHeader
        title={getCategoryLabel(category)}
        href={`/category/${category}`}
      />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} variant="compact" />
        ))}
      </div>
    </section>
  );
}
