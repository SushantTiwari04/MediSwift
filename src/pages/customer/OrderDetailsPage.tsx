import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, CreditCard, Clock, Package,
  Navigation, RefreshCw, Stethoscope, Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderStatusTracker } from '@/components/customer/OrderStatusTracker';
import { formatPrice, formatDate, formatTime } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { fetchOrderById, type OrderRecord } from '@/lib/orders';

export function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const { data, error } = await fetchOrderById(id);
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setOrder(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium">{error ? 'Failed to load order' : 'Order not found'}</p>
        <Button variant="link" onClick={() => navigate('/customer/orders')}>Back to orders</Button>
      </div>
    );
  }

  const addr = order.delivery_address;
  const addressStr = `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Order header */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{order.order_number}</p>
                <p className="text-xs text-muted-foreground">
                  Placed on {formatDate(order.placed_at)} at {formatTime(order.placed_at)}
                </p>
              </div>
              {order.status === 'CANCELLED' ? (
                <Badge variant="outline" className="border-destructive/30 text-destructive">Cancelled</Badge>
              ) : order.status === 'DELIVERED' ? (
                <Badge variant="outline" className="border-success/30 text-success">Delivered</Badge>
              ) : (
                <Badge variant="outline" className="border-primary/30 text-primary">{order.status.replace(/_/g, ' ')}</Badge>
              )}
            </div>
            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
              <div className="mt-4">
                <OrderStatusTracker currentStatus={order.status} />
              </div>
            )}
            {order.status !== 'CANCELLED' && (
              <Button className="mt-4 w-full" size="lg" asChild>
                <Link to={`/customer/orders/${order.id}/tracking`}>
                  <Navigation className="mr-2 h-4 w-4" />
                  Track Order
                </Link>
              </Button>
            )}
          </Card>

          {/* Items */}
          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Package className="h-4 w-4 text-primary" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <span className="text-lg font-bold text-primary">{item.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.brand} • {item.strength} • Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery fee</span><span>{formatPrice(order.delivery_fee)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Service fee</span><span>{formatPrice(order.service_fee)}</span></div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-bold"><span>Total</span><span className="text-primary">{formatPrice(order.total)}</span></div>
            </div>
          </Card>

          {/* Delivery info */}
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Delivery Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Delivery address</p>
                  <p className="font-medium">{addressStr}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Estimated delivery</p>
                  <p className="font-medium">
                    {order.estimated_delivery ? formatTime(order.estimated_delivery) : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Payment method</p>
                  <p className="font-medium">{order.payment_method}</p>
                </div>
              </div>
              {order.prescription_required && (
                <div className="flex items-start gap-2">
                  <Stethoscope className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Prescription</p>
                    <p className="font-medium">Prescription required</p>
                  </div>
                </div>
              )}
              {order.delivery_instructions && (
                <div className="flex items-start gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery instructions</p>
                    <p className="font-medium">{order.delivery_instructions}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Order Status</h3>
            <p className="text-sm font-medium">{order.status.replace(/_/g, ' ')}</p>
            <p className="mt-1 text-xs text-muted-foreground">Your order is being processed</p>
          </Card>

          {order.status === 'DELIVERED' && (
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Quick Actions</h3>
              <Button className="w-full" size="sm" asChild>
                <Link to={`/customer/reorder/${order.id}`}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reorder
                </Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
