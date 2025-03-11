import { Channel } from './index';

/**
 * @swagger
 * components:
 *   schemas:
 *     WhatsAppConfig:
 *       type: object
 *       properties:
 *         apiKey:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         webhookUrl:
 *           type: string
 *         messageTemplate:
 *           type: string
 *       required:
 *         - apiKey
 *         - phoneNumber
 *         - webhookUrl
 */
export interface WhatsAppConfig {
  apiKey: string;
  phoneNumber: string;
  webhookUrl: string;
  messageTemplate?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EmailConfig:
 *       type: object
 *       properties:
 *         smtpServer:
 *           type: string
 *         port:
 *           type: number
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         fromEmail:
 *           type: string
 *         fromName:
 *           type: string
 *       required:
 *         - smtpServer
 *         - port
 *         - username
 *         - password
 *         - fromEmail
 */
export interface EmailConfig {
  smtpServer: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SMSConfig:
 *       type: object
 *       properties:
 *         apiKey:
 *           type: string
 *         senderId:
 *           type: string
 *         webhookUrl:
 *           type: string
 *       required:
 *         - apiKey
 *         - senderId
 */
export interface SMSConfig {
  apiKey: string;
  senderId: string;
  webhookUrl: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatConfig:
 *       type: object
 *       properties:
 *         websocketUrl:
 *           type: string
 *         apiKey:
 *           type: string
 *       required:
 *         - websocketUrl
 *         - apiKey
 */
export interface ChatConfig {
  websocketUrl: string;
  apiKey: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PushConfig:
 *       type: object
 *       properties:
 *         apiKey:
 *           type: string
 *         appId:
 *           type: string
 *         projectId:
 *           type: string
 *       required:
 *         - apiKey
 *         - appId
 *         - projectId
 */
export interface PushConfig {
  apiKey: string;
  appId: string;
  projectId: string;
}

// Define as Json compatible type for database storage
export type ChannelConfig = WhatsAppConfig | EmailConfig | SMSConfig | ChatConfig | PushConfig;
export type ChannelConfigJson = Record<string, any>;

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateChannelInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [whatsapp, email, chat, sms, push]
 *         status:
 *           type: string
 *           enum: [active, inactive, maintenance]
 *         config:
 *           type: object
 *       required:
 *         - name
 *         - type
 *         - config
 */
export interface CreateChannelInput {
  name: string;
  type: Channel['type'];
  status?: Channel['status'];
  config: ChannelConfig;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateChannelInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, maintenance]
 *         config:
 *           type: object
 */
export interface UpdateChannelInput {
  name?: string;
  status?: Channel['status'];
  config?: Partial<ChannelConfig>;
}
