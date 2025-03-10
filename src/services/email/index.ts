import { supabaseAdmin } from '@/lib/supabase';
import { EmailTemplate, EmailConfig } from './types';

/**
 * Email service for sending emails through Supabase
 */
export const emailService = {
  /**
   * Get the default email configuration
   */
  async getDefaultConfig(): Promise<EmailConfig | null> {
    const { data, error } = await supabaseAdmin
      .from('email_config')
      .select('*')
      .eq('is_default', true)
      .single();

    if (error) {
      console.error('Error fetching email config:', error);
      return null;
    }

    return data as EmailConfig;
  },

  /**
   * Update email configuration
   */
  async updateConfig(config: Partial<EmailConfig> & { id: string }): Promise<EmailConfig | null> {
    const { data, error } = await supabaseAdmin
      .from('email_config')
      .update({
        smtp_host: config.smtp_host,
        smtp_port: config.smtp_port,
        smtp_user: config.smtp_user,
        smtp_password: config.smtp_password,
        from_email: config.from_email,
        from_name: config.from_name,
        is_default: config.is_default,
      })
      .eq('id', config.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating email config:', error);
      return null;
    }

    return data as EmailConfig;
  },

  /**
   * Get all email templates
   */
  async getTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }

    return data as EmailTemplate[];
  },

  /**
   * Get a specific email template
   */
  async getTemplate(id: string): Promise<EmailTemplate | null> {
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching email template:', error);
      return null;
    }

    return data as EmailTemplate;
  },

  /**
   * Create a new email template
   */
  async createTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate | null> {
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .insert({
        name: template.name,
        subject: template.subject,
        body_html: template.body_html,
        body_text: template.body_text,
        variables: template.variables,
        is_active: template.is_active,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating email template:', error);
      return null;
    }

    return data as EmailTemplate;
  },

  /**
   * Update an existing email template
   */
  async updateTemplate(template: Partial<EmailTemplate> & { id: string }): Promise<EmailTemplate | null> {
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .update({
        name: template.name,
        subject: template.subject,
        body_html: template.body_html,
        body_text: template.body_text,
        variables: template.variables,
        is_active: template.is_active,
      })
      .eq('id', template.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating email template:', error);
      return null;
    }

    return data as EmailTemplate;
  },

  /**
   * Send an email using a template
   */
  async sendWithTemplate(
    toEmail: string,
    templateId: string,
    variables: Record<string, string>
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { data, error } = await supabaseAdmin.rpc(
        'send_email_template',
        {
          to_email: toEmail,
          template_id: templateId,
          variables: variables
        }
      );

      if (error) {
        console.error('Error sending email with template:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data };
    } catch (error) {
      console.error('Exception sending email with template:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  /**
   * Send a direct email without a template
   */
  async sendDirect(
    toEmail: string,
    subject: string,
    bodyHtml: string,
    bodyText?: string
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { data, error } = await supabaseAdmin.rpc(
        'send_email',
        {
          to_email: toEmail,
          subject: subject,
          body_html: bodyHtml,
          body_text: bodyText || null,
          template_id: null
        }
      );

      if (error) {
        console.error('Error sending direct email:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data };
    } catch (error) {
      console.error('Exception sending direct email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  /**
   * Get email logs
   */
  async getLogs(limit = 50, offset = 0): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('email_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching email logs:', error);
      return [];
    }

    return data;
  }
};
