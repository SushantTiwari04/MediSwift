import { IndianRupee, TrendingUp, Wallet, Bike, Star, ArrowDownToLine, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';
import { deliveryHistory, formatPrice, formatDate, formatTime } from '@/data/deliveryMockData';
import { cn } from '@/lib/utils';

export function DeliveryEarningsPage() {
  const todayEarnings = 340;
  const weekEarnings = deliveryHistory.reduce((s, d) => s + d.payout, 0);
  const monthEarnings = weekEarnings * 4 + 1200;
  const platformFee = Math.round(weekEarnings * 0.05);
  const netEarnings = weekEarnings - platformFee;

  const weeklyData = [
    { day: 'Mon', amount: 420 },
    { day: 'Tue', amount: 510 },
    { day: 'Wed', amount: 380 },
    { day: 'Thu', amount: 620 },
    { day: 'Fri', amount: 740 },
    { day: 'Sat', amount: 890 },
    { day: 'Sun', amount: 550 },
  ];
  const maxAmount = Math.max(...weeklyData.map(d => d.amount));

  return (
    <PageContainer title="Earnings" description="Track your delivery earnings and payouts">
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2"><IndianRupee className="h-5 w-5 text-emerald-500" /><span className="text-2xl font-bold">{formatPrice(todayEarnings)}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Today</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" /><span className="text-2xl font-bold">{formatPrice(weekEarnings)}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">This Week</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-500" /><span className="text-2xl font-bold">{formatPrice(monthEarnings)}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">This Month</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /><span className="text-2xl font-bold">4.8</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Rating</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Weekly chart */}
          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Weekly Earnings</h3>
            <div className="flex items-end justify-between gap-2">
              {weeklyData.map(d => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="text-xs font-medium">{formatPrice(d.amount)}</div>
                  <div className="flex w-full items-end" style={{ height: '160px' }}>
                    <div className={cn('w-full rounded-t-md bg-primary transition-all', d.day === 'Sat' && 'bg-primary/70')} style={{ height: `${(d.amount / maxAmount) * 100}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground">{d.day}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent payouts */}
          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Recent Deliveries</h3>
            <div className="space-y-3">
              {deliveryHistory.slice(0, 5).map(d => (
                <div key={d.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                      <Bike className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{d.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{d.customerArea} • {d.distance} km • {formatDate(d.deliveredAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-500">+{formatPrice(d.payout)}</p>
                    {d.rating && (
                      <p className="flex items-center justify-end gap-0.5 text-xs text-amber-500">
                        <Star className="h-3 w-3 fill-amber-400" />{d.rating}
                      </p>
                    )}
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
                <span className="text-muted-foreground">Gross Earnings</span>
                <span className="font-medium">{formatPrice(weekEarnings)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee (5%)</span>
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
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium text-primary">{formatPrice(netEarnings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Account</span>
                <span className="font-medium">****4567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">UPI ID</span>
                <span className="font-medium">rider@paytm</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              This Week's Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Deliveries</span>
                <span className="font-medium">28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Distance</span>
                <span className="font-medium">94.5 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Time</span>
                <span className="font-medium">26 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cold Chain</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
