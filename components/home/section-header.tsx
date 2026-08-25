import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = '查看更多',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-center justify-between gap-4', className)}>
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 sm:text-xl">
          <span className="inline-block h-5 w-1 rounded-full bg-primary" />
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          {linkLabel} &gt;&gt;
        </Link>
      )}
    </div>
  );
}
