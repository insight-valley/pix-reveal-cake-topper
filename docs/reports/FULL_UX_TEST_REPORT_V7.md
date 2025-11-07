# 🧪 Full UX Test Report V7

**Data:** 2025-10-22  
**Teste:** End-to-End Complete Flow  
**Testador:** AI Assistant (Cursor)  
**Duração:** ~30 minutos

---

## 🎯 Sumário Executivo

### Status Geral: 🔴 **CRÍTICO - Sistema não funcional**

**Problema principal identificado:**
1. ✅ **CORRIGIDO:** Campo `imageUrl` era obrigatório mas não usado
2. 🔴 **CRÍTICO:** Bucket `generated-images` não existe no Supabase Storage

### Resultado
- ❌ Geração de imagens: **FALHOU**
- ❌ Fluxo de pagamento: **NÃO TESTADO** (bloqueado pelo erro anterior)
- ✅ Interface: **OK**
- ✅ APIs Health: **OK**

---

## 🐛 Bugs Críticos Encontrados

### 🔴 BUG #1: Campo `imageUrl` obrigatório mas não usado
**Severidade:** Alta  
**Status:** ✅ **CORRIGIDO**

**Descrição:**
- API `/api/generate-image` exigia `imageUrl` como campo obrigatório
- Esse campo nunca era usado no processo de geração
- Causava erro: "Prompt, imageUrl e imageId são obrigatórios"

**Causa Raiz:**
```tsx
// src/components/CakeTopperGenerator.tsx:68
const result = await generateImage({
  prompt: text,
  imageUrl: (cakeTopperExample as unknown as { src: string }).src, // ❌ PROBLEMA
  imageId,
});
```

**Fix Aplicado:**
1. Removido campo `imageUrl` da interface `GenerateImageParams` em:
   - `app/api/generate-image/route.ts`
   - `src/services/imageGenerator.ts`
   - `src/hooks/useImageGeneration.ts`
   - `src/components/CakeTopperGenerator.tsx`

2. Simplificado chamada da API:
```tsx
// ANTES
const result = await generateImage({
  prompt: text,
  imageUrl: (cakeTopperExample as unknown as { src: string }).src,
  imageId,
});

// DEPOIS  
const result = await generateImage({
  prompt: text,
  imageId,
});
```

**Evidência:**
- Console log ANTES: `Gerando imagem com: {prompt, imageUrl: /_next/static/media/..., imageId}`
- Console log DEPOIS: `Gerando imagem com: {prompt, imageId}` ✅

---

### 🔴 BUG #2: Bucket Supabase Storage não existe
**Severidade:** 🔴 **CRÍTICA** (BLOQUEIA TODO O SISTEMA)  
**Status:** ⏳ **PENDENTE**

**Descrição:**
- API retorna erro 500: "Falha ao salvar imagem gerada"
- Detalhes: "Bucket not found"
- Bucket `generated-images` não foi criado no Supabase Storage

**Como reproduzir:**
```bash
curl -X POST http://localhost:8080/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Teste","imageId":"test_456"}'

# Resposta:
{
  "error": "Falha ao salvar imagem gerada",
  "details": "Bucket not found"
}
```

**Fix Necessário:**
1. Criar bucket `generated-images` no Supabase Storage
2. Configurar políticas de acesso (public read após pagamento)
3. Documentar processo em `/docs/setup/SUPABASE_SETUP.md`

**Script para criar bucket (via Supabase Dashboard):**
```
1. Acessar: https://supabase.com/dashboard/project/phmbpoacpivuqlmjnnoj/storage/buckets
2. Clicar em "Create bucket"
3. Nome: `generated-images`
4. Public: ❌ (false) - apenas URLs assinadas
5. File size limit: 10MB
6. Allowed MIME types: image/png, image/jpeg
```

**Políticas RLS recomendadas:**
```sql
-- Permitir upload apenas via service_role
CREATE POLICY "Service role can upload"
ON storage.objects FOR INSERT
USING (bucket_id = 'generated-images' AND auth.role() = 'service_role');

-- Permitir leitura com signed URLs
CREATE POLICY "Authenticated can read"
ON storage.objects FOR SELECT
USING (bucket_id = 'generated-images');
```

---

## 📸 Screenshots e Evidências

### 1. Homepage Inicial
![Homepage](.playwright-mcp/01-homepage-initial.png)
- ✅ Interface carrega corretamente
- ✅ Botão "Gerar Imagem" desabilitado quando vazio
- ✅ Placeholder text visível

### 2. Erro de Geração (ANTES do fix)
![Erro Geração](.playwright-mcp/02-error-generation.png)
- ❌ Erro: "Falha ao salvar imagem gerada"
- Console: `Failed to load resource: 500 (Internal Server Error)`

### 3. Tentativa Pós-Fix
![Pós Fix](.playwright-mcp/03-generation-success.png)
- ✅ Campo `imageUrl` removido do payload
- ❌ Ainda falha com "Bucket not found"

---

