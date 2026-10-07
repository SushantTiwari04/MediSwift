import { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { PharmacyCard } from '@/components/customer/PharmacyCard';
import { pharmacies } from '@/data/mockData';
import { cn } from '@/lib/utils';

const sortOptions = [
  { value: 'distance', label: 'Nearest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'trust', label: 'Trust Score' },
  { value: 'eta', label: 'Fastest Delivery' },
];

export function PharmacyListPage() {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  let filtered = pharmacies.filter(p => {
    const matchesQuery = !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.address.toLowerCase().includes(query.toLowerCase()) ||
      p.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()));
    const matchesOpen = !showOpenOnly || p.open;
    const matchesVerified = !showVerifiedOnly || p.verified;
    return matchesQuery && matchesOpen && matchesVerified;
  });

  if (sortBy === 'distance') filtered = [...filtered].sort((a, b) => a.distance - b.distance);
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sortBy === 'trust') filtered = [...filtered].sort((a, b) => b.trustScore - a.trustScore);
  if (sortBy === 'eta') {
    const etaToNum = (eta: string) => parseInt(eta) || 999;
    filtered = [...filtered].sort((a, b) => etaToNum(a.eta) - etaToNum(b.eta));
  }

  return (
    <PageContainer
      title="Nearby Pharmacies"
      description={`${filtered.length} pharmacy${filtered.length !== 1 ? 'ies' : ''} found near you`}
      action={
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      }
    >
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by pharmacy name, area, or specialty..."
          className="h-12 pl-11 pr-10 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mb-4 rounded-lg border bg-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border bg-background px-3 py-1.5 text-sm"
              >
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showOpenOnly} onChange={(e) => setShowOpenOnly(e.target.checked)} />
              Open now
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showVerifiedOnly} onChange={(e) => setShowVerifiedOnly(e.target.checked)} />
              Verified only
            </label>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(pharmacy => (
          <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <MapPin className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">No pharmacies found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or search term</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => { setQuery(''); setShowOpenOnly(false); setShowVerifiedOnly(false); }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
