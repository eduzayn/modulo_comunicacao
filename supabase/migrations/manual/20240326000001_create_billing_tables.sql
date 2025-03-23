-- Arquivo de migração para criar estrutura de faturamento
-- Usado para suportar as funcionalidades de assinatura, faturamento e pagamentos

-- Tabela de planos disponíveis
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  discount_percentage INTEGER,
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'quarterly', 'yearly')),
  features JSONB DEFAULT '[]'::jsonb,
  is_recommended BOOLEAN DEFAULT FALSE,
  max_users INTEGER NOT NULL,
  max_channels JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de assinaturas dos clientes
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL, -- Referência ao ID do cliente/organização
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'canceled', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  items JSONB DEFAULT '[]'::jsonb, -- Itens incluídos na assinatura (usuários, canais, etc.)
  discount JSONB DEFAULT '{}'::jsonb, -- Informações sobre descontos aplicados
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de faturas
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES subscriptions(id),
  invoice_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
  amount_due DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  amount_remaining DECIMAL(10, 2),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_method TEXT, -- Método usado para pagamento
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de métodos de pagamento
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit_card', 'boleto', 'pix', 'bank_transfer')),
  details JSONB NOT NULL, -- Detalhes específicos do método de pagamento (mascarados para segurança)
  is_default BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE, -- Para cartões de crédito
  status TEXT CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico de pagamentos
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id),
  payment_method_id UUID REFERENCES payment_methods(id),
  transaction_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed', 'refunded')),
  payment_date TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_reason TEXT,
  gateway_response JSONB, -- Resposta da gateway de pagamento
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de saldo para uso de serviços adicionais (como assistente AI)
CREATE TABLE IF NOT EXISTS customer_balance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0,
  last_topup_amount DECIMAL(10, 2),
  last_topup_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações de faturamento
CREATE TABLE IF NOT EXISTS billing_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL UNIQUE,
  auto_billing BOOLEAN DEFAULT TRUE,
  send_invoice_emails BOOLEAN DEFAULT TRUE,
  payment_notifications BOOLEAN DEFAULT TRUE,
  tax_id TEXT, -- CPF/CNPJ
  billing_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers para atualizar o timestamp de updated_at
CREATE TRIGGER update_subscription_plans_modtime
BEFORE UPDATE ON subscription_plans
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_subscriptions_modtime
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_invoices_modtime
BEFORE UPDATE ON invoices
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_payment_methods_modtime
BEFORE UPDATE ON payment_methods
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_payment_history_modtime
BEFORE UPDATE ON payment_history
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_customer_balance_modtime
BEFORE UPDATE ON customer_balance
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_billing_settings_modtime
BEFORE UPDATE ON billing_settings
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para assinaturas
CREATE POLICY "Allow read for all authenticated users" ON subscription_plans
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON subscriptions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON invoices
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON payment_methods
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON payment_history
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON customer_balance
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON billing_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Inserir dados de exemplo para os planos de assinatura
INSERT INTO subscription_plans (name, description, price, discount_price, discount_percentage, interval, features, is_recommended, max_users, max_channels)
VALUES
  ('BÁSICO', 'Plano básico para equipes pequenas', 799.90, NULL, NULL, 'monthly', 
   '[
     "5 usuários incluídos", 
     "1 canal de WhatsApp", 
     "Suporte por email", 
     "Acesso ao painel de análises básico", 
     "Automações limitadas"
   ]'::jsonb, 
   FALSE, 5, '{"whatsapp": 1, "email": 1, "sms": 1}'::jsonb),
   
  ('PRO', 'Plano ideal para empresas em crescimento', 1599.90, 1279.90, 20, 'monthly', 
   '[
     "20 usuários incluídos", 
     "3 canais de WhatsApp", 
     "1 canal de Instagram", 
     "1 canal de Facebook", 
     "Suporte prioritário", 
     "Acesso a todas as automações", 
     "Assistente AI Kin ilimitado", 
     "APIs para integrações"
   ]'::jsonb, 
   TRUE, 20, '{"whatsapp": 3, "email": 5, "sms": 3, "instagram": 1, "facebook": 1}'::jsonb),
   
  ('ENTERPRISE', 'Plano completo para grandes empresas', 3299.90, NULL, NULL, 'monthly', 
   '[
     "Usuários ilimitados", 
     "Canais ilimitados", 
     "Suporte VIP 24/7", 
     "Gerente de conta dedicado", 
     "Treinamento personalizado", 
     "Customizações específicas", 
     "SLA garantido", 
     "Hospedagem dedicada"
   ]'::jsonb, 
   FALSE, 999, '{"whatsapp": 99, "email": 99, "sms": 99, "instagram": 99, "facebook": 99}'::jsonb);

-- Criar índices para melhor performance
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payment_methods_customer_id ON payment_methods(customer_id);
CREATE INDEX idx_payment_history_invoice_id ON payment_history(invoice_id);
CREATE INDEX idx_customer_balance_customer_id ON customer_balance(customer_id); 