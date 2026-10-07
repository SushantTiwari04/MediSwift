import { useState } from 'react';
import { Bell, CheckCheck, Package, FileText, Truck, ShieldAlert, Info } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notifications as initialNotifications, formatRelativeTime, type Notification } from '@/data/mockData';
import { cn } from '@/lib/utils';

const typeConfig: Record<Notification['type'], { icon: typeof Package; color: string; bg: string }> = {
  order: { icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
  prescription: { icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  delivery: { icon: Truck, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  safety: { icon: ShieldAlert, color: 'text-destructive', bg: 'bg-destructive/10' },
  system: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
};

const filterTabs = [
  { value: 'all', label: 'All' },
  { value: 'order', label: 'Orders' },
  { value: 'prescription', label: 'Prescriptions' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'safety', label: 'Safety' },
] as const;

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | Notification['type']>('all');

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <PageContainer
      title="Notifications"
      description={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
      action={
        unreadCount > 0 ? (
          <Button size="sm" variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        ) : undefined
      }
    >
      <div className="scrollbar-thin mb-4 flex gap-2 overflow-x-auto pb-1">
        {filterTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              filter === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(notif => {
          const config = typeConfig[notif.type];
          return (
            <Card
              key={notif.id}
              className={cn('flex items-start gap-4 p-4 transition-colors', !notif.read && 'border-primary/20 bg-primary/5')}
            >
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', config.bg)}>
                <config.icon className={cn('h-5 w-5', config.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{notif.title}</p>
                  {!notif.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{notif.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(notif.timestamp)}</p>
              </div>
              {!notif.read && (
                <Button size="sm" variant="ghost" onClick={() => markAsRead(notif.id)}>
                  Mark read
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <Bell className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No notifications</p>
          <p className="mt-1 text-xs text-muted-foreground">You're all caught up!</p>
        </div>
      )}
    </PageContainer>
  );
}
