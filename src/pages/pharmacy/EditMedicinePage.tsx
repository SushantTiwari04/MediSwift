import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PageContainer } from '@/components/layout/PageContainer';
import {
  fetchMedicineById,
  updateMedicine,
} from '@/lib/medicines';

const DOSAGE_FORMS = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 'Inhaler', 'Cream', 'Spray'];
const CATEGORIES = ['Pain Relief', 'Antibiotic', 'Diabetes', 'Allergy', 'Gastrointestinal', 'Cough & Cold', 'Supplements', 'First Aid', 'Cardiac', 'Eye Care', 'Respiratory', 'Hygiene'];
const STORAGE_OPTIONS = ['Room Temperature', 'Refrigerated (2-8°C)', 'Frozen (-20°C)', 'Cool & Dry'];

export function EditMedicinePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brand, setBrand] = useState('');
  const [strength, setStrength] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [category, setCategory] = useState('');
  const [packSize, setPackSize] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [price, setPrice] = useState('');
  const [storageRequirement, setStorageRequirement] = useState('');
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchMedicineById(id).then(({ data, error: fetchError }) => {
      setLoading(false);
      if (fetchError) {
        setError(fetchError);
        return;
      }
      if (!data) {
        setNotFound(true);
        return;
      }
      setName(data.name);
      setGenericName(data.generic_name);
      setBrand(data.brand);
      setStrength(data.strength);
      setDosageForm(data.dosage_form);
      setCategory(data.category);
      setPackSize(data.pack_size);
      setBatchNumber(data.batch_number);
      setExpiryDate(data.expiry_date);
      setStockQuantity(String(data.stock_quantity));
      setLowStockThreshold(String(data.low_stock_threshold));
      setPrice(String(data.price));
      setStorageRequirement(data.storage_requirement);
      setPrescriptionRequired(data.prescription_required);
      setDescription(data.description || '');
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSaving(true);

    const { error: updateError } = await updateMedicine(id, {
      name: name.trim(),
      generic_name: genericName.trim(),
      brand: brand.trim(),
      strength: strength.trim(),
      dosage_form: dosageForm,
      category: category || 'Pain Relief',
      pack_size: packSize.trim(),
      batch_number: batchNumber.trim(),
      expiry_date: expiryDate,
      stock_quantity: parseInt(stockQuantity) || 0,
      low_stock_threshold: parseInt(lowStockThreshold) || 20,
      price: parseFloat(price) || 0,
      storage_requirement: storageRequirement || 'Room Temperature',
      prescription_required: prescriptionRequired,
      description: description.trim() || null,
    });

    setSaving(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/pharmacy/inventory'), 1200);
  };

  if (loading) {
    return (
      <PageContainer title="Edit Medicine" description="Loading...">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  if (notFound) {
    return (
      <PageContainer title="Edit Medicine" description="Medicine not found">
        <div className="py-16 text-center">
          <p className="text-sm font-medium">Medicine not found</p>
          <Button variant="link" onClick={() => navigate('/pharmacy/inventory')}>Back to inventory</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Medicine" description={`${name} - ${brand}`}>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to inventory
      </Button>

      {success && (
        <Card className="mb-4 flex items-center gap-3 border-success/30 bg-success/5 p-4">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <p className="text-sm font-medium text-success">Medicine updated successfully! Redirecting...</p>
        </Card>
      )}

      {error && (
        <Card className="mb-4 flex items-center gap-3 border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </Card>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Medicine Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="medicine">Medicine Name *</Label>
              <Input id="medicine" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activeIngredient">Generic Name *</Label>
              <Input id="activeIngredient" value={genericName} onChange={(e) => setGenericName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strength">Strength *</Label>
              <Input id="strength" value={strength} onChange={(e) => setStrength(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form">Dosage Form *</Label>
              <Select value={dosageForm} onValueChange={setDosageForm}>
                <SelectTrigger id="form"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DOSAGE_FORMS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="packSize">Pack Size *</Label>
              <Input id="packSize" value={packSize} onChange={(e) => setPackSize(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage">Storage Requirement</Label>
              <Select value={storageRequirement} onValueChange={setStorageRequirement}>
                <SelectTrigger id="storage"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STORAGE_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Batch & Stock</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="batchNumber">Batch Number *</Label>
              <Input id="batchNumber" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Stock Quantity *</Label>
              <Input id="quantity" type="number" min="0" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input id="lowStockThreshold" type="number" min="0" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rxRequired">Prescription Required</Label>
              <div className="flex h-10 items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={prescriptionRequired}
                    onChange={(e) => setPrescriptionRequired(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  {prescriptionRequired ? 'Yes, prescription needed' : 'No, OTC medicine'}
                </label>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Additional Information</h3>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" size="lg" onClick={() => navigate('/pharmacy/inventory')}>
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
