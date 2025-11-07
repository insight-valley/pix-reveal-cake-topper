-- Create payments table to track all payment transactions
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id TEXT NOT NULL,
    external_reference TEXT UNIQUE NOT NULL, -- MP payment ID
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method_id TEXT,
    payment_type_id TEXT,
    installments INTEGER DEFAULT 1,
    issuer_id TEXT,
    token TEXT,
    payer_email TEXT,
    payer_document_type TEXT,
    payer_document_number TEXT,
    description TEXT,
    mp_payment_id BIGINT UNIQUE,
    mp_status TEXT,
    mp_status_detail TEXT,
    mp_date_approved TIMESTAMPTZ,
    mp_date_created TIMESTAMPTZ,
    mp_date_last_updated TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create download_tokens table for secure download control
CREATE TABLE IF NOT EXISTS download_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    image_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_logs table for audit trail
CREATE TABLE IF NOT EXISTS payment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'created', 'webhook_received', 'status_changed', 'download_granted'
    event_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_external_reference ON payments(external_reference);
CREATE INDEX IF NOT EXISTS idx_payments_mp_payment_id ON payments(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_image_id ON payments(image_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_download_tokens_token ON download_tokens(token);
CREATE INDEX IF NOT EXISTS idx_download_tokens_expires_at ON download_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_download_tokens_image_id ON download_tokens(image_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_payment_id ON payment_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_event_type ON payment_logs(event_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for payments table
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for payment creation and webhook processing
CREATE POLICY "Allow anonymous payment creation" ON payments
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow service role full access to payments" ON payments
    FOR ALL TO service_role
    USING (true);

-- Allow token validation for downloads
CREATE POLICY "Allow anonymous token read" ON download_tokens
    FOR SELECT TO anon
    USING (expires_at > NOW() AND used_at IS NULL);

CREATE POLICY "Allow service role full access to download_tokens" ON download_tokens
    FOR ALL TO service_role
    USING (true);

-- Allow service role full access to logs
CREATE POLICY "Allow service role full access to payment_logs" ON payment_logs
    FOR ALL TO service_role
    USING (true);
