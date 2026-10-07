import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck, Search, FileText, ChevronRight,
  Clock, CheckCircle2, XCircle, Eye, Loader2, AlertCircle,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  fetchAllPrescriptions,
  type PrescriptionRecord,
  type PrescriptionStatus,
} from '@/lib/prescriptions';

const statusFilters = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Under Review', value: 'UNDER_REVIEW' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const statusConfig: Record<PrescriptionStatus, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  APPROVED: { label: 'Approved', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  PENDING: { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  UNDER_REVIEW: { label: 'Under Review', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  REJECTED: { label: 'Rejected', icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  CLARIFICATION_REQUIRED: { label: 'Clarification', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
};

export function AdminPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const loadPrescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllPrescriptions();
    setLoading(false);
    if (fetchError) {
      setError(fetchError);
      return;
    }
    setPrescriptions(data || []);
  }, []);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const filtered = prescriptions.filter(p => {
    const matchesSearch =
      p.prescription_number.toLowerCase().includes(search.toLowerCase()) ||
      p.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      p.doctor_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageContainer title="Prescriptions" description="Review and manage customer prescriptions">
      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total', value: prescriptions.length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Pending', value: prescriptions.filter(p => p.status === 'PENDING').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'Under Review', value: prescriptions.filter(p => p.status === 'UNDER_REVIEW').length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Approved', value: prescriptions.filter(p => p.status === 'APPROVED').length, color: 'text-success', bg: 'bg-success/10' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className={cn('mb-2 flex h-9 w-9 items-center justify-center rounded-lg', s.bg)}>
              <ClipboardCheck className={cn('h-4 w-4', s.color)} />
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
            placeholder="Search by ID, patient, or doctor..."
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

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && error && (
        <Card className="flex items-center gap-3 border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </Card>
      )}

      {!loading && !error && (
        <>
          <p className="mb-3 text-sm text-muted-foreground">{filtered.length} prescriptions found</p>

          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map(rx => {
                const config = statusConfig[rx.status];
                return (
                  <Link key={rx.id} to={`/admin/prescriptions/${rx.id}`}>
                    <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
                      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', config.bg)}>
                        <FileText className={cn('h-5 w-5', config.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{rx.prescription_number}</p>
                          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', config.bg, config.color)}>
                            {config.label}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {rx.patient_name || 'Unknown patient'} · {rx.doctor_name || 'No doctor'}
                        </p>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(rx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center py-16">
              <FileText className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium">No prescriptions found</p>
              <p className="mt-1 text-xs text-muted-foreground">Customer prescriptions will appear here</p>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
