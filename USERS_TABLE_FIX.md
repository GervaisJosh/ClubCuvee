# Fixed: Removed Users Table Dependency

## Problem
The app was failing with error: "Could not find the 'preferences' column of 'users' in the schema cache" because:
- AuthContext was trying to access a `users` table that doesn't exist
- The app architecture uses `businesses` and `customers` tables directly, not a `users` table
- The userService was trying to create/update records in the non-existent `users` table

## Solution Implemented

### 1. Updated AuthContext.tsx
Removed dependency on `userService` and changed `fetchUserProfile` to:
1. First check if the user is a business owner (query `businesses` table)
2. Then check if the user is a customer (query `customers` table)
3. Set appropriate profile data based on what's found

```typescript
// Check businesses table first
const { data: businessUser } = await supabase
  .from('businesses')
  .select('*')
  .eq('owner_id', userId)
  .single();

if (businessUser) {
  setUserProfile({
    id: businessUser.id,
    auth_id: userId,
    email: businessUser.email,
    name: businessUser.name,
    is_business: true,
    business_id: businessUser.id,
    is_admin: false
  });
  return;
}

// Then check customers table
const { data: customerUser } = await supabase
  .from('customers')
  .select('*')
  .eq('auth_id', userId)
  .single();
```

### 2. Removed Imports
- Removed `import { getUserProfileByAuthId } from '../services/userService'`
- Removed `import { getUserProfile } from '../api/supabaseQueries'`

## Impact

1. **Business Onboarding Flow**: Now works without trying to create a `users` table record
2. **Auth Flow**: 
   - Create auth.users entry (Supabase Auth) ✓
   - Create businesses table entry with owner_id ✓
   - No intermediate users table needed ✓
3. **Customer Flow**: Uses customers table directly
4. **No Schema Changes**: Works with existing database structure

## Architecture Clarification

- **Business Users**: Profile data stored in `businesses` table
- **Customer Users**: Profile data stored in `customers` table
- **No Generic Users Table**: Each user type has its own dedicated table
- **Auth**: Still uses Supabase Auth (auth.users) for authentication

## Testing

The business onboarding should now:
1. Create auth user without errors
2. Create business record
3. Sign in successfully
4. Upload images without 406 errors

No more "users table not found" errors!