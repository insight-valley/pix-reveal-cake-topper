# 🗄️ Configuração do Supabase

**Projeto:** Gerador de Topo de Bolo  
**Database:** PostgreSQL via Supabase  
**URL:** https://phmbpoacpivuqlmjnnoj.supabase.co

---

## 📊 Schema do Banco de Dados

### Tabela: `payments`

**Propósito:** Armazenar todas as transações de pagamento PIX via AbacatePay

```sql
CREATE TABLE payments (
  -- Identificadores
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id TEXT NOT NULL,
  external_reference TEXT UNIQUE NOT NULL,
  
  -- Dados da transação
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT DEFAULT 'pending',
  description TEXT,
  
  -- Integração AbacatePay
  abacate_pay_id TEXT UNIQUE,  -- ID da cobrança no AbacatePay
  abacate_pay_url TEXT,          -- URL de pagamento
  qr_code TEXT,                  -- PIX copia e cola
  qr_code_base64 TEXT,           -- QR Code imagem (base64)
  expires_at TIMESTAMPTZ,        -- Expiração do PIX
  
  -- Dados do pagador
  payer_email TEXT,
  payer_name TEXT,
  payer_document_type TEXT,  -- CPF ou CNPJ
  payer_document_number TEXT,
  
  -- Metadata de pagamento
  payment_method_id TEXT,  -- "pix"
  payment_type_id TEXT,    -- "bank_transfer"
  installments INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Índices:**
```sql
CREATE INDEX idx_payments_abacate_pay_id ON payments(abacate_pay_id);
CREATE INDEX idx_payments_external_reference ON payments(external_reference);
CREATE INDEX idx_payments_status ON payments(status);
```

**Valores de Status:**
- `pending` - Aguardando pagamento
- `approved` - Pagamento confirmado
- `rejected` - Pagamento rejeitado
- `cancelled` - Pagamento cancelado
- `expired` - PIX expirado
- `refunded` - Pagamento reembolsado

---

### Tabela: `download_tokens`

**Propósito:** Tokens temporários para download de imagens HD após pagamento

```sql
CREATE TABLE download_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id),
  image_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Regras:**
- Tokens expiram em 24 horas
- Podem ser usados apenas uma vez
- Gerados automaticamente após pagamento aprovado

---

### Tabela: `payment_logs`

**Propósito:** Auditoria completa de todos os eventos relacionados a pagamentos

```sql
CREATE TABLE payment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Tipos de Eventos:**
- `created` - Pagamento criado
- `abacate_webhook_received` - Webhook do AbacatePay recebido
- `status_updated` - Status atualizado
- `download_token_generated` - Token gerado
- `download_completed` - Download realizado

---

## 🔐 Row Level Security (RLS)

### Policies Configuradas:

**`payments` table:**
```sql
-- Usuários podem ver apenas seus próprios pagamentos (se autenticados)
CREATE POLICY "Users can view own payments"
ON payments FOR SELECT
USING (auth.uid() = user_id);

-- Serviço pode fazer tudo
CREATE POLICY "Service role can do everything"
ON payments FOR ALL
USING (auth.role() = 'service_role');
```

**`download_tokens` table:**
```sql
-- Tokens são públicos para validação, mas sensíveis
CREATE POLICY "Anyone can validate tokens"
ON download_tokens FOR SELECT
USING (true);  -- Mas a lógica de validação está na API
```

**`payment_logs` table:**
```sql
-- Logs são apenas para service_role
CREATE POLICY "Service role can insert logs"
ON payment_logs FOR INSERT
USING (auth.role() = 'service_role');
```

---

## 🔑 Variáveis de Ambiente

### Frontend (Públicas):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://phmbpoacpivuqlmjnnoj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend (Secretas):
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE:**
- `ANON_KEY` é pública (pode ir no frontend)
- `SERVICE_ROLE_KEY` é secreta (APENAS no backend)
- Nunca commitar a `SERVICE_ROLE_KEY` no git

---

## 📝 Migrações Aplicadas

### 1. `20250806023049_add_payments_system.sql`
- Criou tabelas iniciais (payments, download_tokens, payment_logs)
- Configurou RLS policies
- Estrutura original com campos Mercado Pago

### 2. `20250111000000_migrate_to_abacatepay_fixed.sql` ✅
- Removeu campos do Mercado Pago
- Adicionou campos do AbacatePay
- Atualizou índices
- Status: **APLICADA**

---

## 🔧 Queries Úteis

### Verificar pagamentos pendentes:
```sql
SELECT id, external_reference, amount, status, created_at
FROM payments
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 10;
```

### Verificar últimos pagamentos aprovados:
```sql
SELECT 
  p.id,
  p.external_reference,
  p.amount,
  p.payer_email,
  p.abacate_pay_id,
  p.created_at,
  dt.token as download_token
