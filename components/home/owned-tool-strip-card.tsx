import Link from 'next/link';
import { OwnedBadge } from '@/components/badges/owned-badge';
import { ToolIcon } from '@/components/tools/tool-icon';
import type { Tool } from '@/types';

interface OwnedToolStripCardProps {
  tool: Tool;
}

export function OwnedToolStripCard({ tool }: OwnedToolStripCardProps) {
  return (
    <Link
      href={`/tools/${tool.id}`}
      className="group flex min-w-[220px] max-w-[240px] snap-start flex-col rounded-xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/50 p-4 transition-all hover:border-violet-300 hover:shadow-md sm:min-w-[240px]"
    >
      <div className="flex items-start gap-3">
        <ToolIcon
          icon={tool.icon}
          name={tool.name}
          category={tool.category[0]}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <OwnedBadge size="sm" />
          </div>
          <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-slate-800 group-hover:text-primary">
            {tool.name}
          </h3>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
        {tool.tagline}
      </p>
    </Link>
  );
}
