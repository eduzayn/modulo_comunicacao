-- Versão corrigida da função para verificar se uma tabela existe no banco de dados
CREATE OR REPLACE FUNCTION public.check_table_exists(p_table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = p_table_name
  ) INTO _exists;

  RETURN _exists;
END;
$$;
