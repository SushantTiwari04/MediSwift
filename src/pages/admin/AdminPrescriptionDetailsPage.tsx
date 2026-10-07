import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, FileText, Clock, CheckCircle2, XCircle, Eye,
  Pill, User, Stethoscope, Calendar, AlertCircle, Loader2,
  Save, Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  fetchPrescriptionById,
  updatePrescriptionStatus,
  type PrescriptionRecord,
  type PrescriptionStatus,
} from '@/lib/prescriptions';

const statusOptions: { value: PrescriptionStatus; label: string; icon: typeof CheckCircle2; color: string }[] = [
  { value: 'PENDING', label: 'Pending', icon: Clock, color: 'text-amber-500' },
  { value: 'UNDER_REVIEW', label: 'Under Review', icon: Eye, color: 'text-blue-500' },
  { value: 'APPROVED', label: 'Approved', icon: CheckCircle2, color: 'text-success' },
  { value: 'REJECTED', label: 'Rejected', icon: XCircle, color: 'text-destructive' },
];

const statusConfig: Record<PrescriptionStatus, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  APPROVED: { label: 'Approved', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  PENDING: { label: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  UNDER_REVIEW: { label: 'Under Review', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  REJECTED: { label: 'Rejected', icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  CLARIFICATION_REQUIRED: { label: 'Clarification', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
};

export function AdminPrescriptionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState<PrescriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<PrescriptionStatus>('PENDING');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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
        setPrescription(data);
        setSelectedStatus(data.status);
        setAdminNotes(data.admin_notes || '');
      }
    });
  }, [id]);

  const handleSave = async () => {
    if (!prescription) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    const { error: updateError } = await updatePrescriptionStatus(
      prescription.id,
      selectedStatus,
      adminNotes.trim() || undefined,
    );
    setSaving(false);
    if (updateError) {
      setSaveError(updateError);
      return;
    }
    setSaveSuccess(true);
    setPrescription({ ...prescription, status: selectedStatus, admin_notes: adminNotes.trim() || null });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
        <Button variant="link" onClick={() => navigate('/admin/prescriptions')}>Back to prescriptions</Button>
      </div>
    );
  }

  const config = statusConfig[prescription.status];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <Link to="/admin/prescriptions" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Prescriptions
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Prescription image */}
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
                  <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">No file uploaded</p>
                  <p className="text-xs text-muted-foreground">Manual entry prescription</p>
                </div>
              </div>
            )}
          </Card>

          {/* Medicines */}
          {prescription.medicines && prescription.medicines.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Pill className="h-4 w-4 text-primary" />
                Medicines
              </h3>
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
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar — details + status controls */}
        <div className="space-y-4">
          {/* Details */}
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
                    <p className="text-xs text-muted-foreground">Customer Notes</p>
                    <p className="font-medium">{prescription.notes}</p>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Status controls */}
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Status Management</h3>

            {saveSuccess && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                Status updated successfully
              </div>
            )}
            {saveError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {saveError}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs">Update Status</Label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedStatus(opt.value)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition-all',
                      selectedStatus === opt.value
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'hover:bg-accent'
                    )}
                  >
                    <opt.icon className={cn('h-4 w-4', selectedStatus === opt.value ? opt.color : 'text-muted-foreground')} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="adminNotes" className="text-xs">Admin Notes</Label>
              <Textarea
                id="adminNotes"
                placeholder="Add review notes visible to the customer..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              type="button"
              className="mt-4 w-full"
              onClick={handleSave}
              disabled={saving || (selectedStatus === prescription.status && adminNotes === (prescription.admin_notes || ''))}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
