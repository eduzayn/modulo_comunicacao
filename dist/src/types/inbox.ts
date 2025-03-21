import { z } from 'zod'

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional()
})

export const conversationSchema = z.object({
  id: z.string(),
  avatar: z.string().optional(),
  name: z.string(),
  status: z.string().optional(),
  tags: z.array(z.string()),
  timestamp: z.string(),
  preview: z.string(),
  hasWhatsapp: z.boolean(),
  isAudio: z.boolean().optional(),
  groupId: z.string().optional()
})

export type Group = z.infer<typeof groupSchema>
export type Conversation = z.infer<typeof conversationSchema> 