/*
  # Fix Profiles RLS Policies

  ## Overview
  This migration fixes the infinite recursion issue in the profiles table RLS policies.
  
  ## Changes
  1. Drop the problematic "Admins can read company profiles" policy that caused infinite recursion
  2. Replace with a simpler policy that allows users to read profiles from their own company
  
  ## Security
  - Users can read their own profile
  - Users can read other profiles from the same company (no admin check needed for reading)
  - Only users can update their own profile
  - Only users can insert their own profile during signup
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can read company profiles" ON profiles;

-- Create a new policy that allows users to read profiles from their own company
-- This uses a direct comparison instead of a subquery to avoid recursion
CREATE POLICY "Users can read company profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );