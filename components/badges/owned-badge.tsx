import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OwnedBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function OwnedBadge({ className, size = 'md' }: OwnedBadgeProps) {
  return (
    <Badge
      variant="owned"
      className={cn(
        size === 'sm' && 'px-1.5 py-0 text-[10px]',
        className
      )}
      title="由我们团队自研或深度合作，不代表唯一推荐"
    >
      自研
    </Badge>
  );
}

export function OwnedRecommendBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn('border border-violet-200 bg-violet-50 text-violet-700', className)}
    >
      自研推荐
    </Badge>
  );
}
