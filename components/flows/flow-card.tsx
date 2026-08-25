import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getCategoryLabel } from '@/data/categories';
import type { Flow } from '@/types';
import { cn } from '@/lib/utils';

interface FlowCardProps {
  flow: Flow;
  compact?: boolean;
}

export function FlowCard({ flow, compact = false }: FlowCardProps) {
  return (
    <Link
      href={`/flow/${flow.id}`}
      className={cn(
        'group flex flex-col rounded-xl border border-slate-100 bg-white transition-all hover:border-primary/25 hover:shadow-sm',
        compact ? 'p-3' : 'p-4 shadow-sm hover:shadow-md'
      )}
    >
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary" className="text-[10px]">
          {flow.scenario}
        </Badge>
        {flow.fullOwnedFlow && (
          <Badge variant="owned" className="text-[10px]">
            全自研
          </Badge>
        )}
        {!compact && (
          <Badge variant="secondary" className="text-[10px]">
            {getCategoryLabel(flow.category)}
          </Badge>
        )}
      </div>
      <h3
        className={cn(
          'font-semibold leading-snug text-slate-800 group-hover:text-primary',
          compact ? 'text-sm line-clamp-2' : 'text-base'
        )}
      >
        {flow.title}
      </h3>
      {!compact && (
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {flow.description}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{flow.steps.length} 步 · {flow.difficulty}</span>
        {!compact && <span>{flow.estimatedCost}</span>}
      </div>
    </Link>
  );
}
