import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, FileWarning, Plus, Minus, ShieldCheck,
  AlertTriangle, Info, Clock, MapPin, Pill, ThermometerSun,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import { getMedicineById, pharmacies, formatPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart';
import { CheckCircle2 } from 'lucide-react';

export function MedicineDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const medicine = getMedicineById(id || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!medicine) return;
    addToCart({
      medicineId: medicine.id,
      name: medicine.name,
      brand: medicine.brand,
      strength: medicine.strength,
      form: medicine.form,
      price: medicine.price,
      prescriptionRequired: medicine.prescriptionRequired,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!medicine) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium">Medicine not found</p>
        <Button variant="link" onClick={() => navigate('/customer/search')}>Back to search</Button>
      </div>
    );
  }

  const availablePharmacies = pharmacies.filter(p => p.open).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Medicine info */}
        <div>
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-muted">
                <medicine.imageIcon className={cn('h-10 w-10', medicine.imageColor)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{medicine.name}</h1>
                  {medicine.prescriptionRequired && (
                    <Badge variant="outline" className="border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                      <FileWarning className="mr-1 h-3 w-3" />
                      Rx Required
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{medicine.brand} • {medicine.genericName}</p>
                <p className="text-sm text-muted-foreground">{medicine.strength} • {medicine.form}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{medicine.rating}</span>
                  <span className="text-sm text-muted-foreground">({medicine.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{formatPrice(medicine.price)}</p>
                <p className="text-xs text-muted-foreground">per unit</p>
              </div>
              <Badge className={medicine.inStock ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'} variant="outline">
                {medicine.inStock ? 'In stock' : 'Out of stock'}
              </Badge>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg border px-3 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-3 text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button className="flex-1" disabled={!medicine.inStock} onClick={handleAddToCart}>
                {added ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Added!
                  </>
                ) : (
                  medicine.prescriptionRequired ? 'Add to Cart (Rx)' : 'Add to Cart'
                )}
              </Button>
            </div>
          </Card>

          {/* Available at pharmacies */}
          <div className="mt-4">
            <h3 className="mb-3 text-sm font-semibold">Available at these pharmacies</h3>
            <div className="space-y-2">
              {availablePharmacies.map(pharmacy => (
                <Link key={pharmacy.id} to={`/customer/pharmacies/${pharmacy.id}`}>
                  <Card className="flex items-center gap-3 p-3 transition-shadow hover:shadow-md">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white', pharmacy.imageColor)}>
                      {pharmacy.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-medium">{pharmacy.name}</p>
                        {pharmacy.verified && <ShieldCheck className="h-3.5 w-3.5 text-primary" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {pharmacy.distance} km
                        <Clock className="ml-1 h-3 w-3" />
                        {pharmacy.eta}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">{formatPrice(medicine.price)}</span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Details tabs */}
        <div>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="dosage" className="text-xs">Dosage</TabsTrigger>
              <TabsTrigger value="warnings" className="text-xs">Warnings</TabsTrigger>
              <TabsTrigger value="storage" className="text-xs">Storage</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="p-5">
                <h3 className="mb-2 text-sm font-semibold">About this medicine</h3>
                <p className="text-sm text-muted-foreground">{medicine.description}</p>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Manufacturer</p>
                    <p className="font-medium">{medicine.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium">{medicine.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Generic Name</p>
                    <p className="font-medium">{medicine.genericName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Form</p>
                    <p className="font-medium">{medicine.form}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="dosage">
              <Card className="p-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Pill className="h-4 w-4 text-primary" />
                  Dosage Instructions
                </h3>
                <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
              </Card>
            </TabsContent>

            <TabsContent value="warnings">
              <Card className="p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Side Effects & Warnings
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-muted-foreground">Common Side Effects</p>
                    <ul className="space-y-1">
                      {medicine.sideEffects.map(effect => (
                        <li key={effect} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-muted-foreground">Warnings</p>
                    <ul className="space-y-1">
                      {medicine.warnings.map(warning => (
                        <li key={warning} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="storage">
              <Card className="p-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <ThermometerSun className="h-4 w-4 text-primary" />
                  Storage Instructions
                </h3>
                <p className="text-sm text-muted-foreground">{medicine.storage}</p>
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary/5 p-3">
                  <Info className="h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    Always keep medicines out of reach of children. Check expiry date before use.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
