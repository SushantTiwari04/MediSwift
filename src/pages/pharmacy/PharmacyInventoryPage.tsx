import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, AlertTriangle, Boxes, Loader2, AlertCircle, Pill } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import {
  fetchPharmacyMedicines,
  daysUntilExpiry,
  type MedicineRecord,
} from '@/lib/medicines';
import { formatPrice } from '@/data/pharmacyMockData';

export function PharmacyInventoryPage() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<MedicineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const loadMedicines = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchPharmacyMedicines(user.id);
    setLoading(false);
    if (fetchError) {
      setError(fetchError);
      return;
    }
    setMedicines(data || []);
  }, [user]);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  const categories = ['All', ...Array.from(new Set(medicines.map(m => m.category).filter(Boolean)))];

  const filtered = medicines.filter(m => {
    const matchesQuery = query === '' ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.brand.toLowerCase().includes(query.toLowerCase()) ||
      m.generic_name.toLowerCase().includes(query.toLowerCase()) ||
      m.batch_number.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || m.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <PageContainer
      title="Inventory"
      description="Manage your medicine stock and pricing"
      action={
        <Button size="sm" asChild>
          <Link to="/pharmacy/inventory/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Medicine
          </Link>
        </Button>
      }
    >
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by medicine, brand, ingredient, or batch..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="scrollbar-thin mb-4 flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              category === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && error && (
        <Card className="flex items-center gap-3 border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">{error}</p>
        </Card>
      )}

      {!loading && !error && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{filtered.length} item(s)</p>

          <div className="space-y-2">
            {filtered.map(item => {
              const days = daysUntilExpiry(item.expiry_date);
              const isLowStock = item.stock_quantity <= item.low_stock_threshold;
              const isExpiringSoon = days <= 60;
              return (
                <Card key={item.id} className="p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Pill className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                        {isLowStock && (
                          <Badge variant="outline" className="shrink-0 border-red-500/30 text-red-500">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Low Stock
                          </Badge>
                        )}
                        {isExpiringSoon && (
                          <Badge variant="outline" className="shrink-0 border-orange-500/30 text-orange-500">
                            Expiring
                          </Badge>
                        )}
                        {item.prescription_required && (
                          <Badge variant="outline" className="shrink-0 border-amber-500/30 text-amber-600">
                            Rx
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.brand} • {item.generic_name} • {item.strength} • {item.dosage_form}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>Batch: {item.batch_number}</span>
                        <span>Pack: {item.pack_size}</span>
                        <span>Expires: {new Date(item.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>Storage: {item.storage_requirement}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{formatPrice(Number(item.price))}</p>
                      <p className={cn('text-xs font-medium', isLowStock ? 'text-red-500' : 'text-muted-foreground')}>
                        Qty: {item.stock_quantity}
                      </p>
                      <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs" asChild>
                        <Link to={`/pharmacy/inventory/edit/${item.id}`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-16">
              <Boxes className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium">No inventory items found</p>
              <Button variant="link" asChild>
                <Link to="/pharmacy/inventory/add">Add your first medicine</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
