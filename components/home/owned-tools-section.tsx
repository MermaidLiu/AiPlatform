import Link from 'next/link';
import { SectionHeader } from '@/components/home/section-header';
import { OwnedToolStripCard } from '@/components/home/owned-tool-strip-card';
import { getHomepageOwnedTools } from '@/lib/owned';

export function OwnedToolsSection() {
  const ownedTools = getHomepageOwnedTools();
  if (ownedTools.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50/80 via-white to-indigo-50/80 p-4 sm:p-5">
      <div className="mb-1 flex flex-wrap items-baseline gap-2">
        <SectionHeader
          title="自研工具流"
          href="/owned"
          linkLabel="全部自研"
          className="mb-0 flex-1"
        />
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        <span className="font-medium text-violet-700">由我们自研</span>
        {' · '}
        以下为我们自主研发或深度合作的能力，与第三方工具并列对比，不构成唯一推荐。
        <Link
          href="/about-recommendation"
          className="ml-1 text-primary hover:underline"
        >
          了解推荐原则
        </Link>
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {ownedTools.map((tool) => (
          <OwnedToolStripCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
