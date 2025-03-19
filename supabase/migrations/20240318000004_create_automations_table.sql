-- Create automations table
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  event TEXT NOT NULL,
  action TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

-- Create trigger
CREATE TRIGGER update_automations_updated_at
  BEFORE UPDATE ON automations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON automations
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON automations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON automations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default automations
INSERT INTO automations (name, event, action)
VALUES
  ('Adição Funil Cobrança', 'move_group', 'add_tag'),
  ('Adição Funil Financeiro', 'move_group', 'add_tag'),
  ('Adição Funil Pós-Vendas', 'move_group', 'add_tag'),
  ('Adição Funil Secretaria Pós', 'move_group', 'add_tag'),
  ('Adição Funil Secretaria Segunda', 'move_group', 'add_tag'),
  ('Adição Funil Suporte', 'move_group', 'add_tag'),
  ('Adição Funil Tutoria', 'move_group', 'add_tag'),
  ('Atribuir/Negociação', 'move_group', 'assign_agent'),
  ('Avaliador de Atendimento', 'resolve_conversation', 'add_tag'),
  ('Transferência Bot', 'pending_time', 'move_group')
ON CONFLICT (name) DO NOTHING; 