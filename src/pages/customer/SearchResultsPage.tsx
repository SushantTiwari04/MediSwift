import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, FileWarning, Star, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { medicines, pharmacies, formatPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(query);

  const results = medicines.filter(m => {
    if (!query || query === 'all') return true;
    return m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.brand.toLowerCase().includes(query.toLowerCase()) ||
      m.genericName.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <PageContainer title="Search Results" description={query && query !== 'all' ? `Results for "${query}"` : 'All medicines'}>
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customer/search')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            className="h-11 pl-11"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(`/customer/search/results?q=${encodeURIComponent(localQuery)}`);
            }}
          />
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {results.length} result{results.length !== 1 ? 's' : ''} found
      </p>

      <div className="space-y-3">
        {results.map(medicine => {
          const pharmacy = pharmacies.find(p => p.open);
          return (
            <Link key={medicine.id} to={`/customer/medicines/${medicine.id}`}>
              <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-md">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <medicine.imageIcon className={cn('h-8 w-8', medicine.imageColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold">{medicine.name}</h3>
                    {medicine.prescriptionRequired && (
                      <Badge variant="outline" className="shrink-0 border-amber-500/30 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                        <FileWarning className="mr-1 h-3 w-3" />
                        Rx
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {medicine.brand} • {medicine.strength} • {medicine.form}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {medicine.rating} ({medicine.reviews})
                    </span>
                    {pharmacy && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {pharmacy.name} • {pharmacy.distance} km
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-primary">{formatPrice(medicine.price)}</span>
                    <div className="flex items-center gap-2">
                      {pharmacy && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {pharmacy.eta}
                        </span>
                      )}
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        medicine.inStock ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                      )}>
                        {medicine.inStock ? 'In stock' : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm font-medium">No medicines found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different search term</p>
        </div>
      )}
    </PageContainer>
  );
}
