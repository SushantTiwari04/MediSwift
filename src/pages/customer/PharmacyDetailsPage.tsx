import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Clock, ShieldCheck, Phone,
  CheckCircle2, XCircle, Navigation, Package,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicineCard } from '@/components/customer/MedicineCard';
import { getPharmacyById, medicines, formatPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';

const mockReviews = [
  { id: 1, name: 'Ananya R.', rating: 5, date: '2 days ago', text: 'Quick delivery and genuine medicines. The pharmacist was very helpful in explaining dosage.' },
  { id: 2, name: 'Karthik S.', rating: 4, date: '1 week ago', text: 'Good service overall. Sometimes delivery takes longer during peak hours.' },
  { id: 3, name: 'Priya M.', rating: 5, date: '2 weeks ago', text: 'Best pharmacy in the area. 24/7 service is a lifesaver for emergency medicines.' },
  { id: 4, name: 'Rahul V.', rating: 4, date: '3 weeks ago', text: 'Reliable and trustworthy. They always verify prescriptions properly.' },
];

export function PharmacyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pharmacy = getPharmacyById(id || '');

  if (!pharmacy) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium">Pharmacy not found</p>
        <Button variant="link" onClick={() => navigate('/customer/pharmacies')}>Back to pharmacies</Button>
      </div>
    );
  }

  const availableMedicines = medicines.filter(m => m.inStock).slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Header card */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn('flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white', pharmacy.imageColor)}>
            {pharmacy.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{pharmacy.name}</h1>
              {pharmacy.verified && (
                <Badge className="bg-primary/10 text-primary" variant="outline">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">{pharmacy.rating}</span>
                <span>({pharmacy.reviewCount} reviews)</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {pharmacy.distance} km away
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{pharmacy.address}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={cn(
            'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
            pharmacy.open ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            {pharmacy.open ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {pharmacy.open ? pharmacy.openHours : 'Currently closed'}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            <Clock className="h-3 w-3" />
            {pharmacy.eta} delivery
          </span>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Trust score: {pharmacy.trustScore}%
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {pharmacy.yearsActive} years active
          </span>
        </div>

        {pharmacy.specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pharmacy.specialties.map(spec => (
              <span key={spec} className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">{spec}</span>
            ))}
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex gap-3">
          <Button className="flex-1" asChild>
            <Link to="/customer/search">
              <Package className="mr-2 h-4 w-4" />
              Browse Medicines
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href={`tel:${pharmacy.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
          <Button variant="outline">
            <Navigation className="mr-2 h-4 w-4" />
            Directions
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="medicines" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medicines">Available Medicines</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({mockReviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="medicines" className="mt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {availableMedicines.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} pharmacyName={pharmacy.name} distance={pharmacy.distance} eta={pharmacy.eta} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <div className="space-y-3">
            {mockReviews.map(review => (
              <Card key={review.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.name}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn('h-3 w-3', i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted')} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{review.text}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
