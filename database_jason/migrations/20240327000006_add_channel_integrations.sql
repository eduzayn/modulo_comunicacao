-- Criar tabela para integrações de canal
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'channel_integrations'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    CREATE TABLE channel_integrations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      channel_id UUID NOT NULL REFERENCES channels(id),
      provider TEXT NOT NULL,
      config JSONB NOT NULL DEFAULT '{}'::jsonb,
      credentials JSONB NOT NULL DEFAULT '{}'::jsonb,
      status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
      last_sync_at TIMESTAMP WITH TIME ZONE,
      error_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    CREATE INDEX idx_channel_integrations_channel_id ON channel_integrations(channel_id);
    CREATE INDEX idx_channel_integrations_status ON channel_integrations(status);
    
    ALTER TABLE channel_integrations ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Allow all for authenticated users" ON channel_integrations
      FOR ALL
      USING (auth.role() = 'authenticated');
      
    -- Usar a função update_modified_column() em vez de moddatetime()
    CREATE TRIGGER update_channel_integrations_modtime
      BEFORE UPDATE ON channel_integrations
      FOR EACH ROW
      EXECUTE FUNCTION update_modified_column();
  END IF;
END $$; 