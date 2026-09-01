import Link from 'next/link';
import { SectionHeader } from '@/components/home/section-header';
import { ToolCard } from '@/components/tools/tool-card';
import { getOfficialPicksTools } from '@/lib/owned';

export function OfficialPicksSection() {
  const tools = getOfficialPicksTools();

  return (
    <section
      id="official-picks"
      className="scroll-mt-24 rounded-2xl border bg-white p-4 sm:p-5"
    >
      <SectionHeader
        title="官方精选"
        subtitle="5 个自研 + 5 个代理优惠工具，标注仅表示归属，不影响客观对比"
        href="/owned"
        linkLabel="官方能力"
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} variant="compact" />
        ))}
      </div>
    </section>
  );
}
