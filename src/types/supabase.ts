/**
 * supabase.ts
 * 
 * Definições de tipos para o esquema do banco de dados Supabase.
 * Este arquivo deve ser mantido sincronizado com o esquema atual do banco.
 */

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
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          last_sign_in: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          last_sign_in?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          last_sign_in?: string | null
          is_active?: boolean
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          subject: string
          content: string
          sender_id: string
          recipient_ids: string[]
          is_read: boolean
          status: string
          priority: string
          tags: string[] | null
          attachments: Json[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          subject: string
          content: string
          sender_id: string
          recipient_ids: string[]
          is_read?: boolean
          status?: string
          priority?: string
          tags?: string[] | null
          attachments?: Json[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          subject?: string
          content?: string
          sender_id?: string
          recipient_ids?: string[]
          is_read?: boolean
          status?: string
          priority?: string
          tags?: string[] | null
          attachments?: Json[] | null
        }
      }
      contacts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          full_name: string
          email: string
          phone: string | null
          company: string | null
          position: string | null
          address: string | null
          notes: string | null
          tags: string[] | null
          is_favorite: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          full_name: string
          email: string
          phone?: string | null
          company?: string | null
          position?: string | null
          address?: string | null
          notes?: string | null
          tags?: string[] | null
          is_favorite?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string | null
          company?: string | null
          position?: string | null
          address?: string | null
          notes?: string | null
          tags?: string[] | null
          is_favorite?: boolean
        }
      }
      user_activity: {
        Row: {
          id: string
          created_at: string
          user_id: string
          activity_type: string
          details: Json | null
          session_id: string | null
          ip_address: string | null
          duration_seconds: number | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          activity_type: string
          details?: Json | null
          session_id?: string | null
          ip_address?: string | null
          duration_seconds?: number | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          activity_type?: string
          details?: Json | null
          session_id?: string | null
          ip_address?: string | null
          duration_seconds?: number | null
          is_active?: boolean
        }
      }
      user_sessions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          start_time: string
          end_time: string | null
          duration_seconds: number | null
          is_active: boolean
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          start_time: string
          end_time?: string | null
          duration_seconds?: number | null
          is_active?: boolean
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          duration_seconds?: number | null
          is_active?: boolean
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      time_entries: {
        Row: {
          id: string
          created_at: string
          user_id: string
          start_time: string
          end_time: string | null
          duration_seconds: number | null
          description: string | null
          project_id: string | null
          is_billable: boolean
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          start_time: string
          end_time?: string | null
          duration_seconds?: number | null
          description?: string | null
          project_id?: string | null
          is_billable?: boolean
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          duration_seconds?: number | null
          description?: string | null
          project_id?: string | null
          is_billable?: boolean
          status?: string
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
      message_priority: 'low' | 'medium' | 'high'
      message_status: 'draft' | 'sent' | 'delivered' | 'read' | 'archived'
      time_entry_status: 'active' | 'paused' | 'completed'
      user_role: 'admin' | 'manager' | 'user' | 'guest'
    }
  }
} 