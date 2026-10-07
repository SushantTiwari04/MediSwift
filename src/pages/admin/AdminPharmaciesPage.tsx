import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Building2, ArrowRight, CheckCircle, XCircle, Star, Phone, Mail, MapPin } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { adminPharmacies, formatRevenue, formatDate, type VerificationStatus } from '@/data/adminMockData';

const statusFilters = [
  { label: 'All', value: 'ALL' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Expired', value: 'EXPIRED' },
];

const verifyColors: Record<VerificationStatus, string> = {
  VERIFIED: 'bg-success/10 text-success',
  PENDING: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  REJECTED: 'bg-destructive/10 text-destructive',
  EXPIRED: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
};

export function AdminPharmaciesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [actionPharmacy, setActionPharmacy] = useState<typeof adminPharmacies[0] | null>(null);

  const filtered = adminPharmacies.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.ownerName.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || p.verificationStatus === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageContainer title="Pharmacies" description="Manage registered pharmacies and verify licenses">
      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Pharmacies', value: adminPharmacies.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Verified', value: adminPharmacies.filter(p => p.verificationStatus === 'VERIFIED').length, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Pending Approval', value: adminPharmacies.filter(p => p.verificationStatus === 'PENDING').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'Rejected', value: adminPharmacies.filter(p => p.verificationStatus === 'REJECTED').length, color: 'text-destructive', bg: 'bg-destructive/10' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className={cn('mb-2 flex h-9 w-9 items-center justify-center rounded-lg', s.bg)}>
              <Building2 className={cn('h-4 w-4', s.color)} />
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
            placeholder="Search by name, owner, or city..."
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

      <p className="mb-3 text-sm text-muted-foreground">{filtered.length} pharmacies found</p>

      {/* Pharmacy List */}
      <div className="space-y-3">
        {filtered.map(pharmacy => (
          <Card key={pharmacy.id} className="p-4 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white', pharmacy.avatarColor)}>
                {pharmacy.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{pharmacy.name}</p>
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', verifyColors[pharmacy.verificationStatus])}>
                    {pharmacy.verificationStatus}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{pharmacy.ownerName} · {pharmacy.city}</p>
              </div>
              <div className="hidden sm:block text-right">
                {pharmacy.verificationStatus === 'VERIFIED' && (
                  <>
                    <p className="text-sm font-semibold">{pharmacy.totalOrders} orders</p>
                    <p className="text-xs text-muted-foreground">{formatRevenue(pharmacy.revenue)}</p>
                  </>
                )}
              </div>
              <Link to={`/admin/pharmacies/${pharmacy.id}`}>
                <Button variant="outline" size="sm">Details</Button>
              </Link>
            </div>
            {(pharmacy.verificationStatus === 'PENDING' || pharmacy.verificationStatus === 'EXPIRED') && (
              <div className="mt-3 flex items-center gap-2 border-t pt-3">
                <span className="text-xs text-muted-foreground">License: {pharmacy.licenseNumber}</span>
                <span className="ml-auto flex gap-2">
                  <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => setActionPharmacy(pharmacy)}>
                    <XCircle className="mr-1 h-4 w-4" /> Reject
                  </Button>
                  <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => setActionPharmacy(pharmacy)}>
                    <CheckCircle className="mr-1 h-4 w-4" /> Approve
                  </Button>
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Approve/Reject Dialog */}
      <Dialog open={!!actionPharmacy} onOpenChange={(open) => !open && setActionPharmacy(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {actionPharmacy && `Are you sure you want to approve ${actionPharmacy.name}? This will enable them to receive orders on the platform.`}
            </DialogDescription>
          </DialogHeader>
          {actionPharmacy && (
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <p><span className="text-muted-foreground">License:</span> {actionPharmacy.licenseNumber}</p>
              <p><span className="text-muted-foreground">Pharmacist License:</span> {actionPharmacy.pharmacistLicense}</p>
              <p><span className="text-muted-foreground">Expires:</span> {formatDate(actionPharmacy.licenseExpiry)}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionPharmacy(null)}>Cancel</Button>
            <Button className="bg-success hover:bg-success/90" onClick={() => setActionPharmacy(null)}>
              <CheckCircle className="mr-2 h-4 w-4" /> Approve Pharmacy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
