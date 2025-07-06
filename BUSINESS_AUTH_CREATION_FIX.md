# Business Auth Creation Fix

## What Was Changed

### Problem
- Previously, the API was using the admin's auth ID as the business owner_id
- This caused RLS policy violations because the business email didn't have an auth account
- Images couldn't upload because the owner_id didn't match any authenticated user

### Solution
The `/api/create-business.ts` now:
1. Creates an auth account for the BUSINESS EMAIL (not the admin)
2. Sets the password provided in the form
3. Uses the business email's auth ID as the owner_id
4. Returns the business auth user ID for client-side authentication

### Code Changes

#### 1. API Changes (`/api/create-business.ts`)
```typescript
// Create auth account for business email
const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
  email: businessData.email.trim(),
  email_confirm: true, // Auto-confirm since admin is creating
  password: businessData.password, // Set the password they provided
});

// Handle existing users gracefully
if (authError?.message?.includes('already exists')) {
  // Use existing user
}

// Create business with correct owner_id
owner_id: businessAuthUser.id, // The business email's auth ID
```

#### 2. BusinessSetup Changes
- Removed auth header requirement from API call
- Added automatic sign-in after business creation
- Uses the business credentials to authenticate for image uploads

### Benefits
1. **Correct Ownership**: owner_id matches the business email's auth account
2. **RLS Compliance**: Images upload successfully because the authenticated user owns the business
3. **Better UX**: Business gets their account immediately with the password they chose
4. **No Schema Changes**: Works with existing database structure

### Testing
1. Create a new business invitation
2. Complete the setup form with business email and password
3. Verify business is created with correct owner_id
4. Verify images upload successfully
5. Business can sign in with their email/password immediately

### Important Notes
- The admin who sends the invitation doesn't become the owner
- The business email becomes the owner with full access
- If a business email already has an auth account, it uses the existing one
- All RLS policies work correctly because owner_id = business auth ID