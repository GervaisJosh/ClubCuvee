# Image Upload Debug Guide

## Current Upload Flow

1. **Business Creation**:
   - API creates auth account for business email
   - Sets `owner_id` to business email's auth ID
   - Returns `businessAuthUserId`

2. **Authentication Switch**:
   - Component signs in as business user with email/password
   - This establishes the correct auth context for uploads

3. **Image Upload**:
   - Uploads happen AFTER business creation
   - Uses the business user's auth session
   - RLS policies check if `auth.uid() = business.owner_id`

## Key Debug Points

### 1. Check Console Logs for:

```
=== BUSINESS CREATED ===
Business ID: xxx
Business Auth User ID: xxx
Business Email: xxx

=== SIGNING IN AS BUSINESS USER ===
Successfully signed in as business user

=== UPLOAD STATE CHECK ===
Logo upload state: { hasLogoFile: true, ... }

=== PROCEEDING WITH LOGO UPLOAD ===
Auth session before upload: {
  sessionUserId: xxx,
  sessionEmail: business@email.com,
  businessIdForUpload: xxx
}

Business ownership check before upload: {
  businessOwnerId: xxx,
  currentUserId: xxx,
  ownershipMatch: true  // <-- MUST BE TRUE
}
```

### 2. Common Issues:

**A. Ownership Mismatch**
- If `ownershipMatch: false`, the RLS policy will block uploads
- This means the signed-in user doesn't match the business owner

**B. Sign-in Failed**
- Check if "Failed to sign in as business user" appears
- Password might be incorrect or user creation failed

**C. No Files Selected**
- Check `hasLogoFile: false` in upload state
- Files might not be stored in component state

## Storage RLS Policy

The bucket uses this policy:
```sql
-- Users can only upload to folders they own
(string_to_array(name, '/'))[1] IN (
  SELECT id::text 
  FROM businesses 
  WHERE owner_id = auth.uid()
)
```

This means:
- File path: `{businessId}/logo.png`
- First folder must be a business ID where `owner_id = current user`

## Troubleshooting Steps

1. **Check Business Creation**:
   - Verify business is created with correct owner_id
   - Check Supabase dashboard: businesses table

2. **Check Auth Status**:
   - Verify sign-in succeeds after business creation
   - Check auth logs in console

3. **Check File State**:
   - Verify files are selected and stored in state
   - Check console for file details

4. **Check RLS**:
   - Run ownership check query in Supabase SQL editor:
   ```sql
   SELECT id, owner_id, email 
   FROM businesses 
   WHERE id = 'your-business-id';
   ```

5. **Test Manual Upload**:
   - Try uploading via Supabase dashboard as the business user
   - If that fails, it's an RLS issue

## Expected Success Flow

1. Business created with business email's auth ID as owner
2. Sign in as business user succeeds
3. Ownership check shows `ownershipMatch: true`
4. Upload succeeds with public URL returned
5. Database updated with image URLs

## If Uploads Still Fail

1. Check Supabase logs for RLS policy violations
2. Verify the bucket exists and is public
3. Check if the business email already had an auth account
4. Look for any error messages in upload response