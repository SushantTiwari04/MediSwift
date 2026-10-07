import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Navigation, MapPin, Clock, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderStatusTracker } from '@/components/customer/OrderStatusTracker';
import { getOrderById, orderStatusSteps, formatPrice, type OrderStatus } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrderById(id || '');
  const [simulatedStatus, setSimulatedStatus] = useState<OrderStatus>(order?.status || 'NEW');

  useEffect(() => {
    if (!order) return;
    setSimulatedStatus(order.status);
  }, [order]);

  useEffect(() => {
    if (!order || order.status === 'DELIVERED' || order.status === 'CANCELLED') return;
    const currentIndex = orderStatusSteps.findIndex(s => s.status === simulatedStatus);
    if (currentIndex >= orderStatusSteps.length - 1) return;
    const timer = setTimeout(() => {
      setSimulatedStatus(orderStatusSteps[currentIndex + 1].status);
    }, 4000);
    return () => clearTimeout(timer);
  }, [simulatedStatus, order]);

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium">Order not found</p>
        <Button variant="link" onClick={() => navigate('/customer/orders')}>Back to orders</Button>
      </div>
    );
  }

  const currentIndex = orderStatusSteps.findIndex(s => s.status === simulatedStatus);
  const isDelivered = simulatedStatus === 'DELIVERED';

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map placeholder */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden p-0">
            <div className="relative h-80 bg-gradient-to-br from-blue-50 via-emerald-50 to-amber-50 dark:from-blue-950/30 dark:via-emerald-950/30 dark:to-amber-950/30">
              {/* Mock map grid */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }} />
              {/* Route line */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path d="M 50 300 Q 200 200 350 150 T 650 80" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeDasharray="8 4" className="animate-pulse" />
              </svg>
              {/* Pharmacy pin */}
              <div className="absolute left-[8%] bottom-[15%] flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Package className="h-5 w-5" />
                </div>
                <span className="mt-1 rounded-full bg-background px-2 py-0.5 text-xs font-medium shadow">{order.pharmacyName}</span>
              </div>
              {/* Rider pin */}
              <div className={cn('absolute transition-all duration-1000', isDelivered ? 'left-[80%] top-[15%]' : 'left-[45%] top-[45%]')}>
                <div className="flex h-10 w-10 animate-bounce items-center justify-center rounded-full bg-amber-500 text-white shadow-lg">
                  <Navigation className="h-5 w-5" />
                </div>
                <span className="mt-1 block whitespace-nowrap rounded-full bg-background px-2 py-0.5 text-xs font-medium shadow">
                  {isDelivered ? 'Delivered!' : order.riderName || 'On the way'}
                </span>
              </div>
              {/* Destination pin */}
              <div className="absolute right-[8%] top-[12%] flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="mt-1 rounded-full bg-background px-2 py-0.5 text-xs font-medium shadow">Your location</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold">
                  {isDelivered ? 'Order delivered!' : `ETA: ${order.estimatedDelivery}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isDelivered ? 'Thank you for using MediSwift' : 'Your order is on the way'}
                </p>
              </div>
              {order.riderPhone && !isDelivered && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${order.riderPhone}`}><Phone className="mr-1 h-4 w-4" />Call rider</a>
                </Button>
              )}
            </div>
          </Card>

          {/* Status tracker */}
          <Card className="mt-4 p-5">
            <h3 className="mb-4 text-sm font-semibold">Order Progress</h3>
            <OrderStatusTracker currentStatus={simulatedStatus} cancelled={order.status === 'CANCELLED'} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Order Summary</h3>
            <p className="text-sm font-medium">{order.orderNumber}</p>
            <p className="text-xs text-muted-foreground">{order.items.map(i => i.name).join(', ')}</p>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="outline" className={cn(
                isDelivered ? 'border-success/30 text-success' : 'border-primary/30 text-primary'
              )}>
                {simulatedStatus.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div className="mt-3 text-sm font-bold text-primary">{formatPrice(order.total)}</div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Estimated delivery</span>
            </div>
            <p className="mt-1 text-sm font-semibold">{order.estimatedDelivery}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
