import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Building2, Bike, Package, ClipboardCheck, ShieldCheck,
  ShieldAlert, DollarSign, ArrowRight, TrendingUp, TrendingDown,
  Loader2, AlertCircle, FileText,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  adminOrders, dashboardStats, revenueChart, orderTrendChart,
  formatPrice, formatRevenue,
} from '@/data/adminMockData';
import { fetchAllPrescriptions } from '@/lib/prescriptions';
import { fetchAllOrders } from '@/lib/orders';

const stats = [
  { label: 'Total Customers', value: dashboardStats.totalCustomers.toLocaleString('en-IN'), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', link: '/admin/customers', trend: '+5.6%' },
  { label: 'Total Pharmacies', value: dashboardStats.totalPharmacies, icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', link: '/admin/pharmacies', trend: '+12.5%' },
  { label: 'Delivery Partners', value: dashboardStats.totalDeliveryPartners, icon: Bike, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', link: '/admin/delivery-partners', trend: '+5.9%' },
  { label: 'Active Orders', value: dashboardStats.activeOrders, icon: Package, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', link: '/admin/orders', trend: '+8.2%' },
  { label: 'Total Revenue', value: formatRevenue(dashboardStats.totalRevenue), icon: DollarSign, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/30', link: '/admin/revenue', trend: '+14.3%' },
];

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  ACCEPTED: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400',
  PREPARING: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  READY: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
  PICKED_UP: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400',
  IN_TRANSIT: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
  DELIVERED: 'bg-success/10 text-success',
  CANCELLED: 'bg-destructive/10 text-destructive',
  VERIFICATION: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400',
  PACKED: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
};

export function AdminDashboardPage() {
  const recentOrders = adminOrders.slice(0, 6);
  const maxRevenue = Math.max(...revenueChart.map(d => d.revenue));
  const maxOrders = Math.max(...orderTrendChart.map(d => d.orders));

  const [pendingPrescriptions, setPendingPrescriptions] = useState<number | null>(null);
  const [activeDeliveries, setActiveDeliveries] = useState<number | null>(null);
  const [pendingVerification, setPendingVerification] = useState<number | null>(null);
  const [liveOrders, setLiveOrders] = useState<number | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [rxResult, ordersResult] = await Promise.all([
        fetchAllPrescriptions(),
        fetchAllOrders(),
      ]);

      if (rxResult.error) {
        setOverviewError(rxResult.error);
        setLoadingOverview(false);
        return;
      }
      if (ordersResult.error) {
        setOverviewError(ordersResult.error);
        setLoadingOverview(false);
        return;
      }

      const rxs = rxResult.data || [];
      setPendingPrescriptions(rxs.filter(r => r.status === 'PENDING').length);
      setPendingVerification(rxs.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length);

      const orders = ordersResult.data || [];
      setActiveDeliveries(orders.filter(o => o.status === 'PICKED_UP' || o.status === 'IN_TRANSIT').length);
      setLiveOrders(orders.length);
      setLoadingOverview(false);
    })();
  }, []);

  const liveCards = [
    {
      label: 'Pending Prescriptions',
      value: pendingPrescriptions,
      icon: ClipboardCheck,
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 dark:bg-cyan-950/30',
      link: '/admin/prescriptions',
    },
    {
      label: 'Active Deliveries',
      value: activeDeliveries,
      icon: Bike,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      link: '/admin/orders',
    },
    {
      label: 'Pending Pharmacy Verification',
      value: pendingVerification,
      icon: FileText,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      link: '/admin/prescriptions',
    },
  ];

  return (
    <PageContainer
      title="Admin Dashboard"
      description="Platform-wide overview and key metrics"
    >
      {/* Live overview cards */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Live Overview</h2>
        {overviewError && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-xs text-destructive">Failed to load live data: {overviewError}</p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {liveCards.map((card) => (
            <Link key={card.label} to={card.link}>
              <Card className="group p-5 transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', card.bg)}>
                    <card.icon className={cn('h-5 w-5', card.color)} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {loadingOverview ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : card.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className="group p-4 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.bg)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span className={cn(
                  'flex items-center gap-0.5 text-[10px] font-medium',
                  stat.trend.startsWith('-') ? 'text-destructive' : 'text-success'
                )}>
                  {stat.trend.startsWith('-') ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  {stat.trend}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Revenue Trend</h2>
            <Badge variant="outline" className="text-xs">Last 6 months</Badge>
          </div>
          <div className="flex h-48 items-end gap-3">
            {revenueChart.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-col items-center justify-end" style={{ height: '140px' }}>
                  <div
                    className="w-full rounded-t-md bg-primary transition-all hover:bg-primary/80"
                    style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                    title={`${formatPrice(d.revenue)}`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="text-sm text-muted-foreground">This month</span>
            <span className="text-lg font-bold text-foreground">{formatPrice(dashboardStats.monthlyRevenue)}</span>
          </div>
        </Card>

        {/* Order Trend Chart */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Weekly Order Trend</h2>
            <Badge variant="outline" className="text-xs">Last 7 days</Badge>
          </div>
          <div className="flex h-48 items-end gap-3">
            {orderTrendChart.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-col items-center justify-end" style={{ height: '140px' }}>
                  <div
                    className="w-full rounded-t-md bg-emerald-500 transition-all hover:bg-emerald-400"
                    style={{ height: `${(d.orders / maxOrders) * 100}%` }}
                    title={`${d.orders} orders`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="text-sm text-muted-foreground">Total this week</span>
            <span className="text-lg font-bold text-foreground">{orderTrendChart.reduce((a, b) => a + b.orders, 0)} orders</span>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Package className="h-5 w-5 text-primary" />
            Recent Orders
          </h2>
          <Link to="/admin/orders" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <Link key={order.id} to={`/admin/orders/${order.id}`}>
              <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{order.orderNumber}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.customerName} · {order.pharmacyName}
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                </div>
                <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusColors[order.status])}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 text-lg font-semibold">Platform Health</h2>
          <div className="space-y-3">
            {[
              { label: 'Order fulfillment rate', value: 94.2, color: 'bg-success' },
              { label: 'Prescription approval rate', value: 87.5, color: 'bg-primary' },
              { label: 'Delivery on-time rate', value: 91.8, color: 'bg-emerald-500' },
              { label: 'Customer satisfaction', value: 89.0, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className={cn('h-2 rounded-full', item.color)} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-lg font-semibold">Alerts & Notifications</h2>
          <div className="space-y-3">
            <Link to="/admin/medication-safety" className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30">
                <ShieldCheck className="h-4 w-4 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{dashboardStats.safetyAlerts} Safety Alerts</p>
                <p className="text-xs text-muted-foreground">Requires pharmacist review</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link to="/admin/adr-reports" className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30">
                <ShieldAlert className="h-4 w-4 text-orange-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{dashboardStats.adrReports} ADR Reports</p>
                <p className="text-xs text-muted-foreground">2 escalated, 3 under review</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link to="/admin/temperature" className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">1 Temperature Breach</p>
                <p className="text-xs text-muted-foreground">Insulin delivery exceeded range</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
