-- Create pipeline_cadences table
CREATE TABLE IF NOT EXISTS pipeline_cadences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  task_title TEXT NOT NULL,
  task_description TEXT,
  delay_days INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger
CREATE TRIGGER update_pipeline_cadences_updated_at
  BEFORE UPDATE ON pipeline_cadences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE pipeline_cadences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON pipeline_cadences
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON pipeline_cadences
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON pipeline_cadences
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default cadences
INSERT INTO pipeline_cadences (pipeline_id, stage, task_title, task_description, delay_days)
SELECT
  p.id,
  'Contato inicial',
  'Enviar e-mail de boas-vindas',
  'Enviar e-mail automático de boas-vindas com informações sobre o curso',
  0
FROM pipelines p
WHERE p.name = 'TUTORIA MÚSICA'
UNION ALL
SELECT
  p.id,
  'Lead',
  'Agendar apresentação',
  'Entrar em contato para agendar apresentação do curso',
  1
FROM pipelines p
WHERE p.name = 'DIPLOMAÇÃO POR COMPETÊNCIA'
UNION ALL
SELECT
  p.id,
  'Interesse',
  'Enviar material informativo',
  'Enviar PDF com informações sobre o curso EJA',
  0
FROM pipelines p
WHERE p.name = 'EJA'; 