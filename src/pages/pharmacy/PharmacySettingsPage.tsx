import { useState } from 'react';
import { Bell, Package, FileCheck, AlertTriangle, Truck, Star, Settings, Shield, Moon, Globe, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';

export function PharmacySettingsPage() {
  const [newOrders, setNewOrders] = useState(true);
  const [prescriptions, setPrescriptions] = useState(true);
  const [lowStock, setLowStock] = useState(true);
  const [expiry, setExpiry] = useState(true);
  const [delivery, setDelivery] = useState(true);
  const [reviews, setReviews] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  const notificationSettings = [
    { label: 'New Orders', desc: 'Get notified when a new order arrives', icon: Package, value: newOrders, setter: setNewOrders },
    { label: 'Prescription Reviews', desc: 'Alerts for pending prescription verifications', icon: FileCheck, value: prescriptions, setter: setPrescriptions },
    { label: 'Low Stock Alerts', desc: 'Notifications when items fall below threshold', icon: AlertTriangle, value: lowStock, setter: setLowStock },
    { label: 'Expiry Warnings', desc: 'Alerts for medicines nearing expiry', icon: AlertTriangle, value: expiry, setter: setExpiry },
    { label: 'Delivery Updates', desc: 'Rider assignment and delivery status changes', icon: Truck, value: delivery, setter: setDelivery },
    { label: 'Customer Reviews', desc: 'Notifications when customers leave reviews', icon: Star, value: reviews, setter: setReviews },
  ];

  return (
    <PageContainer title="Settings" description="Manage your pharmacy preferences">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Bell className="h-4 w-4 text-primary" />
              Notification Preferences
            </h3>
            <div className="space-y-1">
              {notificationSettings.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg p-3 hover:bg-accent">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch checked={item.value} onCheckedChange={item.setter} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Settings className="h-4 w-4 text-primary" />
              Order Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg p-3 hover:bg-accent">
                <div>
                  <p className="text-sm font-medium">Auto-accept orders</p>
                  <p className="text-xs text-muted-foreground">Automatically accept new orders without manual review</p>
                </div>
                <Switch checked={autoAccept} onCheckedChange={setAutoAccept} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="maxDistance">Maximum delivery distance (km)</Label>
                <Input id="maxDistance" type="number" defaultValue="10" min="1" max="50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prepTime">Default preparation time (minutes)</Label>
                <Input id="prepTime" type="number" defaultValue="15" min="5" max="60" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Shield className="h-4 w-4 text-primary" />
              Security
            </h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between rounded-lg p-3 hover:bg-accent">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Require OTP for sensitive actions</p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>
              <Separator />
              <Button variant="outline" className="w-full justify-start">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Moon className="h-4 w-4 text-primary" />
              Appearance
            </h3>
            <div className="flex items-center justify-between rounded-lg p-3 hover:bg-accent">
              <p className="text-sm font-medium">Dark Mode</p>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Globe className="h-4 w-4 text-primary" />
              Language & Region
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">English (India)</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Currency</Label>
                <p className="text-sm text-muted-foreground">Indian Rupee (₹)</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Timezone</Label>
                <p className="text-sm text-muted-foreground">IST (GMT+5:30)</p>
              </div>
            </div>
          </Card>

          <Button className="w-full">Save Changes</Button>
        </div>
      </div>
    </PageContainer>
  );
}
