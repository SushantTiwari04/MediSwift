import { AlertTriangle, Pill, ShieldAlert, RefreshCw, Info, Stethoscope } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Severity = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

const severityConfig: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
  GREEN: { label: 'Safe', color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
  YELLOW: { label: 'Caution', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-500/30' },
  ORANGE: { label: 'Warning', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-500/30' },
  RED: { label: 'Critical', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
};

const safetyAlerts: {
  severity: Severity; type: string; title: string; desc: string; icon: typeof Pill;
}[] = [
  {
    severity: 'RED',
    type: 'Drug Interaction',
    title: 'Metformin + Contrast Dye Risk',
    desc: 'Metformin should be stopped 48 hours before any iodinated contrast imaging. Risk of lactic acidosis.',
    icon: AlertTriangle,
  },
  {
    severity: 'ORANGE',
    type: 'Duplicate Medicine',
    title: 'Duplicate Pain Relief',
    desc: 'You have both Paracetamol (Crocin) and Ibuprofen (Brufen) in your cart. Taking both may increase side effects.',
    icon: Pill,
  },
  {
    severity: 'YELLOW',
    type: 'Allergy Alert',
    title: 'Penicillin Allergy Flag',
    desc: 'Your profile indicates a penicillin allergy. Amoxicillin (Mox) is contraindicated. Consult your doctor.',
    icon: ShieldAlert,
  },
  {
    severity: 'YELLOW',
    type: 'Pharmacist Review Required',
    title: 'Insulin Dosage Verification',
    desc: 'Insulin Glargine dosage requires pharmacist verification before dispensing. Cold chain storage required.',
    icon: Stethoscope,
  },
  {
    severity: 'GREEN',
    type: 'Safe Combination',
    title: 'Vitamin D3 + Calcium',
    desc: 'Vitamin D3 and calcium supplements can be safely taken together. They work synergistically for bone health.',
    icon: Info,
  },
];

export function SafetyCenterPage() {
  return (
    <PageContainer title="Medication & Safety Center" description="Safety alerts and medication information">
      {/* Disclaimer */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <Info className="h-5 w-5 shrink-0 text-primary" />
        <p className="text-xs text-muted-foreground">
          MediSwift does not provide medical diagnosis or prescription advice. Always consult a qualified healthcare professional for medical guidance.
        </p>
      </div>

      {/* Severity legend */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(severityConfig) as Severity[]).map(s => (
          <Badge key={s} variant="outline" className={cn(severityConfig[s].color, severityConfig[s].border)}>
            {s} — {severityConfig[s].label}
          </Badge>
        ))}
      </div>

      {/* Safety alerts */}
      <div className="space-y-3">
        {safetyAlerts.map((alert, idx) => {
          const config = severityConfig[alert.severity];
          return (
            <Card key={idx} className={cn('border-l-4 p-4', config.border, config.bg)}>
              <div className="flex items-start gap-3">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', config.bg)}>
                  <alert.icon className={cn('h-5 w-5', config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn('shrink-0', config.color, config.border)}>
                      {alert.severity}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">{alert.type}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold">{alert.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{alert.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Safe storage tips */}
      <Card className="mt-6 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <ShieldAlert className="h-4 w-4 text-primary" />
          Medicine Safety Tips
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {[
            'Store medicines below 25°C unless otherwise specified',
            'Keep medicines in their original packaging',
            'Always check expiry dates before use',
            'Keep medicines out of reach of children',
            'Never share prescription medicines with others',
            'Dispose of expired medicines at a pharmacy, not in household waste',
          ].map(tip => (
            <div key={tip} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Report a reaction */}
      <Card className="mt-4 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Experienced a side effect?</p>
            <p className="text-xs text-muted-foreground">Report an adverse drug reaction to help keep others safe</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/customer/adr-report">
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Report ADR
            </a>
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
