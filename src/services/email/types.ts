/**
 * Email configuration interface
 */
export interface EmailConfig {
  id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Email template interface
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text?: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Email log interface
 */
export interface EmailLog {
  id: string;
  email_to: string;
  email_from: string;
  subject: string;
  body_html?: string;
  body_text?: string;
  template_id?: string;
  status: 'pending' | 'sent' | 'failed';
  error_message?: string;
  sent_at: string;
  created_at: string;
}

/**
 * Email sending options
 */
export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateId?: string;
  variables?: Record<string, string>;
}
