-- Criar função para notificações de novas mensagens
DO $$
BEGIN
  -- Verificar se a função já existe
  IF NOT EXISTS (
    SELECT FROM pg_proc 
    WHERE proname = 'notify_new_message'
  ) THEN
    -- Criar a função
    CREATE FUNCTION notify_new_message()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Publica no canal de notificações
      PERFORM pg_notify(
        'new_message', 
        json_build_object(
          'id', NEW.id,
          'conversation_id', NEW.conversation_id,
          'content_type', NEW.content_type,
          'sender_type', COALESCE(NEW.sender_type, 'user'),
          'created_at', NEW.created_at
        )::text
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
  
  -- Verificar se o trigger existe
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'notify_new_message_trigger'
    AND tgrelid = 'messages'::regclass
  ) THEN
    -- Criar trigger apenas se a tabela messages existir
    IF EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'messages'
    ) THEN
      -- Criar trigger
      CREATE TRIGGER notify_new_message_trigger
      AFTER INSERT ON messages
      FOR EACH ROW
      EXECUTE FUNCTION notify_new_message();
    END IF;
  END IF;
END $$; 