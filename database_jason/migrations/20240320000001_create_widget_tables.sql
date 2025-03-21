-- Create widget settings table
CREATE TABLE IF NOT EXISTS "communication.widget_settings" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    theme VARCHAR(50) NOT NULL DEFAULT 'blue',
    text_color VARCHAR(10) NOT NULL DEFAULT 'light',
    position VARCHAR(10) NOT NULL DEFAULT 'right',
    lateral_spacing INTEGER NOT NULL DEFAULT 20,
    bottom_spacing INTEGER NOT NULL DEFAULT 60,
    display_name VARCHAR(255) NOT NULL,
    off_hours_message TEXT,
    team_description TEXT,
    initial_message TEXT,
    show_agent_avatars BOOLEAN NOT NULL DEFAULT TRUE,
    use_custom_image BOOLEAN NOT NULL DEFAULT FALSE,
    custom_image_url TEXT,
    call_to_action BOOLEAN NOT NULL DEFAULT FALSE,
    show_widget_on_mobile BOOLEAN NOT NULL DEFAULT TRUE,
    hide_widget_button BOOLEAN NOT NULL DEFAULT FALSE,
    enable_sounds BOOLEAN NOT NULL DEFAULT TRUE,
    restrict_domain BOOLEAN NOT NULL DEFAULT FALSE,
    allowed_domains TEXT[],
    enable_whatsapp_balloon BOOLEAN NOT NULL DEFAULT FALSE,
    whatsapp_number VARCHAR(50),
    whatsapp_text TEXT,
    use_only_whatsapp BOOLEAN NOT NULL DEFAULT FALSE,
    capture_form_info BOOLEAN NOT NULL DEFAULT FALSE,
    enable_business_hours BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create widget form fields table
CREATE TABLE IF NOT EXISTS "communication.widget_form_fields" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    widget_id UUID NOT NULL REFERENCES "communication.widget_settings"(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'text',
    label VARCHAR(255) NOT NULL,
    required BOOLEAN NOT NULL DEFAULT FALSE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create widget domain restrictions table
CREATE TABLE IF NOT EXISTS "communication.widget_domains" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    widget_id UUID NOT NULL REFERENCES "communication.widget_settings"(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE "communication.widget_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "communication.widget_form_fields" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "communication.widget_domains" ENABLE ROW LEVEL SECURITY;

-- Create policies for widget settings
CREATE POLICY "Widget settings are viewable by authenticated users"
    ON "communication.widget_settings" FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Widget settings are editable by authenticated users"
    ON "communication.widget_settings" FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Widget settings are insertable by authenticated users"
    ON "communication.widget_settings" FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Widget settings are deletable by authenticated users"
    ON "communication.widget_settings" FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create policies for widget form fields
CREATE POLICY "Form fields are viewable by authenticated users"
    ON "communication.widget_form_fields" FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Form fields are editable by authenticated users"
    ON "communication.widget_form_fields" FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Form fields are insertable by authenticated users"
    ON "communication.widget_form_fields" FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Form fields are deletable by authenticated users"
    ON "communication.widget_form_fields" FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create policies for widget domains
CREATE POLICY "Domain restrictions are viewable by authenticated users"
    ON "communication.widget_domains" FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Domain restrictions are editable by authenticated users"
    ON "communication.widget_domains" FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Domain restrictions are insertable by authenticated users"
    ON "communication.widget_domains" FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Domain restrictions are deletable by authenticated users"
    ON "communication.widget_domains" FOR DELETE
    USING (auth.role() = 'authenticated');

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update the updated_at column
CREATE TRIGGER update_widget_settings_updated_at
BEFORE UPDATE ON "communication.widget_settings"
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widget_form_fields_updated_at
BEFORE UPDATE ON "communication.widget_form_fields"
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 