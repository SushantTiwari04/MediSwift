import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { MedicineCard } from '@/components/customer/MedicineCard';
import { medicines } from '@/data/mockData';

const categories = [
  'All', 'Pain Relief', 'Antibiotic', 'Diabetes', 'Allergy',
  'Gastrointestinal', 'Cough & Cold', 'Supplements', 'First Aid',
  'Cardiac', 'Eye Care', 'Respiratory', 'Hygiene',
];

const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Fastest Delivery'];

export function MedicineSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [rxOnly, setRxOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  let filtered = medicines.filter(m => {
    const matchesQuery = query === '' ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.brand.toLowerCase().includes(query.toLowerCase()) ||
      m.genericName.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesRx = !rxOnly || m.prescriptionRequired;
    const matchesStock = !inStockOnly || m.inStock;
    return matchesQuery && matchesCategory && matchesRx && matchesStock;
  });

  if (sortBy === 'Price: Low to High') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'Price: High to Low') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'Rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <PageContainer
      title="Search Medicines"
      description="Find medicines from verified pharmacies near you"
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
          placeholder="Search by medicine name, brand, or generic..."
          className="h-12 pl-11 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate(`/customer/search/results?q=${encodeURIComponent(query)}`);
          }}
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

      {/* Category pills */}
      <div className="scrollbar-thin mb-4 flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter panel */}
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
                {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={rxOnly} onChange={(e) => setRxOnly(e.target.checked)} />
              Prescription required only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
              In stock only
            </label>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} medicine{filtered.length !== 1 ? 's' : ''} found
        </p>
        <Button
          variant="link"
          size="sm"
          onClick={() => navigate(`/customer/search/results?q=${encodeURIComponent(query || 'all')}`)}
        >
          View all results →
        </Button>
      </div>

      {/* Medicine grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map(medicine => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm font-medium">No medicines found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different search term or category</p>
        </div>
      )}
    </PageContainer>
  );
}
