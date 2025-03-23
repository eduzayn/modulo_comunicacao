-- Create bots table
CREATE TABLE IF NOT EXISTS bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  channel TEXT NOT NULL,
  avatar TEXT,
  email TEXT,
  groups TEXT[] DEFAULT '{}',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at if not exists
DO $$
DECLARE
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $BODY$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $BODY$;
  END IF;
END $$;

-- Create trigger
CREATE TRIGGER update_bots_updated_at
  BEFORE UPDATE ON bots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON bots
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON bots
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON bots
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default bots
INSERT INTO bots (name, type, channel, groups)
VALUES
  ('SUPORTE GERAL', 'support', 'whatsapp', '{Suporte Geral}'),
  ('COBRANÇA', 'support', 'whatsapp', '{Cobrança}'),
  ('E-MAIL', 'email', 'email', '{E-mail}'),
  ('WIDGET', 'support', 'widget', '{Widget}'),
  ('BOT COMERCIAL', 'sales', 'whatsapp', '{Comercial}'),
  ('INSTAGRAM E FACEBOOK', 'social', 'instagram', '{Grupo Zayn}')
ON CONFLICT (name) DO NOTHING; 