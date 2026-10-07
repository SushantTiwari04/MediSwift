import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Camera, Upload, FileText, Pill, Plus, Trash2,
  Loader2, CheckCircle2, Image as ImageIcon, AlertCircle, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageContainer } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import {
  uploadPrescriptionImage,
  createPrescription,
} from '@/lib/prescriptions';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function UploadPrescriptionPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'image' | 'manual'>('image');
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState(profile?.full_name || '');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState<{ name: string; strength: string; quantity: number }[]>([]);
  const [newMed, setNewMed] = useState({ name: '', strength: '', quantity: 1 });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError('Only JPG, JPEG, and PNG files are allowed');
      return;
    }
    if (file.size > MAX_SIZE) {
      setFileError('File size must be under 10MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addMedicine = () => {
    if (!newMed.name.trim()) return;
    setMedicines([...medicines, { ...newMed, quantity: Math.max(1, newMed.quantity) }]);
    setNewMed({ name: '', strength: '', quantity: 1 });
  };

  const removeMedicine = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('You must be signed in to upload a prescription');
      return;
    }

    if (mode === 'image' && !selectedFile) {
      setError('Please select a prescription image to upload');
      return;
    }

    if (mode === 'manual' && medicines.length === 0) {
      setError('Please add at least one medicine');
      return;
    }

    if (!doctorName.trim()) {
      setError('Please enter the doctor\'s name');
      return;
    }

    setLoading(true);

    try {
      let fileUrl: string | undefined;
      let filePath: string | undefined;

      if (mode === 'image' && selectedFile) {
        const uploadResult = await uploadPrescriptionImage(user.id, selectedFile);
        if ('error' in uploadResult) {
          setError(uploadResult.error);
          setLoading(false);
          return;
        }
        fileUrl = uploadResult.publicUrl;
        filePath = uploadResult.path;
      }

      const { error: createError } = await createPrescription({
        customerId: user.id,
        doctorName: doctorName.trim(),
        patientName: patientName.trim() || profile?.full_name || '',
        notes: notes.trim() || undefined,
        fileUrl,
        filePath,
        fileType: mode === 'image' ? 'image' : 'image',
        fileName: selectedFile?.name || 'manual-entry',
        medicines: mode === 'manual' ? medicines : [],
      });

      if (createError) {
        setError(createError);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate('/customer/prescriptions'), 1500);
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Upload Prescription" description="Upload or enter your prescription details">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {success && (
        <Card className="mb-4 flex items-center gap-3 border-success/30 bg-success/5 p-4">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <p className="text-sm font-medium text-success">Prescription uploaded successfully! Redirecting...</p>
        </Card>
      )}

      {error && (
        <Card className="mb-4 flex items-center gap-3 border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Upload mode selector */}
          <div>
            <Label className="mb-2 block">Upload Method</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('image')}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border p-3 transition-all',
                  mode === 'image' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-accent'
                )}
              >
                <ImageIcon className={cn('h-5 w-5', mode === 'image' ? 'text-primary' : 'text-muted-foreground')} />
                <span className="text-xs font-medium">Upload Image</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border p-3 transition-all',
                  mode === 'manual' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-accent'
                )}
              >
                <Pill className={cn('h-5 w-5', mode === 'manual' ? 'text-primary' : 'text-muted-foreground')} />
                <span className="text-xs font-medium">Manual Entry</span>
              </button>
            </div>
          </div>

          {/* Image upload area */}
          {mode === 'image' && (
            <Card className="border-dashed p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!previewUrl ? (
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Upload a photo of your prescription</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, JPEG, or PNG. Max file size: 10MB.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  {fileError && (
                    <p className="mt-3 flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {fileError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-lg border">
                    <img src={previewUrl} alt="Prescription preview" className="max-h-80 w-full object-contain" />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    <span className="truncate">{selectedFile?.name}</span>
                    <span className="shrink-0">({((selectedFile?.size || 0) / 1024).toFixed(0)} KB)</span>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Change File
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Manual entry */}
          {mode === 'manual' && (
            <Card className="p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Pill className="h-4 w-4 text-primary" />
                Add Medicines
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                <div className="space-y-1 sm:col-span-5">
                  <Label className="text-xs">Medicine Name</Label>
                  <Input
                    placeholder="e.g., Metformin"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1 sm:col-span-3">
                  <Label className="text-xs">Strength</Label>
                  <Input
                    placeholder="e.g., 850mg"
                    value={newMed.strength}
                    onChange={(e) => setNewMed({ ...newMed, strength: e.target.value })}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    min={1}
                    value={newMed.quantity}
                    onChange={(e) => setNewMed({ ...newMed, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="flex items-end sm:col-span-2">
                  <Button type="button" className="w-full" onClick={addMedicine} disabled={!newMed.name.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {medicines.length > 0 && (
                <div className="mt-4 space-y-2">
                  {medicines.map((med, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg border p-3">
                      <Pill className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.strength} • Qty: {med.quantity}</p>
                      </div>
                      <button type="button" onClick={() => removeMedicine(idx)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {medicines.length === 0 && (
                <p className="mt-3 text-xs text-muted-foreground">No medicines added yet. Add at least one medicine.</p>
              )}
            </Card>
          )}

          {/* Prescription details */}
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Prescription Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor's Name</Label>
                <Input
                  id="doctor"
                  placeholder="Dr. Anil Sharma, MBBS, MD"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient">Patient Name</Label>
                <Input
                  id="patient"
                  placeholder="John Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about the prescription..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-20 p-5">
            <h3 className="mb-3 text-sm font-semibold">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Upload method</span>
                <span className="font-medium">{mode === 'image' ? 'Image Upload' : 'Manual Entry'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Medicines</span>
                <span className="font-medium">{mode === 'manual' ? medicines.length : 'From image'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctor</span>
                <span className="ml-2 truncate font-medium">{doctorName || '—'}</span>
              </div>
              {selectedFile && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File</span>
                  <span className="ml-2 truncate font-medium">{selectedFile.name}</span>
                </div>
              )}
            </div>
            <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Your prescription will be reviewed by our team. Verification typically takes 15-30 minutes.
              </p>
            </div>
            <Button type="submit" className="mt-4 w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Submit Prescription'
              )}
            </Button>
            <Button type="button" variant="outline" className="mt-2 w-full" asChild>
              <Link to="/customer/prescriptions">Cancel</Link>
            </Button>
          </Card>
        </div>
      </form>
    </PageContainer>
  );
}
