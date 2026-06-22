import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'free' | 'basic' | 'pro' | 'premium'
          status: 'active' | 'cancelled' | 'expired'
          razorpay_subscription_id: string | null
          start_date: string
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'free' | 'basic' | 'pro' | 'premium'
          status: 'active' | 'cancelled' | 'expired'
          razorpay_subscription_id?: string | null
          start_date?: string
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'free' | 'basic' | 'pro' | 'premium'
          status?: 'active' | 'cancelled' | 'expired'
          razorpay_subscription_id?: string | null
          start_date?: string
          end_date?: string | null
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          model: string | null
          tokens: number | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          model?: string | null
          tokens?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          model?: string | null
          tokens?: number | null
          created_at?: string
        }
      }
      usage: {
        Row: {
          id: string
          user_id: string
          date: string
          message_count: number
          tokens_used: number
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          message_count?: number
          tokens_used?: number
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          message_count?: number
          tokens_used?: number
        }
      }
    }
  }
}
