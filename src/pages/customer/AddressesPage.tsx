import { useState } from 'react';
import { Plus, MapPin, Home, Briefcase, MapPinHouse, Star, Trash2, Edit3, Check, X } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { addresses as initialAddresses, type Address } from '@/data/mockData';
import { cn } from '@/lib/utils';

const typeIcons: Record<Address['type'], typeof Home> = {
  HOME: Home,
  WORK: Briefcase,
  OTHER: MapPinHouse,
};

export function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Address, 'id' | 'isDefault'>>({
    label: '', line1: '', line2: '', city: 'Bengaluru', state: 'Karnataka', pincode: '', type: 'HOME',
  });

  const resetForm = () => {
    setForm({ label: '', line1: '', line2: '', city: 'Bengaluru', state: 'Karnataka', pincode: '', type: 'HOME' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.line1 || !form.pincode) return;
    if (editingId) {
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
    } else {
      setAddresses(prev => [...prev, { ...form, id: `addr-${Date.now()}`, isDefault: false }]);
    }
    resetForm();
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({ label: addr.label, line1: addr.line1, line2: addr.line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode, type: addr.type });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const setDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <PageContainer
      title="Saved Addresses"
      description="Manage your delivery addresses"
      action={
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      }
    >
      {showForm && (
        <Card className="mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
            <button onClick={resetForm} className="rounded-md p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input placeholder="e.g., Home, Work" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Address['type'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOME">Home</SelectItem>
                  <SelectItem value="WORK">Work</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address Line 1</Label>
              <Input placeholder="Flat/House no, Building, Street" value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address Line 2 (optional)</Label>
              <Input placeholder="Area, Landmark" value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })} />
            </div>
            <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            <div className="space-y-2"><Label>State</Label><Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} /></div>
            <div className="space-y-2"><Label>PIN Code</Label><Input placeholder="560001" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Save'} Address</Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {addresses.map(addr => {
          const Icon = typeIcons[addr.type];
          return (
            <Card key={addr.id} className={cn('p-4', addr.isDefault && 'border-primary/30 bg-primary/5')}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{addr.label || addr.type}</p>
                    {addr.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <Star className="h-3 w-3 fill-primary" />
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{addr.line1}</p>
                  {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
                  <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <div className="mt-3 flex gap-2">
                    {!addr.isDefault && (
                      <Button size="sm" variant="outline" onClick={() => setDefault(addr.id)}>
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Set Default
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(addr)}>
                      <Edit3 className="mr-1 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(addr.id)}>
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="flex flex-col items-center py-16">
          <MapPin className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No saved addresses</p>
          <p className="mt-1 text-xs text-muted-foreground">Add an address to start ordering</p>
          <Button className="mt-4" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Address
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
