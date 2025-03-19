import { createClient } from '@supabase/supabase-js'
import { Group, Conversation } from '@/types/inbox'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getGroups(): Promise<Group[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('name')

  if (error) {
    throw new Error('Erro ao buscar grupos')
  }

  return data
}

export async function getConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) {
    throw new Error('Erro ao buscar conversas')
  }

  return data
}

export async function moveToGroup(conversationId: string, groupId: string): Promise<void> {
  const { error } = await supabase
    .from('conversations')
    .update({ groupId })
    .eq('id', conversationId)

  if (error) {
    throw new Error('Erro ao mover conversa para grupo')
  }
} 