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
      conversations: {
        Row: {
          id: string
          contact_id: string
          channel_id: string
          channel_type: string
          status: string
          assigned_to: string | null
          unread_count: number
          search_vector: unknown
          created_at: string
          updated_at: string
          last_message_at: string | null
        }
        Insert: {
          id?: string
          contact_id: string
          channel_id: string
          channel_type: string
          status: string
          assigned_to?: string | null
          unread_count?: number
          search_vector?: unknown
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
        }
        Update: {
          id?: string
          contact_id?: string
          channel_id?: string
          channel_type?: string
          status?: string
          assigned_to?: string | null
          unread_count?: number
          search_vector?: unknown
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_channel_id_fkey"
            columns: ["channel_id"]
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          sender_type: string
          content: string
          status: string
          attachments: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          sender_type: string
          content: string
          status: string
          attachments?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          sender_type?: string
          content?: string
          status?: string
          attachments?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          }
        ]
      }
      contacts: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          last_contact: string | null
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_contact?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_contact?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_tags: {
        Row: {
          id: string
          conversation_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          tag_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_tags_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      },
      channels: {
        Row: {
          id: string
          name: string
          type: string
          is_active: boolean
          created_at: string
          updated_at: string | null
          icon: string | null
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
          icon?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
          icon?: string | null
          description?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T] 