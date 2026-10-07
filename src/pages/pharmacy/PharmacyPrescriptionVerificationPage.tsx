import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, FileText, Check, X, HelpCircle, Stethoscope, User,
  Pill, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  fetchPrescriptionById,
  updatePrescriptionStatus,
  type PrescriptionRecord,
  type PrescriptionStatus,
} from '@/lib/prescriptions';

const statusColors: Record<PrescriptionStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  UNDER_REVIEW: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  APPROVED: 'bg-success/10 text-success',
  CLARIFICATION_REQUIRED: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  REJECTED: 'bg-destructive/10 text-destructive',
};

export function PharmacyPrescriptionVerificationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rx, setRx] = useState<PrescriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<PrescriptionStatus | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPrescriptionById(id).then(({ data, error: fetchError }) => {
      setLoading(false);
      if (fetchError) {
        setError(fetchError);
        return;
      }
      if (data) {
        setRx(data);
        setNotes(data.admin_notes || '');
      }
    });
  }, [id]);

  const handleAction = async (status: PrescriptionStatus) => {
    if (!rx) return;
    setActing(true);
    setActionError(null);
    const { error: updateError } = await updatePrescriptionStatus(
      rx.id,
      status,
      notes.trim() || undefined,
    );
    setActing(false);
    if (updateError) {
      setActionError(updateError);
      return;
    }
    setRx({ ...rx, status, admin_notes: notes.trim() || null });
    setActionResult(status);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !rx) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium">{error ? 'Failed to load prescription' : 'Prescription not found'}</p>
        <Button variant="link" onClick={() => navigate('/pharmacy/prescriptions')}>Back to prescriptions</Button>
      </div>
    );
  }

  const isPending = rx.status === 'PENDING' || rx.status === 'UNDER_REVIEW' || rx.status === 'CLARIFICATION_REQUIRED';

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to prescriptions
      </Button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Prescription {rx.prescription_number}</h1>
          <p className="text-sm text-muted-foreground">
            {rx.patient_name || 'Unknown patient'} • {rx.doctor_name || 'No doctor'} • {new Date(rx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <span className={cn('rounded-full px-3 py-1 text-xs font-medium', statusColors[rx.status])}>
          {rx.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: Original prescription */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4 text-primary" />
            Original Prescription
          </h3>
          <Card className="overflow-hidden">
            {rx.file_url ? (
              <div className="overflow-hidden rounded-lg border">
                <img
                  src={rx.file_url}
                  alt="Prescription"
                  className="max-h-96 w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-muted/30">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">No image uploaded</p>
                </div>
              </div>
            )}
          </Card>

          <Card className="mt-3 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{rx.doctor_name || 'Not specified'}</p>
                  <p className="text-xs text-muted-foreground">Prescribing Doctor</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{rx.patient_name || 'Not specified'}</p>
                  <p className="text-xs text-muted-foreground">Patient</p>
                </div>
              </div>
              {rx.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Customer Notes</p>
                    <p className="font-medium">{rx.notes}</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT: Medicines + actions */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Pill className="h-4 w-4 text-primary" />
            Prescribed Medicines
          </h3>
          {rx.medicines && rx.medicines.length > 0 ? (
            <Card className="p-5">
              <div className="space-y-3">
                {rx.medicines.map((med, idx) => (
                  <div key={idx} className="flex items-start gap-2 rounded-lg border p-3">
                    <Pill className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{med.name} {med.strength}</p>
                      <p className="text-xs text-muted-foreground">Quantity: {med.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="mb-3 h-10 w-10 text-amber-500" />
              <p className="text-sm font-medium">No medicines listed</p>
              <p className="mt-1 text-xs text-muted-foreground">Review the prescription image manually</p>
            </Card>
          )}

          {/* Admin notes from review */}
          {rx.admin_notes && rx.status !== 'PENDING' && (
            <Card className="mt-3 p-4">
              <p className="text-xs font-medium text-muted-foreground">Review Notes</p>
              <p className="mt-1 text-sm">{rx.admin_notes}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Action area */}
      <div className="mt-6">
        {actionError && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">{actionError}</p>
          </div>
        )}

        {actionResult && (
          <div className="mb-4 rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <p className="text-sm font-medium text-success">
                Prescription {actionResult === 'APPROVED' ? 'approved' : actionResult === 'REJECTED' ? 'rejected' : 'marked for clarification'}. Approved prescriptions move to order preparation.
              </p>
            </div>
          </div>
        )}

        {isPending && !actionResult && (
          <>
            <div className="mb-4">
              <Label htmlFor="pharmNotes" className="text-sm font-medium">Pharmacist Notes (optional)</Label>
              <Textarea
                id="pharmNotes"
                placeholder="Add notes about this prescription..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="destructive" className="sm:order-1" disabled={acting} onClick={() => handleAction('REJECTED')}>
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button variant="outline" className="sm:order-2" disabled={acting} onClick={() => handleAction('CLARIFICATION_REQUIRED')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Request Clarification
              </Button>
              <Button className="sm:order-3 bg-success hover:bg-success/90" disabled={acting} onClick={() => handleAction('APPROVED')}>
                {acting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Approve
              </Button>
            </div>
          </>
        )}

        {actionResult && (
          <Button variant="outline" asChild>
            <Link to="/pharmacy/prescriptions">Back to all prescriptions</Link>
          </Button>
        )}

        {!isPending && !actionResult && (
          <div className="mt-6">
            <Card className={cn('p-4 text-center', statusColors[rx.status])}>
              <p className="text-sm font-medium capitalize">
                This prescription has been {rx.status.replace(/_/g, ' ').toLowerCase()}
              </p>
              {rx.status === 'APPROVED' && (
                <p className="mt-1 text-xs">This prescription is approved and ready for order preparation.</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
