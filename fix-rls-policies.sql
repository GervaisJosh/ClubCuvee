-- Fix RLS policies for all tables to prevent 500 errors

-- 1. BUSINESSES TABLE POLICIES
-- Allow business owners and admins to view their business
CREATE POLICY "Business owners can view their business" ON businesses
  FOR SELECT USING (
    owner_id = auth.uid() 
    OR id IN (
      SELECT business_id FROM business_users 
      WHERE auth_id = auth.uid() AND is_active = true
    )
  );

-- Allow business owners to update their business
CREATE POLICY "Business owners can update their business" ON businesses
  FOR UPDATE USING (
    owner_id = auth.uid() 
    OR id IN (
      SELECT business_id FROM business_users 
      WHERE auth_id = auth.uid() AND role = 'business_admin' AND is_active = true
    )
  );

-- Allow admins full access
CREATE POLICY "Admins have full access to businesses" ON businesses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_app_meta_data->>'is_admin' = 'true'
    )
  );

-- 2. CUSTOMERS TABLE POLICIES
-- Allow customers to view their own record
CREATE POLICY "Customers can view their own data" ON customers
  FOR SELECT USING (auth_id = auth.uid());

-- Allow customers to update their own profile
CREATE POLICY "Customers can update their own data" ON customers
  FOR UPDATE USING (auth_id = auth.uid());

-- Allow business owners/admins to view their customers
CREATE POLICY "Business can view their customers" ON customers
  FOR SELECT USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
      UNION
      SELECT business_id FROM business_users 
      WHERE auth_id = auth.uid() AND is_active = true
    )
  );

-- Allow business owners/admins to manage their customers
CREATE POLICY "Business can manage their customers" ON customers
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
      UNION
      SELECT business_id FROM business_users 
      WHERE auth_id = auth.uid() AND role = 'business_admin' AND is_active = true
    )
  );

-- Allow admins full access
CREATE POLICY "Admins have full access to customers" ON customers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_app_meta_data->>'is_admin' = 'true'
    )
  );

-- 3. BUSINESS_USERS TABLE POLICIES
-- Allow business users to view their own record
CREATE POLICY "Business users can view their own record" ON business_users
  FOR SELECT USING (auth_id = auth.uid());

-- Allow business owners to manage their team
CREATE POLICY "Business owners can manage team" ON business_users
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

-- Allow business admins to view team members
CREATE POLICY "Business admins can view team" ON business_users
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM business_users 
      WHERE auth_id = auth.uid() AND role = 'business_admin' AND is_active = true
    )
  );

-- 4. MEMBERSHIP_TIERS TABLE POLICIES
-- Allow public read access (for customer signup)
CREATE POLICY "Public can view active tiers" ON membership_tiers
  FOR SELECT USING (is_active = true);

-- Allow business to manage their tiers
CREATE POLICY "Business can manage their tiers" ON membership_tiers
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
      UNION
      SELECT business_id FROM business_users 
      WHERE auth_id = auth.uid() AND role = 'business_admin' AND is_active = true
    )
  );

-- 5. WINES TABLE POLICIES
-- Allow customers to view wines from their business
CREATE POLICY "Customers can view business wines" ON wines
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM customers WHERE auth_id = auth.uid()
    )
  );

-- Allow business to manage their wines
CREATE POLICY "Business can manage their wines" ON wines
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
      UNION
      SELECT business_id FROM business_users 
      WHERE auth_id = auth.uid() AND is_active = true
    )
  );

-- 6. ORDERS TABLE POLICIES
-- Allow customers to view their orders
CREATE POLICY "Customers can view their orders" ON orders
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_id = auth.uid()
    )
  );

-- Allow business to view and manage their orders
CREATE POLICY "Business can manage their orders" ON orders
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
      UNION
      SELECT business_id FROM business_users 
      WHERE auth_id = auth.uid() AND is_active = true
    )
  );

-- 7. Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 8. Drop existing policies that might conflict (run before creating new ones)
-- Run these commands first if you get "policy already exists" errors:
/*
DROP POLICY IF EXISTS "Business owners can view their business" ON businesses;
DROP POLICY IF EXISTS "Business owners can update their business" ON businesses;
DROP POLICY IF EXISTS "Admins have full access to businesses" ON businesses;
DROP POLICY IF EXISTS "Customers can view their own data" ON customers;
DROP POLICY IF EXISTS "Customers can update their own data" ON customers;
DROP POLICY IF EXISTS "Business can view their customers" ON customers;
DROP POLICY IF EXISTS "Business can manage their customers" ON customers;
DROP POLICY IF EXISTS "Admins have full access to customers" ON customers;
DROP POLICY IF EXISTS "Business users can view their own record" ON business_users;
DROP POLICY IF EXISTS "Business owners can manage team" ON business_users;
DROP POLICY IF EXISTS "Business admins can view team" ON business_users;
DROP POLICY IF EXISTS "Public can view active tiers" ON membership_tiers;
DROP POLICY IF EXISTS "Business can manage their tiers" ON membership_tiers;
DROP POLICY IF EXISTS "Customers can view business wines" ON wines;
DROP POLICY IF EXISTS "Business can manage their wines" ON wines;
DROP POLICY IF EXISTS "Customers can view their orders" ON orders;
DROP POLICY IF EXISTS "Business can manage their orders" ON orders;
*/