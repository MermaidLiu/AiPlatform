import Link from 'next/link';
import { AgencyBadge } from '@/components/badges/agency-badge';
import { OwnedBadge, OwnedRecommendBadge } from '@/components/badges/owned-badge';
import { Badge } from '@/components/ui/badge';
import { ToolIcon } from '@/components/tools/tool-icon';
import { getCategoryLabel } from '@/data/categories';
import { getVerificationLabel } from '@/lib/verification';
import type { Tool } from '@/types';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'compact';
  showOwnedRecommend?: boolean;
  isNew?: boolean;
  className?: string;
}

export function ToolCard({
  tool,
  variant = 'default',
  showOwnedRecommend = false,
  isNew = false,
  className,
}: ToolCardProps) {
  const primaryCategory = tool.category[0];

  if (variant === 'compact') {
    return (
      <Link
        href={`/tools/${tool.id}`}
        className={cn(
          'group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-all hover:border-primary/25 hover:bg-slate-50/80 hover:shadow-sm',
          className
        )}
      >
        <ToolIcon
          icon={tool.icon}
          name={tool.name}
          category={primaryCategory}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {isNew && (
              <span className="shrink-0 rounded bg-red-500 px-1 py-px text-[10px] font-bold leading-none text-white">
                新
              </span>
            )}
            <h3 className="truncate text-sm font-bold text-slate-800 group-hover:text-primary">
              {tool.name}
            </h3>
            {tool.owned && <OwnedBadge size="sm" />}
            {tool.agencyDiscount && <AgencyBadge size="sm" short />}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {tool.tagline}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tools/${tool.id}`}
      className={cn(
        'group flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md',
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <ToolIcon
          icon={tool.icon}
          name={tool.name}
          category={primaryCategory}
        />
        <div className="flex flex-wrap justify-end gap-1">
          {isNew && (
            <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              新
            </span>
          )}
          {tool.owned && <OwnedBadge />}
          {tool.agencyDiscount && <AgencyBadge />}
          {showOwnedRecommend && tool.owned && <OwnedRecommendBadge />}
        </div>
      </div>

      <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">
        {tool.name}
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {tool.tagline}
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        {tool.isFree && (
          <Badge variant="secondary" className="text-[10px]">
            免费
          </Badge>
        )}
        {tool.hasChinese && (
          <Badge variant="secondary" className="text-[10px]">
            中文
          </Badge>
        )}
        {tool.hasTutorial && (
          <Badge variant="secondary" className="text-[10px]">
            教程
          </Badge>
        )}
        {tool.mobileReady && (
          <Badge variant="secondary" className="text-[10px]">
            手机可用
          </Badge>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <span>{getCategoryLabel(primaryCategory)}</span>
        <Badge
          variant={
            tool.verificationStatus === 'verified' ? 'verified' : 'pending'
          }
        >
          {getVerificationLabel(tool.verificationStatus)}
        </Badge>
      </div>
    </Link>
  );
}
