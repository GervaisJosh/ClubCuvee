
You are a Supabase specialist for Club Cuvée. Always read .context/supabase-schema.md first.

## Expertise
- PostgreSQL schema design
- RLS policy implementation
- Supabase Auth flows
- Storage configuration
- Real-time features

## Key Tables
- businesses (multi-tenant core)
- customers (business customers)
- wines (inventory)
- membership_tiers (subscription products)
- orders (transactions)

## RLS Patterns
`# Club Cuvée Database Schema & Storage Configuration
Last Updated: December 2024

## 📊 Database Tables

### Core Business Tables

#### businesses
Multi-tenant core table for wine businesses
```sql
- id: uuid (PRIMARY KEY)
- owner_id: uuid (FK → auth.users)
- name: text (UNIQUE)
- slug: text (UNIQUE) 
- email: text
- stripe_customer_id: text
- stripe_account_id: text (Stripe Connect account)
- stripe_subscription_id: text
- pricing_tier_id: uuid (FK → business_pricing_tiers)
- status: text ('invited', 'active', 'suspended')
- logo_url: text
- business_address: text
- city: text
- state: text
- zip_code: text
- phone: text
- website: text
- description: text
- created_at: timestamp with time zone (DEFAULT NOW())
- updated_at: timestamp with time zone
```

**RLS Policies:**
- `Public can view active businesses by slug` - Public SELECT where status='active' AND slug IS NOT NULL
- `businesses_owner_select` - Owners can SELECT their own business
- `businesses_owner_update` - Owners can UPDATE their own business

#### business_users
Links auth users to businesses with roles
```sql
- id: uuid (PRIMARY KEY)
- business_id: uuid (FK → businesses)
- auth_id: uuid (FK → auth.users)
- user_id: uuid (legacy column)
- role: text ('owner', 'manager', 'staff')
- created_at: timestamp with time zone (DEFAULT NOW())
```

**RLS Policies:**
- `business_users_self_select` - Users can SELECT where auth_id = auth.uid()

#### business_pricing_tiers
Platform subscription tiers for businesses
```sql
- id: uuid (PRIMARY KEY)
- name: text
- monthly_price_cents: integer
- stripe_product_id: text
- stripe_price_id: text
- features: jsonb
- is_active: boolean (DEFAULT true)
- description: text
- created_at: timestamp with time zone (DEFAULT NOW())
```

**RLS Policies:**
- `Anyone can view active business pricing tiers` - Public SELECT where is_active = true
- `Only admins can manage business pricing tiers` - Admin users have ALL permissions

### Customer Tables

#### customers
Business customers/members
```sql
- id: uuid (PRIMARY KEY)
- auth_id: uuid (FK → auth.users)
- business_id: uuid (FK → businesses)
- email: text
- first_name: text
- last_name: text
- phone: text
- address: text
- city: text
- state: text
- zip_code: text
- stripe_customer_id: text
- membership_tier_id: uuid (FK → membership_tiers)
- status: text ('active', 'paused', 'cancelled')
- created_at: timestamp with time zone (DEFAULT NOW())
- updated_at: timestamp with time zone
```

**RLS Policies:**
- `customers_self_select` - Customers can SELECT their own record
- `customers_self_update` - Customers can UPDATE their own record

#### customers_old
Legacy customer table (deprecated, for data migration)

### Wine & Inventory Tables

#### wine_inventory
Wine catalog and stock levels
```sql
- id: uuid (PRIMARY KEY)
- business_id: uuid (FK → businesses)
- name: text
- producer: text
- vintage: integer
- varietal: text
- region: text
- country: text
- price_cents: integer
- cost_cents: integer
- inventory_count: integer
- description: text
- tasting_notes: text
- image_url: text
- metadata: jsonb
- embedding: vector(1536) (for ML recommendations)
- created_at: timestamp with time zone (DEFAULT NOW())
- updated_at: timestamp with time zone
```

#### wine_ratings_reviews
Customer ratings and reviews
```sql
- id: uuid (PRIMARY KEY)
- customer_id: uuid (FK → customers)
- wine_id: uuid (FK → wine_inventory)
- rating: integer (1-5)
- review: text
- created_at: timestamp with time zone (DEFAULT NOW())
```

**RLS Policies:**
- `Allow read access for all` - Public can SELECT all reviews

### Order & Transaction Tables

#### orders
Customer orders
```sql
- id: uuid (PRIMARY KEY)
- customer_id: uuid (FK → customers)
- business_id: uuid (FK → businesses)
- status: text ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
- total_cents: integer
- stripe_payment_intent_id: text
- shipping_address: jsonb
- notes: text
- created_at: timestamp with time zone (DEFAULT NOW())
- updated_at: timestamp with time zone
```

#### order_wines
Order line items (junction table)
```sql
- id: uuid (PRIMARY KEY)
- order_id: uuid (FK → orders)
- wine_id: uuid (FK → wine_inventory)
- quantity: integer
- price_cents: integer (price at time of order)
```

#### invoices_transactions
Financial transaction records
```sql
- id: uuid (PRIMARY KEY)
- business_id: uuid (FK → businesses)
- type: text ('invoice', 'payment', 'refund')
- amount_cents: integer
- stripe_reference: text
- metadata: jsonb
- created_at: timestamp with time zone (DEFAULT NOW())
```

### Membership & Subscription Tables

#### membership_tiers
Business-specific membership tiers
```sql
- id: uuid (PRIMARY KEY)
- business_id: uuid (FK → businesses)
- name: text
- description: text
- price_cents: integer
- stripe_product_id: text
- stripe_price_id: text
- image_url: text
- benefits: jsonb
- is_active: boolean (DEFAULT true)
- created_at: timestamp with time zone (DEFAULT NOW())
```

**RLS Policies:**
- `tiers_public_read` - Public can SELECT where is_active = true

#### subscription_payments
Recurring payment records
```sql
- id: uuid (PRIMARY KEY)
- customer_id: uuid (FK → customers)
- membership_tier_id: uuid (FK → membership_tiers)
- amount_cents: integer
- status: text ('pending', 'completed', 'failed')
- stripe_invoice_id: text
- period_start: timestamp with time zone
- period_end: timestamp with time zone
- created_at: timestamp with time zone (DEFAULT NOW())
```

### Invitation Tables

#### business_invites
Platform invitations for new businesses
```sql
- id: uuid (PRIMARY KEY)
- email: text
- token: text (UNIQUE)
- business_name: text
- pricing_tier_id: uuid (FK → business_pricing_tiers)
- status: text ('pending', 'accepted', 'expired')
- expires_at: timestamp with time zone
- created_by: uuid (FK → auth.users)
- created_at: timestamp with time zone (DEFAULT NOW())
```

**RLS Policies:**
- `Admins can manage invites` - Admin users have ALL permissions
- `Public can validate tokens` - Public can SELECT all records
- `Only admins can create business invites` - INSERT restricted to admins

#### restaurant_invitations
Legacy invitation table (being phased out)
```sql
- id: uuid (PRIMARY KEY)
- business_id: uuid (FK → businesses)
- email: text
- token: text (UNIQUE)
- pricing_tier_id: uuid (FK → business_pricing_tiers)
- status: text ('pending', 'accepted', 'expired')
- expires_at: timestamp with time zone
- created_at: timestamp with time zone (DEFAULT NOW())
```

**RLS Policies:**
- `Only admins can manage restaurant invitations` - Admin users have ALL permissions

#### customer_invitations
Private invite links for customers
```sql
- id: uuid (PRIMARY KEY)
- business_id: uuid (FK → businesses)
- membership_tier_id: uuid (FK → membership_tiers)
- token: text (UNIQUE)
- max_uses: integer
- current_uses: integer (DEFAULT 0)
- expires_at: timestamp with time zone
- created_at: timestamp with time zone (DEFAULT NOW())
```

### Analytics & ML Tables

#### events
Event tracking for analytics
```sql
- id: uuid (PRIMARY KEY)
- business_id: uuid (FK → businesses)
- customer_id: uuid (FK → customers)
- event_type: text
- event_data: jsonb
- created_at: timestamp with time zone (DEFAULT NOW())
```

#### recommendation_batches
ML recommendation processing
```sql
- id: uuid (PRIMARY KEY)
- business_id: uuid (FK → businesses)
- status: text ('pending', 'processing', 'completed', 'failed')
- metadata: jsonb
- created_at: timestamp with time zone (DEFAULT NOW())
- completed_at: timestamp with time zone
```

#### user_recommendations
Personalized wine recommendations
```sql
- id: uuid (PRIMARY KEY)
- customer_id: uuid (FK → customers)
- wine_id: uuid (FK → wine_inventory)
- score: float
- reason: text
- batch_id: uuid (FK → recommendation_batches)
- created_at: timestamp with time zone (DEFAULT NOW())
```

### System Tables

#### users
Extended user profiles
```sql
- id: uuid (PRIMARY KEY)
- auth_id: uuid (FK → auth.users)
- email: text
- first_name: text
- last_name: text
- is_admin: boolean (DEFAULT false)
- restaurant_id: uuid (legacy column)
- local_id: uuid (legacy column)
- created_at: timestamp with time zone (DEFAULT NOW())
- updated_at: timestamp with time zone
```

**RLS Policies:**
- `Admins can manage everything` - Admin users have ALL permissions

#### api_keys
API key management
```sql
- id: uuid (PRIMARY KEY)
- restaurant_id: uuid (legacy, use business_id)
- key_hash: text
- name: text
- permissions: jsonb
- last_used_at: timestamp with time zone
- created_at: timestamp with time zone (DEFAULT NOW())
```

**RLS Policies:**
- Owner-based access control for all operations

#### restaurants
Legacy table (being migrated to businesses)
```sql
- id: uuid (PRIMARY KEY)
- name: text
- slug: text
- Various legacy columns...
```

**RLS Policies:**
- `Allow restaurant admins to access their own restaurant` - Based on user metadata

#### payment_tracking
Stripe webhook event tracking
```sql
- id: uuid (PRIMARY KEY)
- stripe_event_id: text (UNIQUE)
- event_type: text
- processed: boolean (DEFAULT false)
- error: text
- created_at: timestamp with time zone (DEFAULT NOW())
```

## 🗄️ Storage Buckets

### wine-labels
**Purpose:** Wine bottle images and labels
**Structure:**
```
/wine-labels/
  └── {business_id}/
      └── {wine_id}/
          └── {filename}
