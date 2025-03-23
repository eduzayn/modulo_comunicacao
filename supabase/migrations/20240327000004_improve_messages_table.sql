-- Verificar e melhorar a tabela messages
DO $$
DECLARE
  table_exists BOOLEAN;
  column_exists BOOLEAN;
BEGIN
  -- Verificar se a tabela messages existe
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'messages'
  ) INTO table_exists;
  
  IF table_exists THEN
    -- Primeiro verificar se a coluna content_type já existe
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'content_type'
    ) INTO column_exists;
    
    -- Adicionar content_type primeiro se não existir
    IF NOT column_exists THEN
      ALTER TABLE messages ADD COLUMN content_type TEXT DEFAULT 'text';
    END IF;
    
    -- Verificar se outras colunas existem
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'duration'
    ) INTO column_exists;
    
    -- Adicionar colunas para arquivos e mídia se não existirem
    IF NOT column_exists THEN
      ALTER TABLE messages
        ADD COLUMN duration TEXT,
        ADD COLUMN file_name TEXT,
        ADD COLUMN file_size TEXT,
        ADD COLUMN file_type TEXT,
        ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    
    -- Verificar se a coluna status existe
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'status'
    ) INTO column_exists;
    
    -- Adicionar coluna status se não existir
    IF NOT column_exists THEN
      ALTER TABLE messages ADD COLUMN status TEXT DEFAULT 'sent';
    END IF;
    
    -- Tentar adicionar constraint somente após garantir que as colunas existem
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'content_type'
    ) INTO column_exists;
    
    IF column_exists THEN
      -- Adicionar constraint para content_type
      BEGIN
        ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_content_type_check;
        ALTER TABLE messages ADD CONSTRAINT messages_content_type_check 
          CHECK (content_type IN ('text', 'image', 'audio', 'document', 'file'));
      EXCEPTION WHEN OTHERS THEN
        -- Ignorar erro se acontecer
        RAISE NOTICE 'Erro ao adicionar constraint para content_type: %', SQLERRM;
      END;
    END IF;

    -- Verificar novamente para status
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'messages'
      AND column_name = 'status'
    ) INTO column_exists;
    
    IF column_exists THEN
      -- Adicionar constraint para status
      BEGIN
        ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_status_check;
        ALTER TABLE messages ADD CONSTRAINT messages_status_check 
          CHECK (status IN ('sent', 'delivered', 'read', 'failed'));
      EXCEPTION WHEN OTHERS THEN
        -- Ignorar erro se acontecer
        RAISE NOTICE 'Erro ao adicionar constraint para status: %', SQLERRM;
      END;
    END IF;
    
    -- Criar índices para pesquisas de mensagens
    BEGIN
      CREATE INDEX IF NOT EXISTS idx_messages_content_type ON messages(content_type);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Erro ao criar índice para content_type: %', SQLERRM;
    END;
    
    BEGIN
      CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Erro ao criar índice para status: %', SQLERRM;
    END;
  END IF;
END $$; 