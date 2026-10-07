/*
# Create profiles table for role-based authentication

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique)
  - `full_name` (text)
  - `phone` (text, nullable)
  - `role` (text, one of: customer, pharmacy, delivery, admin)
  - `city` (text, nullable)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `profiles`.
- Users can read their own profile row.
- Users can insert their own profile row (on signup).
- Users can update their own profile row.

3. Notes
- The `role` column stores the portal type for each user.
- Email confirmation is OFF — users can log in immediately after signup.
- A trigger could auto-create profile rows, but we insert from the client
  after signUp to keep things simple and explicit.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL DEFAULT '',
  phone text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'pharmacy', 'delivery', 'admin')),
  city text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
