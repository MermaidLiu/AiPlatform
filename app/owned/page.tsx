import Link from 'next/link';
import { OwnedBadge } from '@/components/badges/owned-badge';
import { SectionHeader } from '@/components/home/section-header';
import { ToolIcon } from '@/components/tools/tool-icon';
import { getCategoryLabel } from '@/data/categories';
import { getOwnedPageGroups, getAllOwnedToolsOrdered } from '@/lib/owned';
import type { Tool } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '自研工具',
  description:
    'AgentFlow Guide 自研工具一览，含企业方案与三大品类分组，透明披露、客观对比',
};

export default function OwnedPage() {
  const { enterprise, categories } = getOwnedPageGroups();

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2">
            <OwnedBadge />
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              自研工具
            </h1>
          </div>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
            由我们自研或深度合作的能力，按企业方案与三大品类分组展示。
            「自研」标注仅表示归属，<strong>不代表唯一推荐</strong>，第三方工具同样收录可对比。
            <Link
              href="/about-recommendation"
              className="ml-1 text-primary hover:underline"
            >
              了解推荐原则 →
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* 企业方案 */}
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 to-white p-4 sm:p-5">
          <SectionHeader title="企业方案" subtitle="跨品类底层能力与企业级服务" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {enterprise.map((tool) => (
              <OwnedToolRow key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* 三大品类 */}
        {categories.map((group) => (
          <section
            key={group.id}
            className="rounded-2xl border bg-white p-4 sm:p-5"
          >
            <SectionHeader
              title={group.name}
              href={`/category/${group.id}`}
              linkLabel="进入品类"
            />
            {group.tools.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <OwnedToolRow key={`${group.id}-${tool.id}`} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">该品类暂无自研工具</p>
            )}
          </section>
        ))}

        <div className="rounded-xl border border-dashed bg-white p-6 text-center text-sm text-muted-foreground">
          共 {getAllOwnedToolsOrdered().length} 个自研工具 · 可在
          <Link href="/tools" className="mx-1 text-primary hover:underline">
            工具库
          </Link>
          中与第三方并列对比
        </div>
      </div>
    </div>
  );
}

function OwnedToolRow({ tool }: { tool: Tool }) {
  return (
    <div className="relative">
      {tool.ageRestricted && (
        <span className="absolute -right-1 -top-1 z-10 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          18+
        </span>
      )}
      <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
        <ToolIcon
          icon={tool.icon}
          name={tool.name}
          category={tool.category[0]}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <OwnedBadge size="sm" />
            {tool.category.map((c) => (
              <span
                key={c}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {getCategoryLabel(c)}
              </span>
            ))}
          </div>
          <Link
            href={`/tools/${tool.id}`}
            className="mt-1 block text-sm font-bold hover:text-primary"
          >
            {tool.name}
          </Link>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {tool.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
