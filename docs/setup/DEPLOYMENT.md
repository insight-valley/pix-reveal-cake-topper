# 🚀 Guia de Deploy na Vercel

## Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Projeto Supabase configurado
3. Chave de API do OpenAI
4. Chave de API do AbacatePay

---

## 1. Preparar Banco de Dados (Supabase)

### 1.1 Executar Migrações

```bash
# Conectar ao Supabase
supabase link --project-ref seu-project-ref

# Executar migrações
supabase db push

# Ou via SQL Editor no Dashboard:
# 1. Abra o SQL Editor no Supabase Dashboard
# 2. Execute supabase/migrations/20250109000000_add_payments_system.sql
# 3. Execute supabase/migrations/20250111000000_migrate_to_abacatepay.sql
```

### 1.2 Configurar RLS (Row Level Security)

As migrações já incluem as políticas RLS. Verifique se estão ativas:

```sql
-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('payments', 'download_tokens', 'payment_logs');
```

---

## 2. Deploy na Vercel

### 2.1 Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New..." → "Project"
3. Selecione seu repositório Git
4. Framework Preset: **Next.js** (detectado automaticamente)
5. Root Directory: `./` (raiz do projeto)

### 2.2 Configurar Variáveis de Ambiente

No painel da Vercel, vá em Settings → Environment Variables e adicione:

```bash
# Next.js
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (secret)

# OpenAI
OPENAI_API_KEY=sk-proj-... (secret)

# AbacatePay - DESENVOLVIMENTO
ABACATE_PAY_API_KEY=abc_dev_xf5cGzyzdSWMmHjY2W5uhwZ3 (secret)

# AbacatePay - PRODUÇÃO (quando for usar)
# ABACATE_PAY_API_KEY=abc_prod_... (secret)
```

**Importante**: Marque como "secret" todas as chaves sensíveis.

### 2.3 Deploy

1. Clique em "Deploy"
2. Aguarde o build (2-3 minutos)
3. Acesse a URL fornecida pela Vercel

---

## 3. Configurar Webhook do AbacatePay

### 3.1 URL do Webhook

Após o deploy, anote a URL:

```
https://seu-dominio.vercel.app/api/abacate-webhook
```

### 3.2 Registrar Webhook no AbacatePay

