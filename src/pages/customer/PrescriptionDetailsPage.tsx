import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, FileText, Clock, CheckCircle2, XCircle,
  Eye, Pill, User, Stethoscope, Calendar, ShoppingBag,
  AlertCircle, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  fetchPrescriptionById,
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

const statusFlow: { status: PrescriptionStatus; label: string; icon: typeof FileText; color: string }[] = [
  { status: 'PENDING', label: 'Uploaded', icon: FileText, color: 'text-amber-500' },
  { status: 'UNDER_REVIEW', label: 'Under Review', icon: Eye, color: 'text-blue-500' },
  { status: 'APPROVED', label: 'Approved', icon: CheckCircle2, color: 'text-success' },
];

function getStatusIndex(status: PrescriptionStatus): number {
  if (status === 'APPROVED') return 2;
  if (status === 'UNDER_REVIEW') return 1;
  return 0;
}

export function PrescriptionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState<PrescriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPrescriptionById(id).then(({ data, error: fetchError }) => {
      setLoading(false);
      if (fetchError) {
        setError(fetchError);
        return;
      }
      setPrescription(data);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium">{error || 'Prescription not found'}</p>
        <Button variant="link" onClick={() => navigate('/customer/prescriptions')}>Back to prescriptions</Button>
      </div>
    );
  }

  const config = statusConfig[prescription.status];
  const currentFlowIndex = getStatusIndex(prescription.status);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Prescription file preview */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', config.bg)}>
                  <FileText className={cn('h-6 w-6', config.color)} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{prescription.prescription_number}</p>
                  <Badge variant="outline" className={cn('mt-1', config.color, 'border-current/20')}>
                    <config.icon className="mr-1 h-3 w-3" />
                    {config.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Real image preview */}
            {prescription.file_url ? (
              <div className="overflow-hidden rounded-lg border">
                <img
                  src={prescription.file_url}
                  alt="Prescription"
                  className="max-h-96 w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
                <div className="text-center">
                  <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">No file uploaded</p>
                  <p className="text-xs text-muted-foreground">Manual entry prescription</p>
                </div>
              </div>
            )}
          </Card>

          {/* Status flow */}
          {prescription.status !== 'REJECTED' && (
            <Card className="p-6">
              <h3 className="mb-4 text-sm font-semibold">Verification Status</h3>
              <div className="space-y-0">
                {statusFlow.map((step, index) => {
                  const isComplete = index < currentFlowIndex;
                  const isCurrent = index === currentFlowIndex;
                  const isPending = index > currentFlowIndex;
                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                          isComplete && 'border-success bg-success text-success-foreground',
                          isCurrent && 'border-primary bg-primary text-primary-foreground',
                          isPending && 'border-muted bg-background text-muted-foreground'
                        )}>
                          <step.icon className="h-4 w-4" />
                        </div>
                        {index < statusFlow.length - 1 && (
                          <div className={cn('w-0.5 grow', isComplete ? 'bg-success' : 'bg-muted')} style={{ minHeight: '2rem' }} />
                        )}
                      </div>
                      <div className={cn('pb-4', isPending && 'opacity-50')}>
                        <p className={cn('text-sm font-semibold', isCurrent && 'text-primary', isComplete && 'text-success', isPending && 'text-muted-foreground')}>
                          {step.label}
                        </p>
                        {isCurrent && <p className="text-xs text-primary">In progress...</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Medicines */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Pill className="h-4 w-4 text-primary" />
              Prescribed Medicines
            </h3>
            {prescription.medicines && prescription.medicines.length > 0 ? (
              <div className="space-y-3">
                {prescription.medicines.map((med, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.strength} • Quantity: {med.quantity}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/customer/search">Order</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No medicines listed on this prescription.</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Stethoscope className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Doctor</p>
                  <p className="font-medium">{prescription.doctor_name || 'Not specified'}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Patient</p>
                  <p className="font-medium">{prescription.patient_name || 'Not specified'}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Uploaded</p>
                  <p className="font-medium">
                    {new Date(prescription.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              {prescription.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="font-medium">{prescription.notes}</p>
                  </div>
                </>
              )}
              {prescription.admin_notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Admin Notes</p>
                    <p className="font-medium">{prescription.admin_notes}</p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {prescription.status === 'APPROVED' && prescription.medicines && prescription.medicines.length > 0 && (
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Quick Actions</h3>
              <Button className="w-full" asChild>
                <Link to="/customer/search">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Order Medicines
                </Link>
              </Button>
            </Card>
          )}

          {prescription.status === 'REJECTED' && (
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Prescription Rejected</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {prescription.admin_notes || 'Please upload a new prescription to continue.'}
                  </p>
                </div>
              </div>
              <Button className="mt-4 w-full" size="sm" asChild>
                <Link to="/customer/prescriptions/upload">Upload New</Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