## 🔍 Testes Realizados

### ✅ 1. Health Checks
```bash
curl http://localhost:8080/api/health
```
**Resultado:** ✅ OK
```json
{
  "status": "healthy",
  "checks": {
    "api": {"status": "ok"},
    "database": {"status": "ok", "responseTime": 809},
    "openai": {"status": "configured"},
    "abacatepay": {"status": "configured"}
  }
}
```

### ❌ 2. Geração de Imagem (Frontend)
**Steps:**
1. Acessar http://localhost:8080
2. Preencher prompt: "Feliz Aniversário João"
3. Clicar em "Gerar Imagem"

**Resultado:** ❌ FALHOU
- Erro: "Erro ao gerar imagem. Tente novamente.: Falha ao salvar imagem gerada"
- Status HTTP: 500
- Detalhes: "Bucket not found"

### ❌ 3. Geração de Imagem (API Direta)
```bash
curl -X POST http://localhost:8080/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Parabéns Maria","imageId":"test_123"}'
```

**Resultado:** ❌ FALHOU (mesmo erro)

### ⏸️ 4. Fluxo de Pagamento
**Status:** NÃO TESTADO (bloqueado por Bug #2)

---

## 📊 Console Logs Relevantes

### Browser Console:
```
[LOG] Gerando imagem com: {prompt: Feliz Aniversário João, imageId: img_1761102782207_warcwciux}
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error)
[ERROR] Erro na geração de imagem: Error: Falha ao salvar imagem gerada
```

### Server Logs (inferido):
```
[img_XXX] Request payload: {prompt: "Feliz...", imageId: "img_XXX"}
[img_XXX] OpenAI API call completed: {status: 200}
[img_XXX] Uploading generated image to Supabase Storage
[img_XXX] Failed to upload image: Bucket not found
```

---

## 🎯 Action Items (Priorizado)

### 🔴 Crítico (AGORA)
1. **Criar bucket `generated-images` no Supabase Storage**
   - Acessar Dashboard Supabase
   - Criar bucket com configurações corretas
   - Configurar políticas RLS
   - **ETA:** 10 minutos

2. **Documentar setup do Storage**
   - Atualizar `/docs/setup/SUPABASE_SETUP.md`
   - Adicionar seção sobre Storage
   - **ETA:** 15 minutos

3. **Validar fluxo completo após fix**
   - Testar geração end-to-end
   - Testar pagamento completo
   - **ETA:** 20 minutos

### 🟡 Médio (PRÓXIMO)
4. **Adicionar validação de bucket na inicialização**
   ```typescript
   // Verificar se bucket existe no startup
   async function validateStorageSetup() {
     const buckets = await supabase.storage.listBuckets();
     if (!buckets.find(b => b.name === 'generated-images')) {
       console.error('❌ Bucket generated-images not found!');
       throw new Error('Storage not configured');
     }
   }
   ```

5. **Melhorar mensagens de erro**
   - Diferenciar erro de bucket vs erro de upload
   - Mostrar mensagem user-friendly

### 🟢 Baixo (FUTURO)
6. **Adicionar retry logic para uploads**
7. **Monitorar uso de Storage no Supabase**
8. **Implementar limpeza de imagens antigas**

---

## 📈 Métricas

| Métrica | Valor |
|---------|-------|
| Tempo total de teste | ~30min |
| Bugs críticos encontrados | 2 |
| Bugs corrigidos | 1 |
| Taxa de sucesso | 0% (bloqueado) |
| Tempo médio de geração | N/A |
| APIs testadas | 2/4 |

---

## 🎓 Lições Aprendidas

### 1. **Validar infraestrutura antes de deploy**
   - Storage buckets devem ser criados na migration
   - Health check deveria incluir validação de Storage

### 2. **Campos obrigatórios devem ser usados**
   - `imageUrl` era obrigatório mas nunca usado
   - Revisar interfaces e remover campos desnecessários

### 3. **Mensagens de erro devem ser específicas**
   - "Falha ao salvar imagem" é genérico
   - Melhor: "Bucket Supabase não configurado"

### 4. **Testing é crítico**
   - Bug #2 teria sido detectado em staging
   - Adicionar testes E2E automatizados

---

## 📝 Próximos Passos

1. ✅ Criar bucket `generated-images` no Supabase
2. ✅ Validar geração de imagem funciona
3. ✅ Testar fluxo de pagamento completo
4. ✅ Documentar todas as correções
5. ✅ Adicionar script de setup automático

---

## 📚 Referências

- Bug #1 Fix: Commits relacionados à remoção de `imageUrl`
- Bug #2: https://supabase.com/docs/guides/storage
- Documentação: `/docs/setup/SUPABASE_SETUP.md` (a ser atualizado)

---

**Conclusão:**
Sistema está **não-funcional** devido ao bucket faltante. Fix é simples (criar bucket), mas é bloqueador total. Após correção, sistema deve funcionar normalmente.

**Próximo teste:** V8 após criação do bucket.
