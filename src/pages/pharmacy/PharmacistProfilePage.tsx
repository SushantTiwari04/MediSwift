import { UserCircle, Mail, Phone, Award, GraduationCap, BadgeCheck, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';

export function PharmacistProfilePage() {
  return (
    <PageContainer title="Pharmacist Profile" description="Your professional information">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <UserCircle className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Dr. Arun Kumar, Pharm.D</h2>
                  <BadgeCheck className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Chief Pharmacist & Owner</p>
                <p className="text-sm text-muted-foreground">Wellness Pharmacy</p>
                <div className="mt-2">
                  <Badge variant="outline" className="border-success/30 text-success">
                    <BadgeCheck className="mr-1 h-3 w-3" />
                    Licensed Pharmacist
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Personal Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div><p className="font-medium">Email</p><p className="text-muted-foreground">arun.kumar@wellnesspharmacy.in</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div><p className="font-medium">Phone</p><p className="text-muted-foreground">+91 98765 43210</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div><p className="font-medium">Date of Birth</p><p className="text-muted-foreground">15 March 1985</p></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="h-4 w-4 text-primary" />
              Education & Qualifications
            </h3>
            <div className="space-y-4">
              {[
                { degree: 'Doctor of Pharmacy (Pharm.D)', institution: 'JSS College of Pharmacy, Mysuru', year: '2010' },
                { degree: 'Bachelor of Pharmacy (B.Pharm)', institution: 'Al-Ameen College of Pharmacy, Bengaluru', year: '2006' },
                { degree: 'Diploma in Clinical Pharmacy', institution: 'Manipal College of Pharmaceutical Sciences', year: '2011' },
              ].map(edu => (
                <div key={edu.degree} className="border-l-2 border-primary/30 pl-4">
                  <p className="text-sm font-medium">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">Graduated: {edu.year}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Award className="h-4 w-4 text-primary" />
              Professional Licenses
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Karnataka State Pharmacy Council Registration', value: 'KPC-78901', status: 'Active', expiry: 'Valid until 2028' },
                { label: 'Drug Controller License', value: 'KA-DC-2010-45678', status: 'Active', expiry: 'Valid until 2027' },
                { label: 'Continuing Education Certificate', value: 'CE-2026-1234', status: 'Active', expiry: 'Renewed 2026' },
              ].map(lic => (
                <div key={lic.value} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{lic.label}</p>
                    <p className="text-xs text-muted-foreground">{lic.value} • {lic.expiry}</p>
                  </div>
                  <Badge variant="outline" className="border-success/30 text-success">{lic.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Career Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">16 years</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prescriptions Verified</span>
                <span className="font-medium">8,500+</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Orders Processed</span>
                <span className="font-medium">15,420</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">ADR Reports Filed</span>
                <span className="font-medium">42</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {['Clinical Pharmacy', 'Diabetes Management', 'Critical Care', 'Drug Safety', 'Pharmacovigilance'].map(spec => (
                <Badge key={spec} variant="secondary">{spec}</Badge>
              ))}
            </div>
          </Card>

          <Button className="w-full" variant="outline">Edit Profile</Button>
        </div>
      </div>
    </PageContainer>
  );
}
