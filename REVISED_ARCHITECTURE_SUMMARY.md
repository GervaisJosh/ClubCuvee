# Club Cuvée Revised Architecture - Private, Scoped Access Model

## 🔒 **CRITICAL CHANGES IMPLEMENTED**

This document outlines the complete architectural revision to enforce Club Cuvée's private, invite-only business model. **All public access routes have been eliminated** and replaced with a secure, scoped-access system.

---

## ❌ **REMOVED: Public Access Violations**

### Files Deleted
- `src/pages/club/BusinessMembership.tsx` - **REMOVED**: Public membership page
- `api/business/[businessId]/membership.ts` - **REMOVED**: Public business API
- `api/create-customer-checkout.ts` - **REMOVED**: Public checkout API

### Routes Eliminated
- `/club/[businessId]` - **REMOVED**: Public browsable membership pages
- Any public routes exposing business or tier data

---

## ✅ **NEW: Private, Invite-Only System**

### 1. **Enhanced Database Schema with RLS**
**File**: `supabase/migrations/20230626000000_private_customer_access.sql`

#### New Tables Created:
```sql
-- Private invitation system
customer_invitations (
  token VARCHAR UNIQUE,           -- Secure invitation token
  business_id UUID,               -- Scoped to specific business
  email VARCHAR,                  -- Invited customer email
  tier_id UUID,                   -- Optional suggested tier
  status VARCHAR,                 -- pending/used/expired
  expires_at TIMESTAMPTZ          -- Time-limited access
)

-- Customer profiles (business-scoped)
customer_profiles (
  id UUID,                        -- Links to auth.users
  business_id UUID,               -- Enforces business isolation
  email VARCHAR,
  first_name, last_name, phone
)

-- Enhanced customer memberships
customer_memberships (
  customer_user_id UUID,          -- Links to customer profile
  business_id UUID,               -- Enforces business scoping
  tier_id UUID,
  stripe_subscription_id VARCHAR,
  invitation_token VARCHAR        -- Tracks invitation source
)
```

#### Row-Level Security (RLS) Policies:
- **Businesses**: Only admin can access their own business
- **Membership Tiers**: Only show tiers from customer's business
- **Customer Memberships**: Only customer's own membership data
- **Customer Profiles**: Only own profile + business admin can view

### 2. **Private Customer Registration Flow**
**Files**: 
- `src/pages/customer/PrivateRegistration.tsx`
- `api/validate-customer-invitation.ts`
- `api/create-private-customer-checkout.ts`

#### Process:
1. **Token Validation**: Secure token with expiration checking
2. **Account Creation**: Supabase Auth registration with business scoping
3. **Tier Selection**: Choose from business-specific tiers only
4. **Private Checkout**: Stripe session with invitation metadata
5. **Access Grant**: Customer profile linked to specific business

#### Route: `/join/[token]`
- **Access**: Token-based (7-day expiry)
- **Scope**: Limited to invited email + specific business
- **Auth**: Creates customer account scoped to business_id

### 3. **Scoped Customer Dashboard**
**File**: `src/pages/customer/ScopedCustomerDashboard.tsx`

#### Features:
- **Business-Scoped Data**: Only shows data from customer's business
- **RLS Enforcement**: Database queries automatically filtered
- **No Cross-Business Access**: Impossible to view other businesses' data
- **Membership Status**: Shows tier, billing, and business contact info

#### Route: `/customer/dashboard`
- **Access**: Auth-protected (Supabase Auth)
- **Scope**: Only customer's own business data
- **Isolation**: Complete data separation between businesses

### 4. **Admin Customer Invitation System**
**File**: `src/pages/admin/CustomerInvitations.tsx`

#### Features:
- **Business Selection**: Admin chooses target business
- **Email Invitations**: Generate private tokens for specific customers
- **Tier Suggestions**: Optional pre-selected tier
- **Secure Links**: Time-limited tokens with business scoping

#### Route: `/admin/customer-invitations`
- **Access**: Admin-only
- **Function**: Generate private invitation links
- **Security**: Each token scoped to specific business + email

---

## 🔐 **Security Model Enforced**

### 1. **No Public Routes**
- ✅ All customer access requires authentication
- ✅ All data queries filtered by business_id
- ✅ No browsable business directories
- ✅ No public membership pages

### 2. **Row-Level Security (RLS)**
```sql
-- Example: Customers can only see their business data
CREATE POLICY "Customers view own business tiers" ON membership_tiers
  FOR SELECT USING (
    business_id IN (
      SELECT business_id FROM customer_profiles 
      WHERE id = auth.uid()
    )
  );
```

