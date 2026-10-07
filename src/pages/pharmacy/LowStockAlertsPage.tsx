import { Link } from 'react-router-dom';
import { AlertTriangle, TrendingDown, Package, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { inventory, formatPrice } from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

export function LowStockAlertsPage() {
  const lowStockItems = inventory
    .filter(i => i.quantity <= i.lowStockThreshold)
    .sort((a, b) => (a.quantity / a.lowStockThreshold) - (b.quantity / b.lowStockThreshold));

  const outOfStock = lowStockItems.filter(i => i.quantity === 0);
  const critical = lowStockItems.filter(i => i.quantity > 0 && i.quantity <= i.lowStockThreshold * 0.5);
  const warning = lowStockItems.filter(i => i.quantity > i.lowStockThreshold * 0.5);

  return (
    <PageContainer title="Low Stock Alerts" description="Medicines that need restocking">
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-2xl font-bold text-destructive">{outOfStock.length}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Out of stock</p>
        </Card>
        <Card className="border-orange-500/30 bg-orange-50 p-4 dark:bg-orange-950/20">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-500" />
            <span className="text-2xl font-bold text-orange-500">{critical.length}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Critical</p>
        </Card>
        <Card className="border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-950/20">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-amber-500" />
            <span className="text-2xl font-bold text-amber-500">{warning.length}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Warning</p>
        </Card>
      </div>

      {outOfStock.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-destructive">Out of Stock</h3>
          <div className="space-y-2">
            {outOfStock.map(item => (
              <Card key={item.id} className="border-destructive/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <item.imageIcon className={cn('h-6 w-6', item.imageColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.medicine} - {item.brand}</p>
                    <p className="text-xs text-muted-foreground">{item.strength} • {item.form} • Threshold: {item.lowStockThreshold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-destructive">0 units</p>
                    <Button variant="destructive" size="sm" className="mt-1">
                      <Plus className="mr-1 h-3 w-3" />
                      Restock
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {critical.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-orange-500">Critical - Below 50% threshold</h3>
          <div className="space-y-2">
            {critical.map(item => (
              <Card key={item.id} className="border-orange-500/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <item.imageIcon className={cn('h-6 w-6', item.imageColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.medicine} - {item.brand}</p>
                    <p className="text-xs text-muted-foreground">{item.strength} • Threshold: {item.lowStockThreshold} • {formatPrice(item.price)}/unit</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-orange-500">{item.quantity} units</p>
                    <Button variant="outline" size="sm" className="mt-1 border-orange-500/30 text-orange-600" asChild>
                      <Link to={`/pharmacy/inventory/edit/${item.id}`}>Restock</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {warning.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-amber-500">Warning - Below threshold</h3>
          <div className="space-y-2">
            {warning.map(item => (
              <Card key={item.id} className="border-amber-500/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <item.imageIcon className={cn('h-6 w-6', item.imageColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.medicine} - {item.brand}</p>
                    <p className="text-xs text-muted-foreground">{item.strength} • Threshold: {item.lowStockThreshold} • {formatPrice(item.price)}/unit</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-500">{item.quantity} units</p>
                    <Button variant="outline" size="sm" className="mt-1" asChild>
                      <Link to={`/pharmacy/inventory/edit/${item.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {lowStockItems.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <Package className="mb-3 h-12 w-12 text-success" />
          <p className="text-sm font-medium">All stock levels are healthy</p>
        </div>
      )}
    </PageContainer>
  );
}
