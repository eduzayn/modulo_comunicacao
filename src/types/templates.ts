/**
 * templates.ts
 * 
 * Description: Types for templates
 * 
 * @module types/templates
 * @author Devin AI
 * @created 2025-03-12
 */

/**
 * Template status
 */
export type TemplateStatus = 'active' | 'inactive' | 'draft';

/**
 * Template channel type
 */
export type TemplateChannelType = 'email' | 'whatsapp' | 'facebook' | 'instagram' | 'sms' | 'push';

/**
 * Template interface
 */
export interface Template {
  id: string;
  name: string;
  content: string;
  channelType: TemplateChannelType;
  variables: string[];
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create template input
 */
export interface CreateTemplateInput {
  name: string;
  content: string;
  channelType: TemplateChannelType;
  variables?: string[];
  status?: TemplateStatus;
}

/**
 * Update template input
 */
export interface UpdateTemplateInput {
  name?: string;
  content?: string;
  channelType?: TemplateChannelType;
  variables?: string[];
  status?: TemplateStatus;
}
