# 🎂 PIX Reveal Cake Topper Generator

> 📚 **Documentação**: Consulte [`/docs/INDEX.md`](/docs/INDEX.md) para toda a documentação organizada do projeto.  
> 🚀 **Referência Rápida**: Veja [`/docs/QUICK_REFERENCE.md`](/docs/QUICK_REFERENCE.md) para acesso direto por cenário.

Gerador de toppers de bolo personalizados usando IA (OpenAI) com pagamentos via PIX (AbacatePay).

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 15 + React 18 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Banco de Dados**: Supabase PostgreSQL
- **IA**: OpenAI (GPT-Image-1)
- **Pagamentos**: AbacatePay (PIX apenas)
- **Deploy**: Vercel

## ✨ Funcionalidades

- ✅ Geração de toppers de bolo com IA
- ✅ Catálogo de 8+ prompts prontos
- ✅ Pagamento via PIX (R$ 1,00 por imagem)
- ✅ Download seguro após pagamento
- ✅ PWA (funciona offline)
- ✅ Sistema de tokens com expiração
- ✅ Webhook automático do AbacatePay
- ✅ Logs de auditoria completos

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd pix-reveal-cake-topper

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves

# Execute as migrações do banco
supabase link --project-ref seu-project-ref
supabase db push

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:9876](http://localhost:9876)

## 🔐 Variáveis de Ambiente

```bash
# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:9876

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# AbacatePay
ABACATE_PAY_API_KEY=abc_dev_... # ou abc_prod_...
```

## 🚀 Deploy na Vercel

Veja o guia completo em [DEPLOYMENT.md](./DEPLOYMENT.md)

Passos rápidos:

1. Conecte seu repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático! 🎉

## 📊 Arquitetura

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
└────────┬────────┘
         │
         ├─► /api/generate-image ──► OpenAI API
         │
         ├─► /api/create-payment ──► AbacatePay SDK
         │
         ├─► /api/payment-status ──► Supabase + AbacatePay
         │
         └─► /api/validate-download ──► Supabase

         ↓
┌─────────────────┐
│   Supabase      │
│   PostgreSQL    │
│   - payments    │
│   - download_   │
│     tokens      │
│   - payment_    │
│     logs        │
└─────────────────┘

         ↑
┌─────────────────┐
│  AbacatePay     │
│  Webhook        │
└─────────────────┘
```

## 💳 Sistema de Pagamentos

### AbacatePay Integration

- **Método**: PIX apenas
- **Valor mínimo**: R$ 1,00 (100 centavos)
- **Webhook**: Automático para atualização de status
- **Segurança**: Tokens únicos + expiração 24h

### Fluxo de Pagamento

1. Usuário gera imagem (preview grátis)
2. Clica em "Pagar e Baixar HD"
3. Sistema gera QR Code PIX via AbacatePay
4. Usuário paga
5. Webhook atualiza status automaticamente
6. Download liberado com token único

## 🗄️ Banco de Dados

### Tabelas Principais

- **payments**: Registro de todos os pagamentos
- **download_tokens**: Tokens únicos para download
- **payment_logs**: Auditoria completa de eventos

### Migrações

```bash
# Executar todas as migrações
supabase db push

# Ou manualmente no SQL Editor:
# 1. supabase/migrations/20250109000000_add_payments_system.sql
# 2. supabase/migrations/20250111000000_migrate_to_abacatepay.sql
```

## 🧪 Testes

```bash
# Smoke tests (Playwright)
npm run test

# UI mode
npm run test:ui

# Debug mode
npm run test:debug
```

## 📚 Documentação

### Documentação Estratégica
- [🎯 Cheat Sheet](./docs/PRICING_CHEAT_SHEET.md) - **Números-chave** (30 segundos)
- [💰 Análise Financeira](./docs/PRICING_EXECUTIVE_SUMMARY.md) - Resumo executivo (5 minutos)
- [📊 Estudo Completo](./docs/FINANCIAL_VIABILITY_ANALYSIS.md) - Análise detalhada (30 minutos)

### Documentação Técnica
- [AGENT.md](./docs/guides/AGENT.md) - Documentação completa do projeto
- [DEPLOYMENT.md](./docs/setup/DEPLOYMENT.md) - Guia de deploy na Vercel
- [ABACATEPAY_INTEGRATION.md](./docs/setup/ABACATEPAY_INTEGRATION.md) - Integração com pagamentos
- [HEALTHCHECK.md](./docs/setup/HEALTHCHECK.md) - Health check endpoints

> 📖 **Toda a documentação:** [/docs/INDEX.md](./docs/INDEX.md)

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Next.js dev server (porta 8080)
npm run build           # Build para produção
npm run start           # Start production server

# Testes
npm run test            # Playwright tests
npm run test:ui         # UI mode
npm run lint            # ESLint

# Banco de dados
supabase db push        # Executar migrações
supabase db reset       # Reset (cuidado!)
```

## 🔧 Troubleshooting

### Erro ao criar pagamento

```
Error: Valor mínimo é R$ 1,00
```

**Solução**: AbacatePay exige mínimo de 100 centavos (R$ 1,00)

### Webhook não funciona

**Solução**:
1. Verifique URL no dashboard do AbacatePay
2. URL deve ser: `https://seu-dominio.vercel.app/api/abacate-webhook`
3. Verifique logs na Vercel

### Imagem não gera

**Solução**:
1. Verifique saldo/quota da OpenAI
2. Confirme `OPENAI_API_KEY` nas variáveis de ambiente
3. Verifique logs da API: `/api/generate-image`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Projeto privado - Todos os direitos reservados.

## 🆘 Suporte

Para suporte técnico, consulte:

1. Documentação ([AGENT.md](./AGENT.md))
2. Guia de deploy ([DEPLOYMENT.md](./DEPLOYMENT.md))
3. Issues do GitHub

---

**Última atualização**: 2025-01-11
**Versão**: 2.0.0 (migrado para AbacatePay)
