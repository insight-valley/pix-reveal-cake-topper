-- Migração para AbacatePay
-- Remove campos do Mercado Pago e adiciona campos do AbacatePay

-- Adicionar colunas do AbacatePay
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS abacate_pay_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS abacate_pay_url TEXT,
ADD COLUMN IF NOT EXISTS qr_code TEXT,
ADD COLUMN IF NOT EXISTS qr_code_base64 TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Remover colunas do Mercado Pago (se existirem)
ALTER TABLE payments 
DROP COLUMN IF EXISTS mp_payment_id,
DROP COLUMN IF EXISTS mp_status,
DROP COLUMN IF EXISTS mp_status_detail,
DROP COLUMN IF EXISTS mp_date_approved,
DROP COLUMN IF EXISTS mp_date_created,
DROP COLUMN IF EXISTS mp_date_last_updated,
DROP COLUMN IF EXISTS token,
DROP COLUMN IF EXISTS issuer_id;

-- Atualizar tipos de status para incluir novos do AbacatePay
COMMENT ON COLUMN payments.status IS 'pending, approved, rejected, cancelled, expired, refunded';

-- Criar índice para o abacate_pay_id
CREATE INDEX IF NOT EXISTS idx_payments_abacate_pay_id ON payments(abacate_pay_id);

-- Remover índices antigos do Mercado Pago (se existirem)
DROP INDEX IF EXISTS idx_payments_mp_payment_id;

-- Comentários para documentação
COMMENT ON COLUMN payments.abacate_pay_id IS 'ID da cobrança no AbacatePay';
COMMENT ON COLUMN payments.abacate_pay_url IS 'URL de pagamento do AbacatePay';
COMMENT ON COLUMN payments.qr_code IS 'Código PIX copia e cola';
COMMENT ON COLUMN payments.qr_code_base64 IS 'QR Code em base64';
COMMENT ON COLUMN payments.expires_at IS 'Data de expiração do PIX';
