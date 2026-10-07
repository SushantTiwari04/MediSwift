import { TrendingUp, TrendingDown, Package, Star, Clock, IndianRupee, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { pharmacyOrders, inventory, pharmacyReviews } from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

export function AnalyticsPage() {
  const delivered = pharmacyOrders.filter(o => o.status === 'DELIVERED');
  const cancelled = pharmacyOrders.filter(o => o.status === 'CANCELLED');
  const fulfillmentRate = Math.round((delivered.length / pharmacyOrders.length) * 100);
  const avgRating = (pharmacyReviews.reduce((s, r) => s + r.rating, 0) / pharmacyReviews.length).toFixed(1);

  const categoryDistribution = inventory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);
  const sortedCategories = Object.entries(categoryDistribution).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...sortedCategories.map(c => c[1]));

  const monthlyTrend = [
    { month: 'Mar', orders: 320, revenue: 45000 },
    { month: 'Apr', orders: 380, revenue: 52000 },
    { month: 'May', orders: 410, revenue: 58000 },
    { month: 'Jun', orders: 450, revenue: 61000 },
    { month: 'Jul', orders: 520, revenue: 72000 },
    { month: 'Aug', orders: 480, revenue: 68000 },
  ];
  const maxOrders = Math.max(...monthlyTrend.map(m => m.orders));

  return (
    <PageContainer title="Analytics" description="Performance insights and trends">
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2"><Package className="h-5 w-5 text-blue-500" /><span className="text-2xl font-bold">{pharmacyOrders.length}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Total Orders</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><IndianRupee className="h-5 w-5 text-emerald-500" /><span className="text-2xl font-bold">₹68K</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Monthly Revenue</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /><span className="text-2xl font-bold">{avgRating}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Avg Rating</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-orange-500" /><span className="text-2xl font-bold">18m</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Avg Delivery</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="h-4 w-4 text-primary" />
            Monthly Order Trend
          </h3>
          <div className="flex items-end justify-between gap-2">
            {monthlyTrend.map(m => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="text-xs font-medium">{m.orders}</div>
                <div className="flex w-full items-end" style={{ height: '160px' }}>
                  <div className="w-full rounded-t-md bg-primary/80 transition-all" style={{ height: `${(m.orders / maxOrders) * 100}%` }} />
                </div>
                <div className="text-xs text-muted-foreground">{m.month}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-sm font-semibold">Inventory by Category</h3>
          <div className="space-y-3">
            {sortedCategories.map(([cat, qty]) => (
              <div key={cat}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">{cat}</span>
                  <span className="font-medium">{qty} units</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(qty / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Fulfillment Rate</h3>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${fulfillmentRate} 100`} className="text-primary" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">{fulfillmentRate}%</div>
            </div>
            <div className="text-sm">
              <p className="flex items-center gap-1 text-success"><TrendingUp className="h-4 w-4" /> {delivered.length} delivered</p>
              <p className="flex items-center gap-1 text-destructive"><TrendingDown className="h-4 w-4" /> {cancelled.length} cancelled</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = pharmacyReviews.filter(r => r.rating === stars).length;
              const pct = Math.round((count / pharmacyReviews.length) * 100);
              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="w-12 text-xs text-muted-foreground">{stars} star</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-xs text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Top Selling Medicines</h3>
          <div className="space-y-2 text-sm">
            {[
              { name: 'Paracetamol', sold: 420 },
              { name: 'Cetirizine', sold: 310 },
              { name: 'Vitamin D3', sold: 280 },
              { name: 'Metformin', sold: 195 },
              { name: 'Ibuprofen', sold: 165 },
            ].map((med, idx) => (
              <div key={med.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold', idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-muted text-muted-foreground')}>{idx + 1}</span>
                  {med.name}
                </span>
                <span className="font-medium">{med.sold} units</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
