-- Tabela de Automações
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'automations'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    CREATE TABLE automations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      trigger JSONB NOT NULL DEFAULT '{"type":"manual","conditions":[]}',
      actions JSONB NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      created_by UUID REFERENCES auth.users(id)
    );
    
    CREATE INDEX idx_automations_status ON automations(status);
    
    ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Allow all for authenticated users" ON automations
      FOR ALL
      USING (auth.role() = 'authenticated');
      
    CREATE TRIGGER update_automations_modtime
      BEFORE UPDATE ON automations
      FOR EACH ROW
      EXECUTE FUNCTION moddatetime(updated_at);
  END IF;
END $$; 