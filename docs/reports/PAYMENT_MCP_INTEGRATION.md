# Integração com MCP do AbacatePay para Testes

**Data**: 11 de Janeiro de 2025  
**Status**: ✅ Implementado (com limitações conhecidas)

## 📋 Resumo

Implementada solução para testar o fluxo completo de pagamento usando o AbacatePay, com suporte para MCP quando disponível.

## 🎯 Solução Implementada

### 1. Endpoint de Teste (`/api/test-simulate-payment`)

Endpoint que tenta simular pagamentos via API do AbacatePay:

```typescript
POST /api/test-simulate-payment
{
  "pixQrCodeId": "pix_char_xxx"
}
```

**Comportamento:**
- Tenta usar `abacatePay.simulatePixPayment()`
- Se falhar (endpoint não existe), verifica status atual
- Retorna informações úteis para debug

### 2. Teste Completo com Retry Logic

Criado teste em `tests/payment-integration-mcp.spec.ts` que:
- Cria pagamento
- Tenta simular via API/MCP
- Aguarda token de download (até 15 tentativas)
- Valida download com retry (até 5 tentativas)

### 3. Helper para AbacatePay

Helper em `tests/helpers/abacate-pay-helper.ts` com funções:
- `simulatePaymentViaMCP()` - Simula pagamento
- `checkPaymentStatusViaMCP()` - Verifica status

## ⚠️ Limitações Conhecidas

### AbacatePay API

O AbacatePay em modo de desenvolvimento:
- ❌ **Não tem endpoint `/v1/pixQrCode/simulate`**
- ⚠️ Status não é atualizado automaticamente
- ✅ Webhooks podem ser simulados manualmente

### Soluções Disponíveis

#### Opção 1: Usar MCP do AbacatePay (Recomendado)

Se o MCP estiver disponível e funcionando:

```typescript
// Em um ambiente que suporta MCP diretamente
const result = await mcp_abacate-pay_simulatePixPayment({
  id: pixQrCodeId
});
```

**Vantagens:**
- Atualiza status real no AbacatePay
- Permite validar fluxo completo
- Funciona como em produção

**Desvantagens:**
- Requer MCP configurado
- Pode não estar disponível em todos os ambientes

#### Opção 2: Modo de Teste com Bypass

Adicionar variável de ambiente `TEST_MODE=true` e modificar validação:

```typescript
// Em /api/validate-download
if (process.env.TEST_MODE === 'true' && payment.status === 'approved') {
  // Bypassar validação real do AbacatePay em testes
  return { valid: true, imageUrl: ... };
}
```

**Vantagens:**
- Testes rápidos e confiáveis
- Não depende de API externa
- Funciona sempre

**Desvantagens:**
- Não valida integração real com AbacatePay
- Pode mascarar problemas de integração

#### Opção 3: Conta de Teste Real

Usar conta de teste do AbacatePay que permite:
- Pagamentos automáticos em dev
- Status atualizado imediatamente
- Validação real funcionando

**Vantagens:**
- Validação real completa
- Testa integração real
- Mais próximo de produção

**Desvantagens:**
- Requer configuração adicional
- Pode ter custos

## 🚀 Como Usar

### Executar Testes com MCP

```bash
# Teste completo com retry logic
npx playwright test tests/payment-integration-mcp.spec.ts

# Testes de integração padrão
npx playwright test tests/payment-integration.spec.ts
```

### Configurar MCP (se disponível)

1. Verificar se MCP do AbacatePay está configurado
2. Usar função `mcp_abacate-pay_simulatePixPayment` diretamente
3. Atualizar endpoint `/api/test-simulate-payment` para usar MCP

## 📊 Resultados Atuais

### Testes de Integração Padrão

```
✅ 7 passed
⏭️  1 skipped (validação de download - AbacatePay não atualiza em dev)
```

### Teste com MCP

```
⏭️  1 skipped (aguarda MCP ou conta de teste)
```

## 💡 Recomendações

### Para Desenvolvimento Local

1. **Usar modo de teste com bypass** para testes rápidos
2. **Validar integração manualmente** antes de deploy
3. **Usar webhook simulado** para testar fluxo de atualização

### Para CI/CD

1. **Usar conta de teste real** do AbacatePay
2. **Ou usar modo de teste** com bypass
3. **Validar integração** em ambiente de staging

### Para Produção

1. **Sempre validar** com AbacatePay real
2. **Monitorar webhooks** e logs
3. **Ter fallback** para validação manual se necessário

## 🔄 Próximos Passos

1. **Verificar disponibilidade do MCP** do AbacatePay
2. **Implementar modo de teste** com bypass se necessário
3. **Configurar conta de teste** para validação real
4. **Documentar processo** de validação manual

## 📝 Arquivos Criados

1. `app/api/test-simulate-payment/route.ts` - Endpoint de teste
2. `tests/helpers/abacate-pay-helper.ts` - Helpers para AbacatePay
3. `tests/payment-integration-mcp.spec.ts` - Teste completo com MCP
4. `docs/reports/PAYMENT_MCP_INTEGRATION.md` - Esta documentação

## ✅ Conclusão

A solução implementada permite testar o fluxo completo de pagamento, mas ainda depende de:
- MCP do AbacatePay funcionando, OU
- Modo de teste com bypass, OU
- Conta de teste real

A escolha depende do ambiente e requisitos de validação.
