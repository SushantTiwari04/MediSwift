import { Link } from 'react-router-dom';
import { CalendarClock, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { inventory, formatDate, formatPrice, daysUntilExpiry } from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

export function ExpiryManagementPage() {
  const sorted = [...inventory].sort((a, b) => daysUntilExpiry(a.expiryDate) - daysUntilExpiry(b.expiryDate));
  const expired = sorted.filter(i => daysUntilExpiry(i.expiryDate) < 0);
  const expiringSoon = sorted.filter(i => { const d = daysUntilExpiry(i.expiryDate); return d >= 0 && d <= 60; });
  const safe = sorted.filter(i => daysUntilExpiry(i.expiryDate) > 60);

  return (
    <PageContainer title="Expiry Management" description="Monitor and manage expiring medicines">
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-2xl font-bold text-destructive">{expired.length}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Expired</p>
        </Card>
        <Card className="border-orange-500/30 bg-orange-50 p-4 dark:bg-orange-950/20">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-orange-500" />
            <span className="text-2xl font-bold text-orange-500">{expiringSoon.length}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Expiring soon</p>
        </Card>
        <Card className="border-success/30 bg-success/5 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span className="text-2xl font-bold text-success">{safe.length}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Safe</p>
        </Card>
      </div>

      {expired.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Expired - Remove Immediately
          </h3>
          <div className="space-y-2">
            {expired.map(item => (
              <Card key={item.id} className="border-destructive/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <item.imageIcon className={cn('h-5 w-5', item.imageColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.medicine} - {item.brand}</p>
                    <p className="text-xs text-muted-foreground">Batch: {item.batchNumber} • Expired: {formatDate(item.expiryDate)}</p>
                  </div>
                  <Button variant="destructive" size="sm">Dispose</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {expiringSoon.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-500">
            <CalendarClock className="h-4 w-4" />
            Expiring Soon (within 60 days)
          </h3>
          <div className="space-y-2">
            {expiringSoon.map(item => {
              const days = daysUntilExpiry(item.expiryDate);
              return (
                <Card key={item.id} className="border-orange-500/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <item.imageIcon className={cn('h-5 w-5', item.imageColor)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.medicine} - {item.brand}</p>
                      <p className="text-xs text-muted-foreground">Batch: {item.batchNumber} • Expires: {formatDate(item.expiryDate)} • Qty: {item.quantity}</p>
                    </div>
                    <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                      {days} days left
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-success">
          <CheckCircle2 className="h-4 w-4" />
          Safe Stock
        </h3>
        <div className="space-y-2">
          {safe.map(item => {
            const days = daysUntilExpiry(item.expiryDate);
            return (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <item.imageIcon className={cn('h-5 w-5', item.imageColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.medicine} - {item.brand}</p>
                    <p className="text-xs text-muted-foreground">Batch: {item.batchNumber} • Expires: {formatDate(item.expiryDate)}</p>
                  </div>
                  <Badge variant="outline" className="border-success/30 text-success">
                    {days} days left
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
