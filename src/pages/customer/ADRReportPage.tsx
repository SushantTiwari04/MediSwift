import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Loader2, CheckCircle2, Pill } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { medicines } from '@/data/mockData';
import { cn } from '@/lib/utils';

const severityLevels = [
  { value: 'mild', label: 'Mild', color: 'text-success', bg: 'bg-success/10' },
  { value: 'moderate', label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { value: 'severe', label: 'Severe', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  { value: 'life_threatening', label: 'Life-threatening', color: 'text-destructive', bg: 'bg-destructive/10' },
];

export function ADRReportPage() {
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [time, setTime] = useState('');
  const [severity, setSeverity] = useState('');
  const [otherMeds, setOtherMeds] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <PageContainer title="Report ADR" description="Report an adverse drug reaction">
        <Card className="flex flex-col items-center p-8 text-center">
          <CheckCircle2 className="mb-3 h-12 w-12 text-success" />
          <p className="text-base font-semibold">Report Submitted</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your adverse drug reaction report has been submitted. A pharmacist will review it and follow up if needed.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Report ID: ADR-{Date.now().toString().slice(-6)}</p>
          <Button className="mt-6" onClick={() => navigate('/customer')}>Back to Home</Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Report ADR" description="Report an adverse drug reaction">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-950/20">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          This form is for reporting adverse drug reactions only. If you are experiencing a medical emergency, please use the Emergency Portal or call 108 immediately.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
        <Card className="p-5">
          <div className="space-y-2">
            <Label>Select Medicine</Label>
            <Select value={medicine} onValueChange={setMedicine}>
              <SelectTrigger><SelectValue placeholder="Select the medicine" /></SelectTrigger>
              <SelectContent>
                {medicines.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name} ({m.brand}) {m.strength}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-5">
          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms Experienced</Label>
            <Input id="symptoms" placeholder="e.g., Rash, nausea, dizziness" value={symptoms} onChange={e => setSymptoms(e.target.value)} required />
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="time">Approximate Time of Onset</Label>
            <Input id="time" placeholder="e.g., 30 minutes after taking the medicine" value={time} onChange={e => setTime(e.target.value)} required />
          </div>
        </Card>

        <Card className="p-5">
          <Label>Severity</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {severityLevels.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSeverity(s.value)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg border p-3 transition-all',
                  severity === s.value ? 'border-primary ring-1 ring-primary/20' : 'hover:bg-accent'
                )}
              >
                <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', s.bg)}>
                  <Pill className={cn('h-4 w-4', s.color)} />
                </span>
                <span className="text-xs font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="space-y-2">
            <Label htmlFor="other">Other Medicines Being Taken</Label>
            <Input id="other" placeholder="List any other medicines or supplements" value={otherMeds} onChange={e => setOtherMeds(e.target.value)} />
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="desc">Detailed Description</Label>
            <Textarea id="desc" placeholder="Describe the reaction in detail..." value={description} onChange={e => setDescription(e.target.value)} rows={4} required />
          </div>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Submit Report'}
        </Button>
      </form>
    </PageContainer>
  );
}
