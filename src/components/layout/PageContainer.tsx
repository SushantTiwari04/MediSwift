import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  description,
  action,
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8', className)}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="animate-fade-in-up">{children}</div>
    </div>
  );
}

interface PageContainerPlaceholderProps {
  title: string;
  description?: string;
  role: string;
}

export function PageContainerPlaceholder({
  title,
  description,
  role,
}: PageContainerPlaceholderProps) {
  return (
    <PageContainer
      title={title}
      description={description}
      action={
        <button
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90'
          )}
        >
          <Plus className="h-4 w-4" />
          New
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="mb-4 h-10 w-10 rounded-lg bg-primary/10" />
            <div className="mb-2 h-4 w-2/3 rounded bg-muted" />
            <div className="mb-1 h-3 w-full rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-dashed bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          This is a placeholder page for the <span className="font-medium text-foreground">{role}</span> portal.
          Full functionality will be added in upcoming steps.
        </p>
      </div>
    </PageContainer>
  );
}
