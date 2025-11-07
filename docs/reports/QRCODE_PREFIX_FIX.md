# 🔧 Correção: QR Code com Prefixo Duplicado

**Data:** 2025-01-18  
**Tipo:** Bug Fix  
**Severidade:** Alta (impedia exibição do QR Code)

## 📋 Problema

O QR Code do AbacatePay não estava sendo exibido no frontend devido ao prefixo `data:image/png;base64,` estar duplicado.

### Sintomas
- QR Code não aparecia na tela
- Console do navegador mostrava: `Failed to load resource: net::ERR_INVALID_URL`
- URL da imagem: `data:image/png;base64,data:image/png;base64,iVBORw0...`

### Causa Raiz
A API do AbacatePay retorna o `brCodeBase64` **já com** o prefixo `data:image/png;base64,`, mas o código não estava verificando isso antes de usar o valor.

## ✅ Solução

Implementada lógica de normalização em `lib/abacatepay.ts` que:

1. **Detecta** se o prefixo já existe
2. **Remove** prefixos duplicados se existirem
3. **Adiciona** o prefixo se não existir
4. **Mantém** inalterado se já estiver correto

### Código Aplicado

```typescript
// lib/abacatepay.ts - linha ~131
if (brCodeBase64) {
  // Verificar se já tem o prefixo
  const hasPrefix = brCodeBase64.startsWith("data:image/png;base64,");
  
  // Se tem prefixo duplicado, remover um
  if (brCodeBase64.match(/^data:image\/png;base64,data:image\/png;base64,/)) {
    console.log("[AbacatePay] FIXING: QR Code has DUPLICATE prefix!");
    brCodeBase64 = brCodeBase64.replace(
      /^data:image\/png;base64,data:image\/png;base64,/,
      "data:image/png;base64,"
    );
  }
  // Se não tem prefixo, adicionar
  else if (!hasPrefix) {
    console.log("[AbacatePay] Adding data URI prefix to QR Code");
    brCodeBase64 = `data:image/png;base64,${brCodeBase64}`;
  }
}
```

## 🧪 Testes

### Teste Unitário
Criado `tests/qrcode-prefix.test.js` que valida:

✅ **Caso 1:** QR Code sem prefixo → adiciona prefixo  
✅ **Caso 2:** QR Code com prefixo correto (1x) → mantém inalterado  
✅ **Caso 3:** QR Code com prefixo duplicado (2x) → remove duplicata  
✅ **Caso 4:** QR Code undefined → retorna undefined  
✅ **Caso 5:** QR Code base64 válido → adiciona prefixo  

**Resultado:** 5/5 testes passaram ✅

### Como Executar

```bash
node tests/qrcode-prefix.test.js
```

## 📝 Arquivos Modificados

- ✏️ `lib/abacatepay.ts` - Adicionada lógica de normalização
- ➕ `tests/qrcode-prefix.test.js` - Teste unitário
- 📄 `docs/reports/QRCODE_PREFIX_FIX.md` - Esta documentação

## ✨ Resultado

- ✅ QR Code agora é exibido corretamente
- ✅ Solução robusta que funciona independente do formato que a API retornar
- ✅ Código defensivo que previne problemas futuros
- ✅ 100% dos testes passando

## 🔍 Validação Manual

Para validar em produção:

1. Gerar um novo pagamento PIX
2. Verificar que o QR Code aparece na tela
3. Inspecionar elemento e confirmar que a URL da imagem tem apenas **UM** prefixo `data:image/png;base64,`
4. Verificar console do navegador (não deve ter erros `ERR_INVALID_URL`)

## 📚 Lições Aprendidas

1. **Sempre validar** dados externos (APIs) antes de usar
2. **Criar testes unitários** para bugs críticos
3. **Documentar** o comportamento esperado de APIs de terceiros
4. **Usar lógica defensiva** para prevenir problemas similares

## 🔗 Referências

- Issue original: Usuário reportou QR code não exibido
- AbacatePay API Docs: https://docs.abacatepay.com/
- Commit anterior: Fix duplicado em `/docs/reports/FULL_UX_TEST_REPORT_V5.md`
