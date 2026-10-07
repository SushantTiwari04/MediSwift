import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, CreditCard, Wallet, Banknote,
  FileWarning, CheckCircle2, Upload, ShieldCheck, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PageContainer } from '@/components/layout/PageContainer';
import { addresses, formatPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart';
import { createOrder } from '@/lib/orders';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  const deliveryFee = items.length > 0 ? 25 : 0;
  const serviceFee = items.length > 0 ? 10 : 0;
  const total = subtotal + deliveryFee + serviceFee;
  const hasRxItems = items.some(item => item.prescriptionRequired);

  const paymentOptions = [
    { id: 'UPI', label: 'UPI Payment', icon: Wallet, desc: 'Pay via UPI app' },
    { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
    { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
  ];

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError(null);

    const addr = addresses.find(a => a.id === selectedAddress);
    if (!addr) {
      setError('Please select a delivery address');
      setPlacing(false);
      return;
    }

    const { data, error: orderError } = await createOrder({
      items,
      subtotal,
      deliveryFee,
      serviceFee,
      total,
      deliveryAddress: {
        label: addr.label,
        line1: addr.line1,
        line2: addr.line2,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
      },
      paymentMethod,
      deliveryInstructions,
      prescriptionRequired: hasRxItems,
    });

    if (orderError || !data) {
      setError(orderError || 'Failed to place order. Please try again.');
      setPlacing(false);
      return;
    }

    clearCart();
    setConfirmedOrderId(data.id);
    setConfirmedOrderNumber(data.order_number);
    setPlacing(false);
  };

  if (confirmedOrderId) {
    return (
      <PageContainer title="Order Confirmed">
        <div className="mx-auto max-w-md py-8 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mx-auto">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <h2 className="text-xl font-bold">Order Placed Successfully!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your order has been placed and is being processed.
          </p>
          <div className="mt-6 rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">Order ID</p>
            <p className="text-lg font-bold text-primary">{confirmedOrderNumber}</p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild>
              <Link to={`/customer/orders/${confirmedOrderId}`}>View Order Details</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/customer/orders">Go to My Orders</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/customer">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <PageContainer title="Checkout">
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-base font-semibold">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">Add medicines before checking out</p>
          <Button className="mt-6" asChild>
            <Link to="/customer/search">Browse medicines</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Checkout" description="Review and place your order">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to cart
      </Button>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Delivery address */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery Address
            </h3>
            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
              <div className="space-y-2">
                {addresses.map(addr => (
                  <label key={addr.id} className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors',
                    selectedAddress === addr.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  )}>
                    <RadioGroupItem value={addr.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Default</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{addr.line1}</p>
                      {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
                      <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link to="/customer/addresses">+ Add new address</Link>
            </Button>
          </div>

          {/* Prescription upload if needed */}
          {hasRxItems && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <FileWarning className="h-4 w-4 text-amber-500" />
                Upload Prescription
              </h3>
              <Card className="border-dashed p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30">
                    <Upload className="h-6 w-6 text-amber-500" />
                  </div>
                  <p className="text-sm font-medium">Upload your prescription</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Some items require a valid doctor's prescription
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">Choose Image</Button>
                    <Button variant="outline" size="sm">Choose PDF</Button>
                  </div>
                  <Link to="/customer/prescriptions/upload" className="mt-3 text-xs font-medium text-primary hover:underline">
                    Or upload from prescription center →
                  </Link>
                </div>
              </Card>
            </div>
          )}

          {/* Delivery instructions */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Delivery Instructions (optional)</h3>
            <Input
              placeholder="e.g., Ring the doorbell, leave at the door..."
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
            />
          </div>

          {/* Payment method */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-2">
                {paymentOptions.map(opt => (
                  <label key={opt.id} className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                    paymentMethod === opt.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  )}>
                    <RadioGroupItem value={opt.id} />
                    <opt.icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <Card className="sticky top-20 p-5">
            <h3 className="mb-4 text-sm font-semibold">Order Summary</h3>
            <div className="mb-4 space-y-3">
              {items.map((item) => (
                <div key={item.medicineId} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <span className="text-sm font-bold text-primary">{item.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.strength} • Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery fee</span>
                <span className="font-medium">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span className="font-medium">{formatPrice(serviceFee)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-success/5 p-3">
              <ShieldCheck className="h-4 w-4 text-success" />
              <p className="text-xs text-muted-foreground">Secure payment • Encrypted transaction</p>
            </div>

            <Button className="mt-4 w-full" size="lg" onClick={handlePlaceOrder} disabled={placing}>
              {placing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Place Order • {formatPrice(total)}
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
