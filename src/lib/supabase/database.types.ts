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
      profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          role: 'admin' | 'groomer' | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          role?: 'admin' | 'groomer' | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          role?: 'admin' | 'groomer' | null
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          guardian_name: string
          pet_name: string
          species: string | null
          weight: number | null
          memo: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_name: string
          pet_name: string
          species?: string | null
          weight?: number | null
          memo?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_name?: string
          pet_name?: string
          species?: string | null
          weight?: number | null
          memo?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          duration_hours: number
          price: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          duration_hours: number
          price?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          duration_hours?: number
          price?: number | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          service_ids: string[]
          start_time: string
          end_time: string
          color: string
          status: 'scheduled' | 'completed' | 'cancelled'
          total_price: number | null
          memo: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          service_ids: string[]
          start_time: string
          end_time: string
          color?: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          total_price?: number | null
          memo?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          service_ids?: string[]
          start_time?: string
          end_time?: string
          color?: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          total_price?: number | null
          memo?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      notification_templates: {
        Row: {
          id: string
          name: string
          template: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          template: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          template?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}