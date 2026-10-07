import { useState, useEffect, useCallback } from 'react';
import {
  Store, User, Navigation, Package, MapPin, Phone,
  CheckCircle2, ArrowRight, Loader2, AlertCircle, Bike,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';
import { fetchOrdersByStatus, updateOrderStatus, type OrderRecord } from '@/lib/orders';
import type { OrderStatus } from '@/data/mockData';

const deliverySteps: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'PICKED_UP', label: 'Picked Up', description: 'Package picked up from pharmacy' },
  { status: 'IN_TRANSIT', label: 'Out for Delivery', description: 'Heading to customer' },
  { status: 'DELIVERED', label: 'Delivered', description: 'Order delivered successfully' },
];

export function CurrentDeliveryPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await fetchOrdersByStatus(['PICKED_UP', 'IN_TRANSIT']);
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

  const activeOrder = orders[0] || null;

  const handleAdvance = async (orderId: string, currentStatus: OrderStatus) => {
    setUpdating(true);
    let nextStatus: OrderStatus | null = null;
    if (currentStatus === 'PICKED_UP') nextStatus = 'IN_TRANSIT';
    else if (currentStatus === 'IN_TRANSIT') nextStatus = 'DELIVERED';

    if (!nextStatus) {
      setUpdating(false);
      return;
    }

    const { error: updateError } = await updateOrderStatus(orderId, nextStatus);
    setUpdating(false);
    if (updateError) {
      setError(updateError);
      return;
    }

    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: nextStatus! } : o
    ));

    if (nextStatus === 'DELIVERED') {
      setTimeout(() => loadOrders(), 1500);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Current Delivery">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Current Delivery">
        <div className="flex flex-col items-center py-16">
          <AlertCircle className="mb-3 h-12 w-12 text-destructive" />
          <p className="text-sm font-medium text-destructive">Failed to load delivery</p>
          <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        </div>
      </PageContainer>
    );
  }

  if (!activeOrder) {
    return (
      <PageContainer title="Current Delivery" description="No active delivery">
        <div className="flex flex-col items-center py-16">
          <Bike className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No active delivery</p>
          <p className="mt-1 text-xs text-muted-foreground">Accept a delivery request to get started</p>
          <Button className="mt-4" size="sm" asChild>
            <Link to="/delivery/requests">View delivery requests</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const addr = activeOrder.delivery_address;
  const currentIndex = deliverySteps.findIndex(s => s.status === activeOrder.status);
  const isDelivered = activeOrder.status === 'DELIVERED';

  return (
    <PageContainer title="Current Delivery" description={`Order ${activeOrder.order_number}`}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Map placeholder */}
          <Card className="overflow-hidden">
            <div className="relative flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-green-950/30 dark:via-blue-950/30 dark:to-green-950/30">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path d="M 50 150 Q 200 80 350 120 T 500 80" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="8 4" />
              </svg>
              <div className="absolute left-[10%] top-[60%] flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Store className="h-5 w-5" />
                </div>
                <span className="mt-1 rounded bg-card px-2 py-0.5 text-xs font-medium shadow">Pharmacy</span>
              </div>
              <div className="absolute right-[15%] top-[25%] flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg">
                  <User className="h-5 w-5" />
                </div>
                <span className="mt-1 rounded bg-card px-2 py-0.5 text-xs font-medium shadow">Customer</span>
              </div>
              <div className="absolute left-[45%] top-[45%] flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg">
                  <Navigation className="h-6 w-6" />
                </div>
                <span className="mt-1 rounded bg-card px-2 py-0.5 text-xs font-medium shadow">You</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t p-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> GPS tracking active</span>
              <span className="font-medium text-primary">{isDelivered ? 'Delivered' : 'En route'}</span>
            </div>
          </Card>

          {/* Status tracker */}
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Delivery Progress</h3>
            <div className="space-y-0">
              {deliverySteps.map((step, index) => {
                const isComplete = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isPending = index > currentIndex;
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                        isComplete && 'border-success bg-success text-success-foreground',
                        isCurrent && 'border-primary bg-primary text-primary-foreground',
                        isPending && 'border-muted bg-background text-muted-foreground'
                      )}>
                        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                      </div>
                      {index < deliverySteps.length - 1 && (
                        <div className={cn('w-0.5 grow', isComplete ? 'bg-success' : 'bg-muted')} style={{ minHeight: '2.5rem' }} />
                      )}
                    </div>
                    <div className={cn('pb-6', isPending && 'opacity-50')}>
                      <p className={cn(
                        'text-sm font-semibold',
                        isCurrent && 'text-primary',
                        isComplete && 'text-success',
                        isPending && 'text-muted-foreground'
                      )}>{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                      {isCurrent && <p className="mt-1 text-xs font-medium text-primary">In progress...</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Action button */}
          {!isDelivered && (
            <Button
              size="lg"
              className="w-full"
              disabled={updating}
              onClick={() => handleAdvance(activeOrder.id, activeOrder.status)}
            >
              {updating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {activeOrder.status === 'PICKED_UP' && 'Start Delivery (Out for Delivery)'}
              {activeOrder.status === 'IN_TRANSIT' && 'Mark as Delivered'}
            </Button>
          )}

          {isDelivered && (
            <Card className="p-5 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-success" />
              <p className="text-sm font-medium text-success">Order delivered successfully!</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link to="/delivery/requests">Find more deliveries</Link>
              </Button>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Store className="h-4 w-4 text-primary" />
              Pickup
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Pharmacy</p>
              <p className="text-xs text-muted-foreground">Pick up from pharmacy counter</p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4 text-success" />
              Drop
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{addr.label}</p>
              <p className="text-xs text-muted-foreground">{addr.line1}</p>
              {addr.line2 && <p className="text-xs text-muted-foreground">{addr.line2}</p>}
              <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Items ({activeOrder.items.length})</h3>
            <div className="space-y-2">
              {activeOrder.items.map((item, idx) => (
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
            <Separator className="my-3" />
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment</span>
              <span className="text-sm font-medium">{activeOrder.payment_method}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-sm text-muted-foreground">Order total</span>
              <span className="text-sm font-bold text-primary">₹{activeOrder.total.toFixed(2)}</span>
            </div>
          </Card>

          {activeOrder.delivery_instructions && (
            <Card className="border-amber-500/20 bg-amber-50 p-4 dark:bg-amber-950/20">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Delivery Notes</p>
              <p className="mt-1 text-xs text-muted-foreground">{activeOrder.delivery_instructions}</p>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
