import { useState } from 'react';
import {
  Bell, Package, Navigation, IndianRupee, Star, Settings, CheckCheck,
  Inbox, Truck, AlertTriangle, Wallet, TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { deliveryNotifications, formatRelativeTime, type DeliveryNotification } from '@/data/deliveryMockData';
import { cn } from '@/lib/utils';

const typeConfig: Record<DeliveryNotification['type'], { icon: typeof Package; color: string; bg: string }> = {
  request: { icon: Inbox, color: 'text-primary', bg: 'bg-primary/10' },
  delivery: { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  payment: { icon: Wallet, color: 'text-success', bg: 'bg-success/10' },
  system: { icon: Settings, color: 'text-muted-foreground', bg: 'bg-muted' },
  rating: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
};

const filterTabs = [
  { value: 'all', label: 'All' },
  { value: 'request', label: 'Requests' },
  { value: 'delivery', label: 'Deliveries' },
  { value: 'payment', label: 'Earnings' },
  { value: 'rating', label: 'Ratings' },
] as const;

export function DeliveryNotificationsPage() {
  const [notifications, setNotifications] = useState<DeliveryNotification[]>(deliveryNotifications);
  const [filter, setFilter] = useState<'all' | DeliveryNotification['type']>('all');

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <PageContainer title="Notifications" description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
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
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="mr-1 h-3.5 w-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {filtered.map(notification => {
          const config = typeConfig[notification.type];
          return (
            <Card
              key={notification.id}
              className={cn(
                'cursor-pointer p-4 transition-all hover:shadow-md',
                !notification.read && 'border-primary/30 bg-primary/5'
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', config.bg)}>
                  <config.icon className={cn('h-5 w-5', config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{notification.title}</p>
                    {!notification.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{notification.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(notification.timestamp)}</p>
                </div>
              </div>
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
