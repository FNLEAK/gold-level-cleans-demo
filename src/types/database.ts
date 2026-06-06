export type ProfileRole = 'owner' | 'customer'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: ProfileRole
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: ProfileRole
          created_at?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          role?: ProfileRole
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string | null
          scheduled_date: string
          start_time: string | null
          service: string | null
          notes: string | null
          status: BookingStatus
          source: 'online' | 'owner'
          customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          scheduled_date: string
          start_time?: string | null
          service?: string | null
          notes?: string | null
          status?: BookingStatus
          source?: 'online' | 'owner'
          customer_id?: string | null
        }
        Update: {
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          scheduled_date?: string
          start_time?: string | null
          service?: string | null
          notes?: string | null
          status?: BookingStatus
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type BookingRow = Database['public']['Tables']['bookings']['Row']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
