# Configuração do Langfuse

## 📊 Sobre o Langfuse

O Langfuse é uma plataforma open-source de observabilidade para aplicações de IA (LLMs). Ele fornece rastreamento detalhado, análise de custos, latência e qualidade das gerações.

## 🔑 Obtendo as Credenciais

1. Acesse [Langfuse Cloud](https://cloud.langfuse.com)
2. Crie uma conta ou faça login
3. Crie um novo projeto ou selecione um existente
4. Vá em **Settings** → **API Keys**
5. Copie as seguintes chaves:
   - **Public Key** (começa com `pk-lf-...`)
   - **Secret Key** (começa com `sk-lf-...`)

## 🔧 Configuração de Variáveis de Ambiente

### Para Next.js API Routes (Local e Vercel)

Adicione no seu arquivo `.env` ou `.env.local`:

```bash
# Langfuse Cloud - Monitoramento de IA
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com  # Região UE
# LANGFUSE_HOST=https://us.cloud.langfuse.com  # Região EUA

# OpenAI API
OPENAI_API_KEY=sk-proj-...
```

### Para Supabase Edge Functions

Configure os secrets no Supabase:

```bash
# Via CLI
npx supabase secrets set LANGFUSE_PUBLIC_KEY=pk-lf-...
npx supabase secrets set LANGFUSE_SECRET_KEY=sk-lf-...
npx supabase secrets set LANGFUSE_HOST=https://cloud.langfuse.com

# Ou via Dashboard
# Vá em Project Settings → Edge Functions → Secrets
```

### Para Vercel (Produção)

1. Acesse o dashboard do Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as variáveis:
   - `LANGFUSE_PUBLIC_KEY`
   - `LANGFUSE_SECRET_KEY`
   - `LANGFUSE_HOST`

## 📈 Recursos do Langfuse

### O que o Langfuse rastreia:

- ✅ **Prompts enviados**: Texto completo do prompt
- ✅ **Respostas da API**: URLs geradas, erros, etc
- ✅ **Latência**: Tempo de resposta de cada chamada
- ✅ **Custos**: Cálculo automático baseado no modelo
- ✅ **Metadados**: Informações contextuais (user_id, request_id, etc)
- ✅ **Erros**: Stack traces e detalhes de falhas
- ✅ **Gerações encadeadas**: Traces completos de múltiplas chamadas

### Dashboard Langfuse

Após configurar, você terá acesso a:

- **Traces**: Lista de todas as gerações com filtros
- **Sessions**: Agrupe gerações por usuário/sessão
- **Users**: Análise por usuário
- **Metrics**: Latência média, taxa de erro, custos totais
- **Prompts**: Biblioteca versionada de prompts

## 🔍 Monitoramento em Tempo Real

Com a instrumentação implementada, cada geração de imagem aparecerá automaticamente no Langfuse com:

- Prompt original do usuário
- Prompt melhorado (enhanced)
- Tempo de processamento
- Status (sucesso/erro)
- Metadados da requisição
- ID único para rastreamento

## 🚨 Troubleshooting

### Erro: "Unauthorized" ou "Invalid API Key"

- Verifique se copiou as chaves corretamente (com `pk-lf-` e `sk-lf-`)
- Confirme que está usando o host correto (UE vs EUA)
- No Supabase, verifique se os secrets foram salvos: `npx supabase secrets list`

### Traces não aparecem no Langfuse

- Verifique os logs da aplicação para erros de conexão
- Confirme que as variáveis de ambiente estão carregadas
- Aguarde alguns segundos - pode haver delay de indexação

### Erro: "Cannot find module '@langfuse/openai'"

```bash
npm install @langfuse/openai @langfuse/tracing
```

## 📚 Referências

- [Documentação oficial do Langfuse](https://langfuse.com/docs)
- [Langfuse + OpenAI](https://langfuse.com/docs/integrations/openai)
- [Langfuse Cloud](https://cloud.langfuse.com)
