import type { LucideIcon } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  icon: Icon = AlertCircle,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 text-center',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
