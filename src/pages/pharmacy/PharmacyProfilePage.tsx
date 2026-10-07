import { ShieldCheck, Star, MapPin, Clock, Phone, Mail, Globe, Building2, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';

export function PharmacyProfilePage() {
  return (
    <PageContainer title="Pharmacy Profile" description="Manage your pharmacy details">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                W
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Wellness Pharmacy</h2>
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Verified pharmacy partner since 2014</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-sm text-muted-foreground">(1,240 reviews)</span>
                  </div>
                  <Badge variant="outline" className="text-success border-success/30">Trust Score: 96%</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">12 MG Road, Bengaluru, KA 560001</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+91 80 2234 5678</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">contact@wellnesspharmacy.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-muted-foreground">www.wellnesspharmacy.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Operating Hours</p>
                  <p className="text-muted-foreground">Open 24 hours</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Licenses & Certifications</h3>
            <div className="space-y-3">
              {[
                { label: 'Drug License Number', value: 'KA-BL-2024-12345' },
                { label: 'GST Registration', value: '29ABCDE1234F1Z5' },
                { label: 'FSSAI License', value: '10024031000234' },
                { label: 'Pharmacy Council Registration', value: 'KPC-78901' },
              ].map(lic => (
                <div key={lic.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{lic.label}</p>
                    <p className="text-xs text-muted-foreground">{lic.value}</p>
                  </div>
                  <Badge variant="outline" className="border-success/30 text-success">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {['Prescription medicines', 'Cold chain storage', '24/7 service', 'Home delivery', 'Diabetes care', 'Geriatric care'].map(spec => (
                <Badge key={spec} variant="secondary">{spec}</Badge>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Years Active</span>
                <span className="font-medium">12 years</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Orders</span>
                <span className="font-medium">15,420</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-medium">₹4.2L</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Delivery Time</span>
                <span className="font-medium">18 min</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items in Stock</span>
                <span className="font-medium">1,520</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Award className="h-4 w-4 text-primary" />
              Achievements
            </h3>
            <div className="space-y-2">
              {[
                'Top Pharmacy 2025',
                'Fastest Delivery Award',
                '500+ 5-star reviews',
                'Cold Chain Excellence',
              ].map(ach => (
                <div key={ach} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {ach}
                </div>
              ))}
            </div>
          </Card>

          <Button className="w-full" variant="outline">Edit Profile</Button>
        </div>
      </div>
    </PageContainer>
  );
}
