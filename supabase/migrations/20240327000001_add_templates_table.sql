-- Tabela de Templates
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'templates'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    CREATE TABLE templates (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      channel_type TEXT NOT NULL CHECK (channel_type IN ('whatsapp', 'email', 'chat', 'sms', 'push', 'facebook', 'instagram')),
      category TEXT,
      variables TEXT[] DEFAULT '{}',
      version INTEGER DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    CREATE INDEX idx_templates_channel_type ON templates(channel_type);
    CREATE INDEX idx_templates_status ON templates(status);
    
    ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Allow all for authenticated users" ON templates
      FOR ALL
      USING (auth.role() = 'authenticated');
      
    CREATE TRIGGER update_templates_modtime
      BEFORE UPDATE ON templates
      FOR EACH ROW
      EXECUTE FUNCTION moddatetime(updated_at);
  ELSE
    -- Verificar e adicionar colunas necessárias
    BEGIN
      ALTER TABLE templates 
        ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
        ADD COLUMN IF NOT EXISTS variables TEXT[] DEFAULT '{}';
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
  END IF;
END $$; 