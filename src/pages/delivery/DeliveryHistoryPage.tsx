import { useState } from 'react';
import { Bike, Star, ThermometerSnowflake, MapPin, Clock, IndianRupee, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { deliveryHistory, formatPrice, formatDate, formatTime } from '@/data/deliveryMockData';
import { cn } from '@/lib/utils';

export function DeliveryHistoryPage() {
  const [filter, setFilter] = useState<'all' | 'cold' | 'rated'>('all');

  const filtered = deliveryHistory.filter(d => {
    if (filter === 'cold') return d.temperatureControlled;
    if (filter === 'rated') return d.rating !== undefined;
    return true;
  });

  return (
    <PageContainer title="Delivery History" description={`${deliveryHistory.length} total deliveries`}>
      <div className="scrollbar-thin mb-4 flex gap-2 overflow-x-auto pb-2">
        {[
          { value: 'all' as const, label: 'All' },
          { value: 'cold' as const, label: 'Cold Chain' },
          { value: 'rated' as const, label: 'Rated' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              filter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(d => (
          <Card key={d.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/10">
                <Bike className="h-6 w-6 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{d.orderNumber}</p>
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {d.pharmacyName} → {d.customerName} • {d.customerArea}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{d.distance} km</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{d.duration}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{formatPrice(d.payout)}</span>
                  <span>{formatDate(d.deliveredAt)} at {formatTime(d.deliveredAt)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {d.temperatureControlled && (
                  <Badge variant="outline" className="border-blue-500/30 text-blue-500">
                    <ThermometerSnowflake className="mr-1 h-3 w-3" />
                    Cold Chain
                  </Badge>
                )}
                {d.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{d.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <Bike className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No deliveries found</p>
        </div>
      )}
    </PageContainer>
  );
}
