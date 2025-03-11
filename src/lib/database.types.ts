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
      ai_settings: {
        Row: {
          id: string
          model: string
          temperature: number
          max_tokens: number
          auto_respond: boolean
          sentiment_analysis: boolean
          suggest_responses: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          model: string
          temperature: number
          max_tokens: number
          auto_respond: boolean
          sentiment_analysis: boolean
          suggest_responses: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          model?: string
          temperature?: number
          max_tokens?: number
          auto_respond?: boolean
          sentiment_analysis?: boolean
          suggest_responses?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      channels: {
        Row: {
          id: string
          name: string
          type: string
          status: string
          config: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          status: string
          config?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          status?: string
          config?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          channel_id: string
          participants: string[]
          status: string
          priority: string
          context: string
          last_message_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          participants: string[]
          status: string
          priority: string
          context: string
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          participants?: string[]
          status?: string
          priority?: string
          context?: string
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_channel_id_fkey"
            columns: ["channel_id"]
            referencedRelation: "channels"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          media_url: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          media_url?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          media_url?: string | null
          read?: boolean
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
      templates: {
        Row: {
          id: string
          name: string
          content: string
          channel_type: string
          category: string | null
          variables: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          content: string
          channel_type: string
          category?: string | null
          variables?: string[]
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          content?: string
          channel_type?: string
          category?: string | null
          variables?: string[]
          status?: string
          created_at?: string
          updated_at?: string
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
