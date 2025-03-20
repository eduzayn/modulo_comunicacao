-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (
    category IN (
      'Segunda Licenciatura',
      'Formação Pedagógica',
      'EJA',
      'Bacharelado 2°',
      'Primeira Graduação',
      'Pós-Graduação',
      'MBA',
      'Formação Livre',
      'Capacitação'
    )
  ),
  full_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  final_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  entry_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON courses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON courses
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default courses
INSERT INTO courses (name, category, full_price, discount_type, discount_value, final_price, entry_fee)
VALUES
  ('Pedagogia - Segunda Licenciatura', 'Segunda Licenciatura', 2078.40, 'percentage', 10, 1870.56, 199.90),
  ('Formação Pedagógica em Matemática', 'Formação Pedagógica', 2078.40, 'percentage', 10, 1870.56, 199.90),
  ('EJA - Ensino Médio', 'EJA', 1500.00, 'fixed', 200, 1300.00, 150.00),
  ('Administração - Bacharelado 2°', 'Bacharelado 2°', 2078.40, 'percentage', 10, 1870.56, 199.90),
  ('Pedagogia - Primeira Graduação', 'Primeira Graduação', 2500.00, 'percentage', 15, 2125.00, 250.00),
  ('Neuropsicopedagogia', 'Pós-Graduação', 1800.00, 'fixed', 300, 1500.00, 180.00),
  ('MBA em Gestão Educacional', 'MBA', 3000.00, 'percentage', 20, 2400.00, 300.00),
  ('Curso de Libras', 'Formação Livre', 800.00, 'fixed', 100, 700.00, 80.00),
  ('Capacitação em Educação Especial', 'Capacitação', 500.00, 'percentage', 5, 475.00, 50.00)
ON CONFLICT (name) DO NOTHING; 