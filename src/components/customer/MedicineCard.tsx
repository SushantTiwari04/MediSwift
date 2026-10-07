import { Link } from 'react-router-dom';
import { Star, Plus, FileWarning, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { Medicine } from '@/data/mockData';
import { formatPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/cart';

interface MedicineCardProps {
  medicine: Medicine;
  pharmacyName?: string;
  distance?: number;
  eta?: string;
  variant?: 'default' | 'compact';
}

export function MedicineCard({ medicine, pharmacyName, distance, eta, variant = 'default' }: MedicineCardProps) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      medicineId: medicine.id,
      name: medicine.name,
      brand: medicine.brand,
      strength: medicine.strength,
      form: medicine.form,
      price: medicine.price,
      prescriptionRequired: medicine.prescriptionRequired,
    }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  if (variant === 'compact') {
    return (
      <Link
        to={`/customer/medicines/${medicine.id}`}
        className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
          <medicine.imageIcon className={cn('h-6 w-6', medicine.imageColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{medicine.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{medicine.brand} • {medicine.strength}</p>
          <p className="text-sm font-bold text-primary">{formatPrice(medicine.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/customer/medicines/${medicine.id}`}
      className="group flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
          <medicine.imageIcon className={cn('h-7 w-7', medicine.imageColor)} />
        </div>
        {medicine.prescriptionRequired && (
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <FileWarning className="h-3 w-3" />
            Rx
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold leading-tight">{medicine.name}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{medicine.brand} • {medicine.strength}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{medicine.form} • {medicine.category}</p>

      <div className="mt-2 flex items-center gap-1.5">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="text-xs font-medium">{medicine.rating}</span>
        <span className="text-xs text-muted-foreground">({medicine.reviews})</span>
      </div>

      {pharmacyName && (
        <p className="mt-2 truncate text-xs text-muted-foreground">{pharmacyName}</p>
      )}

      {(distance !== undefined || eta) && (
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {distance !== undefined && <span>{distance} km away</span>}
          {distance !== undefined && eta && <span>•</span>}
          {eta && <span>{eta} delivery</span>}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-base font-bold text-primary">{formatPrice(medicine.price)}</span>
        <span className={cn(
          'rounded-full px-2 py-0.5 text-xs font-medium',
          medicine.inStock ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        )}>
          {medicine.inStock ? 'In stock' : 'Out of stock'}
        </span>
      </div>

      {medicine.inStock && (
        <button
          onClick={handleAddToCart}
          className={cn(
            'mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            added
              ? 'bg-success/10 text-success'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          )}
        >
          {added ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Added!
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      )}
    </Link>
  );
}
