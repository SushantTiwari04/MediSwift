import { Check } from 'lucide-react';
import type { OrderStatus } from '@/data/mockData';
import { orderStatusSteps } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  cancelled?: boolean;
}

export function OrderStatusTracker({ currentStatus, cancelled }: OrderStatusTrackerProps) {
  if (cancelled || currentStatus === 'CANCELLED') {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
        <p className="text-sm font-medium text-destructive">Order Cancelled</p>
        <p className="mt-1 text-xs text-muted-foreground">This order was cancelled and will not be delivered.</p>
      </div>
    );
  }

  const currentIndex = orderStatusSteps.findIndex(s => s.status === currentStatus);

  return (
    <div className="space-y-0">
      {orderStatusSteps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  isComplete && 'border-success bg-success text-success-foreground',
                  isCurrent && 'border-primary bg-primary text-primary-foreground',
                  isPending && 'border-muted bg-background text-muted-foreground'
                )}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              {index < orderStatusSteps.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 grow',
                    isComplete ? 'bg-success' : 'bg-muted'
                  )}
                  style={{ minHeight: '2.5rem' }}
                />
              )}
            </div>

            <div className={cn('pb-6', isPending && 'opacity-50')}>
              <p
                className={cn(
                  'text-sm font-semibold',
                  isCurrent && 'text-primary',
                  isComplete && 'text-success',
                  isPending && 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
              {isCurrent && (
                <p className="mt-1 text-xs font-medium text-primary">In progress...</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface CompactOrderStatusProps {
  currentStatus: OrderStatus;
}

export function CompactOrderStatus({ currentStatus }: CompactOrderStatusProps) {
  const currentIndex = orderStatusSteps.findIndex(s => s.status === currentStatus);
  const totalSteps = orderStatusSteps.length;

  if (currentStatus === 'CANCELLED') {
    return (
      <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
        Cancelled
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="bg-primary transition-all"
          style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {currentIndex + 1}/{totalSteps}
      </span>
    </div>
  );
}
