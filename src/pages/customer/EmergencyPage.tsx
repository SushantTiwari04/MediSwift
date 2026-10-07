import { Phone, MapPin, Siren, AlertTriangle, Ambulance, Hospital, ShieldAlert, Navigation } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const emergencyContacts = [
  { name: 'Emergency Ambulance', number: '108', icon: Ambulance, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  { name: 'Police', number: '100', icon: ShieldAlert, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { name: 'Poison Control', number: '1800 222 1222', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { name: 'Medical Helpline', number: '104', icon: Phone, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
];

const emergencyGuidance = [
  { title: 'Severe allergic reaction', desc: 'Take an antihistamine if available. Call 108 immediately. Do not drive yourself.' },
  { title: 'Medication overdose', desc: 'Call Poison Control immediately. Keep the medicine container with you for reference.' },
  { title: 'Difficulty breathing', desc: 'Use your inhaler if prescribed. Sit upright. Call 108 if not relieved within minutes.' },
  { title: 'Chest pain', desc: 'Chew an aspirin if not allergic. Call 108 immediately. Do not drive.' },
];

export function EmergencyPage() {
  return (
    <PageContainer title="Emergency Portal" description="Quick access to emergency medical services">
      {/* Warning banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4">
        <Siren className="h-6 w-6 shrink-0 text-destructive" />
        <div>
          <p className="text-sm font-bold text-destructive">
            Medicine delivery is NOT a substitute for emergency medical care.
          </p>
          <p className="mt-1 text-xs text-destructive/80">
            If you are experiencing a medical emergency, call 108 (ambulance) or go to the nearest emergency room immediately.
          </p>
        </div>
      </div>

      {/* Emergency call buttons */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {emergencyContacts.map(contact => (
          <a key={contact.name} href={`tel:${contact.number}`}>
            <Card className={`flex flex-col items-center gap-2 p-4 text-center transition-shadow hover:shadow-md ${contact.bg}`}>
              <contact.icon className={`h-8 w-8 ${contact.color}`} />
              <span className="text-xs font-semibold">{contact.name}</span>
              <span className="text-lg font-bold">{contact.number}</span>
            </Card>
          </a>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Emergency guidance */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Emergency Guidance
          </h2>
          <div className="space-y-3">
            {emergencyGuidance.map(g => (
              <Card key={g.title} className="p-4">
                <p className="text-sm font-semibold">{g.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Nearby facilities */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Hospital className="h-5 w-5 text-primary" />
            Nearby Emergency Facilities
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Manipal Hospital', distance: '1.2 km', address: 'Old Airport Road, Bengaluru' },
              { name: 'Sakra World Hospital', distance: '2.8 km', address: 'Marathahalli, Bengaluru' },
              { name: 'Apollo Speciality Hospital', distance: '3.5 km', address: 'Jayanagar, Bengaluru' },
            ].map(facility => (
              <Card key={facility.name} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{facility.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{facility.address}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
                      <MapPin className="h-3 w-3" />
                      {facility.distance} away
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Navigation className="mr-1 h-3.5 w-3.5" />
                    Directions
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Location sharing */}
      <Card className="mt-6 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Share Your Location</p>
            <p className="text-xs text-muted-foreground">In an emergency, share your live location with emergency services</p>
          </div>
          <Button variant="outline" size="sm">Share Location</Button>
        </div>
      </Card>
    </PageContainer>
  );
}
