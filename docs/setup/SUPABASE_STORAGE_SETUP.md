# 📦 Supabase Storage Setup

**Projeto:** Gerador de Topo de Bolo  
**Storage:** Supabase Storage para imagens geradas

---

## 🎯 Objetivo

Armazenar imagens geradas pelo DALL-E (OpenAI) de forma segura, com acesso controlado via URLs assinadas após pagamento.

---

## 🪣 Buckets Necessários

### `generated-images`

**Propósito:** Armazenar todas as imagens geradas pela IA

**Configuração:**
- **Nome:** `generated-images`
- **Public:** ❌ `false` (privado por padrão)
- **File size limit:** 10 MB
- **Allowed MIME types:** `image/png`, `image/jpeg`

---

## 🔧 Como Criar o Bucket

### Método 1: Via Dashboard Supabase (Manual)

1. Acesse o Dashboard:
   ```
   https://supabase.com/dashboard/project/phmbpoacpivuqlmjnnoj/storage/buckets
   ```

2. Clique em **"Create bucket"** ou **"New bucket"**

3. Preencha os campos:
   - **Name:** `generated-images`
   - **Public bucket:** ❌ Desmarcar (deve ser privado)
   - **Allowed MIME types:** `image/png, image/jpeg`
   - **File size limit:** `10485760` (10 MB)

4. Clique em **"Create bucket"**

5. Configure as políticas RLS (ver seção abaixo)

### Método 2: Via SQL (Automatizado)

Execute no SQL Editor do Supabase:

```sql
-- Criar bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-images', 'generated-images', false);

-- Configurar limite de tamanho (10 MB)
UPDATE storage.buckets 
SET file_size_limit = 10485760
WHERE id = 'generated-images';

-- Configurar MIME types permitidos
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg']
WHERE id = 'generated-images';
```

---

## 🔐 Políticas RLS (Row Level Security)

### Políticas para o bucket `generated-images`

```sql
-- 1. Permitir UPLOAD apenas via service_role (API backend)
CREATE POLICY "Service role can upload generated images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (
  bucket_id = 'generated-images'
);

-- 2. Permitir LEITURA apenas via service_role ou URLs assinadas
-- (URLs assinadas são geradas no backend e validam automaticamente)
CREATE POLICY "Anyone can read with signed URLs"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'generated-images'
);

-- 3. Permitir DELETE apenas via service_role (cleanup)
CREATE POLICY "Service role can delete old images"
ON storage.objects FOR DELETE
TO service_role
USING (
  bucket_id = 'generated-images'
);
```

### Como aplicar as políticas:

1. Acesse: https://supabase.com/dashboard/project/phmbpoacpivuqlmjnnoj/storage/policies

2. Selecione o bucket `generated-images`

3. Clique em **"New policy"** para cada política acima

4. Cole o SQL correspondente e salve

---

## 📁 Estrutura de Arquivos

### Padrão de nomes:
```
generated-images/
  ├── img_1234567890_abc12.png
  ├── img_1234567891_def34.png
  └── img_1234567892_ghi56.png
```

**Formato:** `img_{timestamp}_{randomId}.png`

**Exemplo:**
```typescript
const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// Resultado: img_1761102782207_warcwciux
```

---

## 🔑 URLs Assinadas (Signed URLs)

### O que são?

URLs temporárias que permitem acesso a arquivos privados por tempo limitado.

### Como funciona no projeto:

```typescript
// 1. Salvar imagem no Storage (backend)
await supabase.storage
  .from('generated-images')
  .upload(storagePath, imageBuffer, {
    contentType: 'image/png',
    upsert: true,
  });

// 2. Gerar URL assinada (válida por 12 horas)
const { data, error } = await supabase.storage
  .from('generated-images')
  .createSignedUrl(storagePath, 60 * 60 * 12); // 12 horas

// 3. Retornar URL para o frontend
return {
  imageId,
  imageUrl: data.signedUrl, // Temporária e segura
  storagePath,
};
```

### Duração das URLs:

