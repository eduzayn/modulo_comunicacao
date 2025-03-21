/**
 * widget-settings.ts
 * 
 * Description: Service for managing widget settings in Supabase
 * 
 * @module services/supabase/widget-settings
 * @created 2024-03-20
 */
import { BaseService } from './base-service';
import { supabase } from '@/lib/supabase';
import { WidgetSettings, WidgetPosition, WidgetTextColor, WidgetTheme } from '@/app/settings/widget/types';

interface WidgetFormField {
  id?: string;
  widget_id: string;
  type: 'text' | 'email' | 'phone';
  label: string;
  required: boolean;
  position: number;
}

interface WidgetDomain {
  id?: string;
  widget_id: string;
  domain: string;
}

export class WidgetSettingsService extends BaseService {
  constructor() {
    super('communication.widget_settings');
  }

  /**
   * Get widget settings for a workspace
   * 
   * @param workspaceId - Workspace ID
   * @returns Widget settings or null if not found
   */
  async getByWorkspaceId(workspaceId: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('workspace_id', workspaceId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found for this workspace
        return null;
      }
      throw new Error(`Error fetching widget settings: ${error.message}`);
    }
    
    return data;
  }

  /**
   * Create or update widget settings
   * 
   * @param workspaceId - Workspace ID
   * @param settings - Widget settings
   * @returns Created or updated widget settings
   */
  async saveSettings(workspaceId: string, settings: Partial<WidgetSettings>) {
    // Check if settings already exist for this workspace
    const existingSettings = await this.getByWorkspaceId(workspaceId);
    
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from(this.table)
        .update({
          theme: settings.theme || existingSettings.theme,
          text_color: settings.textColor || existingSettings.text_color,
          position: settings.position || existingSettings.position,
          lateral_spacing: settings.lateralSpacing || existingSettings.lateral_spacing,
          bottom_spacing: settings.bottomSpacing || existingSettings.bottom_spacing,
          display_name: settings.displayName || existingSettings.display_name,
          off_hours_message: settings.offHoursMessage || existingSettings.off_hours_message,
          team_description: settings.teamDescription || existingSettings.team_description,
          initial_message: settings.initialMessage || existingSettings.initial_message,
          show_agent_avatars: settings.showAgentAvatars !== undefined ? settings.showAgentAvatars : existingSettings.show_agent_avatars,
          use_custom_image: settings.useCustomImage !== undefined ? settings.useCustomImage : existingSettings.use_custom_image,
          custom_image_url: settings.customImageUrl || existingSettings.custom_image_url,
          call_to_action: settings.callToAction !== undefined ? settings.callToAction : existingSettings.call_to_action,
          show_widget_on_mobile: settings.showWidgetOnMobile !== undefined ? settings.showWidgetOnMobile : existingSettings.show_widget_on_mobile,
          hide_widget_button: settings.hideWidgetButton !== undefined ? settings.hideWidgetButton : existingSettings.hide_widget_button,
          enable_sounds: settings.enableSounds !== undefined ? settings.enableSounds : existingSettings.enable_sounds,
          restrict_domain: settings.restrictDomain !== undefined ? settings.restrictDomain : existingSettings.restrict_domain,
          enable_whatsapp_balloon: settings.enableWhatsAppBalloon !== undefined ? settings.enableWhatsAppBalloon : existingSettings.enable_whatsapp_balloon,
          whatsapp_number: settings.whatsAppNumber || existingSettings.whatsapp_number,
          whatsapp_text: settings.whatsAppText || existingSettings.whatsapp_text,
          use_only_whatsapp: settings.useOnlyWhatsApp !== undefined ? settings.useOnlyWhatsApp : existingSettings.use_only_whatsapp,
          capture_form_info: settings.captureFormInfo !== undefined ? settings.captureFormInfo : existingSettings.capture_form_info,
          enable_business_hours: settings.enableBusinessHours !== undefined ? settings.enableBusinessHours : existingSettings.enable_business_hours,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error updating widget settings: ${error.message}`);
      }
      
      return this.mapToWidgetSettings(data);
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from(this.table)
        .insert({
          workspace_id: workspaceId,
          theme: settings.theme || 'blue',
          text_color: settings.textColor || 'light',
          position: settings.position || 'right',
          lateral_spacing: settings.lateralSpacing || 20,
          bottom_spacing: settings.bottomSpacing || 60,
          display_name: settings.displayName || 'Chat Support',
          off_hours_message: settings.offHoursMessage || 'We\'ll get back to you as soon as possible.',
          team_description: settings.teamDescription || '',
          initial_message: settings.initialMessage || 'How can we help you today?',
          show_agent_avatars: settings.showAgentAvatars !== undefined ? settings.showAgentAvatars : true,
          use_custom_image: settings.useCustomImage !== undefined ? settings.useCustomImage : false,
          custom_image_url: settings.customImageUrl || null,
          call_to_action: settings.callToAction !== undefined ? settings.callToAction : false,
          show_widget_on_mobile: settings.showWidgetOnMobile !== undefined ? settings.showWidgetOnMobile : true,
          hide_widget_button: settings.hideWidgetButton !== undefined ? settings.hideWidgetButton : false,
          enable_sounds: settings.enableSounds !== undefined ? settings.enableSounds : true,
          restrict_domain: settings.restrictDomain !== undefined ? settings.restrictDomain : false,
          enable_whatsapp_balloon: settings.enableWhatsAppBalloon !== undefined ? settings.enableWhatsAppBalloon : false,
          whatsapp_number: settings.whatsAppNumber || null,
          whatsapp_text: settings.whatsAppText || 'Hello, I found you through your website and I would like more information.',
          use_only_whatsapp: settings.useOnlyWhatsApp !== undefined ? settings.useOnlyWhatsApp : false,
          capture_form_info: settings.captureFormInfo !== undefined ? settings.captureFormInfo : false,
          enable_business_hours: settings.enableBusinessHours !== undefined ? settings.enableBusinessHours : false
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error creating widget settings: ${error.message}`);
      }
      
      return this.mapToWidgetSettings(data);
    }
  }

  /**
   * Save form fields
   * 
   * @param widgetId - Widget ID
   * @param fields - Form fields
   * @returns Saved form fields
   */
  async saveFormFields(widgetId: string, fields: Omit<WidgetFormField, 'widget_id' | 'position'>[]) {
    // First delete all existing fields for this widget
    const { error: deleteError } = await supabase
      .from('communication.widget_form_fields')
      .delete()
      .eq('widget_id', widgetId);
    
    if (deleteError) {
      throw new Error(`Error deleting form fields: ${deleteError.message}`);
    }
    
    // If there are no fields to add, return empty array
    if (fields.length === 0) {
      return [];
    }
    
    // Insert new fields
    const formattedFields = fields.map((field, index) => ({
      widget_id: widgetId,
      type: field.type,
      label: field.label,
      required: field.required,
      position: index
    }));
    
    const { data, error } = await supabase
      .from('communication.widget_form_fields')
      .insert(formattedFields)
      .select();
    
    if (error) {
      throw new Error(`Error creating form fields: ${error.message}`);
    }
    
    return data;
  }

  /**
   * Save domain restrictions
   * 
   * @param widgetId - Widget ID
   * @param domains - Domains
   * @returns Saved domains
   */
  async saveDomains(widgetId: string, domains: string[]) {
    // First delete all existing domains for this widget
    const { error: deleteError } = await supabase
      .from('communication.widget_domains')
      .delete()
      .eq('widget_id', widgetId);
    
    if (deleteError) {
      throw new Error(`Error deleting domains: ${deleteError.message}`);
    }
    
    // If there are no domains to add, return empty array
    if (domains.length === 0) {
      return [];
    }
    
    // Insert new domains
    const formattedDomains = domains.map(domain => ({
      widget_id: widgetId,
      domain
    }));
    
    const { data, error } = await supabase
      .from('communication.widget_domains')
      .insert(formattedDomains)
      .select();
    
    if (error) {
      throw new Error(`Error creating domains: ${error.message}`);
    }
    
    return data;
  }

  /**
   * Map database object to WidgetSettings
   * 
   * @param data - Database object
   * @returns Widget settings
   */
  private mapToWidgetSettings(data: any): WidgetSettings {
    return {
      theme: data.theme as WidgetTheme,
      textColor: data.text_color as WidgetTextColor,
      position: data.position as WidgetPosition,
      lateralSpacing: data.lateral_spacing,
      bottomSpacing: data.bottom_spacing,
      displayName: data.display_name,
      offHoursMessage: data.off_hours_message,
      teamDescription: data.team_description,
      initialMessage: data.initial_message
    };
  }
}

export default new WidgetSettingsService(); 