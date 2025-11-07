# 💳 Integração AbacatePay - Documentação

**Gateway:** AbacatePay  
**Método:** PIX  
**SDK:** `abacatepay-nodejs-sdk`  
**Ambiente:** Development

---

## 🔑 Credenciais

### Development (DEV):
```bash
ABACATE_PAY_API_KEY=abc_dev_xf5cGzyzdSWMmHjY2W5uhwZ3
```

**⚠️ IMPORTANTE:**
- Esta é a chave de **DESENVOLVIMENTO**
- Para produção, você precisará de uma chave diferente
- Nunca commitar a chave de produção no git

### Como obter chaves:
1. Acesse: https://dashboard.abacatepay.com
2. Vá em **Configurações** → **API Keys**
3. Copie a chave apropriada (dev ou prod)

---

## 📦 SDK Instalado

```json
{
  "dependencies": {
    "abacatepay-nodejs-sdk": "^1.0.0"
  }
}
```

**Documentação oficial:**  
https://docs.abacatepay.com/pages/sdks

---

## 💻 Implementação

### Arquivo: `src/lib/abacatepay.ts`

```typescript
import AbacatePay from "abacatepay-nodejs-sdk";

export class AbacatePayService {
  private client: ReturnType<typeof AbacatePay>;

  constructor(apiKey: string) {
    this.client = AbacatePay(apiKey);
  }

  async createPixPayment(request: CreatePixPaymentRequest) {
    // Criar cobrança PIX
    const billing = await this.client.billing.create({
      frequency: "ONE_TIME",
      methods: ["PIX"],
      products: [
        {
          externalId: request.imageId,
          name: request.description,
          description: request.description,
          quantity: 1,
          price: request.amount, // em centavos
        },
      ],
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      completionUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/?payment=success`,
      customer: {
        name: request.customer?.name || "Cliente",
        email: request.customer?.email,
        cellphone: request.customer?.cellphone || "(00) 00000-0000",
        taxId: request.customer?.taxId || "000.000.000-00",
      },
    });

    return {
      id: billing.data.id,
      url: billing.data.url,
      status: billing.data.status,
      amount: request.amount,
      // SDK retorna QR Code via retrieve, não no create
    };
  }
}
```

---

## 🔄 Fluxo de Pagamento

### 1. Criar Cobrança

**Endpoint:** `POST /api/create-payment`

**Request:**
```typescript
{
  imageId: "img_123",
  amount: 100, // em centavos (R$ 1,00)
  description: "Topo de bolo personalizado",
  customer: {
    email: "user@example.com",
    name: "Nome do Cliente",
    taxId: "12345678901", // CPF ou CNPJ
    cellphone: "(11) 98765-4321" // opcional
  }
}
```

**Response do AbacatePay:**
```typescript
{
  id: "billing_abc123",
  url: "https://pay.abacatepay.com/billing_abc123",
  status: "PENDING",
  // QR Code precisa ser obtido via retrieve
}
```

---

### 2. Obter QR Code

**⚠️ LIMITAÇÃO DO SDK:**
O SDK atual não retorna QR Code no `create()`. Você precisa:

**Opção A:** Usar o endpoint `retrieve()` (não implementado ainda)
```typescript
const billing = await client.billing.retrieve(billingId);
// billing.pixQrCode
// billing.pixQrCodeBase64
```

**Opção B:** Redirecionar para `billing.url` (implementado)
```typescript
// Redireciona usuário para página de pagamento do AbacatePay
window.location.href = response.abacate_pay_url;
```

---

### 3. Webhook (Notificação de Pagamento)

**Endpoint:** `POST /api/abacate-webhook`

**Payload do AbacatePay:**
```json
{
  "event": "billing.updated",
  "data": {
    "id": "billing_abc123",
    "externalId": "cake_topper_img123_1234567890",
    "status": "PAID",
    "paidAt": "2025-01-11T00:30:00Z"
  }
}
```

**Status Possíveis:**
- `PENDING` → Aguardando pagamento
- `PAID` → Pagamento confirmado ✅
- `EXPIRED` → PIX expirou
- `CANCELED` → Cobrança cancelada
- `REFUNDED` → Pagamento reembolsado

---

### 4. Mapeamento de Status

**AbacatePay → Banco de Dados:**

```typescript
const statusMap = {
  PENDING: "pending",
  PAID: "approved",
  EXPIRED: "expired",
  CANCELED: "cancelled",
  REFUNDED: "refunded",
};
```

---

## 🔧 Configuração do Webhook

### No Dashboard do AbacatePay:

1. Acesse: https://dashboard.abacatepay.com/settings/webhooks
2. Adicione novo webhook:
   - **URL:** `https://seu-dominio.vercel.app/api/abacate-webhook`
   - **Eventos:** `billing.updated`
   - **Status:** Ativo

