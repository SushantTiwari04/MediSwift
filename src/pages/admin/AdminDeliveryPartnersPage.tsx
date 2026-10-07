import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bike, ArrowRight, CheckCircle, XCircle, Star, Package, Navigation } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { adminDeliveryPartners, formatRevenue, formatDate, type DeliveryPartnerStatus, type VerificationStatus } from '@/data/adminMockData';

const statusFilters = [
  { label: 'All', value: 'ALL' },
  { label: 'Online', value: 'ONLINE' },
  { label: 'On Delivery', value: 'ON_DELIVERY' },
  { label: 'Offline', value: 'OFFLINE' },
];

const dpStatusColors: Record<DeliveryPartnerStatus, string> = {
  ONLINE: 'bg-success/10 text-success',
  ON_DELIVERY: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  OFFLINE: 'bg-muted text-muted-foreground',
};

const verifyColors: Record<VerificationStatus, string> = {
  VERIFIED: 'bg-success/10 text-success',
  PENDING: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  REJECTED: 'bg-destructive/10 text-destructive',
  EXPIRED: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
};

export function AdminDeliveryPartnersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filtered = adminDeliveryPartners.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || d.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageContainer title="Delivery Partners" description="Manage delivery partners and verification status">
      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Partners', value: adminDeliveryPartners.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Online Now', value: adminDeliveryPartners.filter(d => d.status === 'ONLINE').length, color: 'text-success', bg: 'bg-success/10' },
          { label: 'On Delivery', value: adminDeliveryPartners.filter(d => d.status === 'ON_DELIVERY').length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Pending Verification', value: adminDeliveryPartners.filter(d => d.verificationStatus === 'PENDING').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className={cn('mb-2 flex h-9 w-9 items-center justify-center rounded-lg', s.bg)}>
              <Bike className={cn('h-4 w-4', s.color)} />
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
          <Input placeholder="Search by name or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={cn('shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                filter === f.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">{filtered.length} delivery partners found</p>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(dp => (
          <Card key={dp.id} className="p-4 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className={cn('relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white', dp.avatarColor)}>
                {dp.name.charAt(0)}
                <span className={cn('absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card',
                  dp.status === 'ONLINE' ? 'bg-success' : dp.status === 'ON_DELIVERY' ? 'bg-blue-500' : 'bg-muted-foreground')} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium">{dp.name}</p>
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', dpStatusColors[dp.status])}>{dp.status.replace(/_/g, ' ')}</span>
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', verifyColors[dp.verificationStatus])}>{dp.verificationStatus}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{dp.vehicleType} · {dp.city} · Joined {formatDate(dp.joinedAt)}</p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">{dp.totalDeliveries} deliveries</p>
                <p className="text-xs text-muted-foreground">{dp.rating > 0 ? `${dp.rating.toFixed(1)} ★` : 'No rating'}</p>
              </div>
              <Link to={`/admin/delivery-partners/${dp.id}`}>
                <Button variant="outline" size="sm">Details</Button>
              </Link>
            </div>
            {dp.verificationStatus === 'PENDING' && (
              <div className="mt-3 flex items-center justify-end gap-2 border-t pt-3">
                <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10"><XCircle className="mr-1 h-4 w-4" /> Reject</Button>
                <Button size="sm" className="bg-success hover:bg-success/90"><CheckCircle className="mr-1 h-4 w-4" /> Verify</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
