import Link from 'next/link';
import { AgencyBadge } from '@/components/badges/agency-badge';
import { OwnedBadge } from '@/components/badges/owned-badge';
import { ToolIcon } from '@/components/tools/tool-icon';
import { getCategoryLabel } from '@/data/categories';
import { getOfficialCapabilityTools } from '@/lib/owned';
import type { Tool } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '官方能力',
  description:
    'AgentFlow Guide 官方能力一览：5 个自研工具与 5 个代理优惠工具，透明披露、客观对比',
};

export default function OwnedPage() {
  const tools = getOfficialCapabilityTools();

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            官方能力
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
            5 个自研工具与 5 个代理优惠工具直接堆叠展示。「自研」与「代理优惠」标注仅表示归属与合作，
            <strong>不代表唯一推荐</strong>，第三方工具同样收录可对比。
            <Link
              href="/about-recommendation"
              className="ml-1 text-primary hover:underline"
            >
              了解推荐原则 →
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {tools.map((tool) => (
            <OfficialCapabilityCard key={tool.id} tool={tool} />
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-dashed bg-white p-6 text-center text-sm text-muted-foreground">
          共 {tools.length} 个官方能力工具 · 可在
          <Link href="/tools" className="mx-1 text-primary hover:underline">
            工具库
          </Link>
          中与第三方并列对比
        </div>
      </div>
    </div>
  );
}

function OfficialCapabilityCard({ tool }: { tool: Tool }) {
  return (
    <div className="relative">
      {tool.ageRestricted && (
        <span className="absolute -right-1 -top-1 z-10 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          18+
        </span>
      )}
      <Link
        href={`/tools/${tool.id}`}
        className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-colors hover:border-primary/25 hover:bg-slate-50/80"
      >
        <ToolIcon
          icon={tool.icon}
          name={tool.name}
          category={tool.category[0]}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {tool.owned && <OwnedBadge size="sm" />}
            {tool.agencyDiscount && <AgencyBadge size="sm" short />}
            {tool.category.map((category) => (
              <span
                key={category}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {getCategoryLabel(category)}
              </span>
            ))}
          </div>
          <p className="mt-1 text-sm font-bold hover:text-primary">{tool.name}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {tool.tagline}
          </p>
        </div>
      </Link>
    </div>
  );
}