FROM payments p
LEFT JOIN download_tokens dt ON dt.payment_id = p.id
WHERE p.status = 'approved'
ORDER BY p.created_at DESC
LIMIT 10;
```

### Logs de um pagamento específico:
```sql
SELECT 
  event_type,
  event_data,
  created_at
FROM payment_logs
WHERE payment_id = 'uuid-aqui'
ORDER BY created_at ASC;
```

---

## 🚀 API Endpoints do Projeto

### POST `/api/create-payment`
Cria novo pagamento no AbacatePay e persiste no Supabase

**Body:**
```json
{
  "imageId": "img_123",
  "amount": 100,
  "description": "Topo de bolo",
  "customer": {
    "email": "user@example.com",
    "name": "User Name",
    "taxId": "12345678901"
  }
}
```

**Response:**
```json
{
  "payment_id": "uuid",
  "abacate_pay_id": "billing_id",
  "qr_code": "00020126...",
  "qr_code_base64": "iVBORw0KGg..."
}
```

---

### POST `/api/abacate-webhook`
Recebe notificações do AbacatePay e atualiza status no Supabase

**Headers:**
```
Content-Type: application/json
x-abacatepay-signature: <signature>
```

**Body (exemplo):**
```json
{
  "event": "billing.updated",
  "data": {
    "id": "billing_id",
    "status": "PAID",
    "paidAt": "2025-01-11T00:00:00Z"
  }
}
```

---

### POST `/api/validate-download`
Valida token de download e retorna URL da imagem HD

**Body:**
```json
{
  "token": "dl_token_here",
  "imageId": "img_123"
}
```

---

## 🔄 Fluxo de Dados

```
1. Frontend → /api/create-payment
   ↓
2. API cria cobrança no AbacatePay
   ↓
3. API salva em Supabase (payments)
   ↓
4. API retorna QR Code para frontend
   ↓
5. Usuário paga via PIX
   ↓
6. AbacatePay envia webhook → /api/abacate-webhook
   ↓
7. Webhook atualiza status em Supabase
   ↓
8. Webhook gera download_token
   ↓
9. Frontend pode baixar HD com token
```

---

## 📊 Monitoramento

### Dashboard Supabase:
https://supabase.com/dashboard/project/phmbpoacpivuqlmjnnoj

**Áreas importantes:**
- **Database** → Ver tabelas e dados
- **SQL Editor** → Executar queries
- **API** → Ver keys e endpoints
- **Logs** → Ver erros e requisições

---

## ⚠️ Troubleshooting

### Erro: "TypeError: fetch failed"
**Causa:** Variáveis de ambiente incorretas  
**Fix:** Verifique se `NEXT_PUBLIC_` está no início

### Erro: "Failed to save payment"
**Causa:** Falta `SUPABASE_SERVICE_ROLE_KEY`  
**Fix:** Adicione a key no `.env.local`

### Erro: "Row Level Security violation"
**Causa:** Tentando acessar dados sem permissão  
**Fix:** Use `service_role` key nas API routes

---

**Última atualização:** 2025-01-11  
**Versão do Schema:** 2.0 (AbacatePay)
