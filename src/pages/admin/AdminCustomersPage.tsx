import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, ArrowRight, Package, DollarSign, Mail, Phone, MapPin } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { adminCustomers, formatPrice, formatRevenue, formatDate, type AccountStatus } from '@/data/adminMockData';

const statusFilters = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Suspended', value: 'SUSPENDED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Banned', value: 'BANNED' },
];

const statusColors: Record<AccountStatus, string> = {
  ACTIVE: 'bg-success/10 text-success',
  SUSPENDED: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  PENDING: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  BANNED: 'bg-destructive/10 text-destructive',
};

export function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filtered = adminCustomers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchesFilter = filter === 'ALL' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageContainer
      title="Customers"
      description="Manage all platform customers"
    >
      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Customers', value: adminCustomers.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Active', value: adminCustomers.filter(c => c.status === 'ACTIVE').length, icon: Users, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Suspended', value: adminCustomers.filter(c => c.status === 'SUSPENDED').length, icon: Users, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'Banned', value: adminCustomers.filter(c => c.status === 'BANNED').length, icon: Users, color: 'text-destructive', bg: 'bg-destructive/10' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className={cn('mb-2 flex h-9 w-9 items-center justify-center rounded-lg', s.bg)}>
              <s.icon className={cn('h-4 w-4', s.color)} />
            </div>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                filter === f.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">{filtered.length} customers found</p>

      {/* Customer List */}
      <div className="space-y-3">
        {filtered.map(customer => (
          <Link key={customer.id} to={`/admin/customers/${customer.id}`}>
            <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white', customer.avatarColor)}>
                {customer.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{customer.name}</p>
                <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">{customer.totalOrders} orders</p>
                <p className="text-xs text-muted-foreground">{formatRevenue(customer.totalSpent)}</p>
              </div>
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusColors[customer.status])}>
                {customer.status}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
