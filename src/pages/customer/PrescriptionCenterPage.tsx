import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Upload, Plus, Clock, CheckCircle2, XCircle,
  AlertCircle, ChevronRight, Pill, Loader2, Eye,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import {
  fetchCustomerPrescriptions,
  type PrescriptionRecord,
  type PrescriptionStatus,
} from '@/lib/prescriptions';

const statusConfig: Record<PrescriptionStatus, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  APPROVED: { label: 'Approved', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  PENDING: { label: 'Pending Review', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  UNDER_REVIEW: { label: 'Under Review', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  REJECTED: { label: 'Rejected', icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  CLARIFICATION_REQUIRED: { label: 'Clarification Needed', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
};

export function PrescriptionCenterPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | PrescriptionStatus>('all');

  const loadPrescriptions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchCustomerPrescriptions(user.id);
    setLoading(false);
    if (fetchError) {
      setError(fetchError);
      return;
    }
    setPrescriptions(data || []);
  }, [user]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const filtered = filter === 'all' ? prescriptions : prescriptions.filter(p => p.status === filter);

  const filterTabs = [
    { value: 'all' as const, label: 'All' },
    { value: 'PENDING' as const, label: 'Pending' },
    { value: 'UNDER_REVIEW' as const, label: 'Under Review' },
    { value: 'APPROVED' as const, label: 'Approved' },
    { value: 'REJECTED' as const, label: 'Rejected' },
  ];

  return (
    <PageContainer
      title="Prescriptions"
      description="Upload and manage your prescriptions"
      action={
        <Button size="sm" asChild>
          <Link to="/customer/prescriptions/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Link>
        </Button>
      }
    >
      {/* Upload card */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm font-semibold">Upload a new prescription</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Take a photo or upload an image of your doctor's prescription
          </p>
          <div className="mt-4 flex gap-2">
            <Button size="sm" asChild>
              <Link to="/customer/prescriptions/upload">
                <Plus className="mr-1 h-4 w-4" />
                Upload Prescription
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <Card className="flex items-center gap-3 border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </Card>
      )}

      {/* Filter tabs */}
      {!loading && !error && (
        <>
          <div className="scrollbar-thin mb-4 flex gap-2 overflow-x-auto pb-1">
            {filterTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  filter === tab.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Prescriptions list */}
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map(rx => {
                const config = statusConfig[rx.status];
                return (
                  <Link key={rx.id} to={`/customer/prescriptions/${rx.id}`}>
                    <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
                      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-lg', config.bg)}>
                        <FileText className={cn('h-6 w-6', config.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">{rx.prescription_number}</p>
                          <Badge variant="outline" className={cn('shrink-0', config.color, 'border-current/20')}>
                            <config.icon className="mr-1 h-3 w-3" />
                            {config.label}
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{rx.doctor_name || 'Doctor not specified'}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{new Date(rx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          {rx.medicines && rx.medicines.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Pill className="h-3 w-3" />
                              {rx.medicines.length} medicine{rx.medicines.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
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
              <p className="mt-1 text-xs text-muted-foreground">Upload a prescription to get started</p>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