3. Em desenvolvimento (local):
   - Use **ngrok** ou **localtunnel**:
   ```bash
   npx localtunnel --port 8080
   # URL: https://xyz.loca.lt
   # Webhook: https://xyz.loca.lt/api/abacate-webhook
   ```

---

## 💰 Valores e Limites

### Valor Mínimo:
```typescript
const MIN_AMOUNT = 100; // R$ 1,00 (100 centavos)
```

**⚠️ ATENÇÃO:**
- AbacatePay requer **mínimo de R$ 1,00**
- Valores devem ser em **centavos** (inteiro)
- Exemplo: R$ 1,50 = 150 centavos

### Conversão:
```typescript
// BRL → Centavos
const amountInCents = Math.round(amountInBRL * 100);

// Centavos → BRL
const amountInBRL = amountInCents / 100;
```

---

## 🧪 Testes

### ⚠️ Modo de Desenvolvimento

**IMPORTANTE:** Em modo de desenvolvimento, pagamentos PIX precisam ser confirmados manualmente. Use uma das opções abaixo:

1. **Endpoint de simulação** (`/api/simulate-payment`) - Recomendado
2. **Simular webhook manualmente** (`/api/abacate-webhook`)
3. **MCP do AbacatePay** (via ferramentas MCP)

---

### 1. Criar Pagamento (via curl):

```bash
curl -X POST http://localhost:8080/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "imageId": "test-123",
    "amount": 100,
    "description": "Teste de pagamento",
    "customer": {
      "email": "teste@example.com",
      "name": "Teste Usuario",
      "taxId": "12345678901"
    }
  }'
```

**Esperado:**
```json
{
  "payment_id": "uuid-db",
  "abacate_pay_id": "billing_xyz",
  "abacate_pay_url": "https://pay.abacatepay.com/billing_xyz",
  "status": "PENDING"
}
```

---

### 2. Simular Pagamento (DEV mode):

**Opção A: Via endpoint de simulação (recomendado)**

```bash
# Criar pagamento primeiro (veja exemplo acima)
# Depois simular confirmação:

curl -X POST http://localhost:8080/api/simulate-payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "uuid-do-pagamento"
  }'
```

**Ou usando o ID do AbacatePay:**
```bash
curl -X POST http://localhost:8080/api/simulate-payment \
  -H "Content-Type: application/json" \
  -d '{
    "abacatePayId": "pix_char_xxxxx"
  }'
```

**Esperado:**
```json
{
  "ok": true,
  "message": "Payment simulated successfully",
  "payment_id": "uuid-db",
  "abacate_pay_id": "pix_char_xxxxx",
  "old_status": "pending",
  "new_status": "approved",
  "status": "PAID",
  "amount": 100
}
```

**Opção B: Simular Webhook manualmente**

```bash
curl -X POST http://localhost:8080/api/abacate-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "billing.updated",
    "data": {
      "id": "pix_char_xxxxx",
      "status": "PAID",
      "paidAt": "2025-01-11T00:30:00Z"
    }
  }'
```

**Esperado:**
```json
{
  "ok": true,
  "message": "Webhook processed",
  "paymentId": "uuid-db",
  "status": "approved"
}
```

**Opção C: Usar MCP do AbacatePay (via CLI/Serena)**

Se você tiver o MCP do AbacatePay configurado, pode usar diretamente:

