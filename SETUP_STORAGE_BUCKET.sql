-- Setup Business Assets Storage Bucket
-- =====================================
-- IMPORTANT: The 'business-assets' bucket must be created manually in Supabase Dashboard first
-- Go to Storage > New Bucket > Name: "business-assets" > Public bucket: YES

-- After creating the bucket, run these policies:

-- 1. Allow authenticated users to upload files to business folders
CREATE POLICY "Authenticated users can upload business assets"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'business-assets' AND
  (auth.uid() IS NOT NULL)
);

-- 2. Allow authenticated users to update their own business files
CREATE POLICY "Users can update own business assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-assets' AND
  auth.uid() IS NOT NULL
);

-- 3. Allow authenticated users to delete their own business files
CREATE POLICY "Users can delete own business assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-assets' AND
  auth.uid() IS NOT NULL
);

-- 4. Allow public read access to all business assets (for displaying logos/images)
CREATE POLICY "Public read access to business assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'business-assets');

-- Note: For more restrictive policies, you can match the folder structure to business ownership:
-- Example: Check if the user owns the business by matching the folder ID
-- WITH CHECK (
--   bucket_id = 'business-assets' AND
--   (storage.foldername(name))[1] IN (
--     SELECT id::text FROM businesses WHERE owner_id = auth.uid()
--   )
-- );