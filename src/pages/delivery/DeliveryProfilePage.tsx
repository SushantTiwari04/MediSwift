import { useState } from 'react';
import {
  User, Bike, FileText, Star, TrendingUp, Package, Clock, MapPin,
  Phone, Mail, Calendar, Shield, CheckCircle2, AlertCircle, XCircle, Edit3, Camera,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';
import { deliveryHistory, formatPrice } from '@/data/deliveryMockData';
import { cn } from '@/lib/utils';

export function DeliveryProfilePage() {
  const [editing, setEditing] = useState(false);

  const stats = [
    { label: 'Total Deliveries', value: '342', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Rating', value: '4.8', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { label: 'Completion Rate', value: '98%', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Avg Delivery Time', value: '26 min', icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  const documents = [
    { name: 'Driving License', status: 'verified', number: 'DL-0420190001234', expiry: '2028-06-15' },
    { name: 'Vehicle Registration', status: 'verified', number: 'KA-05-MN-4321', expiry: '2027-03-22' },
    { name: 'Insurance', status: 'verified', number: 'INS-2026-8849', expiry: '2027-01-10' },
    { name: 'Aadhaar Card', status: 'verified', number: 'XXXX-XXXX-4523', expiry: 'N/A' },
    { name: 'PAN Card', status: 'pending', number: 'Not submitted', expiry: 'N/A' },
  ];

  const docStatusConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
    verified: { label: 'Verified', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    pending: { label: 'Pending', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    rejected: { label: 'Rejected', icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  };

  return (
    <PageContainer title="Profile" description="Manage your personal and vehicle information">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Personal details */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <User className="h-4 w-4 text-primary" />
                Personal Details
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
                <Edit3 className="mr-1 h-3.5 w-3.5" />
                {editing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            {/* Avatar */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  RK
                </div>
                {editing && (
                  <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div>
                <p className="text-lg font-bold">Rahul Kumar</p>
                <p className="text-sm text-muted-foreground">Delivery Partner • ID: DP-1024</p>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-xs text-muted-foreground">(234 ratings)</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue="Rahul Kumar" disabled={!editing} />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input defaultValue="+91 98765 43210" disabled={!editing} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input defaultValue="rahul.kumar@mediswift.in" disabled={!editing} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                  <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input defaultValue="1995-03-15" disabled={!editing} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input defaultValue="Flat 12, Sai Residency, Jayanagar 4th Block, Bengaluru 560011" disabled={!editing} className="pl-9" />
                </div>
              </div>
            </div>

            {editing && (
              <div className="mt-4 flex gap-2">
                <Button className="flex-1" onClick={() => setEditing(false)}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            )}
          </Card>

          {/* Vehicle details */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Bike className="h-4 w-4 text-primary" />
              Vehicle Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Input defaultValue="Motorcycle" disabled />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input defaultValue="Honda Activa 6G" disabled={!editing} />
              </div>
              <div className="space-y-2">
                <Label>Registration Number</Label>
                <Input defaultValue="KA-05-MN-4321" disabled={!editing} />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input defaultValue="2023" disabled={!editing} />
              </div>
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <Input defaultValue="Petrol" disabled={!editing} />
              </div>
              <div className="space-y-2">
                <Label>Insurance Provider</Label>
                <Input defaultValue="Bajaj Allianz" disabled={!editing} />
              </div>
            </div>
          </Card>

          {/* Document status */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-primary" />
              Document Status
            </h3>
            <div className="space-y-3">
              {documents.map(doc => {
                const config = docStatusConfig[doc.status];
                return (
                  <div key={doc.name} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', config.bg)}>
                        <config.icon className={cn('h-4 w-4', config.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.number} • Expires: {doc.expiry}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn(config.color, 'border-current/20')}>
                      {config.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Performance stats */}
          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" />
              Performance Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.map(stat => (
                <div key={stat.label} className="rounded-lg border p-3">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', stat.bg)}>
                    <stat.icon className={cn('h-4 w-4', stat.color)} />
                  </div>
                  <p className="mt-2 text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Verification status */}
          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Shield className="h-4 w-4 text-primary" />
              Account Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">KYC Verification</span>
                <Badge variant="outline" className="text-success border-success/20">Verified</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Background Check</span>
                <Badge variant="outline" className="text-success border-success/20">Cleared</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Training Status</span>
                <Badge variant="outline" className="text-success border-success/20">Completed</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Status</span>
                <Badge variant="outline" className="text-success border-success/20">Active</Badge>
              </div>
            </div>
          </Card>

          {/* Recent performance */}
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Recent Deliveries</h3>
            <div className="space-y-2">
              {deliveryHistory.slice(0, 4).map(d => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{d.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{d.customerArea}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{formatPrice(d.payout)}</p>
                    {d.rating && (
                      <p className="flex items-center justify-end gap-0.5 text-xs text-amber-500">
                        <Star className="h-3 w-3 fill-amber-400" />{d.rating}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
