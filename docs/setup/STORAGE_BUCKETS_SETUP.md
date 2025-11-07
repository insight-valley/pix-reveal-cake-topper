# Supabase Storage Buckets Setup

## Buckets Necessários

O sistema requer dois buckets no Supabase Storage:

### 1. `generated-images` (HD originals)
- **Status:** ✅ Já existe
- Armazena imagens em alta definição (1024x1024 PNG)
- Acesso: Privado (somente via signed URLs após pagamento)

### 2. `generated-previews` (Watermarked previews)
- **Status:** ⚠️ Precisa ser criado
- Armazena previews degradadas (800px JPEG com watermark)
- Acesso: Privado (via signed URLs antes do pagamento)

## Como Criar `generated-previews`

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o Dashboard do Supabase
2. Vá em **Storage** no menu lateral
3. Clique em **New bucket**
4. Configure:
   - **Name:** `generated-previews`
   - **Public:** `false` (unchecked)
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** `image/jpeg, image/jpg`
5. Clique em **Create bucket**

### Opção 2: Via SQL (Supabase SQL Editor)

```sql
-- Criar bucket via SQL
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-previews',
  'generated-previews',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/jpg']
);
```

### Opção 3: Via Supabase CLI

```bash
supabase storage create generated-previews \
  --public=false \
  --file-size-limit=5242880 \
  --allowed-mime-types=image/jpeg,image/jpg
```

## Policies de Acesso

Após criar o bucket, configure as policies:

### Service Role: Full Access

```sql
-- Policy para service role (backend)
CREATE POLICY "Service role has full access to generated-previews"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'generated-previews');
```

### Anon: Read via Signed URLs only

As signed URLs já fornecem acesso temporário, não é necessária policy adicional para `anon`.

## Verificação

Para verificar se os buckets estão configurados corretamente:

### Via Dashboard
1. Storage → Buckets
2. Verificar se ambos `generated-images` e `generated-previews` existem
3. Ambos devem estar marcados como **Private**

### Via API

```bash
curl "${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/bucket" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
```

Deve retornar ambos os buckets na lista.

## Estrutura Esperada

```
storage/
├── generated-images/
│   └── <imageId>.png         # HD 1024x1024 PNG
└── generated-previews/
    └── <imageId>.jpeg        # Preview 800px JPEG + watermark
```

## Troubleshooting

### Bucket já existe
Se ao tentar criar retornar erro "Bucket already exists", está tudo certo! Você pode pular a criação.

### Erro de permissão
Certifique-se de estar usando a `SUPABASE_SERVICE_ROLE_KEY`, não a `anon` key.

### Imagens não aparecem
1. Verifique se o bucket existe
2. Verifique se as policies estão configuradas
3. Verifique logs do Next.js para erros de upload
4. Verifique signed URL não expirou

## Storage Cleanup (Opcional)

Para limpar previews antigos (economizar espaço):

```sql
-- Deletar previews com mais de 7 dias
DELETE FROM storage.objects
WHERE bucket_id = 'generated-previews'
  AND created_at < NOW() - INTERVAL '7 days';
```

Configurar via Supabase Edge Function para rodar automaticamente.

## Custos

- **Free tier:** 1GB storage
- **Pro:** $0.021/GB/month
- Previews são ~70% menores que HD (JPEG vs PNG)
- Considerar cleanup automático de previews antigas

---

**Última atualização:** 22 de Outubro de 2025  
**Relacionado:** `/docs/reports/IMAGE_PROTECTION_IMPLEMENTATION.md`
