import { z } from 'zod';
import { emailService } from '../../services/email';
import { EmailConfig, EmailTemplate } from '../../services/email/types';

/**
 * Schema for email configuration
 */
export const emailConfigSchema = z.object({
  id: z.string().optional(),
  smtp_host: z.string().min(1, 'SMTP host is required'),
  smtp_port: z.number().int().min(1, 'SMTP port is required'),
  smtp_user: z.string().min(1, 'SMTP username is required'),
  smtp_password: z.string().optional(),
  from_email: z.string().email('Valid email is required'),
  from_name: z.string().min(1, 'From name is required'),
  is_default: z.boolean().default(true)
});

/**
 * Schema for email template
 */
export const emailTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body_html: z.string().min(1, 'HTML content is required'),
  body_text: z.string().optional(),
  variables: z.array(z.string()).default([]),
  is_active: z.boolean().default(true)
});

/**
 * Schema for sending an email
 */
export const sendEmailSchema = z.object({
  to: z.string().email('Valid recipient email is required'),
  subject: z.string().min(1, 'Subject is required').optional(),
  html: z.string().optional(),
  text: z.string().optional(),
  templateId: z.string().optional(),
  variables: z.record(z.string()).optional()
}).refine(data => {
  // Either templateId or (subject and html) must be provided
  return (data.templateId !== undefined) || (data.subject !== undefined && data.html !== undefined);
}, {
  message: 'Either template ID or subject and HTML content must be provided',
  path: ['templateId']
});

/**
 * Get default email configuration
 */
export async function getEmailConfig() {
  try {
    const config = await emailService.getDefaultConfig();
    return { success: true, data: config };
  } catch (error) {
    console.error('Error fetching email config:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch email configuration' 
    };
  }
}

/**
 * Update email configuration
 */
export async function updateEmailConfig(data: z.infer<typeof emailConfigSchema>) {
  try {
    const validatedData = emailConfigSchema.parse(data);
    
    if (!validatedData.id) {
      return { 
        success: false, 
        error: 'Configuration ID is required for updates' 
      };
    }
    
    const config = await emailService.updateConfig(validatedData as EmailConfig);
    
    if (!config) {
      return { 
        success: false, 
        error: 'Failed to update email configuration' 
      };
    }
    
    return { success: true, data: config };
  } catch (error) {
    console.error('Error updating email config:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Validation error', 
        validationErrors: error.errors 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update email configuration' 
    };
  }
}

/**
 * Get all email templates
 */
export async function getEmailTemplates() {
  try {
    const templates = await emailService.getTemplates();
    return { success: true, data: templates };
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch email templates' 
    };
  }
}

/**
 * Get a specific email template
 */
export async function getEmailTemplate(id: string) {
  try {
    const template = await emailService.getTemplate(id);
    
    if (!template) {
      return { 
        success: false, 
        error: 'Email template not found' 
      };
    }
    
    return { success: true, data: template };
  } catch (error) {
    console.error('Error fetching email template:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch email template' 
    };
  }
}

/**
 * Create a new email template
 */
export async function createEmailTemplate(data: z.infer<typeof emailTemplateSchema>) {
  try {
    const validatedData = emailTemplateSchema.parse(data);
    
    const template = await emailService.createTemplate(validatedData);
    
    if (!template) {
      return { 
        success: false, 
        error: 'Failed to create email template' 
      };
    }
    
    return { success: true, data: template };
  } catch (error) {
    console.error('Error creating email template:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Validation error', 
        validationErrors: error.errors 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create email template' 
    };
  }
}

/**
 * Update an existing email template
 */
export async function updateEmailTemplate(data: z.infer<typeof emailTemplateSchema> & { id: string }) {
  try {
    const validatedData = emailTemplateSchema.parse(data);
    
    const template = await emailService.updateTemplate({
      ...validatedData,
      id: data.id
    });
    
    if (!template) {
      return { 
        success: false, 
        error: 'Failed to update email template' 
      };
    }
    
    return { success: true, data: template };
  } catch (error) {
    console.error('Error updating email template:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Validation error', 
        validationErrors: error.errors 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update email template' 
    };
  }
}

/**
 * Send an email
 */
export async function sendEmail(data: z.infer<typeof sendEmailSchema>) {
  try {
    const validatedData = sendEmailSchema.parse(data);
    
    let result;
    
    if (validatedData.templateId) {
      // Send using template
      result = await emailService.sendWithTemplate(
        validatedData.to,
        validatedData.templateId,
        validatedData.variables || {}
      );
    } else {
      // Send direct email
      result = await emailService.sendDirect(
        validatedData.to,
        validatedData.subject!,
        validatedData.html!,
        validatedData.text
      );
    }
    
    if (!result.success) {
      return { 
        success: false, 
        error: result.error || 'Failed to send email' 
      };
    }
    
    return { success: true, data: { id: result.id } };
  } catch (error) {
    console.error('Error sending email:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Validation error', 
        validationErrors: error.errors 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}
