import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, FileText, Clock, CheckCircle2, XCircle, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';
import {
  fetchAllPrescriptions,
  type PrescriptionRecord,
  type PrescriptionStatus,
} from '@/lib/prescriptions';

const statusConfig: Record<PrescriptionStatus, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400', icon: Clock },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400', icon: Clock },
  APPROVED: { label: 'Approved', color: 'bg-success/10 text-success', icon: CheckCircle2 },
  CLARIFICATION_REQUIRED: { label: 'Clarification Required', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400', icon: HelpCircle },
  REJECTED: { label: 'Rejected', color: 'bg-destructive/10 text-destructive', icon: XCircle },
};

export function PharmacyPrescriptionsListPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const sorted = [...prescriptions].sort((a, b) => {
    const order: Record<PrescriptionStatus, number> = {
      PENDING: 0, UNDER_REVIEW: 1, CLARIFICATION_REQUIRED: 2, APPROVED: 3, REJECTED: 4,
    };
    return (order[a.status] ?? 5) - (order[b.status] ?? 5);
  });

  if (loading) {
    return (
      <PageContainer title="Prescription Verification" description="Review and verify customer prescriptions">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Prescription Verification" description="Review and verify customer prescriptions">
        <div className="flex flex-col items-center py-16">
          <AlertCircle className="mb-3 h-12 w-12 text-destructive" />
          <p className="text-sm font-medium text-destructive">Failed to load prescriptions</p>
          <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Prescription Verification" description="Review and verify customer prescriptions">
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-amber-500" /><span className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'PENDING').length}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Pending</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-success" /><span className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'APPROVED').length}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Approved</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-blue-500" /><span className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'CLARIFICATION_REQUIRED').length}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Clarification</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2"><XCircle className="h-5 w-5 text-destructive" /><span className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'REJECTED').length}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Rejected</p>
        </Card>
      </div>

      <div className="space-y-3">
        {sorted.map(rx => {
          const config = statusConfig[rx.status] ?? statusConfig.PENDING;
          return (
            <Link key={rx.id} to={`/pharmacy/prescriptions/${rx.id}`}>
              <Card className="p-4 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{rx.prescription_number}</p>
                      <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', config.color)}>
                        <config.icon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {rx.patient_name || 'Unknown patient'} • {rx.doctor_name || 'No doctor'} • {new Date(rx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    {rx.medicines && rx.medicines.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {rx.medicines.length} medicine(s): {rx.medicines.map(m => `${m.name} ${m.strength}`).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <ClipboardCheck className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No prescriptions to review</p>
        </div>
      )}
    </PageContainer>
  );
}