```bash
# Via MCP tool (se disponível)
mcp_abacate-pay_simulatePixPayment --id="pix_char_xxxxx"
```

**⚠️ IMPORTANTE:** 
- O endpoint `/api/simulate-payment` apenas funciona em modo de desenvolvimento
- Em produção, pagamentos são confirmados automaticamente via webhook
- Use sempre o `pix_char_xxx` (ID do QR Code PIX), não o `bill_xxx` (ID da billing)

---

### 3. Simular Pagamento com MCP do Serena:

**Usando o MCP do Serena para confirmar pagamentos:**

O MCP do AbacatePay permite confirmar pagamentos manualmente no modo dev. Você pode usar as ferramentas MCP disponíveis:

```typescript
// Exemplo de uso via MCP (se configurado no ambiente)
// mcp_abacate-pay_simulatePixPayment({ id: "pix_char_xxxxx" })
```

**Nota:** O endpoint `/api/simulate-payment` já implementa essa funcionalidade internamente.

---

### 4. Verificar no Banco:

```sql
SELECT 
  id,
  external_reference,
  abacate_pay_id,
  status,
  amount,
  created_at
FROM payments
WHERE abacate_pay_id = 'billing_xyz';
```

---

## 📊 Monitoramento

### Logs no Console:

```typescript
// API create-payment
[pay_1234_abc] Payment creation request started
[pay_1234_abc] Creating PIX payment with AbacatePay SDK...
[pay_1234_abc] PIX payment created: { billingId: 'xyz', status: 'PENDING' }
[pay_1234_abc] Payment saved: { paymentDbId: 'uuid', duration: '50ms' }

// Webhook
[webhook_5678_def] AbacatePay webhook received
[webhook_5678_def] Processing billing.updated event for billing ID: xyz
[webhook_5678_def] Payment approved! Generating download token...
[webhook_5678_def] Download token generated for payment uuid
```

---

## 🐛 Troubleshooting

### Erro: "Valor mínimo é R$ 1,00"
**Causa:** Amount < 100 centavos  
**Fix:** Enviar `amount: 100` (mínimo)

### Erro: "Failed to create billing"
**Causa:** API Key inválida ou não configurada  
**Fix:** Verificar `ABACATE_PAY_API_KEY` no `.env.local`

### Erro: "Customer data required"
**Causa:** Faltam dados obrigatórios (email, name, taxId)  
**Fix:** Preencher todos os campos do customer

### Webhook não chega
**Causa:** URL não acessível ou não configurada  
**Fix:** 
1. Em dev, use ngrok/localtunnel
2. Verifique dashboard do AbacatePay
3. Confirme que webhook está ativo

---

## 🔐 Segurança

### Validação de Webhook:

**⚠️ TODO: Implementar verificação de assinatura**

```typescript
// Futuro:
const signature = req.headers.get('x-abacatepay-signature');
if (!validateSignature(payload, signature, WEBHOOK_SECRET)) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}
```

### Headers de Segurança:

```typescript
// Webhook deve vir de IPs do AbacatePay
const ABACATEPAY_IPS = [
  "IP1",
  "IP2"
];

if (!ABACATEPAY_IPS.includes(requestIP)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}
```

---

## 📚 Recursos Úteis

- **Documentação:** https://docs.abacatepay.com
- **Dashboard:** https://dashboard.abacatepay.com
- **SDK GitHub:** https://github.com/abacatepay/abacatepay-nodejs-sdk
- **Suporte:** suporte@abacatepay.com

---

## 🚀 Deploy em Produção

### Checklist:

- [ ] Trocar `ABACATE_PAY_API_KEY` para chave de produção
- [ ] Configurar webhook para domínio de produção
- [ ] Implementar validação de assinatura do webhook
- [ ] Configurar rate limiting
- [ ] Adicionar logging/monitoring (Sentry, etc)
- [ ] Testar fluxo completo em produção
- [ ] Documentar procedimentos de rollback

---

**Última atualização:** 2025-01-11  
**Versão da Integração:** 1.0  
**SDK Version:** abacatepay-nodejs-sdk@1.0.0
