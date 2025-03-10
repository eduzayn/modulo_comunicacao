-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Channels table
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('whatsapp', 'email', 'chat', 'sms', 'push')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  participants TEXT[] NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed', 'archived')),
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  context TEXT NOT NULL CHECK (context IN ('academic', 'administrative', 'support')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('whatsapp', 'email', 'chat', 'sms', 'push')),
  category TEXT,
  variables TEXT[] DEFAULT '{}'::text[],
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Settings table
CREATE TABLE IF NOT EXISTS ai_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model TEXT NOT NULL,
  temperature FLOAT NOT NULL CHECK (temperature >= 0 AND temperature <= 1),
  max_tokens INTEGER NOT NULL CHECK (max_tokens > 0),
  auto_respond BOOLEAN NOT NULL,
  sentiment_analysis BOOLEAN NOT NULL,
  suggest_responses BOOLEAN NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_channel_id ON conversations(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_templates_channel_type ON templates(channel_type);
CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_priority ON conversations(priority);

-- Insert default AI settings
INSERT INTO ai_settings (
  model, 
  temperature, 
  max_tokens, 
  auto_respond, 
  sentiment_analysis, 
  suggest_responses
) VALUES (
  'gpt-4',
  0.7,
  1000,
  true,
  true,
  true
);

-- Insert sample channels
INSERT INTO channels (name, type, status, config) VALUES
('WhatsApp Business', 'whatsapp', 'active', '{"api_key": "sample_key", "phone_number": "+5511999999999"}'),
('Email Marketing', 'email', 'active', '{"smtp_server": "smtp.example.com", "port": 587, "username": "user@example.com"}'),
('Live Chat', 'chat', 'active', '{"widget_id": "chat_widget_123"}'),
('SMS Gateway', 'sms', 'inactive', '{"api_key": "sample_sms_key"}'),
('Push Notifications', 'push', 'active', '{"firebase_key": "sample_firebase_key"}');

-- Insert sample templates
INSERT INTO templates (name, content, channel_type, category, variables, status) VALUES
('Welcome Message', 'Olá {{name}}, bem-vindo à Edunéxia! Estamos felizes em tê-lo conosco.', 'whatsapp', 'Onboarding', ARRAY['name'], 'active'),
('Payment Reminder', 'Olá {{name}}, lembramos que o pagamento do curso {{course}} vence em {{days}} dias.', 'email', 'Financial', ARRAY['name', 'course', 'days'], 'active'),
('Support Ticket', 'Ticket #{{ticket_id}} foi criado. Um agente entrará em contato em breve.', 'chat', 'Support', ARRAY['ticket_id'], 'active');

-- Insert sample conversations
INSERT INTO conversations (channel_id, participants, status, priority, context) VALUES
((SELECT id FROM channels WHERE type = 'whatsapp' LIMIT 1), ARRAY['user1', 'agent1'], 'open', 'high', 'support'),
((SELECT id FROM channels WHERE type = 'email' LIMIT 1), ARRAY['user2', 'agent2'], 'open', 'medium', 'academic'),
((SELECT id FROM channels WHERE type = 'chat' LIMIT 1), ARRAY['user3', 'agent3'], 'closed', 'low', 'administrative');

-- Insert sample messages
INSERT INTO messages (conversation_id, sender_id, content) VALUES
((SELECT id FROM conversations LIMIT 1), 'user1', 'Olá, estou com problemas para acessar meu curso.'),
((SELECT id FROM conversations LIMIT 1), 'agent1', 'Olá! Vou ajudar você com isso. Pode me informar qual curso está tentando acessar?'),
((SELECT id FROM conversations OFFSET 1 LIMIT 1), 'user2', 'Quando começa o próximo semestre?'),
((SELECT id FROM conversations OFFSET 1 LIMIT 1), 'agent2', 'O próximo semestre começa em 15 de agosto. Posso ajudar com mais alguma informação?');

-- Create RLS policies for security
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow all for authenticated users" ON channels
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON conversations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON messages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON ai_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Create functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_channels_modtime
BEFORE UPDATE ON channels
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_conversations_modtime
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_templates_modtime
BEFORE UPDATE ON templates
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_ai_settings_modtime
BEFORE UPDATE ON ai_settings
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
