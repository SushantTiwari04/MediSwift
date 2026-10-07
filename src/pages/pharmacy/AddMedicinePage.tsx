import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '@/lib/auth';
import { createMedicine, type DosageForm } from '@/lib/medicines';

const DOSAGE_FORMS: DosageForm[] = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 'Inhaler', 'Cream', 'Spray'];
const CATEGORIES = ['Pain Relief', 'Antibiotic', 'Diabetes', 'Allergy', 'Gastrointestinal', 'Cough & Cold', 'Supplements', 'First Aid', 'Cardiac', 'Eye Care', 'Respiratory', 'Hygiene'];
const STORAGE_OPTIONS = ['Room Temperature', 'Refrigerated (2-8°C)', 'Frozen (-20°C)', 'Cool & Dry'];

interface FormErrors {
  name?: string;
  genericName?: string;
  brand?: string;
  strength?: string;
  dosageForm?: string;
  price?: string;
  stockQuantity?: string;
  expiryDate?: string;
  batchNumber?: string;
  packSize?: string;
}

export function AddMedicinePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const [lowStockThreshold, setLowStockThreshold] = useState('20');
  const [price, setPrice] = useState('');
  const [storageRequirement, setStorageRequirement] = useState('');
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Medicine name is required';
    if (!genericName.trim()) e.genericName = 'Generic name is required';
    if (!brand.trim()) e.brand = 'Brand is required';
    if (!strength.trim()) e.strength = 'Strength is required';
    if (!dosageForm) e.dosageForm = 'Dosage form is required';
    if (!price || parseFloat(price) <= 0) e.price = 'Price must be greater than 0';
    if (!stockQuantity || parseInt(stockQuantity) < 0) e.stockQuantity = 'Quantity must be 0 or more';
    if (!expiryDate) e.expiryDate = 'Expiry date is required';
    if (!batchNumber.trim()) e.batchNumber = 'Batch number is required';
    if (!packSize.trim()) e.packSize = 'Pack size is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    if (!user) {
      setError('You must be signed in to add medicines');
      return;
    }

    setLoading(true);
    const { error: createError } = await createMedicine({
      pharmacy_id: user.id,
      name: name.trim(),
      generic_name: genericName.trim(),
      brand: brand.trim(),
      strength: strength.trim(),
      dosage_form: dosageForm,
      category: category || 'Pain Relief',
      price: parseFloat(price),
      stock_quantity: parseInt(stockQuantity) || 0,
      expiry_date: expiryDate,
      prescription_required: prescriptionRequired,
      batch_number: batchNumber.trim(),
      pack_size: packSize.trim(),
      storage_requirement: storageRequirement || 'Room Temperature',
      low_stock_threshold: parseInt(lowStockThreshold) || 20,
      description: description.trim() || null,
      manufacturer: '',
    });
    setLoading(false);

    if (createError) {
      setError(createError);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/pharmacy/inventory'), 1200);
  };

  return (
    <PageContainer title="Add Medicine" description="Add a new medicine to your inventory">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to inventory
      </Button>

      {success && (
        <Card className="mb-4 flex items-center gap-3 border-success/30 bg-success/5 p-4">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <p className="text-sm font-medium text-success">Medicine added successfully! Redirecting...</p>
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
              <Input id="medicine" placeholder="e.g., Paracetamol" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input id="brand" placeholder="e.g., Crocin" value={brand} onChange={(e) => setBrand(e.target.value)} />
              {errors.brand && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.brand}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="activeIngredient">Generic Name *</Label>
              <Input id="activeIngredient" placeholder="e.g., Acetaminophen" value={genericName} onChange={(e) => setGenericName(e.target.value)} />
              {errors.genericName && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.genericName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="strength">Strength *</Label>
              <Input id="strength" placeholder="e.g., 500mg" value={strength} onChange={(e) => setStrength(e.target.value)} />
              {errors.strength && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.strength}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="form">Dosage Form *</Label>
              <Select value={dosageForm} onValueChange={setDosageForm}>
                <SelectTrigger id="form"><SelectValue placeholder="Select form" /></SelectTrigger>
                <SelectContent>
                  {DOSAGE_FORMS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.dosageForm && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.dosageForm}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="packSize">Pack Size *</Label>
              <Input id="packSize" placeholder="e.g., 15 tablets" value={packSize} onChange={(e) => setPackSize(e.target.value)} />
              {errors.packSize && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.packSize}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage">Storage Requirement</Label>
              <Select value={storageRequirement} onValueChange={setStorageRequirement}>
                <SelectTrigger id="storage"><SelectValue placeholder="Select storage" /></SelectTrigger>
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
              <Input id="batchNumber" placeholder="e.g., CRO2026A" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} />
              {errors.batchNumber && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.batchNumber}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              {errors.expiryDate && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.expiryDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Stock Quantity *</Label>
              <Input id="quantity" type="number" min="0" placeholder="e.g., 100" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />
              {errors.stockQuantity && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.stockQuantity}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input id="lowStockThreshold" type="number" min="0" placeholder="e.g., 20" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input id="price" type="number" min="0" step="0.01" placeholder="e.g., 35.00" value={price} onChange={(e) => setPrice(e.target.value)} />
              {errors.price && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.price}</p>}
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
            <Textarea id="description" placeholder="Medicine description, usage instructions, etc." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Add Medicine
              </>
            )}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate('/pharmacy/inventory')}>
            Cancel
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
