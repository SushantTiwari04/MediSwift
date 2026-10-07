/*
# Create medicines table for pharmacy inventory

1. New Tables
- `medicines`
  - `id` (uuid, primary key)
  - `pharmacy_id` (uuid, references profiles, NOT NULL — the pharmacy that owns this medicine)
  - `name` (text, NOT NULL — medicine name)
  - `generic_name` (text, NOT NULL DEFAULT '' — active ingredient / generic name)
  - `brand` (text, NOT NULL DEFAULT '' — brand name)
  - `strength` (text, NOT NULL DEFAULT '' — e.g. 500mg)
  - `dosage_form` (text, NOT NULL DEFAULT 'Tablet' — Tablet, Capsule, Syrup, etc.)
  - `category` (text, NOT NULL DEFAULT '' — Pain Relief, Antibiotic, etc.)
  - `price` (numeric, NOT NULL DEFAULT 0)
  - `stock_quantity` (integer, NOT NULL DEFAULT 0)
  - `expiry_date` (date, NOT NULL)
  - `prescription_required` (boolean, NOT NULL DEFAULT false)
  - `batch_number` (text, NOT NULL DEFAULT '')
  - `pack_size` (text, NOT NULL DEFAULT '')
  - `storage_requirement` (text, NOT NULL DEFAULT 'Room Temperature')
  - `low_stock_threshold` (integer, NOT NULL DEFAULT 20)
  - `description` (text, nullable)
  - `manufacturer` (text, NOT NULL DEFAULT '')
  - `created_at` (timestamptz, NOT NULL DEFAULT now())
  - `updated_at` (timestamptz, NOT NULL DEFAULT now())

2. Security
- Enable RLS on `medicines`.
- Authenticated pharmacy users can read/insert/update their own medicines (pharmacy_id = auth.uid()).
- Admins can read all medicines.
- Authenticated users (customers) can read medicines where stock_quantity > 0.
- No delete policy — pharmacies update stock to 0 instead.

3. Notes
- When a pharmacy adds a medicine, it becomes visible to customers in search.
- The `stock_quantity > 0` check ensures out-of-stock items don't appear in customer search.
- `pharmacy_id` defaults to auth.uid() so inserts from the pharmacy client work without explicitly passing it.
*/

CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  generic_name text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  strength text NOT NULL DEFAULT '',
  dosage_form text NOT NULL DEFAULT 'Tablet',
  category text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  stock_quantity integer NOT NULL DEFAULT 0,
  expiry_date date NOT NULL,
  prescription_required boolean NOT NULL DEFAULT false,
  batch_number text NOT NULL DEFAULT '',
  pack_size text NOT NULL DEFAULT '',
  storage_requirement text NOT NULL DEFAULT 'Room Temperature',
  low_stock_threshold integer NOT NULL DEFAULT 20,
  description text,
  manufacturer text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

-- Pharmacy users can read their own medicines; admin can read all; customers can read in-stock medicines
DROP POLICY IF EXISTS "medicines_select" ON medicines;
CREATE POLICY "medicines_select"
ON medicines FOR SELECT
TO authenticated
USING (
  pharmacy_id = auth.uid()
  OR stock_quantity > 0
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Pharmacy users can insert their own medicines
DROP POLICY IF EXISTS "medicines_insert_own" ON medicines;
CREATE POLICY "medicines_insert_own"
ON medicines FOR INSERT
TO authenticated
WITH CHECK (pharmacy_id = auth.uid());

-- Pharmacy users can update their own medicines
DROP POLICY IF EXISTS "medicines_update_own" ON medicines;
CREATE POLICY "medicines_update_own"
ON medicines FOR UPDATE
TO authenticated
USING (pharmacy_id = auth.uid())
WITH CHECK (pharmacy_id = auth.uid());
