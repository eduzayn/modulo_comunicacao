-- Tabela de Configurações de IA
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'ai_settings'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    CREATE TABLE ai_settings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      model TEXT NOT NULL DEFAULT 'gpt-3.5-turbo',
      temperature FLOAT NOT NULL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 1),
      max_tokens INTEGER NOT NULL DEFAULT 2000,
      auto_respond BOOLEAN NOT NULL DEFAULT false,
      sentiment_analysis BOOLEAN NOT NULL DEFAULT false,
      suggest_responses BOOLEAN NOT NULL DEFAULT true,
      user_id UUID REFERENCES auth.users(id),
      channel_id UUID REFERENCES channels(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Allow all for authenticated users" ON ai_settings
      FOR ALL
      USING (auth.role() = 'authenticated');
      
    CREATE TRIGGER update_ai_settings_modtime
      BEFORE UPDATE ON ai_settings
      FOR EACH ROW
      EXECUTE FUNCTION moddatetime(updated_at);
  ELSE
    -- Verificar e adicionar colunas necessárias
    BEGIN
      ALTER TABLE ai_settings 
        ADD COLUMN IF NOT EXISTS sentiment_analysis BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS suggest_responses BOOLEAN NOT NULL DEFAULT true,
        ADD COLUMN IF NOT EXISTS channel_id UUID REFERENCES channels(id);
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
  END IF;
END $$; 