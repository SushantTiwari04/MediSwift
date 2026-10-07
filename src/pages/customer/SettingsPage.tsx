import { useState } from 'react';
import { Bell, Globe, Lock, Shield, Moon, Languages, Smartphone, Eye, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export function SettingsPage() {
  const [notif, setNotif] = useState({
    orderUpdates: true,
    prescriptionUpdates: true,
    deliveryAlerts: true,
    safetyAlerts: true,
    promotions: false,
  });
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <PageContainer title="Settings" description="Manage your app preferences">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Notifications */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Bell className="h-4 w-4 text-primary" />
            Notifications
          </h3>
          <div className="space-y-4">
            {[
              { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about your order status' },
              { key: 'prescriptionUpdates', label: 'Prescription Updates', desc: 'Updates on prescription verification' },
              { key: 'deliveryAlerts', label: 'Delivery Alerts', desc: 'Real-time delivery tracking alerts' },
              { key: 'safetyAlerts', label: 'Safety Alerts', desc: 'Drug interaction and safety warnings' },
              { key: 'promotions', label: 'Promotions & Offers', desc: 'Discounts and special offers' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">{item.label}</Label>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notif[item.key as keyof typeof notif]}
                  onCheckedChange={(v) => setNotif({ ...notif, [item.key]: v })}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Language */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Languages className="h-4 w-4 text-primary" />
            Language & Region
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">App Language</Label>
                <p className="text-xs text-muted-foreground">Choose your preferred language</p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Lock className="h-4 w-4 text-primary" />
            Privacy
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Use dark theme throughout the app</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Biometric Login</Label>
                <p className="text-xs text-muted-foreground">Use fingerprint or face unlock</p>
              </div>
              <Switch checked={biometric} onCheckedChange={setBiometric} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Extra security with OTP on login</p>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Shield className="h-4 w-4 text-primary" />
            Security
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Smartphone className="mr-2 h-4 w-4" />
              Manage Devices
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Eye className="mr-2 h-4 w-4" />
              View Login History
            </Button>
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/30 p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
            <Trash2 className="h-4 w-4" />
            Danger Zone
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Deleting your account will permanently remove all your data, orders, and prescriptions.
          </p>
          <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
            Delete Account
          </Button>
        </Card>
      </div>
    </PageContainer>
  );
}
