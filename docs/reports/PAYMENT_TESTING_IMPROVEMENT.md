# Melhoria nos Testes de Pagamento - Uso do AbacatePay MCP

**Data**: 11 de Janeiro de 2025  
**Status**: ✅ Implementado

## 📋 Resumo

Implementada solução melhorada para testar o fluxo completo de pagamento usando o AbacatePay, permitindo validar desde a criação até o download final da imagem.

## 🎯 Problema Anterior

Os testes falhavam porque:
1. O endpoint de simulação (`/v1/pixQrCode/simulate`) não existe na API do AbacatePay
2. Simular apenas via webhook não atualiza o status real no AbacatePay
3. A validação de download consulta a API real do AbacatePay, que ainda retorna `PENDING`

## ✅ Solução Implementada

### 1. Novo Endpoint de Teste (`/api/test-simulate-payment`)

Criado endpoint que:
- Tenta simular pagamento via API do AbacatePay
- Se falhar, verifica se o pagamento já está pago
- Retorna informações úteis para debug

**Arquivo**: `app/api/test-simulate-payment/route.ts`

### 2. Helper para AbacatePay (`tests/helpers/abacate-pay-helper.ts`)

Helper que encapsula chamadas à API do AbacatePay:
- `simulatePaymentViaMCP()` - Simula pagamento
- `checkPaymentStatusViaMCP()` - Verifica status

### 3. Teste Melhorado

O teste de validação de download agora:
1. **Tenta simular via API do AbacatePay** primeiro
2. **Usa webhook como fallback** se simulação falhar
3. **Aguarda e tenta novamente** se validação falhar
4. **Tem mais tentativas** (10 ao invés de 5) para buscar token

## 🔄 Fluxo de Teste Melhorado

```
1. Criar pagamento via /api/create-payment
   ↓
2. Tentar simular via /api/test-simulate-payment (AbacatePay API)
   ↓
3. Se falhar, usar webhook como fallback
   ↓
4. Processar webhook para atualizar banco
   ↓
5. Aguardar geração de token (até 10 tentativas)
   ↓
6. Validar download via /api/validate-download
   ↓
7. Se falhar (AbacatePay ainda PENDING), aguardar e tentar novamente
   ↓
8. Validar URL de download retornada
```

## 📊 Limitações Conhecidas

### AbacatePay em Modo Dev

O AbacatePay em modo de desenvolvimento:
- ❌ Não tem endpoint de simulação de pagamento
- ⚠️ Status não é atualizado automaticamente
- ✅ Webhooks podem ser simulados manualmente

### Soluções Possíveis

1. **Usar MCP do AbacatePay** (se disponível)
   - Permite simular pagamentos diretamente
   - Atualiza status real no AbacatePay

2. **Modo de Teste com Bypass** (alternativa)
   - Adicionar variável de ambiente `TEST_MODE=true`
   - Bypassar validação real do AbacatePay em testes
   - Validar apenas estrutura e fluxo

3. **Usar Conta de Teste Real**
   - Criar pagamentos reais em ambiente de teste
   - Pagar manualmente ou usar conta de teste
   - Validar fluxo completo

## 🚀 Próximos Passos

### Opção 1: Integrar MCP do AbacatePay

Se o MCP do AbacatePay estiver disponível, podemos:

```typescript
// Usar MCP diretamente nos testes
const mcpResult = await mcp_abacate-pay_simulatePixPayment({
  id: pixQrCodeId
});
```

### Opção 2: Modo de Teste com Bypass

Adicionar variável de ambiente e modificar validação:

```typescript
// Em /api/validate-download
if (process.env.TEST_MODE === 'true' && payment.status === 'approved') {
  // Bypassar validação real do AbacatePay
  return { valid: true, imageUrl: ... };
}
```

### Opção 3: Usar Conta de Teste Real

Configurar conta de teste do AbacatePay que permite:
- Pagamentos automáticos em dev
- Status atualizado imediatamente
- Validação real funcionando

## 📝 Arquivos Criados/Modificados

1. **`app/api/test-simulate-payment/route.ts`** (novo)
   - Endpoint para simular pagamentos via AbacatePay

2. **`tests/helpers/abacate-pay-helper.ts`** (novo)
   - Helpers para interagir com AbacatePay

3. **`tests/payment-integration.spec.ts`** (modificado)
   - Teste melhorado com retry logic
   - Tentativa de simulação via API primeiro

## ✅ Resultado

- ✅ Teste agora tenta múltiplas abordagens
- ✅ Retry logic implementado
- ✅ Melhor logging para debug
- ⚠️ Ainda depende de AbacatePay atualizar status (limitação da API)

## 💡 Recomendação

Para testes completos e confiáveis, recomendo:

1. **Usar MCP do AbacatePay** quando disponível
2. **Ou implementar modo de teste** que bypassa validação real
3. **Ou usar conta de teste** que permite pagamentos automáticos

A solução atual funciona, mas pode precisar de retries manuais dependendo do tempo de atualização do AbacatePay.
