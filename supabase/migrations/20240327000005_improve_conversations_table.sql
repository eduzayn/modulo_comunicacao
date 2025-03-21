-- Verificar e melhorar a tabela conversations
DO $$
DECLARE
  table_exists BOOLEAN;
  column_exists BOOLEAN;
BEGIN
  -- Verificar se a tabela conversations existe
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations'
  ) INTO table_exists;
  
  IF table_exists THEN
    -- Verificar se a coluna priority já existe
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'conversations'
      AND column_name = 'priority'
    ) INTO column_exists;
    
    -- Se a coluna não existir, adicioná-la
    IF NOT column_exists THEN
      ALTER TABLE conversations ADD COLUMN priority TEXT DEFAULT 'medium';
      
      -- Adicionar check constraint para priority
      ALTER TABLE conversations ADD CONSTRAINT conversations_priority_check 
        CHECK (priority IN ('low', 'medium', 'high'));
    END IF;
    
    -- Verificar se a coluna context existe
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'conversations'
      AND column_name = 'context'
    ) INTO column_exists;
    
    -- Se a coluna não existir, adicioná-la
    IF NOT column_exists THEN
      ALTER TABLE conversations ADD COLUMN context TEXT DEFAULT 'general';
      
      -- Adicionar check constraint para context
      ALTER TABLE conversations ADD CONSTRAINT conversations_context_check 
        CHECK (context IN ('academic', 'administrative', 'support', 'general'));
    END IF;
    
    -- Verificar se a coluna metadata existe
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'conversations'
      AND column_name = 'metadata'
    ) INTO column_exists;
    
    -- Se a coluna não existir, adicioná-la
    IF NOT column_exists THEN
      ALTER TABLE conversations ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
    
    -- Verificar se a coluna tags existe
    SELECT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'conversations'
      AND column_name = 'tags'
    ) INTO column_exists;
    
    -- Se a coluna não existir, adicioná-la
    IF NOT column_exists THEN
      ALTER TABLE conversations ADD COLUMN tags TEXT[] DEFAULT '{}'::text[];
    END IF;
    
    -- Criar índices para filtragens comuns
    CREATE INDEX IF NOT EXISTS idx_conversations_priority ON conversations(priority);
    CREATE INDEX IF NOT EXISTS idx_conversations_context ON conversations(context);
  END IF;
END $$; 