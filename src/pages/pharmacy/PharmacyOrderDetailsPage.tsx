import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, MapPin, CreditCard, Clock,
  FileCheck, Truck, Check, X, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  getPharmacyOrderById, orderStatusSteps, formatPrice,
  formatTime, formatDate,
} from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

export function PharmacyOrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getPharmacyOrderById(id || '');

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium">Order not found</p>
        <Button variant="link" onClick={() => navigate('/pharmacy/orders')}>Back to orders</Button>
      </div>
    );
  }

  const cancelled = order.status === 'CANCELLED';
  const currentIndex = orderStatusSteps.findIndex(s => s.status === order.status);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to orders
      </Button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{order.customerName} • {formatDate(order.placedAt)} at {formatTime(order.placedAt)}</p>
        </div>
        <span className={cn(
          'rounded-full px-3 py-1 text-xs font-medium',
          order.status === 'DELIVERED' ? 'bg-success/10 text-success' :
          cancelled ? 'bg-destructive/10 text-destructive' :
          order.status === 'NEW' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' :
          'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
        )}>
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Order items */}
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <item.imageIcon className={cn('h-6 w-6', item.imageColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      {item.prescriptionRequired && (
                        <Badge variant="outline" className="shrink-0 border-amber-500/30 text-amber-600 dark:text-amber-400">
                          Rx
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.brand} • {item.strength} • {item.form}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(item.price)}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery fee</span><span>{formatPrice(order.deliveryFee)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Service fee</span><span>{formatPrice(order.serviceFee)}</span></div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-bold"><span>Total</span><span className="text-primary">{formatPrice(order.total)}</span></div>
            </div>
          </Card>

          {/* Order status tracker */}
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Order Status</h3>
            {cancelled ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
                <X className="mx-auto mb-2 h-6 w-6 text-destructive" />
                <p className="text-sm font-medium text-destructive">Order Cancelled</p>
                {order.notes && <p className="mt-1 text-xs text-muted-foreground">{order.notes}</p>}
              </div>
            ) : (
              <div className="space-y-0">
                {orderStatusSteps.map((step, index) => {
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
                          {isComplete ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                        </div>
                        {index < orderStatusSteps.length - 1 && (
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
            )}
            {!cancelled && order.status !== 'DELIVERED' && (
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1">Advance Status</Button>
                <Button size="sm" variant="outline" className="text-destructive">Cancel Order</Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer info */}
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Customer</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{order.deliveryAddress}</span>
              </div>
            </div>
          </Card>

          {/* Delivery info */}
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Delivery</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">ETA: {order.estimatedDelivery}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{order.paymentMethod}</span>
              </div>
              {order.riderName && (
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.riderName}</p>
                    <p className="text-xs text-muted-foreground">{order.riderPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Prescription link */}
          {order.prescriptionRequired && order.prescriptionId && (
            <Link to={`/pharmacy/prescriptions/${order.prescriptionId}`}>
              <Card className="flex items-center gap-3 border-amber-500/30 bg-amber-50 p-4 transition-shadow hover:shadow-md dark:bg-amber-950/20">
                <FileCheck className="h-5 w-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">View Prescription</p>
                  <p className="text-xs text-muted-foreground">Verify before processing</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Card>
            </Link>
          )}

          {order.notes && (
            <Card className="p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Order Notes</p>
              <p className="text-sm">{order.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
