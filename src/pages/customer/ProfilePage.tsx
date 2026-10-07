import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Check, X, HeartPulse, Calendar, Shield } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    dob: '1990-05-15',
    city: 'Bengaluru',
    state: 'Karnataka',
  });

  const stats = [
    { label: 'Total Orders', value: '24', icon: '📦' },
    { label: 'Active Prescriptions', value: '2', icon: '📋' },
    { label: 'Member Since', value: 'Aug 2026', icon: '📅' },
  ];

  return (
    <PageContainer title="Profile" description="Manage your personal information">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Profile header */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {profile.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{profile.name}</h2>
                  <Badge variant="outline" className="border-success/30 text-success">
                    <Shield className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <p className="text-sm text-muted-foreground">{profile.phone}</p>
              </div>
              {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Edit3 className="mr-1 h-3.5 w-3.5" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setEditing(false)}>
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs text-muted-foreground"><User className="h-3 w-3" /> Full Name</Label>
                {editing ? (
                  <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                ) : (
                  <p className="text-sm font-medium">{profile.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> Email</Label>
                {editing ? (
                  <Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                ) : (
                  <p className="text-sm font-medium">{profile.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> Phone</Label>
                {editing ? (
                  <Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                ) : (
                  <p className="text-sm font-medium">{profile.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> Date of Birth</Label>
                {editing ? (
                  <Input type="date" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })} />
                ) : (
                  <p className="text-sm font-medium">{profile.dob}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> City</Label>
                {editing ? (
                  <Input value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} />
                ) : (
                  <p className="text-sm font-medium">{profile.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> State</Label>
                {editing ? (
                  <Input value={profile.state} onChange={e => setProfile({ ...profile, state: e.target.value })} />
                ) : (
                  <p className="text-sm font-medium">{profile.state}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Health info */}
          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <HeartPulse className="h-4 w-4 text-primary" />
              Health Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Known Allergies</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="border-destructive/30 text-destructive">Penicillin</Badge>
                  <Badge variant="outline" className="border-amber-500/30 text-amber-600">Peanuts</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Chronic Conditions</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="border-primary/30 text-primary">Type 2 Diabetes</Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary">Hypertension</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Account Stats</h3>
            <div className="space-y-3">
              {stats.map(stat => (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="text-xl">{stat.icon}</span>
                  <div>
                    <p className="text-sm font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/customer/orders">My Orders</a>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/customer/prescriptions">My Prescriptions</a>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/customer/addresses">Saved Addresses</a>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/customer/settings">Settings</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
