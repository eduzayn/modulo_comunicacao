-- Migração para atualizar a verificação (CHECK) de tipo de canal para incluir facebook e instagram

-- Primeiro, vamos remover a restrição de verificação existente
ALTER TABLE channels DROP CONSTRAINT IF EXISTS channels_type_check;

-- Agora, adicionamos uma nova restrição de verificação com os novos tipos
ALTER TABLE channels ADD CONSTRAINT channels_type_check 
CHECK (type IN ('whatsapp', 'email', 'chat', 'sms', 'push', 'facebook', 'instagram'));

-- Atualizar a mesma restrição na tabela templates
ALTER TABLE templates DROP CONSTRAINT IF EXISTS templates_channel_type_check;
ALTER TABLE templates ADD CONSTRAINT templates_channel_type_check 
CHECK (channel_type IN ('whatsapp', 'email', 'chat', 'sms', 'push', 'facebook', 'instagram'));

-- Inserir registros de exemplo para canais Facebook e Instagram (se não existirem)
INSERT INTO channels (name, type, status, config)
SELECT 'Facebook Page', 'facebook', 'inactive', '{"page_id": "example_page_id", "page_access_token": "example_token"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM channels WHERE type = 'facebook');

INSERT INTO channels (name, type, status, config)
SELECT 'Instagram Business', 'instagram', 'inactive', '{"business_account_id": "example_account_id", "access_token": "example_token"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM channels WHERE type = 'instagram');

-- Inserir templates de exemplo para Facebook e Instagram
INSERT INTO templates (name, content, channel_type, category, variables, status)
SELECT 'Facebook Response', 'Olá {{name}}, obrigado pelo seu contato através do Facebook. Estamos analisando sua mensagem.', 
       'facebook', 'Customer Support', ARRAY['name'], 'active'
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE channel_type = 'facebook');

INSERT INTO templates (name, content, channel_type, category, variables, status)
SELECT 'Instagram DM', 'Olá {{name}}, recebemos sua mensagem no Instagram. Um de nossos atendentes entrará em contato.', 
       'instagram', 'Customer Support', ARRAY['name'], 'active'
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE channel_type = 'instagram'); 