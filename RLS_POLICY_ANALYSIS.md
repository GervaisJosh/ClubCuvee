# RLS Policy Mismatch Analysis

## The Root Cause

The RLS policy violation is happening because of a mismatch between:
1. **Who creates the business** (the API with service role)
2. **Who tries to upload images** (the authenticated user)

## What's Happening

### 1. Business Creation Flow
```
User → API Endpoint (/api/create-business) → Supabase (with service role)
```
The API likely uses a service role key which bypasses RLS and creates the business. The `owner_id` might be:
- Not set at all
- Set to the wrong user ID
- Set correctly but the auth context is different

### 2. Image Upload Flow
```
User → Direct Supabase Storage Upload (with user's auth token)
```
The user tries to upload directly to storage with their auth token, but the RLS policy checks if they own the business.

## The Console Will Show

When you run the form, look for this output:
```
=== VERIFYING BUSINESS OWNERSHIP ===
Business ownership verification: {
  businessId: "abc-123",
  businessOwnerId: "different-user-id",  // Or null
  currentUserId: "current-user-id",
  ownershipMatch: false,  // This is the problem!
  checkError: null
}
OWNERSHIP MISMATCH: Current user does not own the business!
```

## Solutions

### Option 1: Fix the API (Recommended)
The `/api/create-business` endpoint should:
1. Extract the user ID from the auth token
2. Set `owner_id` to that user ID when creating the business

### Option 2: Temporary Workaround
Use less restrictive RLS policies (current approach) but this is less secure.

### Option 3: API Handles Uploads
Have the API endpoint handle image uploads too, using its service role.

## Quick Test

To verify this is the issue:
1. Run the form and check console for "OWNERSHIP MISMATCH"
2. If confirmed, the fix needs to be in the API endpoint

## What the API Should Do

```typescript
// In /api/create-business endpoint
const token = req.headers.authorization?.split(' ')[1];
const { data: { user } } = await supabase.auth.getUser(token);

// Create business with correct owner
const { data: business } = await supabase
  .from('businesses')
  .insert({
    ...businessData,
    owner_id: user.id  // CRITICAL: Set the owner to the authenticated user
  })
  .select()
  .single();
```

Without this, the uploads will always fail with RLS policy violations.