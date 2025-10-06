/*
  # Create Users and Companies Schema

  ## Overview
  This migration sets up the core authentication and company management system for BisFlowPro.
  
  ## New Tables
  
  ### `companies`
  - `id` (uuid, primary key) - Unique identifier for each company
  - `name` (text) - Company name
  - `address` (text) - Company address
  - `purpose_of_use` (text) - Business category: hospitality, commerce, pharmacy, or other
  - `created_at` (timestamptz) - Timestamp of company creation
  
  ### `profiles`
  - `id` (uuid, primary key, references auth.users) - Links to Supabase auth user
  - `username` (text, unique) - Unique username for login
  - `email` (text) - User email
  - `company_id` (uuid, references companies) - Company the user belongs to
  - `is_admin` (boolean) - Whether user is company admin (can add more users)
  - `created_at` (timestamptz) - Timestamp of profile creation
  
  ## Security
  - Enable RLS on both tables
  - Profiles: Users can read their own profile, admins can read company profiles
  - Profiles: Users can update their own profile
  - Companies: Users can read their own company data
  - Companies: Only admins can update company data
  
  ## Important Notes
  1. The first user who creates a company becomes the admin
  2. Admin users can add additional users to their company
  3. All user authentication is handled through Supabase Auth
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  purpose_of_use text NOT NULL CHECK (purpose_of_use IN ('hospitality', 'commerce', 'pharmacy', 'other')),
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read company profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.company_id = profiles.company_id
      AND p.is_admin = true
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Companies policies
CREATE POLICY "Users can read own company"
  ON companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.company_id = companies.id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update company"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.company_id = companies.id
      AND profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.company_id = companies.id
      AND profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated users can create companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);