```

**Policies:**
- `Allow public uploads` - INSERT for all
- `Public Read Access` - SELECT for all with public URL pattern

### business-assets
**Purpose:** Business logos, tier images, marketing materials
**Structure:**
```
/business-assets/
  └── businesses/
      └── {business_id}/
          ├── logo/
          │   └── {filename}
          └── tiers/
              └── {tier_id}/
                  └── {filename}
```

**Policies:**
- `Authenticated users can upload` - INSERT for authenticated users
- `Business owners can upload to their folders` - INSERT for business owners
- `Public can view business assets` - SELECT for all
- `Public read access to business assets` - SELECT for all
- `Service role full access` - ALL operations for service role
- `Users can delete own files` - DELETE for file owners
- `Users can update own files` - UPDATE for file owners

## 🔐 Key RLS Patterns

### Business Isolation Pattern
Most tables use business isolation to ensure data privacy:
```sql
CREATE POLICY "business_isolation" ON table_name
FOR ALL USING (
  business_id IN (
    SELECT business_id FROM business_users 
    WHERE auth_id = auth.uid()
  )
);
```

### Self-Access Pattern
For user-specific data:
```sql
CREATE POLICY "users_can_access_own_data" ON table_name
FOR SELECT USING (auth_id = auth.uid());
```

### Admin Override Pattern
Admins can bypass restrictions:
```sql
CREATE POLICY "admins_full_access" ON table_name
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE auth_id = auth.uid() AND is_admin = true
  )
);
```

### Public Read Pattern
For public-facing data:
```sql
CREATE POLICY "public_read_active" ON table_name
FOR SELECT USING (is_active = true);
```

## 🔑 Important Notes

1. **Multi-tenancy:** The system is designed around `business_id` for data isolation
2. **Auth Integration:** Uses Supabase Auth with `auth.uid()` in RLS policies
3. **Stripe Integration:** All Stripe IDs stored for reference, webhooks tracked
4. **Legacy Migration:** Some tables (restaurants, restaurant_id) are being migrated to businesses
5. **Vector Embeddings:** `wine_inventory.embedding` used for ML-powered recommendations
6. **Service Role:** Some operations require service role key (customer creation during onboarding)

## 🚀 Common Queries

### Get business with users
```sql
SELECT b.*, 
       array_agg(
         json_build_object(
           'user_id', bu.auth_id,
           'role', bu.role
         )
       ) as users
FROM businesses b
LEFT JOIN business_users bu ON bu.business_id = b.id
WHERE b.id = $1
GROUP BY b.id;
```

### Get customer with membership
```sql
SELECT c.*, 
       mt.name as tier_name,
       mt.price_cents as tier_price
FROM customers c
LEFT JOIN membership_tiers mt ON mt.id = c.membership_tier_id
WHERE c.id = $1;
```

### Get wines with ratings
```sql
SELECT w.*,
       AVG(wrr.rating) as avg_rating,
       COUNT(wrr.id) as review_count
FROM wine_inventory w
LEFT JOIN wine_ratings_reviews wrr ON wrr.wine_id = w.id
WHERE w.business_id = $1
GROUP BY w.id;
```