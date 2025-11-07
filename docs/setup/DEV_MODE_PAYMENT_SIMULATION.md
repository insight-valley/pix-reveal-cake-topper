# 🧪 Simulação de Pagamentos no Modo Dev

**Ambiente:** Development Mode  
**Gateway:** AbacatePay  
**Data:** 2025-01-11

---

## 📋 Visão Geral

No **modo de desenvolvimento** do AbacatePay, pagamentos PIX não são confirmados automaticamente. É necessário confirmar manualmente para testar o fluxo completo da aplicação.

Este documento descreve como simular pagamentos usando o endpoint `/api/simulate-payment` ou via MCP do AbacatePay.

---

## 🎯 Métodos de Simulação

### **Método 1: Endpoint de Simulação (Recomendado)**

O endpoint `/api/simulate-payment` permite confirmar pagamentos manualmente usando o ID do pagamento ou o ID do AbacatePay.

**Endpoint:** `POST /api/simulate-payment`

**Request:**
```json
{
  "paymentId": "uuid-do-pagamento-no-banco"
}
```

**Ou:**
```json
{
  "abacatePayId": "pix_char_xxxxx"
}
```

**Response:**
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

**Exemplo de uso:**
```bash
# 1. Criar pagamento
curl -X POST http://localhost:8080/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "imageId": "test-123",
    "description": "Teste",
    "customer": {
      "email": "teste@example.com",
      "name": "Teste Usuario",
      "taxId": "12345678901"
    }
  }'

# 2. Simular pagamento (usar payment_id retornado)
curl -X POST http://localhost:8080/api/simulate-payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "uuid-retornado-acima"
  }'
```

---

### **Método 2: Simular Webhook Manualmente**

Você pode simular o recebimento de um webhook do AbacatePay:

**Endpoint:** `POST /api/abacate-webhook`

**Request:**
```json
{
  "event": "billing.updated",
  "data": {
    "id": "pix_char_xxxxx",
    "status": "PAID",
    "paidAt": "2025-01-11T00:30:00Z"
  }
}
```

**Exemplo:**
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

---

### **Método 3: MCP do AbacatePay**

Se você tiver o MCP do AbacatePay configurado (via Serena ou CLI), pode usar diretamente:

**Via MCP Tool:**
```bash
mcp_abacate-pay_simulatePixPayment --id="pix_char_xxxxx"
```

**Via código (se MCP estiver disponível):**
```typescript
// O endpoint /api/simulate-payment já implementa isso internamente
// Mas você pode chamar diretamente se necessário
```

---

## 🔄 Fluxo Completo de Teste

### **Passo a Passo:**

1. **Gerar imagem e criar pagamento:**
   ```bash
   # Via interface web ou API
   POST /api/create-payment
   ```

2. **Obter ID do pagamento:**
   - Do response da criação: `payment_id` ou `abacate_pay_id`
   - Ou consultar banco de dados

3. **Simular pagamento:**
   ```bash
   POST /api/simulate-payment
   {
     "paymentId": "uuid-do-pagamento"
   }
   ```

4. **Verificar status:**
   ```bash
   GET /api/payment-status?paymentId=uuid-do-pagamento
   ```

5. **Baixar imagem:**
   - A interface deve mostrar botão de download
   - Ou usar token de download diretamente

---

## 📊 O que acontece internamente?

Quando você chama `/api/simulate-payment`:

1. ✅ Busca pagamento no banco de dados
2. ✅ Chama API do AbacatePay para simular pagamento
3. ✅ Atualiza status no banco: `pending` → `approved`
4. ✅ Gera token de download (válido por 24h)
5. ✅ Registra log de auditoria
6. ✅ Retorna status atualizado

---

## ⚠️ Limitações e Avisos

### **Apenas em Modo Dev:**
- O endpoint `/api/simulate-payment` **só funciona** com chaves de desenvolvimento
- Em produção, pagamentos são confirmados automaticamente via webhook
- Não há risco de usar em produção acidentalmente (a API do AbacatePay valida)

### **IDs Corretos:**
- Use `pix_char_xxx` (ID do QR Code PIX), não `bill_xxx` (ID da billing)
- O `abacate_pay_id` salvo no banco já está no formato correto

### **Token de Download:**
- Token é gerado automaticamente quando status muda para `approved`
- Token expira em 24 horas
- Apenas um token por pagamento (não reutilizável)

---

## 🐛 Troubleshooting

### **Erro: "Pagamento não encontrado"**
- Verifique se o `paymentId` ou `abacatePayId` está correto
- Confirme que o pagamento existe no banco de dados

### **Erro: "AbacatePay simulate payment failed"**
- Verifique se a chave de API é de desenvolvimento
- Confirme que o ID do QR Code PIX está correto (formato `pix_char_xxx`)
- Verifique logs do servidor para mais detalhes

### **Status não atualiza**
- Verifique logs do endpoint `/api/simulate-payment`
- Confirme que o webhook está configurado corretamente
- Teste consultando status diretamente: `GET /api/payment-status`

### **Token de download não gerado**
- Verifique logs para erros ao criar token
- Confirme que o status foi atualizado para `approved`
- Verifique se já existe um token válido para o pagamento

---

## 📚 Recursos Relacionados

- **Documentação AbacatePay:** https://docs.abacatepay.com
- **Integração Completa:** `/docs/setup/ABACATEPAY_INTEGRATION.md`
- **Testes de UX:** `/docs/reports/FULL_UX_TEST_REPORT_V*.md`

---

## ✅ Checklist de Validação

Após simular um pagamento, verifique:

- [ ] Status atualizado no banco: `pending` → `approved`
- [ ] Token de download gerado e salvo
- [ ] Log de auditoria registrado
- [ ] Interface mostra botão de download
- [ ] Download da imagem funciona corretamente
- [ ] Token expira após 24 horas

---

**Última atualização:** 2025-01-11  
**Versão:** 1.0
