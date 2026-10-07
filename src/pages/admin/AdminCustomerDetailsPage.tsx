import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Package, DollarSign, Calendar, ShoppingBag } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getAdminCustomerById, adminOrders, formatPrice, formatRevenue, formatDate, type AccountStatus } from '@/data/adminMockData';

const statusColors: Record<AccountStatus, string> = {
  ACTIVE: 'bg-success/10 text-success',
  SUSPENDED: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  PENDING: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  BANNED: 'bg-destructive/10 text-destructive',
};

export function AdminCustomerDetailsPage() {
  const { id } = useParams();
  const customer = id ? getAdminCustomerById(id) : undefined;

  if (!customer) {
    return (
      <PageContainer title="Customer Not Found">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">This customer could not be found.</p>
          <Button variant="outline" asChild className="mt-4">
            <Link to="/admin/customers">Back to Customers</Link>
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const customerOrders = adminOrders.filter(o => o.customerId === customer.id);

  return (
    <PageContainer title={customer.name} description={`Customer since ${formatDate(customer.joinedAt)}`}>
      <Link to="/admin/customers" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Link>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="p-6 lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className={cn('flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white', customer.avatarColor)}>
              {customer.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{customer.name}</h2>
              <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-medium', statusColors[customer.status])}>
                {customer.status}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{customer.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{customer.city}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Joined {formatDate(customer.joinedAt)}</span>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-2 lg:grid-cols-2">
          <Card className="p-5">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{customer.totalOrders}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </Card>
          <Card className="p-5">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <p className="text-2xl font-bold">{formatRevenue(customer.totalSpent)}</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </Card>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Package className="h-5 w-5 text-primary" />
          Order History
        </h2>
        {customerOrders.length > 0 ? (
          <div className="space-y-3">
            {customerOrders.map(order => (
              <Link key={order.id} to={`/admin/orders/${order.id}`}>
                <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{order.orderNumber}</p>
                    <p className="truncate text-xs text-muted-foreground">{order.pharmacyName}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
