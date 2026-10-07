import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';
import { formatPrice } from '@/data/mockData';
import { useCart } from '@/lib/cart';

export function CartPage() {
  const navigate = useNavigate();
  const { items, incrementQuantity, decrementQuantity, removeFromCart, subtotal } = useCart();

  const deliveryFee = items.length > 0 ? 25 : 0;
  const serviceFee = items.length > 0 ? 10 : 0;
  const total = subtotal + deliveryFee + serviceFee;
  const hasRxItems = items.some(item => item.prescriptionRequired);

  if (items.length === 0) {
    return (
      <PageContainer title="Your Cart">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">Add medicines to get started</p>
          <Button className="mt-6" asChild>
            <Link to="/customer/search">Browse medicines</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Your Cart" description={`${items.length} item${items.length !== 1 ? 's' : ''} in your cart`}>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue shopping
      </Button>

      {hasRxItems && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-950/20">
          <FileWarning className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Prescription required</p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Some items require a valid prescription. You'll be asked to upload it during checkout.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.medicineId} className="flex items-center gap-4 p-4">
                <Link to={`/customer/medicines/${item.medicineId}`} className="shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                    <span className="text-lg font-bold text-primary">{item.name.charAt(0)}</span>
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/customer/medicines/${item.medicineId}`}>
                      <h3 className="truncate text-sm font-semibold hover:underline">{item.name}</h3>
                    </Link>
                    {item.prescriptionRequired && (
                      <FileWarning className="h-3.5 w-3.5 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.brand} • {item.strength}</p>
                  <p className="mt-1 text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg border px-2 py-1">
                    <button onClick={() => decrementQuantity(item.medicineId)} className="text-muted-foreground hover:text-foreground">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-1 text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => incrementQuantity(item.medicineId)} className="text-muted-foreground hover:text-foreground">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.medicineId)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Order Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery fee</span>
                <span className="font-medium">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform/service fee</span>
                <span className="font-medium">{formatPrice(serviceFee)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">{formatPrice(total)}</span>
              </div>
            </div>
            <Button className="mt-5 w-full" size="lg" asChild>
              <Link to="/customer/checkout">Proceed to Checkout</Link>
            </Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
