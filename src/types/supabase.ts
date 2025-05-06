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