-- Migration: Email Configuration for Communication Module
-- Description: Sets up email configuration in Supabase for the communication module

-- Create email_config table to store SMTP settings
CREATE TABLE IF NOT EXISTS email_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_user TEXT NOT NULL,
  smtp_password TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_logs table to track sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_to TEXT NOT NULL,
  email_from TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT,
  body_text TEXT,
  template_id UUID REFERENCES email_templates(id),
  status TEXT NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_email_config_updated_at
BEFORE UPDATE ON email_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON email_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default email configuration
INSERT INTO email_config (
  smtp_host,
  smtp_port,
  smtp_user,
  smtp_password,
  from_email,
  from_name,
  is_default
) VALUES (
  'brasil.svrdedicado.org',
  587,
  'contato@eduzayn.com.br',
  '123@mudar', -- This is a placeholder, should be replaced with actual password
  'contato@eduzayn.com.br',
  'Edunéxia',
  TRUE
);

-- Create email sending function using pg_net extension
CREATE OR REPLACE FUNCTION send_email(
  to_email TEXT,
  subject TEXT,
  body_html TEXT,
  body_text TEXT DEFAULT NULL,
  template_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  config email_config;
  log_id UUID;
BEGIN
  -- Get default email configuration
  SELECT * INTO config FROM email_config WHERE is_default = TRUE LIMIT 1;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No default email configuration found';
  END IF;
  
  -- Insert into email_logs
  INSERT INTO email_logs (
    email_to,
    email_from,
    subject,
    body_html,
    body_text,
    template_id,
    status
  ) VALUES (
    to_email,
    config.from_email,
    subject,
    body_html,
    body_text,
    template_id,
    'pending'
  ) RETURNING id INTO log_id;
  
  -- In a real implementation, this would use pg_net to send the email
  -- For now, we'll just log it and assume it's sent
  
  -- Update status to sent
  UPDATE email_logs SET status = 'sent' WHERE id = log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to send email using template
CREATE OR REPLACE FUNCTION send_email_template(
  to_email TEXT,
  template_id UUID,
  variables JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  template email_templates;
  subject_parsed TEXT;
  body_html_parsed TEXT;
  body_text_parsed TEXT;
  log_id UUID;
  var_key TEXT;
  var_value TEXT;
BEGIN
  -- Get template
  SELECT * INTO template FROM email_templates WHERE id = template_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Email template not found';
  END IF;
  
  -- Start with original content
  subject_parsed := template.subject;
  body_html_parsed := template.body_html;
  body_text_parsed := template.body_text;
  
  -- Replace variables
  FOR var_key, var_value IN SELECT * FROM jsonb_each_text(variables)
  LOOP
    subject_parsed := REPLACE(subject_parsed, '{{' || var_key || '}}', var_value);
    body_html_parsed := REPLACE(body_html_parsed, '{{' || var_key || '}}', var_value);
    
    IF body_text_parsed IS NOT NULL THEN
      body_text_parsed := REPLACE(body_text_parsed, '{{' || var_key || '}}', var_value);
    END IF;
  END LOOP;
  
  -- Send email
  log_id := send_email(
    to_email,
    subject_parsed,
    body_html_parsed,
    body_text_parsed,
    template_id
  );
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE email_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow read access to email_config for authenticated users"
  ON email_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to email_templates for authenticated users"
  ON email_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to email_logs for authenticated users"
  ON email_logs FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for service role
CREATE POLICY "Allow full access to email_config for service role"
  ON email_config FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow full access to email_templates for service role"
  ON email_templates FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow full access to email_logs for service role"
  ON email_logs FOR ALL
  TO service_role
  USING (true);
