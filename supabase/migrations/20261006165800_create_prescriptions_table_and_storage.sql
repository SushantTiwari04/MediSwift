/*
# Create prescriptions table and storage bucket

1. New Tables
- `prescriptions`
  - `id` (uuid, primary key)
  - `customer_id` (uuid, references profiles, NOT NULL)
  - `prescription_number` (text, unique — generated client-side)
  - `doctor_name` (text, default empty string)
  - `patient_name` (text, default empty string)
  - `notes` (text, nullable — customer optional notes)
  - `file_url` (text — storage path or data URL for the uploaded image)
  - `file_type` (text: 'image' or 'pdf')
  - `file_name` (text — original file name)
  - `status` (text: 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', default 'PENDING')
  - `admin_notes` (text, nullable — notes set by admin during review)
  - `medicines` (jsonb — array of {name, strength, quantity}, default empty array)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `prescriptions`.
- Customers (authenticated) can read/insert their own prescriptions (customer_id = auth.uid()).
- Admins can read and update all prescriptions.
- No delete policy for safety.

3. Storage
- Create public bucket `prescriptions` for storing prescription images.
- Allow authenticated users to upload to their own folder.
- Allow public read for prescription images (needed for admin view).

4. Notes
- The `status` column tracks: PENDING → UNDER_REVIEW → APPROVED/REJECTED
- `admin_notes` is set by the admin when reviewing.
- `medicines` stores manually entered medicine list as JSONB.
- Images are stored in Supabase Storage bucket `prescriptions` under `customer_id/` folders.
*/

CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prescription_number text UNIQUE NOT NULL,
  doctor_name text NOT NULL DEFAULT '',
  patient_name text NOT NULL DEFAULT '',
  notes text,
  file_url text,
  file_type text NOT NULL DEFAULT 'image' CHECK (file_type IN ('image', 'pdf')),
  file_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')),
  admin_notes text,
  medicines jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Customers can read their own prescriptions
DROP POLICY IF EXISTS "prescriptions_select_own" ON prescriptions;
CREATE POLICY "prescriptions_select_own"
ON prescriptions FOR SELECT
TO authenticated
USING (
  customer_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Customers can insert their own prescriptions
DROP POLICY IF EXISTS "prescriptions_insert_own" ON prescriptions;
CREATE POLICY "prescriptions_insert_own"
ON prescriptions FOR INSERT
TO authenticated
WITH CHECK (customer_id = auth.uid());

-- Admins can update any prescription (for status changes)
DROP POLICY IF EXISTS "prescriptions_update_admin" ON prescriptions;
CREATE POLICY "prescriptions_update_admin"
ON prescriptions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create storage bucket for prescriptions (public read so admin can view images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'prescriptions',
  'prescriptions',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated users can upload to their own folder
DROP POLICY IF EXISTS "prescription_storage_upload_own" ON storage.objects;
CREATE POLICY "prescription_storage_upload_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'prescriptions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Public can read prescription images (needed for admin to view)
DROP POLICY IF EXISTS "prescription_storage_read_public" ON storage.objects;
CREATE POLICY "prescription_storage_read_public"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'prescriptions');

-- Authenticated users can update/delete their own prescription files
DROP POLICY IF EXISTS "prescription_storage_update_own" ON storage.objects;
CREATE POLICY "prescription_storage_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'prescriptions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "prescription_storage_delete_own" ON storage.objects;
CREATE POLICY "prescription_storage_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'prescriptions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
