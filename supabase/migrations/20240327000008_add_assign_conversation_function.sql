-- Criar função para atribuição de conversas
DO $$
BEGIN
  -- Verificar se a função já existe
  IF NOT EXISTS (
    SELECT FROM pg_proc 
    WHERE proname = 'assign_conversation'
  ) THEN
    -- Criar a função
    CREATE OR REPLACE FUNCTION assign_conversation(conversation_id UUID)
    RETURNS UUID AS $$
    DECLARE
      assigned_user_id UUID;
      channel_id UUID;
    BEGIN
      -- Verificar se existem as tabelas necessárias
      IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'conversations'
      ) THEN
        -- Obter o canal da conversa
        SELECT conversations.channel_id INTO channel_id
        FROM conversations
        WHERE conversations.id = conversation_id;
        
        -- Verificar se existem as tabelas team_members e channel_teams
        IF EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'team_members'
        ) AND EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'channel_teams'
        ) THEN
          -- Encontrar o próximo usuário disponível (round-robin simples)
          -- Apenas se as tabelas team_members e channel_teams existirem
          SELECT user_id INTO assigned_user_id
          FROM (
            SELECT tm.user_id, COUNT(c.id) as active_conversations
            FROM team_members tm
            JOIN channel_teams ct ON tm.team_id = ct.team_id
            LEFT JOIN conversations c ON c.assigned_to = tm.user_id AND c.status = 'open'
            WHERE ct.channel_id = channel_id
            GROUP BY tm.user_id
            ORDER BY active_conversations ASC
            LIMIT 1
          ) as available_users;
        ELSE
          -- Alternativa mais simples se as tabelas não existirem
          -- Atribuir ao primeiro usuário do sistema
          SELECT id INTO assigned_user_id
          FROM auth.users
          LIMIT 1;
        END IF;
        
        -- Se encontrou um usuário, atribui a conversa
        IF assigned_user_id IS NOT NULL THEN
          UPDATE conversations
          SET assigned_to = assigned_user_id
          WHERE id = conversation_id;
          
          RETURN assigned_user_id;
        END IF;
      END IF;
      
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$; 