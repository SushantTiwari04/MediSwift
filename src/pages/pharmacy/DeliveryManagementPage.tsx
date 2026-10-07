import { Link } from 'react-router-dom';
import { Truck, MapPin, Clock, Package, Phone, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { deliveryTasks, formatPrice } from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

export function DeliveryManagementPage() {
  const active = deliveryTasks.filter(d => d.status !== 'DELIVERED');
  const completed = deliveryTasks.filter(d => d.status === 'DELIVERED');

  const statusConfig: Record<string, { label: string; color: string }> = {
    ASSIGNED: { label: 'Assigned', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400' },
    PICKED_UP: { label: 'Picked Up', color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' },
    IN_TRANSIT: { label: 'In Transit', color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400' },
    DELIVERED: { label: 'Delivered', color: 'bg-success/10 text-success' },
  };

  return (
    <PageContainer title="Delivery Management" description="Track and manage active deliveries">
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2"><Truck className="h-5 w-5 text-blue-500" /><span className="text-2xl font-bold">{active.length}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Active</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-success" /><span className="text-2xl font-bold">{completed.length}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Completed Today</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /><span className="text-2xl font-bold">{deliveryTasks.reduce((s, d) => s + d.items, 0)}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Items in Transit</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-orange-500" /><span className="text-2xl font-bold">18m</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Avg Time</p>
        </Card>
      </div>

      {active.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold">Active Deliveries</h3>
          <div className="space-y-3">
            {active.map(task => (
              <Card key={task.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link to={`/pharmacy/orders`} className="text-sm font-semibold hover:underline">{task.orderNumber}</Link>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusConfig[task.status].color)}>
                        {statusConfig[task.status].label}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {task.riderName} • {task.riderPhone}
                    </div>
                    <div className="mt-1 flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                      {task.address}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{task.distance} km</span>
                      <span>•</span>
                      <span>ETA: {task.estimatedTime}</span>
                      <span>•</span>
                      <span>{task.items} items</span>
                      <span>•</span>
                      <span className="font-medium text-primary">{formatPrice(task.total)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold">Completed Today</h3>
        <div className="space-y-3">
          {completed.map(task => (
            <Card key={task.id} className="p-4 opacity-75">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{task.orderNumber}</span>
                    <Badge variant="outline" className="border-success/30 text-success">Delivered</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{task.riderName} • {task.address}</p>
                  <p className="text-xs text-muted-foreground">{task.distance} km • {task.items} items • {formatPrice(task.total)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
