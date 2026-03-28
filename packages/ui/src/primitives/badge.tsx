import * as React from 'react';
import { cn } from '../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants: Record<string, string> = {
      default: 'bg-teal/20 text-teal border-teal/30',
      secondary: 'bg-surface-overlay text-slate-300 border-teal/20',
      success: 'bg-success/20 text-success border-success/30',
      warning: 'bg-warning/20 text-warning border-warning/30',
      error: 'bg-error/20 text-error border-error/30',
      outline: 'border-teal/30 text-slate-300',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
