import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { Pharmacy } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  variant?: 'default' | 'compact';
}

export function PharmacyCard({ pharmacy, variant = 'default' }: PharmacyCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/customer/pharmacies/${pharmacy.id}`}
        className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md"
      >
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white', pharmacy.imageColor)}>
          {pharmacy.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold">{pharmacy.name}</h3>
            {pharmacy.verified && <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {pharmacy.rating}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {pharmacy.distance} km
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className={cn('text-xs font-medium', pharmacy.open ? 'text-success' : 'text-destructive')}>
            {pharmacy.open ? 'Open' : 'Closed'}
          </p>
          <p className="flex items-center justify-end gap-0.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {pharmacy.eta}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/customer/pharmacies/${pharmacy.id}`}
      className="group block rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white', pharmacy.imageColor)}>
          {pharmacy.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{pharmacy.name}</h3>
            {pharmacy.verified && (
              <span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{pharmacy.rating}</span>
              <span>({pharmacy.reviewCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {pharmacy.distance} km away
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={cn(
          'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
          pharmacy.open ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        )}>
          <CheckCircle2 className="h-3 w-3" />
          {pharmacy.open ? pharmacy.openHours : 'Currently closed'}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          <Clock className="h-3 w-3" />
          {pharmacy.eta} delivery
        </span>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          Trust score: {pharmacy.trustScore}%
        </span>
      </div>

      {pharmacy.specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pharmacy.specialties.map((spec) => (
            <span key={spec} className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
              {spec}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
