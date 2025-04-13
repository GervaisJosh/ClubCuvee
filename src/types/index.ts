// Types for restaurant registration and onboarding

export interface Restaurant {
  id: string;
  name: string;
  website?: string;
  logo_url?: string;
  admin_email: string;
  subscription_tier: string;
  payment_session_id?: string;
  created_at: string;
  updated_at?: string;
  registration_complete?: boolean;
}

export interface RestaurantFormData {
  restaurantName: string;
  adminName: string;
  email: string;
  website?: string;
  logo?: File | null;
  password: string;
  confirmPassword: string;
  tier?: string;
  sessionId?: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: string | number;
  description: string;
  restaurant_id?: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface CheckoutSessionData {
  priceId?: string;
  tierId?: string;
  customerId: string;
  customerEmail: string;
  restaurantId: string;
  successUrl: string;
  cancelUrl: string;
  createPrice?: boolean;
  tierData?: {
    name: string;
    description: string;
    price: number | string;
  };
}

export interface FormErrors {
  fullName?: string;
  restaurantName?: string;
  adminName?: string;
  email?: string;
  website?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
  general?: string;
}
