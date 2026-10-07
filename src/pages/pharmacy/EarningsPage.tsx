import { IndianRupee, TrendingUp, TrendingDown, Wallet, ArrowDownToLine, Receipt } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';
import { pharmacyOrders, formatPrice, formatDate } from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

export function EarningsPage() {
  const delivered = pharmacyOrders.filter(o => o.status === 'DELIVERED');
  const todayRevenue = delivered
    .filter(o => new Date(o.placedAt).toDateString() === new Date('2026-08-22').toDateString())
    .reduce((s, o) => s + o.total, 0);
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
  const platformFee = Math.round(totalRevenue * 0.08);
  const netEarnings = totalRevenue - platformFee;

  const weeklyData = [
    { day: 'Mon', amount: 4200 },
    { day: 'Tue', amount: 5100 },
    { day: 'Wed', amount: 3800 },
    { day: 'Thu', amount: 6200 },
    { day: 'Fri', amount: 7400 },
    { day: 'Sat', amount: 8900 },
    { day: 'Sun', amount: 5500 },
  ];
  const maxAmount = Math.max(...weeklyData.map(d => d.amount));

  return (
    <PageContainer title="Earnings" description="Track your revenue and payouts">
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2"><IndianRupee className="h-5 w-5 text-emerald-500" /><span className="text-2xl font-bold">{formatPrice(todayRevenue)}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Today's Revenue</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" /><span className="text-2xl font-bold">{formatPrice(netEarnings)}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Net Earnings</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-500" /><span className="text-2xl font-bold">+18%</span></div>
          <p className="mt-1 text-xs text-muted-foreground">vs Last Week</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><Receipt className="h-5 w-5 text-amber-500" /><span className="text-2xl font-bold">{delivered.length}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Orders Fulfilled</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Weekly Revenue</h3>
            <div className="flex items-end justify-between gap-2">
              {weeklyData.map(d => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="text-xs font-medium text-muted-foreground">{formatPrice(d.amount)}</div>
                  <div className="flex w-full items-end" style={{ height: '180px' }}>
                    <div
                      className={cn('w-full rounded-t-md bg-primary transition-all', d.day === 'Sun' && 'bg-primary/70')}
                      style={{ height: `${(d.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">{d.day}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mt-4 p-6">
            <h3 className="mb-4 text-sm font-semibold">Recent Transactions</h3>
            <div className="space-y-3">
              {delivered.map(order => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.customerName} • {formatDate(order.placedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-500">+{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{order.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Earnings Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross Revenue</span>
                <span className="font-medium">{formatPrice(totalRevenue)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee (8%)</span>
                <span className="font-medium text-destructive">-{formatPrice(platformFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Net Earnings</span>
                <span className="font-bold text-primary">{formatPrice(netEarnings)}</span>
              </div>
            </div>
            <Button className="mt-4 w-full" variant="outline">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Download Statement
            </Button>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Payout Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Payout</span>
                <span className="font-medium">Aug 25, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending Payout</span>
                <span className="font-medium text-primary">{formatPrice(netEarnings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Account</span>
                <span className="font-medium">****4567</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
