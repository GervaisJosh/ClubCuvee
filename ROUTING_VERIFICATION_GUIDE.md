# Routing Verification Guide

## Current Routing Configuration

### AuthRouter.tsx Routes
- **Admin**: `/admin`
- **Business**: `/business/dashboard`  
- **Customer**: `/customer/dashboard`

### Actual Component Mapping
- **Admin**: `/admin` → `pages/admin/Dashboard`
- **Business**: `/business/dashboard` → `pages/business/Dashboard`
- **Customer**: `/customer/dashboard` → `pages/customer/ScopedCustomerDashboard`

## Routing Flow

1. User signs in → `AuthContext.tsx` determines user type
2. `AuthRouter.tsx` redirects based on user type
3. App.tsx routes to the appropriate component

## Verified Components

### Customer Dashboard
- **Correct**: `ScopedCustomerDashboard.tsx` - Scoped to specific business
- **Legacy**: `CustomerDashboard.tsx` - Old implementation (not used)

### Business Dashboard  
- **Correct**: `pages/business/Dashboard.tsx`

## Testing Steps

### 1. Clear Browser Data
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
```

### 2. Check User Metadata
After signing in, check the console logs for:
```
"Determining user type for:"
"User is explicitly marked as customer in user_metadata"
"User is customer, redirecting to customer dashboard"
```

### 3. Verify Final Route
The browser URL should be:
- Customer: `http://localhost:5173/customer/dashboard`
- Business: `http://localhost:5173/business/dashboard`
- Admin: `http://localhost:5173/admin`

## SQL Verification Queries

### Check Customer Metadata
```sql
SELECT 
  id,
  email,
  raw_user_meta_data,
  raw_app_meta_data
FROM auth.users
WHERE email = 'testcust1@example.com';
```

### Update Customer Metadata (if needed)
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'role', 'customer',
  'user_type', 'customer'
)
WHERE email = 'testcust1@example.com';
```

### Check Business User Metadata
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'role', 'business',
  'user_type', 'business'
)
WHERE id IN (
  SELECT owner_id FROM businesses WHERE name = 'YOUR_BUSINESS_NAME'
);
```

## Common Issues

### Customer Shows Wrong Dashboard
1. Check if `CustomerDashboard` is imported anywhere instead of `ScopedCustomerDashboard`
2. Verify the route in App.tsx is `/customer/dashboard`
3. Check browser network tab for which component file is loaded

### Business User Not Routing Correctly
1. Ensure they have `role: 'business'` in user_metadata
2. Check if they exist in `businesses` table as owner
3. Verify `business_users` table has their record

### "Strange Dashboard" Appears
This might be:
- The old `CustomerDashboard.tsx` (queries `users` table)
- A cached version of the app
- A different route being triggered

## Component Differences

### ScopedCustomerDashboard (Correct)
- Queries `customers` table
- Shows business-specific information
- Has membership tier details
- Located at: `pages/customer/ScopedCustomerDashboard.tsx`

### CustomerDashboard (Legacy)
- Queries `users` table
- Generic dashboard
- No business scoping
- Located at: `pages/customer/CustomerDashboard.tsx`

## Fix Applied

The AuthContext.tsx now checks user metadata in this order:
1. `user_metadata.role === 'customer'` → Customer
2. `user_metadata.role === 'business'` → Business  
3. `app_metadata.is_admin === true` → Admin
4. Database lookups as fallback

This ensures customers are identified first and routed to the correct dashboard.