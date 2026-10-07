/*
# Add read/update policies for orders table (pharmacy, delivery, admin access)

1. Security Changes
- The orders table currently only allows customers (auth.uid() = customer_id) to access their own orders.
- Pharmacy, delivery, and admin roles need to READ all orders and UPDATE order status.
- We add SELECT and UPDATE policies for all authenticated users (any logged-in pharmacy/delivery/admin can read and update order status).
- INSERT and DELETE remain customer-only (auth.uid() = customer_id).

2. Important Notes
- This is appropriate because pharmacy/delivery/admin are internal staff who need to see and update all orders.
- Customer write access (insert/delete) remains restricted to own rows.
*/

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "select_all_orders_staff" ON orders;
CREATE POLICY "select_all_orders_staff"
ON orders FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('pharmacy', 'delivery', 'admin')
  )
);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders"
ON orders FOR UPDATE
TO authenticated
USING (auth.uid() = customer_id)
WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "update_order_status_staff" ON orders;
CREATE POLICY "update_order_status_staff"
ON orders FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('pharmacy', 'delivery', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('pharmacy', 'delivery', 'admin')
  )
);
