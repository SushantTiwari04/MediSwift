import { Bell, Package, FileCheck, AlertTriangle, Truck, Star, Settings, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { pharmacyNotifications, formatRelativeTime } from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  order: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  prescription: { icon: FileCheck, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  inventory: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  delivery: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  review: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30' },
  system: { icon: Settings, color: 'text-muted-foreground', bg: 'bg-muted' },
};

export function PharmacyNotificationsPage() {
  const unread = pharmacyNotifications.filter(n => !n.read);

  return (
    <PageContainer
      title="Notifications"
      description={`${unread.length} unread notification${unread.length !== 1 ? 's' : ''}`}
      action={
        <Button variant="outline" size="sm">
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all read
        </Button>
      }
    >
      <div className="space-y-2">
        {pharmacyNotifications.map(notif => {
          const config = typeConfig[notif.type];
          return (
            <Card key={notif.id} className={cn('p-4 transition-shadow hover:shadow-md', !notif.read && 'border-primary/30')}>
              <div className="flex items-start gap-3">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', config.bg)}>
                  <config.icon className={cn('h-5 w-5', config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{notif.title}</p>
                    {!notif.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{notif.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(notif.timestamp)}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {pharmacyNotifications.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <Bell className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No notifications</p>
        </div>
      )}
    </PageContainer>
  );
}
