import Link from 'next/link';
import { OwnedBadge } from '@/components/badges/owned-badge';
import { getCategoryLabelsForTool, parseOwnedDesc } from '@/lib/owned';
import type { Tool } from '@/types';

interface ToolOwnedEnhancementProps {
  tool: Tool;
}

export function ToolOwnedEnhancement({ tool }: ToolOwnedEnhancementProps) {
  if (!tool.owned || !tool.ownedDesc) return null;

  const { affiliation, recommendation } = parseOwnedDesc(tool.ownedDesc);

  return (
    <div className="mt-8 space-y-6 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-indigo-50/30 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <OwnedBadge />
        <span className="text-sm font-medium text-violet-800">自研工具增强信息</span>
      </div>

      <section>
        <h2 className="text-base font-semibold text-slate-800">归属说明</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {affiliation}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          归属品类：{getCategoryLabelsForTool(tool)}
        </p>
      </section>

      {(recommendation || tool.tagline) && (
        <section>
          <h2 className="text-base font-semibold text-slate-800">为什么推荐</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {recommendation || tool.tagline}
          </p>
        </section>
      )}

      {tool.comparison && tool.comparison.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-slate-800">与第三方对比</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            以下对比仅供参考，第三方工具同样收录，可并列选择。
          </p>
          <ul className="mt-3 space-y-3">
            {tool.comparison.map((item) => (
              <li
                key={item.vsTool}
                className="rounded-lg border bg-white/80 px-4 py-3 text-sm"
              >
                <span className="font-medium text-slate-700">vs {item.vsTool}</span>
                <p className="mt-1 text-muted-foreground">{item.advantage}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-muted-foreground">
        「自研」标注仅表示归属，不影响客观对比。
        <Link href="/about-recommendation" className="ml-1 text-primary hover:underline">
          阅读完整披露
        </Link>
      </p>
    </div>
  );
}
