# Club Cuvee Admin Portal

This directory contains the secure admin portal for Club Cuvee, accessible only to administrators.

## Features

1. **Secure Authentication**: Only users with the `is_admin` flag in the database can access this portal.
2. **Onboarding Tester**: Test and validate the restaurant onboarding flow, including:
   - Creating restaurant invitations
   - Verifying restaurant registrations
   - Managing membership tiers
   - Testing Stripe integration

## Setting Up Admin Access

To grant admin access to a user:

1. **Option 1**: Use the admin service directly:
   ```typescript
   import { setAdminStatus } from '../services/adminService';
   
   // Make a user an admin
   await setAdminStatus('user-id-here', true);
   ```

2. **Option 2**: Use the utility function (for the first admin):
   ```typescript
   import { makeCurrentUserAdmin } from '../utils/makeAdmin';
   
   // Make the currently logged-in user an admin
   const result = await makeCurrentUserAdmin();
   console.log(result.message);
   ```

## Database Schema

The admin functionality relies on an `is_admin` boolean column in the `users` table.

## Security Considerations

- All admin routes are protected by the `AdminGuard` component
- Row-level security is implemented in the database
- Admin-only operations are authenticated on the server
- API endpoints verify admin status before processing sensitive operations

## Future Enhancements

1. Admin management interface to add/remove admins
2. Audit logging for admin actions
3. Role-based access control with different permission levels
4. Enhanced analytics dashboard for system-wide metrics