1. Acesse o [Dashboard do AbacatePay](https://dashboard.abacatepay.com)
2. Vá em "Webhooks" ou "Configurações"
3. Adicione a URL do webhook
4. Selecione os eventos:
   - `billing.paid` (pagamento aprovado)
   - `billing.expired` (pagamento expirado)
   - `billing.cancelled` (pagamento cancelado)
   - `billing.refunded` (pagamento reembolsado)

---

## 4. Testar a Integração

### 4.1 Teste de Health Check

```bash
curl https://seu-dominio.vercel.app/api/healthz
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123,
  "environment": "production"
}
```

### 4.2 Teste de Geração de Imagem

1. Acesse o site
2. Digite um prompt (ex: "Feliz Aniversário")
3. Clique em "Gerar Imagem"
4. Verifique se a prévia é exibida

### 4.3 Teste de Pagamento (Ambiente de Desenvolvimento)

1. Clique em "Pagar e Baixar HD"
2. Preencha os dados:
   - Email: test@example.com
   - CPF: 123.456.789-01
3. Gere o QR Code PIX
4. Use o MCP do AbacatePay para simular pagamento:

```bash
# Via terminal (se tiver o MCP configurado)
abacatepay simulate-payment <pix_id>
```

5. Verifique se o download é liberado automaticamente

---

## 5. Migrar para Produção

### 5.1 Obter Chaves de Produção

1. **AbacatePay**: Solicite upgrade para produção no dashboard
2. **OpenAI**: Já está em produção por padrão

### 5.2 Atualizar Variáveis de Ambiente

Na Vercel, atualize:

```bash
ABACATE_PAY_API_KEY=abc_prod_... (sua chave de produção)
```

### 5.3 Ajustar Preço Mínimo

O AbacatePay exige **valor mínimo de R$ 1,00** (100 centavos).

Atualize em `src/components/CakeTopperGenerator.tsx`:

```typescript
const IMAGE_PRICE = 1.00; // R$ 1,00 (mínimo do AbacatePay)
```

### 5.4 Configurar Domínio Customizado (Opcional)

1. Na Vercel: Settings → Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Atualize `NEXT_PUBLIC_SITE_URL`

---

## 6. Monitoramento

### 6.1 Logs da Vercel

- Acesse: Project → Deployments → (seu deploy) → Functions
- Visualize logs em tempo real

### 6.2 Logs do Supabase

```sql
-- Ver logs de pagamentos
SELECT * FROM payment_logs 
ORDER BY created_at DESC 
LIMIT 50;

-- Ver pagamentos pendentes
SELECT * FROM payments 
WHERE status = 'pending' 
ORDER BY created_at DESC;

-- Ver tokens de download
SELECT * FROM download_tokens 
WHERE used_at IS NULL 
ORDER BY created_at DESC;
```

### 6.3 Alertas (Recomendado)

Configure alertas na Vercel para:

- Erros 500 em APIs
- Taxa de erro > 1%
- Tempo de resposta > 3s

---

## 7. Troubleshooting

### Build falha

**Erro**: `Module not found: Can't resolve 'abacatepay-nodejs-sdk'`

**Solução**:
```bash
npm install
npm run build  # Testar localmente
git add .
git commit -m "fix: install dependencies"
git push
```

### Webhook não funciona

**Solução**:
1. Verifique se a URL está correta no AbacatePay
2. Teste manualmente:
   ```bash
   curl -X POST https://seu-dominio.vercel.app/api/abacate-webhook \
     -H "Content-Type: application/json" \
     -d '{"event":"test","data":{}}'
   ```
3. Verifique logs na Vercel

### Pagamento não confirma

**Solução**:
1. Verifique logs: `payment_logs` table
2. Confirme se webhook foi recebido
3. Verifique status na API:
   ```bash
   curl https://seu-dominio.vercel.app/api/payment-status?paymentId=xxx
   ```

### Erro ao gerar imagem

**Solução**:
1. Verifique saldo da OpenAI
2. Confirme se `OPENAI_API_KEY` está correto
3. Verifique logs na Vercel

---

## 8. Checklist de Deploy

- [ ] Migrações do banco executadas
- [ ] Variáveis de ambiente configuradas
- [ ] Build passou na Vercel
- [ ] Health check funcionando
- [ ] Geração de imagem testada
- [ ] Pagamento PIX testado (dev)
- [ ] Webhook configurado no AbacatePay
- [ ] Logs sendo registrados no Supabase
- [ ] Domínio customizado configurado (se aplicável)
- [ ] Chave de produção do AbacatePay adicionada (se aplicável)

---

## 9. Custos Estimados

### Vercel (Hobby - Grátis)
- 100GB bandwidth
- Funções serverless ilimitadas
- **Custo**: R$ 0/mês

### Vercel (Pro - Se precisar)
- 1TB bandwidth
- Mais recursos
- **Custo**: ~$20/mês (~R$ 100/mês)

### Supabase (Free Tier)
- 500MB database
- 1GB file storage
- 2GB bandwidth
- **Custo**: R$ 0/mês

### OpenAI
- GPT-Image-1: ~$0.04 por imagem
- **Custo**: Variável (depende do uso)

### AbacatePay
- Taxa por transação: Consultar dashboard
- Sem mensalidade
- **Custo**: Apenas taxas de transação

**Total estimado**: R$ 0-100/mês + custos variáveis de API

---

## 10. Suporte

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **AbacatePay**: ajuda@abacatepay.com
- **OpenAI**: [help.openai.com](https://help.openai.com)

---

**Última atualização**: 2025-01-11
