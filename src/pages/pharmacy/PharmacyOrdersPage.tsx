import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import {
  pharmacyOrders, formatPrice, formatTime, formatDate,
  type PharmacyOrderStatus,
} from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

const statusFilters: { value: PharmacyOrderStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'PRESCRIPTION_REVIEW', label: 'Rx Review' },
  { value: 'SAFETY_REVIEW', label: 'Safety Review' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'READY', label: 'Ready' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function PharmacyOrdersPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<PharmacyOrderStatus | 'ALL'>('ALL');

  const filtered = pharmacyOrders.filter(o => {
    const matchesQuery = query === '' ||
      o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
      o.customerName.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'ALL' || o.status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <PageContainer title="Orders" description="Manage incoming and active customer orders">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by order number or customer..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="scrollbar-thin mb-4 flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map(f => (
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

      <p className="mb-4 text-sm text-muted-foreground">{filtered.length} order(s)</p>

      <div className="space-y-3">
        {filtered.map(order => (
          <Link key={order.id} to={`/pharmacy/orders/${order.id}`}>
            <Card className="p-4 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-muted">
                        <item.imageIcon className={cn('h-5 w-5', item.imageColor)} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.customerName} • {formatDate(order.placedAt)} • {formatTime(order.placedAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  order.status === 'DELIVERED' ? 'bg-success/10 text-success' :
                  order.status === 'CANCELLED' ? 'bg-destructive/10 text-destructive' :
                  order.status === 'NEW' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' :
                  'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                )}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                {order.prescriptionRequired && (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400">
                    Rx Required
                  </Badge>
                )}
                {order.paymentMethod && (
                  <span className="text-xs text-muted-foreground">{order.paymentMethod}</span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <Package className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No orders found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different filter or search term</p>
        </div>
      )}
    </PageContainer>
  );
}
