import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Star, Phone, Mail, MapPin, Package, DollarSign, CheckCircle, XCircle, Calendar, Boxes } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getAdminPharmacyById, adminOrders, formatPrice, formatRevenue, formatDate, type VerificationStatus } from '@/data/adminMockData';

const verifyColors: Record<VerificationStatus, string> = {
  VERIFIED: 'bg-success/10 text-success',
  PENDING: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  REJECTED: 'bg-destructive/10 text-destructive',
  EXPIRED: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
};

export function AdminPharmacyDetailsPage() {
  const { id } = useParams();
  const pharmacy = id ? getAdminPharmacyById(id) : undefined;

  if (!pharmacy) {
    return (
      <PageContainer title="Pharmacy Not Found">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">This pharmacy could not be found.</p>
          <Button variant="outline" asChild className="mt-4">
            <Link to="/admin/pharmacies">Back to Pharmacies</Link>
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const pharmacyOrders = adminOrders.filter(o => o.pharmacyId === pharmacy.id);

  return (
    <PageContainer title={pharmacy.name} description={pharmacy.ownerName}>
      <Link to="/admin/pharmacies" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Pharmacies
      </Link>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Profile */}
        <Card className="p-6 lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className={cn('flex h-16 w-16 items-center justify-center rounded-lg text-xl font-bold text-white', pharmacy.avatarColor)}>
              {pharmacy.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{pharmacy.name}</h2>
              <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-medium', verifyColors[pharmacy.verificationStatus])}>
                {pharmacy.verificationStatus}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">{pharmacy.phone}</span></div>
            <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">{pharmacy.email}</span></div>
            <div className="flex items-center gap-3 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">{pharmacy.address}</span></div>
            <div className="flex items-center gap-3 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Joined {formatDate(pharmacy.joinedAt)}</span></div>
          </div>
          <div className="mt-4 rounded-lg border bg-muted/50 p-3 space-y-1.5 text-sm">
            <p className="flex justify-between"><span className="text-muted-foreground">License No.</span><span className="font-medium">{pharmacy.licenseNumber}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">License Expiry</span><span className="font-medium">{formatDate(pharmacy.licenseExpiry)}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">Pharmacist License</span><span className="font-medium">{pharmacy.pharmacistLicense}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">Currently Open</span><span className="font-medium">{pharmacy.isOpen ? 'Yes' : 'No'}</span></p>
          </div>
          {(pharmacy.verificationStatus === 'PENDING' || pharmacy.verificationStatus === 'EXPIRED') && (
            <div className="mt-4 flex gap-2">
              <Button className="flex-1 bg-success hover:bg-success/90"><CheckCircle className="mr-2 h-4 w-4" /> Approve</Button>
              <Button variant="outline" className="flex-1 text-destructive hover:bg-destructive/10"><XCircle className="mr-2 h-4 w-4" /> Reject</Button>
            </div>
          )}
        </Card>

        {/* Stats + Orders */}
        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"><Package className="h-4 w-4 text-primary" /></div>
              <p className="text-xl font-bold">{pharmacy.totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </Card>
            <Card className="p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-success/10"><DollarSign className="h-4 w-4 text-success" /></div>
              <p className="text-xl font-bold">{formatRevenue(pharmacy.revenue)}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </Card>
            <Card className="p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30"><Star className="h-4 w-4 text-amber-500" /></div>
              <p className="text-xl font-bold">{pharmacy.rating > 0 ? pharmacy.rating.toFixed(1) : '—'}</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </Card>
            <Card className="p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30"><Boxes className="h-4 w-4 text-purple-500" /></div>
              <p className="text-xl font-bold">{pharmacy.inventoryCount}</p>
              <p className="text-xs text-muted-foreground">Inventory Items</p>
            </Card>
          </div>

          <Card className="p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Package className="h-5 w-5 text-primary" /> Recent Orders</h2>
            {pharmacyOrders.length > 0 ? (
              <div className="space-y-3">
                {pharmacyOrders.map(order => (
                  <Link key={order.id} to={`/admin/orders/${order.id}`}>
                    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Package className="h-4 w-4 text-primary" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{order.orderNumber}</p>
                        <p className="truncate text-xs text-muted-foreground">{order.customerName}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                      <Badge variant="outline" className="text-xs">{order.status.replace(/_/g, ' ')}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">No orders yet.</p>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
