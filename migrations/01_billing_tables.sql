-- Criação de tipos enumerados
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'canceled', 'past_due');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
        CREATE TYPE invoice_status AS ENUM ('draft', 'open', 'paid', 'uncollectible', 'void');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method_type') THEN
        CREATE TYPE payment_method_type AS ENUM ('credit_card', 'boleto', 'pix', 'bank_transfer');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method_status') THEN
        CREATE TYPE payment_method_status AS ENUM ('active', 'expired', 'canceled');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('completed', 'pending', 'failed', 'refunded');
    END IF;
END
$$;

-- Tabela de planos de assinatura
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    billing_interval VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, yearly, etc.
    features JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de assinaturas
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    canceled_at TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Tabela de métodos de pagamento
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type payment_method_type NOT NULL,
    details JSONB NOT NULL, -- lastFour, brand, expiryMonth, expiryYear, etc.
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    status payment_method_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de faturas
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    amount_remaining DECIMAL(10, 2) GENERATED ALWAYS AS (amount_due - amount_paid) STORED,
    status invoice_status NOT NULL DEFAULT 'draft',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    items JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de histórico de pagamentos
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES payment_methods(id),
    transaction_id VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    refund_reason TEXT,
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de configurações de faturamento
CREATE TABLE IF NOT EXISTS billing_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    tax_id VARCHAR(50), -- CPF/CNPJ
    billing_address JSONB,
    notification_preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_customer_billing_settings UNIQUE (customer_id)
);

-- Tabela para histórico de créditos e descontos
CREATE TABLE IF NOT EXISTS credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- credit, discount, coupon, etc.
    expired_at TIMESTAMP WITH TIME ZONE,
    applied_to_invoice_id UUID REFERENCES invoices(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Verifica se a sequência existe antes de criá-la
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'invoice_number_seq') THEN
        CREATE SEQUENCE invoice_number_seq START 1;
    END IF;
END
$$;

