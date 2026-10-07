import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, FileText, Camera, Siren, Clock,
  Package, RefreshCw, ChevronRight, Zap, ShieldCheck,
  Star, TrendingUp, HeartPulse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageContainer } from '@/components/layout/PageContainer';
import { MedicineCard } from '@/components/customer/MedicineCard';
import { PharmacyCard } from '@/components/customer/PharmacyCard';
import { CompactOrderStatus } from '@/components/customer/OrderStatusTracker';
import {
  medicines, pharmacies, orders, popularProducts, formatPrice,
  formatDate,
} from '@/data/mockData';
import { cn } from '@/lib/utils';

export function CustomerHomePage() {
  const navigate = useNavigate();
  const recentOrders = orders.filter(o => o.status === 'DELIVERED').slice(0, 2);
  const activeOrder = orders.find(o => o.status === 'IN_TRANSIT');
  const nearbyPharmacies = pharmacies.filter(p => p.open).slice(0, 3);

  return (
    <PageContainer title="" description="" className="!max-w-5xl !px-4 sm:!px-6">
      {/* Location bar */}
      <div className="-mt-2 mb-4 flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="font-medium">Delivering to</span>
        <span className="text-muted-foreground">Flat 302, Green Meadows, MG Road</span>
        <button className="text-xs font-medium text-primary hover:underline">Change</button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search medicines, brands, health products..."
          className="h-12 pl-11 pr-4 text-base"
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate('/customer/search');
          }}
        />
      </div>

      {/* Quick actions */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link to="/customer/prescriptions/upload">
          <Card className="flex flex-col items-center gap-2 p-4 transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs font-medium sm:text-sm">Upload Prescription</span>
          </Card>
        </Link>
        <Card className="flex cursor-pointer flex-col items-center gap-2 p-4 transition-shadow hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xs font-medium sm:text-sm">Scan Prescription</span>
        </Card>
        <Link to="/customer/pharmacies">
          <Card className="flex flex-col items-center gap-2 p-4 transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs font-medium sm:text-sm">Nearby Pharmacies</span>
          </Card>
        </Link>
        <Link to="/customer/emergency">
          <Card className="flex flex-col items-center gap-2 border-destructive/30 bg-destructive/5 p-4 transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Siren className="h-6 w-6 text-destructive" />
            </div>
            <span className="text-xs font-medium text-destructive sm:text-sm">Emergency</span>
          </Card>
        </Link>
      </div>

      {/* Active order banner */}
      {activeOrder && (
        <Link to={`/customer/orders/${activeOrder.id}`} className="mb-6 block">
          <Card className="flex items-center gap-4 border-primary/30 bg-primary/5 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Order in progress</p>
              <p className="truncate text-xs text-muted-foreground">
                {activeOrder.items.map(i => i.name).join(', ')} • ETA {activeOrder.estimatedDelivery}
              </p>
              <div className="mt-2">
                <CompactOrderStatus currentStatus={activeOrder.status} />
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Card>
        </Link>
      )}

      {/* Fast delivery banner */}
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Fast delivery in 15-30 minutes</p>
          <p className="text-xs text-muted-foreground">From verified pharmacies near you</p>
        </div>
        <ShieldCheck className="h-5 w-5 text-primary" />
      </div>

      {/* Recent orders + reorder */}
      {recentOrders.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Package className="h-5 w-5 text-primary" />
              Recent Orders
            </h2>
            <Link to="/customer/orders" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/customer/orders/${order.id}`}>
                <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-muted">
                        <item.imageIcon className={cn('h-5 w-5', item.imageColor)} />
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {order.items.map(i => i.name).join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.placedAt)} • {formatPrice(order.total)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/customer/reorder/${order.id}`}>
                      <RefreshCw className="mr-1 h-3.5 w-3.5" />
                      Reorder
                    </Link>
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Nearby pharmacies */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-primary" />
            Nearby Pharmacies
          </h2>
          <Link to="/customer/pharmacies" className="text-sm font-medium text-primary hover:underline">
            See all
          </Link>
        </div>
        <div className="space-y-3">
          {nearbyPharmacies.map(pharmacy => (
            <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} variant="compact" />
          ))}
        </div>
      </div>

      {/* Popular healthcare products */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="h-5 w-5 text-primary" />
            Popular Healthcare Products
          </h2>
          <Link to="/customer/search" className="text-sm font-medium text-primary hover:underline">
            Browse all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {popularProducts.map(medicine => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      </div>

      {/* Health tip */}
      <Card className="mb-2 flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 dark:from-emerald-950/20 dark:to-teal-950/20">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
          <HeartPulse className="h-6 w-6 text-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-semibold">Health Tip of the Day</p>
          <p className="text-xs text-muted-foreground">
            Store medicines below 25°C and always check expiry dates before use.
            Dispose of expired medicines safely at your nearest pharmacy.
          </p>
        </div>
      </Card>
    </PageContainer>
  );
}
