# Authentication & Tier Image Upload Fix - Testing Guide

## Fixes Implemented

### 1. Authentication Routing Fix (AuthContext.tsx)
**Problem**: Customers were being incorrectly identified as admin and routed to admin dashboard
**Solution**: Reordered user type checks to prioritize user_metadata over app_metadata

#### Changes Made:
- Check `user_metadata.role` FIRST (lines 187-213)
- Check `user_metadata.user_type` as fallback 
- Admin check moved to LAST position with stricter validation (line 243)
- Added explicit check for `is_admin === true` (not just truthy)

### 2. Tier Image Upload Enhancement (BusinessSetup.tsx)
**Problem**: Tier images showed "can be added after initial setup" instead of allowing immediate upload
**Solution**: Replaced placeholder with working ImageUploadField component

#### Changes Made:
- Added tier ID generation when creating new tiers (line 258)
- Added `imageUrl` and `imagePath` to CustomerTierFormData interface (lines 58-59)
- Replaced placeholder div with ImageUploadField component (lines 1141-1159)
- Updated tier data submission to include image URLs (lines 533-534)

## Testing Instructions

### Test 1: Customer Authentication Routing
1. **Clear all browser data** (localStorage, sessionStorage, cookies)
2. Sign in with customer account: TestCust1
3. **Expected**: Should redirect to `/customer/dashboard`
4. **Verify**: Console should show "User is explicitly marked as customer in user_metadata"

### Test 2: Business Authentication Routing  
1. Clear browser data
2. Sign in with business account credentials
3. **Expected**: Should redirect to `/business/dashboard`
4. **Verify**: Console should show "User is explicitly marked as business in user_metadata"

### Test 3: Admin Authentication Routing
1. Clear browser data
2. Sign in with admin account
3. **Expected**: Should redirect to `/admin`
4. **Verify**: Console should show "User is admin (from app_metadata, explicitly true)"

### Test 4: Tier Image Upload During Business Setup
1. Start business onboarding flow `/onboard/{token}`
2. Fill in business details
3. Add a membership tier
4. **Expected**: Should see ImageUploadField instead of "Tier images can be added after initial setup"
5. Select an image file
6. **Verify**: Image uploads immediately and shows preview
7. Complete business setup
8. **Verify**: Tier image URL is saved to database

### Test 5: Tier Images Display
1. Navigate to customer join page `/join/{business-slug}`
2. **Expected**: Tier images should display for each membership tier
3. Navigate to business dashboard
4. **Expected**: Tier images should display in tier management section

## Verification Queries (Supabase SQL Editor)

### Check Customer User Metadata
```sql
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as user_role,
  raw_user_meta_data->>'user_type' as user_type,
  raw_app_meta_data->>'is_admin' as is_admin
FROM auth.users
WHERE email = 'testcust1@example.com';
```

### Check Tier Images
```sql
SELECT 
  id,
  business_id,
  name,
  image_url,
  created_at
FROM membership_tiers
WHERE business_id = '[YOUR_BUSINESS_ID]'
ORDER BY created_at DESC;
```

### Check Business Logo
```sql
SELECT 
  id,
  name,
  logo_url
FROM businesses
WHERE id = '[YOUR_BUSINESS_ID]';
```

## Troubleshooting

### If Customer Still Routes to Admin:
1. Check auth.users table for the customer
2. Verify `raw_user_meta_data` contains `{"role": "customer"}` or `{"user_type": "customer"}`
3. Check if `raw_app_meta_data` incorrectly has `{"is_admin": true}`
4. If metadata is wrong, update it:
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"customer"')
WHERE email = 'testcust1@example.com';
```

### If Tier Images Don't Upload:
1. Check browser console for errors
2. Verify business ID exists before tier creation
3. Check Supabase storage bucket permissions for `business-assets`
4. Verify ImageUploadField receives businessId prop

### If Images Don't Display:
1. Check if image_url is saved in membership_tiers table
2. Verify storage bucket is public or has proper RLS policies
3. Check if image URLs are accessible directly in browser

## Database Note
The API expects `image_storage_path` column in membership_tiers table. If missing, add it:
```sql
ALTER TABLE membership_tiers 
ADD COLUMN IF NOT EXISTS image_storage_path TEXT;
```

## Success Criteria
✅ Customers route to `/customer/dashboard`
✅ Business users route to `/business/dashboard`  
✅ Admins route to `/admin`
✅ Tier images can be uploaded during tier creation
✅ Tier images display on customer join page
✅ Tier images display in business dashboard

## Console Logs to Watch
- "Determining user type for:" - Shows metadata being checked
- "User is explicitly marked as customer in user_metadata" - Confirms customer detection
- "User is admin (from app_metadata, explicitly true)" - Confirms admin detection
- "Successfully uploaded image to:" - Confirms image upload