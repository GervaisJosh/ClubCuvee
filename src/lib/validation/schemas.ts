import { z } from 'zod';

// Restaurant Invite Schema
export const RestaurantInviteSchema = z.object({
  email: z.string().email('Invalid email format'),
  restaurant_name: z.string().min(1, 'Restaurant name is required'),
  website: z.string().url('Invalid website URL').optional(),
  admin_name: z.string().min(1, 'Admin name is required'),
  tier: z.enum(['standard', 'premium', 'enterprise']).default('standard')
});

// Checkout Session Schema
export const CheckoutSessionSchema = z.object({
  tierId: z.string().optional(),
  priceId: z.string().optional(),
  customerId: z.string().uuid('Invalid customer ID'),
  customerEmail: z.string().email('Invalid email format'),
  restaurantId: z.string().uuid('Invalid restaurant ID'),
  successUrl: z.string().url('Invalid success URL'),
  cancelUrl: z.string().url('Invalid cancel URL'),
  createPrice: z.boolean().optional(),
  tierData: z.object({
    name: z.string(),
    price: z.number().positive(),
    description: z.string()
  }).optional(),
  metadata: z.record(z.string()).optional()
}).refine(data => data.tierId || data.priceId || data.createPrice, {
  message: 'Either tierId, priceId, or createPrice must be provided'
});

// Membership Tier Schema
export const MembershipTierSchema = z.object({
  name: z.string().min(1, 'Tier name is required'),
  price: z.number().positive('Price must be positive'),
  description: z.string().min(1, 'Description is required'),
  stripe_product_id: z.string().optional(),
  stripe_price_id: z.string().optional()
});

// Restaurant Form Schema
export const RestaurantFormSchema = z.object({
  restaurantName: z.string().min(1, 'Restaurant name is required'),
  adminName: z.string().min(1, 'Admin name is required'),
  email: z.string().email('Invalid email format'),
  website: z.string().url('Invalid website URL').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  logo: z.any().optional(),
  tier: z.enum(['standard', 'premium', 'enterprise']).default('standard')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
}); 