import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ClipboardList, Calendar, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { inventory, formatDate, formatPrice, daysUntilExpiry } from '@/data/pharmacyMockData';
import { cn } from '@/lib/utils';

export function BatchManagementPage() {
  const [query, setQuery] = useState('');

  const filtered = inventory.filter(i =>
    query === '' ||
    i.medicine.toLowerCase().includes(query.toLowerCase()) ||
    i.brand.toLowerCase().includes(query.toLowerCase()) ||
    i.batchNumber.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PageContainer title="Batch Management" description="Track and manage medicine batches">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by medicine, brand, or batch number..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filtered.map(item => {
          const days = daysUntilExpiry(item.expiryDate);
          const isExpired = days < 0;
          const isExpiringSoon = days <= 60 && days >= 0;
          return (
            <Card key={item.id} className="p-4 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <item.imageIcon className={cn('h-6 w-6', item.imageColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold">{item.medicine}</h3>
                    <Badge variant="secondary" className="shrink-0 font-mono text-xs">{item.batchNumber}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.brand} • {item.strength} • {item.packSize}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Qty: {item.quantity}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Expires: {formatDate(item.expiryDate)}
                    </span>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                </div>
                <div className="text-right">
                  {isExpired ? (
                    <Badge variant="outline" className="border-destructive/30 text-destructive">Expired</Badge>
                  ) : isExpiringSoon ? (
                    <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                      {days} days left
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-success/30 text-success">
                      {days} days left
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <ClipboardList className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No batches found</p>
        </div>
      )}
    </PageContainer>
  );
}