-- Índices para otimização de consultas (apenas se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_customer_id') THEN
        CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_plan_id') THEN
        CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_status') THEN
        CREATE INDEX idx_subscriptions_status ON subscriptions(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_methods_customer_id') THEN
        CREATE INDEX idx_payment_methods_customer_id ON payment_methods(customer_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_invoices_subscription_id') THEN
        CREATE INDEX idx_invoices_subscription_id ON invoices(subscription_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_invoices_status') THEN
        CREATE INDEX idx_invoices_status ON invoices(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_invoices_due_date') THEN
        CREATE INDEX idx_invoices_due_date ON invoices(due_date);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_history_invoice_id') THEN
        CREATE INDEX idx_payment_history_invoice_id ON payment_history(invoice_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_history_transaction_id') THEN
        CREATE INDEX idx_payment_history_transaction_id ON payment_history(transaction_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_history_status') THEN
        CREATE INDEX idx_payment_history_status ON payment_history(status);
    END IF;
END
$$;

-- Habilitar RLS para tabelas
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Criar as políticas RLS (dropa se existirem)
DO $$
BEGIN
    -- Políticas para planos de assinatura
    DROP POLICY IF EXISTS "Planos visíveis para todos" ON subscription_plans;
    CREATE POLICY "Planos visíveis para todos" ON subscription_plans FOR SELECT USING (TRUE);
    
    -- Políticas para assinaturas
    DROP POLICY IF EXISTS "Clientes visualizam suas próprias assinaturas" ON subscriptions;
    CREATE POLICY "Clientes visualizam suas próprias assinaturas" ON subscriptions 
        FOR SELECT USING (auth.uid() = customer_id);
        
    -- Políticas para métodos de pagamento
    DROP POLICY IF EXISTS "Clientes gerenciam seus próprios métodos de pagamento" ON payment_methods;
    CREATE POLICY "Clientes gerenciam seus próprios métodos de pagamento" ON payment_methods 
        FOR ALL USING (auth.uid() = customer_id);
        
    -- Políticas para faturas
    DROP POLICY IF EXISTS "Clientes visualizam suas próprias faturas" ON invoices;
    CREATE POLICY "Clientes visualizam suas próprias faturas" ON invoices 
        FOR SELECT USING (
            auth.uid() IN (
                SELECT customer_id FROM subscriptions WHERE id = invoices.subscription_id
            )
        );
        
    -- Políticas para histórico de pagamentos
    DROP POLICY IF EXISTS "Clientes visualizam seus próprios pagamentos" ON payment_history;
    CREATE POLICY "Clientes visualizam seus próprios pagamentos" ON payment_history 
        FOR SELECT USING (
            auth.uid() IN (
                SELECT customer_id FROM subscriptions 
                JOIN invoices ON subscriptions.id = invoices.subscription_id
                WHERE invoices.id = payment_history.invoice_id
            )
        );
        
    -- Políticas para configurações de faturamento
    DROP POLICY IF EXISTS "Clientes gerenciam suas próprias configurações de faturamento" ON billing_settings;
    CREATE POLICY "Clientes gerenciam suas próprias configurações de faturamento" ON billing_settings 
        FOR ALL USING (auth.uid() = customer_id);
        
    -- Políticas para créditos
    DROP POLICY IF EXISTS "Clientes visualizam seus próprios créditos" ON credits;
    CREATE POLICY "Clientes visualizam seus próprios créditos" ON credits 
        FOR SELECT USING (auth.uid() = customer_id);
END
$$;

-- Inserir planos básicos se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Básico') THEN
        INSERT INTO subscription_plans (name, description, price, billing_interval, features)
        VALUES 
        ('Básico', 'Plano inicial com recursos essenciais', 49.90, 'monthly', 
         '{"canais": 3, "mensagens_mensais": 1000, "suporte": "email"}');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Profissional') THEN
        INSERT INTO subscription_plans (name, description, price, billing_interval, features)
        VALUES 
        ('Profissional', 'Plano completo para pequenas e médias empresas', 99.90, 'monthly', 
         '{"canais": 10, "mensagens_mensais": 5000, "suporte": "email,chat", "integrações": true}');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Empresarial') THEN
        INSERT INTO subscription_plans (name, description, price, billing_interval, features)
        VALUES 
        ('Empresarial', 'Solução completa para grandes empresas', 199.90, 'monthly', 
         '{"canais": "ilimitado", "mensagens_mensais": 20000, "suporte": "email,chat,telefone", "integrações": true, "api_acesso": true, "dedicado": true}');
    END IF;
END
$$;

-- Função para criar automaticamente uma fatura quando o período atual terminar
CREATE OR REPLACE FUNCTION create_invoice_on_period_end()
RETURNS TRIGGER AS $$
BEGIN
    -- Se assinatura está ativa e não cancela no final do período
    IF NEW.status = 'active' AND NEW.cancel_at_period_end = FALSE THEN
        -- Verificar se já existe fatura para o próximo período
        IF NOT EXISTS (
            SELECT 1 FROM invoices 
            WHERE subscription_id = NEW.id 
            AND period_start = NEW.current_period_end
        ) THEN
            -- Criar nova fatura para o próximo período
            INSERT INTO invoices (
                subscription_id, 
                invoice_number, 
                amount_due, 
                status, 
                due_date, 
                period_start, 
                period_end, 
                description
            )
            SELECT 
                NEW.id,
                'INV-' || to_char(NOW(), 'YYYYMMDD') || '-' || LPAD(CAST(nextval('invoice_number_seq') AS TEXT), 6, '0'),
                sp.price,
                'open',
                NEW.current_period_end + INTERVAL '3 days',
                NEW.current_period_end,
                CASE 
                    WHEN sp.billing_interval = 'monthly' THEN NEW.current_period_end + INTERVAL '1 month'
                    WHEN sp.billing_interval = 'yearly' THEN NEW.current_period_end + INTERVAL '1 year'
                    ELSE NEW.current_period_end + INTERVAL '1 month'
                END,
                'Fatura para ' || sp.name || ' - ' || sp.billing_interval
            FROM subscription_plans sp
            WHERE sp.id = NEW.plan_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar os timestamps de updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger apenas se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_create_invoice_on_subscription_update') THEN
        CREATE TRIGGER trg_create_invoice_on_subscription_update
        AFTER UPDATE OF current_period_end ON subscriptions
        FOR EACH ROW
        EXECUTE FUNCTION create_invoice_on_period_end();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_subscription_plans_timestamp') THEN
        CREATE TRIGGER trg_update_subscription_plans_timestamp
        BEFORE UPDATE ON subscription_plans
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_subscriptions_timestamp') THEN
        CREATE TRIGGER trg_update_subscriptions_timestamp
        BEFORE UPDATE ON subscriptions
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_payment_methods_timestamp') THEN
        CREATE TRIGGER trg_update_payment_methods_timestamp
        BEFORE UPDATE ON payment_methods
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_invoices_timestamp') THEN
        CREATE TRIGGER trg_update_invoices_timestamp
        BEFORE UPDATE ON invoices
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_payment_history_timestamp') THEN
        CREATE TRIGGER trg_update_payment_history_timestamp
        BEFORE UPDATE ON payment_history
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_billing_settings_timestamp') THEN
        CREATE TRIGGER trg_update_billing_settings_timestamp
        BEFORE UPDATE ON billing_settings
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_credits_timestamp') THEN
        CREATE TRIGGER trg_update_credits_timestamp
        BEFORE UPDATE ON credits
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
    END IF;
END
$$; 