### 3. **API Endpoint Scoping**
- All customer APIs check user's business_id
- Invitation APIs validate business admin permissions
- Webhook handlers enforce business isolation
- No cross-business data leakage possible

### 4. **Invitation Token Security**
- Cryptographically secure tokens (UUID)
- Time-limited (7-day expiration)
- Single-use (marked as 'used' after registration)
- Email-scoped (only invited email can use)
- Business-scoped (only works for specific business)

---

## 🔄 **User Flow: Complete Privacy**

### Business Onboarding (Unchanged)
1. Admin generates business onboarding link
2. Business pays via Stripe and sets up profile
3. Business receives private ecosystem

### Customer Registration (NEW - Private Only)
1. **Business Admin**: Generates private invitation link for specific customer
2. **Customer**: Receives private link via email (e.g., `/join/abc123-xyz789`)
3. **Customer**: Clicks link, creates account, selects tier, pays via Stripe
4. **Customer**: Gets access to private dashboard scoped only to that business
5. **Isolation**: Customer cannot see any other business data

### Customer Experience (NEW - Scoped)
1. **Login**: Standard Supabase Auth
2. **Dashboard**: Shows only their business's wine club data
3. **Data Access**: RLS ensures business_id filtering on all queries
4. **No Cross-Access**: Impossible to view other businesses' information

---

## 📁 **Files Modified/Created**

### New Files Created:
```
supabase/migrations/20230626000000_private_customer_access.sql
api/generate-customer-invitation.ts
api/validate-customer-invitation.ts  
api/create-private-customer-checkout.ts
src/pages/customer/PrivateRegistration.tsx
src/pages/customer/ScopedCustomerDashboard.tsx
src/pages/admin/CustomerInvitations.tsx
```

### Files Modified:
```
src/types/supabase.ts                    # Added new table types
src/App.tsx                              # Updated routes
src/routes/AdminRoutes.tsx               # Added customer invitation route
src/layouts/AdminLayout.tsx              # Updated navigation
api/webhook/stripe.ts                    # Enhanced webhook handling
```

### Files Removed:
```
src/pages/club/BusinessMembership.tsx    # Public membership page
api/business/[businessId]/membership.ts  # Public business API
api/create-customer-checkout.ts          # Public checkout API
```

---

## 🎯 **Compliance with Club Cuvée Model**

### ✅ **Requirements Met:**

1. **No Public Membership Pages**
   - ❌ Removed `/club/[businessId]` and all public routes
   - ✅ Replaced with private `/join/[token]` invitation system

2. **Private, Invite-Only Customer Access**
   - ✅ `/join/[token]` requires valid invitation token
   - ✅ Token scoped to specific business + email
   - ✅ Time-limited (7-day expiry)
   - ✅ Single-use tokens

3. **Customer Authentication and Scoped Dashboard**
   - ✅ Customers log in via Supabase Auth
   - ✅ Dashboard shows only their business data
   - ✅ RLS enforces business_id filtering
   - ✅ No cross-business data access

4. **Role-Based and Relational Access**
   - ✅ All customers tied to exactly one business_id
   - ✅ All queries filtered by business relationship
   - ✅ Complete data isolation between businesses
   - ✅ Admin can manage invitations for all businesses

---

## 🚀 **Deployment Requirements**

### Database Migration:
```sql
-- Run the new migration
supabase migration up 20230626000000_private_customer_access
```

### Environment Variables (Unchanged):
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Webhook Configuration:
- Update Stripe webhook to handle `invitation_token` metadata
- Webhook processes private customer registrations
- Marks invitations as 'used' after successful payment

---

## 🎉 **Result: Complete Privacy Enforcement**

The revised architecture **completely eliminates** any possibility of:
- Public browsing of businesses or membership tiers
- Cross-business data access by customers
- Unauthorized access to business information
- Data leakage between different wine club ecosystems

Each business now operates as a **completely isolated ecosystem** where:
- Only invited customers can register
- Only authenticated customers can access data
- Only business-scoped data is ever visible
- Admin maintains oversight across all businesses

**The Club Cuvée vision is now fully implemented**: A private, hospitality-branded membership portal where each restaurant gets their own secure ecosystem with complete customer isolation.

---

*Architecture revised and documented by Claude Code assistant*
*All public access violations eliminated ✅*
*Complete business isolation enforced ✅*