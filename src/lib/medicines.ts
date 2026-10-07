import { supabase } from '@/lib/supabase';

export type DosageForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops' | 'Inhaler' | 'Cream' | 'Spray';

export interface MedicineRecord {
  id: string;
  pharmacy_id: string;
  name: string;
  generic_name: string;
  brand: string;
  strength: string;
  dosage_form: DosageForm | string;
  category: string;
  price: number;
  stock_quantity: number;
  expiry_date: string;
  prescription_required: boolean;
  batch_number: string;
  pack_size: string;
  storage_requirement: string;
  low_stock_threshold: number;
  description: string | null;
  manufacturer: string;
  created_at: string;
  updated_at: string;
}

export async function createMedicine(
  params: Omit<MedicineRecord, 'id' | 'created_at' | 'updated_at' | 'pharmacy_id'> & { pharmacy_id?: string },
): Promise<{ data: MedicineRecord | null; error: string | null }> {
  const { data, error } = await supabase
    .from('medicines')
    .insert({
      pharmacy_id: params.pharmacy_id,
      name: params.name,
      generic_name: params.generic_name,
      brand: params.brand,
      strength: params.strength,
      dosage_form: params.dosage_form,
      category: params.category,
      price: params.price,
      stock_quantity: params.stock_quantity,
      expiry_date: params.expiry_date,
      prescription_required: params.prescription_required,
      batch_number: params.batch_number,
      pack_size: params.pack_size,
      storage_requirement: params.storage_requirement,
      low_stock_threshold: params.low_stock_threshold,
      description: params.description,
      manufacturer: params.manufacturer,
    })
    .select('*')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as MedicineRecord, error: null };
}

export async function fetchPharmacyMedicines(
  pharmacyId: string,
): Promise<{ data: MedicineRecord[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('pharmacy_id', pharmacyId)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as MedicineRecord[], error: null };
}

export async function fetchMedicineById(
  id: string,
): Promise<{ data: MedicineRecord | null; error: string | null }> {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as MedicineRecord | null, error: null };
}

export async function updateMedicine(
  id: string,
  updates: Partial<Omit<MedicineRecord, 'id' | 'pharmacy_id' | 'created_at'>>,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('medicines')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function fetchAllInStockMedicines(): Promise<{
  data: MedicineRecord[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .gt('stock_quantity', 0)
    .order('name', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as MedicineRecord[], error: null };
}

export function daysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
