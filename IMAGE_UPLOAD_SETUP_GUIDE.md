# Image Upload Setup Guide for Club Cuvée

## Problem Summary
The image upload functionality in BusinessSetup.tsx is implemented but images are not being uploaded to Supabase storage. This guide will help you set up and debug the image upload feature.

## Setup Instructions

### 1. Create the Storage Bucket in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Configure the bucket:
   - **Name:** `business-assets`
   - **Public bucket:** ✅ YES (check this box)
   - **File size limit:** 10MB (or adjust as needed)
   - **Allowed MIME types:** Leave blank to allow all, or specify:
     ```
     image/png
     image/jpeg
     image/jpg
     image/webp
     ```
5. Click **Create Bucket**

### 2. Apply Storage Policies

After creating the bucket, go to the SQL Editor in Supabase and run the policies from `SETUP_STORAGE_BUCKET.sql`:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload business assets"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'business-assets' AND
  (auth.uid() IS NOT NULL)
);

-- Allow authenticated users to update their files
CREATE POLICY "Users can update own business assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-assets' AND
  auth.uid() IS NOT NULL
);

-- Allow authenticated users to delete their files
CREATE POLICY "Users can delete own business assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-assets' AND
  auth.uid() IS NOT NULL
);

-- Allow public read access (IMPORTANT for displaying images)
CREATE POLICY "Public read access to business assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'business-assets');
```

### 3. Verify Database Schema

Ensure your database tables have the necessary columns:

```sql
-- Check if businesses table has logo_url column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'businesses' AND column_name = 'logo_url';

-- Check if membership_tiers table has image_url column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'membership_tiers' AND column_name = 'image_url';

-- If missing, add the columns:
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE membership_tiers ADD COLUMN IF NOT EXISTS image_url TEXT;
```

## Testing the Upload Feature

### 1. Check Browser Console

When testing the business setup form:

1. Open Browser Developer Tools (F12)
2. Go to the Console tab
3. Fill out the form and select images
4. Click "Create Wine Club"
5. Look for these console logs:
   - `Starting logo upload for business: [businessId]`
   - `Logo file: [filename] [size] [type]`
   - `Upload path: [path]`
   - Success: `Logo uploaded successfully`
   - Error: `Logo upload failed: [error message]`

### 2. Common Issues and Solutions

#### Issue: "Storage bucket not found"
- **Solution:** The bucket hasn't been created. Follow step 1 above.

#### Issue: "new row violates row-level security policy"
- **Solution:** The storage policies haven't been applied. Run the SQL from step 2.

#### Issue: "Failed to update business with logo URL"
- **Solution:** The database columns are missing. Run the ALTER TABLE commands from step 3.

#### Issue: Images upload but don't display
- **Solution:** The bucket needs to be public. Recreate it with "Public bucket" checked.

### 3. Verify Upload in Supabase

1. Go to Storage in Supabase Dashboard
2. Click on the `business-assets` bucket
3. You should see folders named with business IDs
4. Inside each folder:
   - `logo.png` (or jpg/webp)
   - `tier-[uuid].png` for each tier image

### 4. Test Public Access

After upload, the public URLs should be accessible:
```
https://[your-project-ref].supabase.co/storage/v1/object/public/business-assets/[businessId]/logo.png
```

You can test by pasting the URL in a browser - the image should display.

## Debug Checklist

- [ ] Storage bucket `business-assets` exists in Supabase
- [ ] Bucket is set as PUBLIC
- [ ] All 4 storage policies are applied
- [ ] Database tables have `logo_url` and `image_url` columns
- [ ] Browser console shows upload attempts
- [ ] No CORS errors in console
- [ ] Supabase environment variables are correctly set
- [ ] User is authenticated when attempting upload

## Code Flow Overview

1. User selects images in BusinessSetup form
2. Images are stored as File objects with preview URLs
3. On form submission:
   - Business is created first
   - Logo is uploaded to `businessId/logo.ext`
   - Each tier image is uploaded to `businessId/tier-tierId.ext`
   - Database records are updated with public URLs
4. Images are displayed using the stored public URLs

## Next Steps

If uploads still fail after following this guide:
1. Check Supabase logs for detailed error messages
2. Verify your Supabase project's storage limits haven't been reached
3. Test with smaller image files (< 1MB)
4. Check network tab in browser for failed requests
5. Ensure the Supabase client is properly initialized with correct credentials