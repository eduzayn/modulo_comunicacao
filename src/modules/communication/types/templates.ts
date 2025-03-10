import { Template } from './index';

export interface CreateTemplateInput {
  name: string;
  content: string;
  channelType: Template['channelType'];
  category?: string;
  variables?: string[];
}

export interface UpdateTemplateInput {
  name?: string;
  content?: string;
  category?: string;
  status?: Template['status'];
  variables?: string[];
}

export interface GetTemplatesInput {
  channelType?: Template['channelType'];
  category?: string;
  status?: Template['status'];
  page?: number;
  limit?: number;
}
