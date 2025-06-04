export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          name: string
          email: string
          admin_user_id: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          admin_user_id?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          admin_user_id?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      onboarding_tokens: {
        Row: {
          id: string
          token: string
          email: string
          stripe_price_id: string
          business_id: string | null
          status: string
          stripe_session_id: string | null
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          token: string
          email: string
          stripe_price_id: string
          business_id?: string | null
          status?: string
          stripe_session_id?: string | null
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          token?: string
          email?: string
          stripe_price_id?: string
          business_id?: string | null
          status?: string
          stripe_session_id?: string | null
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      membership_tiers: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          price_markup_percentage: number | null
          stripe_product_id: string | null
          stripe_price_id: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          price_markup_percentage?: number | null
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          price_markup_percentage?: number | null
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          business_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          stripe_price_id: string
          status: string
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          stripe_price_id: string
          status: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          stripe_price_id?: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customer_memberships: {
        Row: {
          id: string
          customer_user_id: string | null
          business_id: string
          tier_id: string | null
          stripe_subscription_id: string | null
          status: string | null
          invitation_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_user_id?: string | null
          business_id: string
          tier_id?: string | null
          stripe_subscription_id?: string | null
          status?: string | null
          invitation_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_user_id?: string | null
          business_id?: string
          tier_id?: string | null
          stripe_subscription_id?: string | null
          status?: string | null
          invitation_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customer_invitations: {
        Row: {
          id: string
          token: string
          business_id: string
          email: string
          tier_id: string | null
          status: string
          expires_at: string
          created_at: string
          updated_at: string
          used_at: string | null
          customer_user_id: string | null
        }
        Insert: {
          id?: string
          token: string
          business_id: string
          email: string
          tier_id?: string | null
          status?: string
          expires_at: string
          created_at?: string
          updated_at?: string
          used_at?: string | null
          customer_user_id?: string | null
        }
        Update: {
          id?: string
          token?: string
          business_id?: string
          email?: string
          tier_id?: string | null
          status?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
          used_at?: string | null
          customer_user_id?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          wine_tier: number | null
          first_name: string | null
          last_name: string | null
          preferences: Json | null
          is_admin: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          wine_tier?: number | null
          first_name?: string | null
          last_name?: string | null
          preferences?: Json | null
          is_admin?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          wine_tier?: number | null
          first_name?: string | null
          last_name?: string | null
          preferences?: Json | null
          is_admin?: boolean | null
          created_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          payment_session_id: string | null
          payment_completed: boolean
          payment_date: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          name: string
          payment_session_id?: string | null
          payment_completed?: boolean
          payment_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          payment_session_id?: string | null
          payment_completed?: boolean
          payment_date?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          subscription_start_date: string | null
          current_period_end: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_start_date?: string | null
          current_period_end?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_start_date?: string | null
          current_period_end?: string | null
        }
      }
      restaurant_invitations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          token: string
          status: string
          payment_session_id: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          token: string
          status?: string
          payment_session_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          token?: string
          status?: string
          payment_session_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 