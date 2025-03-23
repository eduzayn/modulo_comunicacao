-- Create pipelines table
CREATE TABLE IF NOT EXISTS pipelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  stages TEXT[] DEFAULT '{}',
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
CREATE TRIGGER update_pipelines_updated_at
  BEFORE UPDATE ON pipelines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON pipelines
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON pipelines
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON pipelines
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default pipelines
INSERT INTO pipelines (name, description, stages, groups)
VALUES
  (
    'TUTORIA MÚSICA',
    'Funil de vendas para tutoria de música',
    ARRAY['Contato inicial', 'Apresentação', 'Proposta', 'Negociação', 'Fechamento'],
    ARRAY['Grupos']
  ),
  (
    'DIPLOMAÇÃO POR COMPETÊNCIA',
    'Funil de vendas para diplomação por competência',
    ARRAY['Lead', 'Qualificação', 'Apresentação', 'Proposta', 'Contrato'],
    ARRAY['Grupos']
  ),
  (
    'EJA',
    'Funil de vendas para EJA',
    ARRAY['Interesse', 'Avaliação', 'Matrícula'],
    ARRAY['Grupos']
  ),
  (
    'TAMIRES',
    'Funil de vendas da Tamires',
    ARRAY['Primeiro contato', 'Qualificação', 'Apresentação', 'Fechamento'],
    ARRAY['Privado']
  ),
  (
    'CAMILA',
    'Funil de vendas da Camila',
    ARRAY['Lead', 'Qualificação', 'Proposta', 'Fechamento'],
    ARRAY['Grupos']
  ),
  (
    'CLAUDINEI',
    'Funil de vendas do Claudinei',
    ARRAY['Contato', 'Avaliação', 'Proposta', 'Contrato'],
    ARRAY['Grupos']
  ),
  (
    'E-MAIL - ACOMPANHAMENTO',
    'Funil para acompanhamento de e-mails',
    ARRAY['Recebido', 'Em análise', 'Respondido', 'Concluído'],
    ARRAY['Grupos']
  ),
  (
    'ALUNOS UNICV',
    'Funil para gestão de alunos UNICV',
    ARRAY['Matrícula', 'Em curso', 'Formado'],
    ARRAY['Grupos']
  ),
  (
    'VAGA CONSULTORIA',
    'Funil para vagas de consultoria',
    ARRAY['Candidatura', 'Entrevista', 'Teste', 'Contratação'],
    ARRAY['Privado']
  ),
  (
    'NEUROPSICANALISE',
    'Funil de vendas para neuropsicanalise',
    ARRAY['Lead', 'Qualificação', 'Apresentação', 'Fechamento'],
    ARRAY['Grupos']
  ),
  (
    'PRIMEIRA GRADUAÇÃO',
    'Funil de vendas para primeira graduação',
    ARRAY['Interesse', 'Avaliação', 'Matrícula', 'Ativo'],
    ARRAY['Grupos']
  ),
  (
    'FINANCEIRO DO ALUNO',
    'Funil para gestão financeira do aluno',
    ARRAY['Em dia', 'Atrasado', 'Negociação', 'Inadimplente'],
    ARRAY['Grupos']
  ),
  (
    'COBRANÇA',
    'Funil para gestão de cobranças',
    ARRAY['Novo', 'Em contato', 'Negociação', 'Acordo', 'Pago'],
    ARRAY['Grupos']
  )
ON CONFLICT (name) DO NOTHING; 