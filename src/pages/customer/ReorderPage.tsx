import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ShoppingBag, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { getOrderById, formatPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function ReorderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrderById(id || '');
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  if (!order) {
    return (
      <PageContainer title="Reorder">
        <div className="py-16 text-center">
          <p className="text-sm font-medium">Order not found</p>
          <Button variant="link" onClick={() => navigate('/customer/orders')}>Back to orders</Button>
        </div>
      </PageContainer>
    );
  }

  const handleReorder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAdded(true);
      setTimeout(() => navigate('/customer/cart'), 1200);
    }, 1000);
  };

  return (
    <PageContainer title="Reorder" description={`Reorder items from ${order.orderNumber}`}>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {added && (
        <Card className="mb-4 flex items-center gap-3 border-success/30 bg-success/5 p-4">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <p className="text-sm font-medium text-success">Items added to cart! Redirecting...</p>
        </Card>
      )}

      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold">Items from this order</h3>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <item.imageIcon className={cn('h-6 w-6', item.imageColor)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.brand} • {item.strength} • Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Order total</p>
            <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
          </div>
          <Button size="lg" onClick={handleReorder} disabled={loading || added}>
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding to cart...</>
            ) : added ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" />Added!</>
            ) : (
              <><RefreshCw className="mr-2 h-4 w-4" />Reorder All Items</>
            )}
          </Button>
        </div>
      </Card>

      <Card className="mt-4 p-5">
        <div className="flex items-start gap-3">
          <ShoppingBag className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">Need different quantities?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              After adding items to your cart, you can adjust quantities before checkout.
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <a href="/customer/cart">Go to cart</a>
            </Button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
