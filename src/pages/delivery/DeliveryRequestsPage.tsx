import { useState, useEffect, useCallback } from 'react';
import {
  Package, MapPin, Navigation, Clock, IndianRupee,
  Store, User, Check, X, Loader2, AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';
import { fetchOrdersByStatus, updateOrderStatus, type OrderRecord } from '@/lib/orders';

export function DeliveryRequestsPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchOrdersByStatus(['READY', 'PACKED']);
    setLoading(false);
    if (fetchError) {
      setError(fetchError);
      return;
    }
    setOrders(data || []);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleAccept = async (orderId: string) => {
    setActingId(orderId);
    const { error: updateError } = await updateOrderStatus(orderId, 'PICKED_UP');
    setActingId(null);
    if (updateError) {
      setError(updateError);
      return;
    }
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const handleDecline = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  if (loading) {
    return (
      <PageContainer title="Delivery Requests" description="Loading available orders">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Delivery Requests" description="Available delivery orders">
        <div className="flex flex-col items-center py-16">
          <AlertCircle className="mb-3 h-12 w-12 text-destructive" />
          <p className="text-sm font-medium text-destructive">Failed to load orders</p>
          <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Delivery Requests" description={`${orders.length} available order${orders.length !== 1 ? 's' : ''}`}>
      <div className="space-y-4">
        {orders.map(order => {
          const addr = order.delivery_address;
          const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
          return (
            <Card key={order.id} className="overflow-hidden">
              <div className="flex items-center justify-between border-b bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{order.order_number}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.placed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Store className="h-4 w-4 text-primary" />
                    </div>
                    <div className="my-1 h-8 w-0.5 bg-muted" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                      <User className="h-4 w-4 text-success" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">PICKUP</p>
                      <p className="text-sm font-medium">Pharmacy</p>
                      <p className="text-xs text-muted-foreground">Pick up prepared order</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">DROP</p>
                      <p className="text-sm font-medium">{addr.label}</p>
                      <p className="text-xs text-muted-foreground">{addr.line1}</p>
                      <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Navigation className="h-3.5 w-3.5" />
                    <span className="text-xs">Items</span>
                  </div>
                  <p className="mt-1 text-sm font-bold">{itemCount}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">Payment</span>
                  </div>
                  <p className="mt-1 text-sm font-bold">{order.payment_method}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <IndianRupee className="h-3.5 w-3.5" />
                    <span className="text-xs">Order Total</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-primary">₹{order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">{order.items.length} item(s)</p>
                <div className="space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <span className="text-xs font-bold text-primary">{item.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{item.name} {item.strength}</p>
                        <p className="text-xs text-muted-foreground">{item.brand} • Qty: {item.quantity}</p>
                      </div>
                      {item.prescriptionRequired && (
                        <Badge variant="outline" className="text-xs">Rx</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {order.delivery_instructions && (
                <div className="border-t bg-amber-50 p-3 dark:bg-amber-950/20">
                  <p className="text-xs text-muted-foreground">{order.delivery_instructions}</p>
                </div>
              )}

              <div className="flex gap-2 border-t p-4">
                <Button
                  variant="outline"
                  className="flex-1 text-destructive hover:bg-destructive/5"
                  disabled={actingId === order.id}
                  onClick={() => handleDecline(order.id)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Decline
                </Button>
                <Button
                  className="flex-1 bg-success hover:bg-success/90"
                  disabled={actingId === order.id}
                  onClick={() => handleAccept(order.id)}
                >
                  {actingId === order.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Accept
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <Package className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No pending requests</p>
          <p className="mt-1 text-xs text-muted-foreground">New requests will appear here when orders are ready for pickup</p>
        </div>
      )}
    </PageContainer>
  );
}
