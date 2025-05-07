export interface RestaurantInvite {
  id: string;
  token: string;
  email: string;
  restaurantName: string;
  invitedBy: string;
  website?: string;
  tier: MembershipTier;
  status: 'pending' | 'in_progress' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
}

export interface OnboardingFormData {
  restaurantName: string;
  email: string;
  membershipTier: MembershipTier;
}

export type MembershipTier = 'basic' | 'premium' | 'enterprise';

export interface MembershipTierOption {
  id: MembershipTier;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export const MEMBERSHIP_TIERS: MembershipTierOption[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small restaurants',
    price: 99,
    features: [
      'Up to 100 wine selections',
      'Basic analytics',
      'Email support',
      'Monthly reports'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For growing restaurants',
    price: 199,
    features: [
      'Up to 500 wine selections',
      'Advanced analytics',
      'Priority support',
      'Weekly reports',
      'Custom branding',
      'API access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large establishments',
    price: 499,
    features: [
      'Unlimited wine selections',
      'Enterprise analytics',
      '24/7 support',
      'Real-time reports',
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'Custom integrations'
    ]
  }
]; 