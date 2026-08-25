import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AgencyBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
  short?: boolean;
}

export function AgencyBadge({
  className,
  size = 'md',
  short = false,
}: AgencyBadgeProps) {
  return (
    <Badge
      variant="agency"
      className={cn(
        size === 'sm' && 'px-1.5 py-0 text-[10px]',
        className
      )}
      title="代理合作工具，通过本站导流可能享有专属优惠"
    >
      {short ? '代理' : '代理优惠'}
    </Badge>
  );
}
