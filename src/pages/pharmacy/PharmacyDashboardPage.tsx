import { Link } from 'react-router-dom';
import {
  Package, IndianRupee, FileCheck, AlertTriangle,
  CalendarClock, Truck, Star, TrendingUp, ArrowRight,
  Clock, ShoppingBag,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import {
  pharmacyOrders, inventory, pharmacyPrescriptions,
  deliveryTasks, formatPrice, formatTime, daysUntilExpiry,
} from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

export function PharmacyDashboardPage() {
  const todayOrders = pharmacyOrders.filter(o =>
    new Date(o.placedAt).toDateString() === new Date('2026-08-22').toDateString()
  );
  const todayRevenue = todayOrders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingPrescriptions = pharmacyPrescriptions.filter(p => p.status === 'PENDING');
  const lowStock = inventory.filter(i => i.quantity <= i.lowStockThreshold);
  const expiringSoon = inventory.filter(i => {
    const days = daysUntilExpiry(i.expiryDate);
    return days <= 60 && days > 0;
  });
  const activeDeliveries = deliveryTasks.filter(d => d.status !== 'DELIVERED');
  const avgRating = 4.7;

  const stats = [
    { label: 'Orders Today', value: todayOrders.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', link: '/pharmacy/orders' },
    { label: 'Revenue Today', value: formatPrice(todayRevenue), icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', link: '/pharmacy/earnings' },
    { label: 'Pending Rx', value: pendingPrescriptions.length, icon: FileCheck, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', link: '/pharmacy/prescriptions' },
    { label: 'Low Stock', value: lowStock.length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', link: '/pharmacy/inventory/low-stock' },
    { label: 'Expiring Soon', value: expiringSoon.length, icon: CalendarClock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', link: '/pharmacy/inventory/expiry' },
    { label: 'Active Deliveries', value: activeDeliveries.length, icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', link: '/pharmacy/delivery' },
    { label: 'Customer Rating', value: avgRating.toFixed(1), icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30', link: '/pharmacy/reviews' },
  ];

  return (
    <PageContainer title="Dashboard" description="Overview of your pharmacy operations">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className="p-4 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.bg)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-3 text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Recent Orders
          </h2>
          <Link to="/pharmacy/orders" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {pharmacyOrders.slice(0, 4).map(order => (
            <Link key={order.id} to={`/pharmacy/orders/${order.id}`}>
              <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-muted">
                      <item.imageIcon className={cn('h-5 w-5', item.imageColor)} />
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{order.orderNumber} • {order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(order.placedAt)} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatPrice(order.total)}</p>
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    order.status === 'DELIVERED' ? 'bg-success/10 text-success' :
                    order.status === 'CANCELLED' ? 'bg-destructive/10 text-destructive' :
                    order.status === 'NEW' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' :
                    'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                  )}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending prescriptions + low stock */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <FileCheck className="h-5 w-5 text-amber-500" />
              Pending Prescriptions
            </h3>
            <Link to="/pharmacy/prescriptions" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {pendingPrescriptions.length > 0 ? pendingPrescriptions.map(rx => (
              <Link key={rx.id} to={`/pharmacy/prescriptions/${rx.id}`}>
                <Card className="flex items-center gap-3 p-3 transition-shadow hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <FileCheck className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{rx.prescriptionNumber}</p>
                    <p className="truncate text-xs text-muted-foreground">{rx.customerName} • {rx.doctorName}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                    Pending
                  </span>
                </Card>
              </Link>
            )) : (
              <Card className="p-4 text-center text-sm text-muted-foreground">No pending prescriptions</Card>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Low Stock Alerts
            </h3>
            <Link to="/pharmacy/inventory/low-stock" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {lowStock.slice(0, 3).map(item => (
              <Card key={item.id} className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30">
                  <item.imageIcon className={cn('h-5 w-5', item.imageColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.medicine}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.brand} • {item.strength}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-500">{item.quantity}</p>
                  <p className="text-xs text-muted-foreground">left</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Expiring soon */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <CalendarClock className="h-5 w-5 text-orange-500" />
            Expiring Soon
          </h3>
          <Link to="/pharmacy/inventory/expiry" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {expiringSoon.slice(0, 3).map(item => {
            const days = daysUntilExpiry(item.expiryDate);
            return (
              <Card key={item.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30">
                    <item.imageIcon className={cn('h-5 w-5', item.imageColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.medicine}</p>
                    <p className="text-xs text-muted-foreground">Batch: {item.batchNumber}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                    Expires in {days} days
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
