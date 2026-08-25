import { AgencyBadge } from '@/components/badges/agency-badge';
import type { Tool } from '@/types';

interface ToolAgencyEnhancementProps {
  tool: Tool;
}

export function ToolAgencyEnhancement({ tool }: ToolAgencyEnhancementProps) {
  if (!tool.agencyDiscount || !tool.agencyDesc) return null;

  return (
    <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50/50 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <AgencyBadge />
        <span className="text-sm font-medium text-orange-800">代理合作说明</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {tool.agencyDesc}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        代理关系不影响我们对工具能力的客观描述与对比展示。
      </p>
    </div>
  );
}
