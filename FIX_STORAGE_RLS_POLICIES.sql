-- Fix Storage RLS Policies for Business Assets
-- ============================================
-- This fixes the RLS policy mismatch by ensuring users can only upload
-- to folders for businesses they own.

-- First, drop the existing overly-permissive policies
DROP POLICY IF EXISTS "Authenticated users can upload business assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own business assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own business assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to business assets" ON storage.objects;

-- Create new policies that check business ownership

-- 1. Allow users to upload files ONLY to their own business folders
CREATE POLICY "Business owners can upload to their folders"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'business-assets' AND
  -- Extract the business ID from the file path (first folder)
  (string_to_array(name, '/'))[1] IN (
    SELECT id::text 
    FROM businesses 
    WHERE owner_id = auth.uid()
  )
);

-- 2. Allow users to update files ONLY in their own business folders
CREATE POLICY "Business owners can update their files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-assets' AND
  (string_to_array(name, '/'))[1] IN (
    SELECT id::text 
    FROM businesses 
    WHERE owner_id = auth.uid()
  )
);

-- 3. Allow users to delete files ONLY from their own business folders
CREATE POLICY "Business owners can delete their files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-assets' AND
  (string_to_array(name, '/'))[1] IN (
    SELECT id::text 
    FROM businesses 
    WHERE owner_id = auth.uid()
  )
);

-- 4. Keep public read access for displaying images
CREATE POLICY "Public read access to business assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'business-assets');

-- IMPORTANT: Alternative approach if the API creates businesses
-- If your API creates businesses with a service role, you might need to:
-- 1. Have the API also handle image uploads
-- 2. OR ensure the API sets the correct owner_id when creating businesses
-- 3. OR use a different approach like signed URLs for uploads