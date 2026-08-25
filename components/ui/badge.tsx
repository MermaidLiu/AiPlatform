import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'owned'
    | 'agency'
    | 'verified'
    | 'pending';
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  owned: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white',
  agency: 'bg-orange-500 text-white',
  verified: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
};

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
