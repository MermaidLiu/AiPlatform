import Link from 'next/link';
import { SectionHeader } from '@/components/home/section-header';
import { ToolCard } from '@/components/tools/tool-card';
import { getCategoryLabel } from '@/data/categories';
import { getToolsByCategory } from '@/lib/data';
import type { Category } from '@/types';

interface CategoryToolWallProps {
  category: Category;
  limit?: number;
}

export function CategoryToolWall({ category, limit = 12 }: CategoryToolWallProps) {
  const tools = getToolsByCategory(category)
    .filter((tool) => !tool.ageRestricted)
    .slice(0, limit);

  return (
    <section
      id={`category-${category}`}
      className="scroll-mt-24 rounded-2xl border bg-white p-4 sm:p-5"
    >
      <SectionHeader
        title={getCategoryLabel(category)}
        href={`/category/${category}`}
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} variant="compact" />
        ))}
      </div>
      {tools.length === 0 && (
        <p className="text-sm text-muted-foreground">该品类暂无工具</p>
      )}
      <div className="mt-3 text-right">
        <Link
          href={`/category/${category}`}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          进入 {getCategoryLabel(category)} 专区 →
        </Link>
      </div>
    </section>
  );
}
