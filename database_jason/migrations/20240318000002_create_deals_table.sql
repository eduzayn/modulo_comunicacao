-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  funnel TEXT NOT NULL,
  stage TEXT NOT NULL,
  contact_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

-- Create trigger
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON deals
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON deals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON deals
  FOR UPDATE USING (auth.role() = 'authenticated'); 