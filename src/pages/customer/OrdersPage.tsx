import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Loader2 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { CompactOrderStatus } from '@/components/customer/OrderStatusTracker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate, type OrderStatus } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { fetchCustomerOrders, type OrderRecord } from '@/lib/orders';

const statusFilters: { value: 'all' | OrderStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function OrdersPage() {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await fetchCustomerOrders();
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setOrders(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <PageContainer title="My Orders" description="Track and manage your medicine orders">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="My Orders" description="Track and manage your medicine orders">
        <div className="flex flex-col items-center py-16">
          <p className="text-sm font-medium text-destructive">Failed to load orders</p>
          <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="My Orders" description="Track and manage your medicine orders">
      <div className="scrollbar-thin mb-4 flex gap-2 overflow-x-auto pb-1">
        {statusFilters.map(tab => (
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
        {filtered.map(order => (
          <Link key={order.id} to={`/customer/orders/${order.id}`}>
            <Card className="p-4 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-muted">
                      <span className="text-xs font-bold text-primary">{item.name.charAt(0)}</span>
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{order.order_number}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDate(order.placed_at)}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.items.map(i => i.name).join(', ')}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <CompactOrderStatus currentStatus={order.status} />
                    <span className="text-sm font-bold text-primary">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <Package className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No orders found</p>
          <p className="mt-1 text-xs text-muted-foreground">Place an order to see it here</p>
          <Button className="mt-4" size="sm" asChild>
            <Link to="/customer/search">Browse medicines</Link>
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
