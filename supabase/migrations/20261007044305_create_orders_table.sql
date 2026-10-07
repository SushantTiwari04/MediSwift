/*
# Create orders table

1. New Tables
- `orders`
  - `id` (uuid, primary key)
  - `customer_id` (uuid, not null, defaults to auth.uid(), references auth.users)
  - `order_number` (text, unique, not null) — human-readable order ID like MED-20260107-ABC123
  - `status` (text, not null, default 'NEW') — order lifecycle status
  - `items` (jsonb, not null) — array of order items with medicineId, name, brand, strength, form, price, quantity
  - `subtotal` (numeric(12,2), not null)
  - `delivery_fee` (numeric(12,2), not null, default 0)
  - `service_fee` (numeric(12,2), not null, default 0)
  - `total` (numeric(12,2), not null)
  - `delivery_address` (jsonb, not null) — shipping address snapshot
  - `payment_method` (text, not null)
  - `delivery_instructions` (text, nullable)
  - `prescription_required` (boolean, not null, default false)
  - `estimated_delivery` (timestamptz, nullable)
  - `placed_at` (timestamptz, not null, default now())
  - `created_at` (timestamptz, not null, default now())
  - `updated_at` (timestamptz, not null, default now())

2. Security
- Enable RLS on `orders`.
- Owner-scoped CRUD: each authenticated customer can only access their own orders.
- SELECT: customer can read own orders.
- INSERT: customer can insert own orders (customer_id defaults to auth.uid()).
- UPDATE: customer can update own orders (for status/cancellation).
- DELETE: customer can delete own orders.

3. Indexes
- Index on customer_id for fast lookups.
- Index on order_number for search.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'NEW',
  items jsonb NOT NULL,
  subtotal numeric(12,2) NOT NULL,
  delivery_fee numeric(12,2) NOT NULL DEFAULT 0,
  service_fee numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL,
  delivery_address jsonb NOT NULL,
  payment_method text NOT NULL,
  delivery_instructions text,
  prescription_required boolean NOT NULL DEFAULT false,
  estimated_delivery timestamptz,
  placed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders"
ON orders FOR UPDATE
TO authenticated
USING (auth.uid() = customer_id)
WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders"
ON orders FOR DELETE
TO authenticated
USING (auth.uid() = customer_id);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
