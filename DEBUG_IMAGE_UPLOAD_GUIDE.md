# Debug Guide: Image Upload Not Working

## Debug Features Added

### 1. Enhanced Console Logging
The BusinessSetup component now includes comprehensive debug logging that will show:

- **Pre-upload auth check** - Verifies user authentication status
- **Business creation confirmation** - Shows the business ID after creation
- **Detailed file information** - Size, type, name for each upload
- **Upload configuration** - Bucket name, file path, options
- **Error details** - Full error object with all properties
- **Success confirmation** - Upload response data and public URLs

### 2. Test Storage Access Button
A blue "Test Storage Access" button has been added to the setup form header. This button:
- Creates a simple text file
- Attempts to upload it to the storage bucket
- Shows auth status before upload
- Lists bucket contents if upload fails
- Deletes the test file if successful

### 3. What to Look For in Console

When you test the form, check the browser console (F12 → Console) for:

#### Success Pattern:
```
=== PRE-UPLOAD AUTH CHECK ===
Current auth context: { userId: "...", isAuthenticated: true, ... }
=== BUSINESS CREATED ===
Business ID: abc-123-def-456
=== LOGO UPLOAD START ===
Logo file details: { name: "logo.png", size: 50000, ... }
=== LOGO UPLOAD SUCCESS ===
Public URL: https://[project].supabase.co/storage/v1/object/public/business-assets/[businessId]/logo.png
```

#### Common Failure Patterns:

**1. Auth Issue:**
```
Auth session before upload: { hasSession: false, accessToken: "Missing" }
Error: User is not authenticated
```

**2. Policy Issue:**
```
Error details: { message: "new row violates row-level security policy", statusCode: 403 }
POLICY ERROR: RLS policy violation
```

**3. Bucket Issue:**
```
Error details: { message: "Bucket not found", statusCode: 404 }
BUCKET ERROR: Storage bucket "business-assets" not found
```

### 4. Testing Steps

1. **Test Storage Access First**
   - Click the blue "Test Storage Access" button
   - Check console for results
   - If this fails, the actual uploads will also fail

2. **Fill Out Form and Submit**
   - Add a business logo
   - Add tier images
   - Submit the form
   - Watch console for detailed logs

3. **Check Specific Error Types**
   - **403 Error**: RLS policy issue - check storage policies
   - **401 Error**: Authentication issue - user not logged in
   - **404 Error**: Bucket doesn't exist
   - **500 Error**: Server error - check Supabase logs

### 5. Quick Fixes Based on Errors

#### If Test Upload Shows "not authenticated":
```javascript
// The user might not be authenticated during business creation
// This could happen if the API creates the business without proper auth context
```

#### If Test Upload Works but Form Upload Fails:
```javascript
// The auth context might be different during form submission
// Check if the API endpoint properly maintains auth session
```

### 6. Verify Storage Policies

Run this SQL in Supabase to check existing policies:
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage';
```

### 7. Manual Upload Test

Try uploading directly via Supabase Dashboard:
1. Go to Storage → business-assets
2. Click "Upload files"
3. Try uploading any image
4. If this fails, it's a bucket configuration issue

## Next Steps Based on Console Output

After running these tests, the console output will clearly indicate:

1. **Is the user authenticated?** - Check auth logs
2. **Is the bucket accessible?** - Check test upload result
3. **What's the exact error?** - Check detailed error logs
4. **When does it fail?** - During upload or during URL generation

Share the console output to get specific guidance on fixing the issue.