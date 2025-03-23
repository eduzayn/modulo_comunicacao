-- Verificar e criar extensão uuid-ossp se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Remover objetos existentes para evitar conflitos
DO $$
BEGIN
  -- Remover triggers se existirem
  DROP TRIGGER IF EXISTS update_groups_updated_at ON groups;
  DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
  
  -- Remover políticas se existirem
  DROP POLICY IF EXISTS "Enable read access for all users" ON groups;
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON groups;
  DROP POLICY IF EXISTS "Enable update for authenticated users only" ON groups;
  DROP POLICY IF EXISTS "Enable read access for all users" ON conversations;
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON conversations;
  DROP POLICY IF EXISTS "Enable update for authenticated users only" ON conversations;
  
  -- Remover função se existir
  DROP FUNCTION IF EXISTS update_updated_at_column();
EXCEPTION
  WHEN undefined_table THEN
    -- Ignora erro se as tabelas não existirem
    NULL;
END $$;

-- Criar tabela groups primeiro (sem RLS inicialmente)
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela conversations (sem RLS inicialmente)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  avatar TEXT,
  name TEXT NOT NULL,
  status TEXT,
  tags TEXT[] DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preview TEXT,
  has_whatsapp BOOLEAN DEFAULT false,
  is_audio BOOLEAN DEFAULT false,
  group_id UUID REFERENCES groups(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar colunas faltantes se necessário
DO $$
DECLARE
  column_exists boolean;
BEGIN
  -- Verificar e adicionar colunas na tabela conversations
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'group_id'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE conversations ADD COLUMN group_id UUID REFERENCES groups(id);
  END IF;

  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'tags'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE conversations ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;

  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'has_whatsapp'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE conversations ADD COLUMN has_whatsapp BOOLEAN DEFAULT false;
  END IF;

  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'is_audio'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE conversations ADD COLUMN is_audio BOOLEAN DEFAULT false;
  END IF;

  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'conversations' 
    AND column_name = 'updated_at'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    ALTER TABLE conversations ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Inserir grupos padrão
INSERT INTO groups (name, icon) VALUES
  ('Sem grupo', 'Users'),
  ('PLATAFORMA UNICV', 'Laptop'),
  ('DESQUALIFICADOS', 'UserX'),
  ('SECRETÁRIA DE MÚSICA', 'Music'),
  ('PRIMEIRA GRADUAÇÃO UNICV', 'GraduationCap'),
  ('ANÁLISE CERTIFICAÇÃO', 'Award'),
  ('CERTIFICAÇÃO EM ANDAMENTO', 'Clock'),
  ('SUPORTE', 'HelpCircle'),
  ('FINANCEIRO', 'Wallet'),
  ('APRESSAMENTOS', 'Timer'),
  ('AGUARDANDO DIPLOMA', 'Scroll')
ON CONFLICT (name) DO NOTHING;

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Configurar RLS depois que tudo estiver criado
DO $$
BEGIN
  -- Habilitar RLS
  ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
  ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
  
  -- Criar políticas
  CREATE POLICY "Enable read access for all users" ON groups
    FOR SELECT USING (true);

  CREATE POLICY "Enable insert for authenticated users only" ON groups
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

  CREATE POLICY "Enable update for authenticated users only" ON groups
    FOR UPDATE USING (auth.role() = 'authenticated');

  CREATE POLICY "Enable read access for all users" ON conversations
    FOR SELECT USING (true);

  CREATE POLICY "Enable insert for authenticated users only" ON conversations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

  CREATE POLICY "Enable update for authenticated users only" ON conversations
    FOR UPDATE USING (auth.role() = 'authenticated');
END $$; 