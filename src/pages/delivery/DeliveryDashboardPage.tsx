import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bike, IndianRupee, Package, Star, Clock, TrendingUp,
  Power, MapPin, Navigation, ThermometerSnowflake,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { deliveryRequests, deliveryHistory, formatPrice } from '@/data/deliveryMockData';
import { cn } from '@/lib/utils';

export function DeliveryDashboardPage() {
  const [online, setOnline] = useState(true);

  const todayDeliveries = deliveryHistory.filter(d => new Date(d.deliveredAt).toDateString() === new Date('2026-08-24').toDateString());
  const todayEarnings = todayDeliveries.reduce((s, d) => s + d.payout, 0);
  const weekEarnings = deliveryHistory.reduce((s, d) => s + d.payout, 0);
  const avgRating = 4.8;
  const pendingRequests = deliveryRequests.filter(r => r.status === 'REQUEST');

  const stats = [
    { label: "Today's Earnings", value: formatPrice(todayEarnings || 340), icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Deliveries Today', value: todayDeliveries.length || 3, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Weekly Earnings', value: formatPrice(weekEarnings), icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Rating', value: avgRating.toFixed(1), icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  ];

  return (
    <PageContainer title="Dashboard" description="Your delivery overview">
      {/* Online/Offline toggle */}
      <Card className={cn('mb-6 p-5 transition-colors', online ? 'border-success/30 bg-success/5' : 'border-muted')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', online ? 'bg-success/10' : 'bg-muted')}>
              <Power className={cn('h-6 w-6', online ? 'text-success' : 'text-muted-foreground')} />
            </div>
            <div>
              <p className="text-sm font-semibold">{online ? 'You are Online' : 'You are Offline'}</p>
              <p className="text-xs text-muted-foreground">
                {online ? 'Receiving delivery requests' : 'Toggle to start receiving requests'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn('text-sm font-medium', online ? 'text-success' : 'text-muted-foreground')}>
              {online ? 'Online' : 'Offline'}
            </span>
            <Switch checked={online} onCheckedChange={setOnline} />
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.bg)}>
              <stat.icon className={cn('h-5 w-5', stat.color)} />
            </div>
            <p className="mt-3 text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Pending requests */}
      {online && pendingRequests.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Navigation className="h-5 w-5 text-primary" />
              Pending Requests
            </h2>
            <Link to="/delivery/requests" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {pendingRequests.slice(0, 2).map(req => (
              <Link key={req.id} to="/delivery/requests">
                <Card className="p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{req.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{req.pharmacyName} → {req.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{formatPrice(req.payout)}</p>
                      <p className="text-xs text-muted-foreground">{req.totalDistance} km • {req.estimatedTime}</p>
                    </div>
                  </div>
                  {req.temperatureControlled && (
                    <div className="mt-2">
                      <Badge variant="outline" className="border-blue-500/30 text-blue-500">
                        <ThermometerSnowflake className="mr-1 h-3 w-3" />
                        Cold Chain {req.temperatureRange}
                      </Badge>
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Current delivery */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Bike className="h-5 w-5 text-primary" />
            Current Delivery
          </h2>
          <Link to="/delivery/current" className="text-sm font-medium text-primary hover:underline">
            Track
          </Link>
        </div>
        <Link to="/delivery/current">
          <Card className="p-4 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                  <Navigation className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold">MS20260824002</p>
                  <p className="text-xs text-muted-foreground">HealthPlus Pharmacy → Priya Iyer</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="border-amber-500/30 text-amber-500">In Transit</Badge>
                <p className="mt-1 text-xs text-muted-foreground">18 min remaining</p>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="border-blue-500/30 text-blue-500">
                <ThermometerSnowflake className="mr-1 h-3 w-3" />
                Cold Chain 2-8°C
              </Badge>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent deliveries */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="h-5 w-5 text-primary" />
            Recent Deliveries
          </h2>
          <Link to="/delivery/history" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {deliveryHistory.slice(0, 3).map(d => (
            <Card key={d.id} className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Package className="h-5 w-5 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.orderNumber} • {d.customerName}</p>
                <p className="truncate text-xs text-muted-foreground">{d.customerArea} • {d.distance} km • {d.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{formatPrice(d.payout)}</p>
                {d.rating && (
                  <p className="flex items-center justify-end gap-0.5 text-xs text-amber-500">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {d.rating}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
