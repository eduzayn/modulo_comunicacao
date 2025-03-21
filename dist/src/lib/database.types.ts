/**
 * Database type definitions for Supabase
 * 
 * This file contains TypeScript type definitions for the Supabase database schema.
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
      'communication.channels': {
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
          status?: string
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
          updated_at?: string
        }
      }
      'communication.templates': {
        Row: {
          id: string
          name: string
          content: string
          type: string
          status: string
          variables: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          content: string
          type: string
          status?: string
          variables?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          content?: string
          type?: string
          status?: string
          variables?: string[]
          updated_at?: string
        }
      }
      'communication.conversations': {
        Row: {
          id: string
          title: string
          status: string
          channel_id: string
          contact_id: string
          last_message: string | null
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          status?: string
          channel_id: string
          contact_id: string
          last_message?: string | null
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          status?: string
          channel_id?: string
          contact_id?: string
          last_message?: string | null
          last_message_at?: string | null
          updated_at?: string
        }
      }
      'communication.messages': {
        Row: {
          id: string
          conversation_id: string
          content: string
          sender_type: string
          sender_id: string
          status: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          content: string
          sender_type: string
          sender_id: string
          status?: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          content?: string
          sender_type?: string
          sender_id?: string
          status?: string
          metadata?: Json | null
        }
      }
      'communication.contacts': {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          metadata?: Json | null
          updated_at?: string
        }
      }
      'communication.ai_settings': {
        Row: {
          id: string
          provider: string
          model: string
          api_key: string
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider: string
          model: string
          api_key: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider?: string
          model?: string
          api_key?: string
          settings?: Json
          updated_at?: string
        }
      }
      'communication.widget_settings': {
        Row: {
          id: string
          workspace_id: string
          theme: string
          text_color: string
          position: string
          lateral_spacing: number
          bottom_spacing: number
          display_name: string
          off_hours_message: string | null
          team_description: string | null
          initial_message: string | null
          show_agent_avatars: boolean
          use_custom_image: boolean
          custom_image_url: string | null
          call_to_action: boolean
          show_widget_on_mobile: boolean
          hide_widget_button: boolean
          enable_sounds: boolean
          restrict_domain: boolean
          allowed_domains: string[] | null
          enable_whatsapp_balloon: boolean
          whatsapp_number: string | null
          whatsapp_text: string | null
          use_only_whatsapp: boolean
          capture_form_info: boolean
          enable_business_hours: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          theme?: string
          text_color?: string
          position?: string
          lateral_spacing?: number
          bottom_spacing?: number
          display_name: string
          off_hours_message?: string | null
          team_description?: string | null
          initial_message?: string | null
          show_agent_avatars?: boolean
          use_custom_image?: boolean
          custom_image_url?: string | null
          call_to_action?: boolean
          show_widget_on_mobile?: boolean
          hide_widget_button?: boolean
          enable_sounds?: boolean
          restrict_domain?: boolean
          allowed_domains?: string[] | null
          enable_whatsapp_balloon?: boolean
          whatsapp_number?: string | null
          whatsapp_text?: string | null
          use_only_whatsapp?: boolean
          capture_form_info?: boolean
          enable_business_hours?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          theme?: string
          text_color?: string
          position?: string
          lateral_spacing?: number
          bottom_spacing?: number
          display_name?: string
          off_hours_message?: string | null
          team_description?: string | null
          initial_message?: string | null
          show_agent_avatars?: boolean
          use_custom_image?: boolean
          custom_image_url?: string | null
          call_to_action?: boolean
          show_widget_on_mobile?: boolean
          hide_widget_button?: boolean
          enable_sounds?: boolean
          restrict_domain?: boolean
          allowed_domains?: string[] | null
          enable_whatsapp_balloon?: boolean
          whatsapp_number?: string | null
          whatsapp_text?: string | null
          use_only_whatsapp?: boolean
          capture_form_info?: boolean
          enable_business_hours?: boolean
          updated_at?: string
        }
      }
      'communication.widget_form_fields': {
        Row: {
          id: string
          widget_id: string
          type: string
          label: string
          required: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          widget_id: string
          type?: string
          label: string
          required?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          widget_id?: string
          type?: string
          label?: string
          required?: boolean
          position?: number
          updated_at?: string
        }
      }
      'communication.widget_domains': {
        Row: {
          id: string
          widget_id: string
          domain: string
          created_at: string
        }
        Insert: {
          id?: string
          widget_id: string
          domain: string
          created_at?: string
        }
        Update: {
          id?: string
          widget_id?: string
          domain?: string
        }
      }
      'api_keys': {
        Row: {
          id: string
          user_id: string
          key: string
          name: string
          role: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          key?: string
          name: string
          role?: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          key?: string
          name?: string
          role?: string
          expires_at?: string | null
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