| Contexto | Duração | Motivo |
|----------|---------|--------|
| Pré-visualização (antes do pagamento) | 12 horas | Tempo para usuário decidir |
| Download HD (após pagamento) | 24 horas | Janela generosa para download |

---

## 🧪 Como Testar

### 1. Verificar se o bucket existe:

```bash
# Via curl (substitua SEU_SERVICE_ROLE_KEY)
curl -X GET \
  'https://phmbpoacpivuqlmjnnoj.supabase.co/storage/v1/bucket' \
  -H "Authorization: Bearer SEU_SERVICE_ROLE_KEY"
```

**Resposta esperada:**
```json
[
  {
    "id": "generated-images",
    "name": "generated-images",
    "public": false,
    "file_size_limit": 10485760,
    "allowed_mime_types": ["image/png", "image/jpeg"]
  }
]
```

### 2. Testar upload via API:

```bash
curl -X POST http://localhost:8080/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Teste de upload","imageId":"test_12345"}'
```

**Resposta esperada (sucesso):**
```json
{
  "imageId": "test_12345",
  "imageUrl": "https://phmbpoacpivuqlmjnnoj.supabase.co/storage/v1/object/sign/...",
  "storagePath": "generated-images/test_12345.png",
  "metadata": { ... }
}
```

### 3. Verificar arquivo foi salvo:

Acesse o Dashboard:
```
https://supabase.com/dashboard/project/phmbpoacpivuqlmjnnoj/storage/buckets/generated-images
```

Você deve ver o arquivo `test_12345.png` listado.

---

## 🔄 Limpeza Automática (Futuro)

### Estratégia recomendada:

```sql
-- Função para deletar imagens antigas (>7 dias sem pagamento)
CREATE OR REPLACE FUNCTION cleanup_old_images()
RETURNS void AS $$
BEGIN
  -- Deletar imagens sem pagamento aprovado após 7 dias
  DELETE FROM storage.objects
  WHERE bucket_id = 'generated-images'
    AND created_at < NOW() - INTERVAL '7 days'
    AND name NOT IN (
      SELECT DISTINCT CONCAT('generated-images/', image_id, '.png')
      FROM payments
      WHERE status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agendar execução diária (via pg_cron ou Supabase Edge Function)
```

**⚠️ Implementação futura** - não aplicar agora.

---

## ⚠️ Troubleshooting

### Erro: "Bucket not found"

**Causa:** Bucket `generated-images` não foi criado  
**Fix:** Siga o passo-a-passo em "Como Criar o Bucket"

### Erro: "new row violates row-level security policy"

**Causa:** Políticas RLS não configuradas corretamente  
**Fix:** 
1. Verifique se está usando `SUPABASE_SERVICE_ROLE_KEY` no backend
2. Aplique as políticas RLS da seção acima

### Erro: "File size exceeds limit"

**Causa:** Imagem maior que 10 MB  
**Fix:** 
1. Aumentar limite do bucket (se necessário)
2. Implementar compressão de imagens antes do upload

### Erro: "Invalid MIME type"

**Causa:** Tentando fazer upload de arquivo não suportado  
**Fix:** Apenas PNG e JPEG são permitidos

---

## 📊 Monitoramento

### Métricas importantes:

1. **Usage (Armazenamento usado):**
   - Dashboard → Storage → Usage
   - Limite: 1 GB (plano free)

2. **Bandwidth (Tráfego):**
   - Dashboard → Storage → Bandwidth
   - Limite: 2 GB/mês (plano free)

3. **Request count:**
   - Dashboard → Storage → Request count
   - Monitorar spikes anormais

### Alertas recomendados:

- ⚠️ **Uso > 80%** do storage
- ⚠️ **Bandwidth > 80%** do limite mensal
- 🔴 **Erros de upload** > 5% das requisições

---

## 🔗 Links Úteis

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Dashboard Storage](https://supabase.com/dashboard/project/phmbpoacpivuqlmjnnoj/storage/buckets)
- [Signed URLs Guide](https://supabase.com/docs/guides/storage/security/signed-urls)

---

**Última atualização:** 2025-10-22  
**Status:** Bucket precisa ser criado (pendente)



