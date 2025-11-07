# 📚 Referência Rápida - Documentação

## 🚨 IMPORTANTE: Leia Primeiro
👉 **[`/docs/INDEX.md`](INDEX.md)** - Índice completo de toda documentação

## ⚡ Links Rápidos por Cenário

### 🆕 Sou Novo no Projeto
1. [`/docs/guides/QUICK_START.md`](guides/QUICK_START.md)
2. [`/docs/setup/SUPABASE_SETUP.md`](setup/SUPABASE_SETUP.md)
3. [`/docs/setup/ABACATEPAY_INTEGRATION.md`](setup/ABACATEPAY_INTEGRATION.md)

### 🚀 Quero Fazer Deploy
→ [`/docs/setup/DEPLOYMENT.md`](setup/DEPLOYMENT.md)

### 💳 Problema com Pagamentos
1. [`/docs/setup/ABACATEPAY_INTEGRATION.md`](setup/ABACATEPAY_INTEGRATION.md)
2. [`/docs/reports/`](reports/) - Buscar por "pagamento" ou "PIX"

### 🎨 Problema com Geração de Imagens
1. [`/docs/guides/PROMPT_SAMPLES.md`](guides/PROMPT_SAMPLES.md)
2. [`/docs/guides/PROMPT_COMPARISON.md`](guides/PROMPT_COMPARISON.md)
3. [`/docs/reports/`](reports/) - Buscar por "geração" ou "timeout"

### 🐛 Bug ou Erro Estranho
→ [`/docs/reports/`](reports/) - **SEMPRE** consulte primeiro! Pode já ter sido resolvido.

### 💰 Decisão sobre Preços
1. **Números-chave (30seg):** [`PRICING_CHEAT_SHEET.md`](PRICING_CHEAT_SHEET.md) 🎯
2. **Decisão rápida (2min):** [`PRICING_DECISION_TREE.md`](PRICING_DECISION_TREE.md) 🌳
3. **Resumo executivo (5min):** [`PRICING_EXECUTIVE_SUMMARY.md`](PRICING_EXECUTIVE_SUMMARY.md) 💰
4. **Análise completa (30min):** [`FINANCIAL_VIABILITY_ANALYSIS.md`](FINANCIAL_VIABILITY_ANALYSIS.md) 📊

### 🖼️ Trabalhar com Prompts
- [`/docs/guides/PROMPT_SAMPLES.md`](guides/PROMPT_SAMPLES.md) - Exemplos testados
- [`/docs/guides/README_PROMPT_LIBRARY.md`](guides/README_PROMPT_LIBRARY.md) - Biblioteca completa
- [`/docs/guides/PROMPT_COMPARISON.md`](guides/PROMPT_COMPARISON.md) - Comparações

### ⚙️ Configurar Ambiente
- [`/docs/setup/SUPABASE_SETUP.md`](setup/SUPABASE_SETUP.md)
- [`/docs/setup/ABACATEPAY_INTEGRATION.md`](setup/ABACATEPAY_INTEGRATION.md)
- [`/docs/setup/ContasTestes.md`](setup/ContasTestes.md)

### 🧪 Testar Funcionalidades
- [`/docs/reports/FULL_UX_TEST_REPORT_V3.md`](reports/FULL_UX_TEST_REPORT_V3.md) - Último report
- [`/docs/setup/HEALTHCHECK.md`](setup/HEALTHCHECK.md)

### 📝 Criar/Atualizar Documentação
1. Leia [`.cursorrules`](../.cursorrules)
2. Leia [`.github/CONTRIBUTING.md`](../.github/CONTRIBUTING.md)
3. Consulte [`/docs/INDEX.md`](INDEX.md)

## 📂 Estrutura Resumida

```
/docs/
├── INDEX.md                 ← COMECE AQUI
├── QUICK_REFERENCE.md       ← Você está aqui
├── DOCUMENTATION_ORGANIZATION.md
│
├── /setup/                  ← Configurações
│   └── README.md
│
├── /guides/                 ← Tutoriais
│   └── README.md
│
└── /reports/                ← Lições Aprendidas ⭐
    └── README.md
```

## 🎯 Regra de Ouro

**Antes de criar qualquer documentação:**
```bash
cat docs/INDEX.md  # Sempre consulte primeiro!
```

## 🔍 Buscar Informação

### Por Palavra-chave
```bash
# Buscar em todos os docs
grep -r "palavra-chave" docs/

# Buscar apenas em setup
grep -r "palavra-chave" docs/setup/

# Buscar em reports (lições aprendidas)
grep -r "erro" docs/reports/
```

### Por Problema Comum
| Problema | Onde Buscar |
|----------|-------------|
| Erro de pagamento | `/docs/reports/` + "pagamento" |
| Timeout na geração | `/docs/reports/` + "timeout" |
| Erro de webhook | `/docs/setup/ABACATEPAY_INTEGRATION.md` |
| Prompt não funciona | `/docs/guides/PROMPT_*.md` |
| Deploy falhando | `/docs/setup/DEPLOYMENT.md` |
| UX/Interface | `/docs/reports/FULL_UX_TEST_REPORT_V*.md` |
| Definir preço | [`PRICING_DECISION_TREE.md`](PRICING_DECISION_TREE.md) ⭐ |
| Análise de custos | [`FINANCIAL_VIABILITY_ANALYSIS.md`](FINANCIAL_VIABILITY_ANALYSIS.md) ⭐ |

## 📖 Documentos por Categoria

### 💰 Estratégia & Finanças ⭐ Novo!
- [`PRICING_CHEAT_SHEET.md`](PRICING_CHEAT_SHEET.md) - Cheat sheet (30seg)
- [`PRICING_DECISION_TREE.md`](PRICING_DECISION_TREE.md) - Árvore de decisão visual (2min)
- [`PRICING_EXECUTIVE_SUMMARY.md`](PRICING_EXECUTIVE_SUMMARY.md) - Resumo executivo (5min)
- [`FINANCIAL_VIABILITY_ANALYSIS.md`](FINANCIAL_VIABILITY_ANALYSIS.md) - Análise completa (30min)

### 🔧 Setup & Configuração
- [`ABACATEPAY_INTEGRATION.md`](setup/ABACATEPAY_INTEGRATION.md)
- [`SUPABASE_SETUP.md`](setup/SUPABASE_SETUP.md)
- [`DEPLOYMENT.md`](setup/DEPLOYMENT.md)
- [`HEALTHCHECK.md`](setup/HEALTHCHECK.md)
- [`ContasTestes.md`](setup/ContasTestes.md)

### 📚 Guias & Tutoriais
- [`QUICK_START.md`](guides/QUICK_START.md) ⭐ Comece aqui
- [`AGENT.md`](guides/AGENT.md)
- [`PROMPT_SAMPLES.md`](guides/PROMPT_SAMPLES.md)
- [`README_PROMPT_LIBRARY.md`](guides/README_PROMPT_LIBRARY.md)
- [`PROMPT_LIBRARY_SUMMARY.md`](guides/PROMPT_LIBRARY_SUMMARY.md)
- [`PROMPT_LIBRARY_UPDATE.md`](guides/PROMPT_LIBRARY_UPDATE.md)
- [`PROMPT_COMPARISON.md`](guides/PROMPT_COMPARISON.md)
- [`VISUAL_SHOWCASE.md`](guides/VISUAL_SHOWCASE.md)
- [`LANDING_PAGE_INFO.md`](guides/LANDING_PAGE_INFO.md)

### 📊 Reports & Lições Aprendidas
- [`FULL_UX_TEST_REPORT.md`](reports/FULL_UX_TEST_REPORT.md) - V1
- [`FULL_UX_TEST_REPORT_V2.md`](reports/FULL_UX_TEST_REPORT_V2.md) - V2
- [`FULL_UX_TEST_REPORT_V3.md`](reports/FULL_UX_TEST_REPORT_V3.md) - V3 ⭐ Mais recente
- [`COMPLETE_FIXES_SUMMARY.md`](reports/COMPLETE_FIXES_SUMMARY.md)
- [`FIXES_APPLIED.md`](reports/FIXES_APPLIED.md)
- [`FIXES_STATUS.md`](reports/FIXES_STATUS.md)
- [`README_FIXES.md`](reports/README_FIXES.md)

## 💡 Dicas

### ✅ Boas Práticas
- Consulte `/docs/INDEX.md` antes de criar docs
- Busque em `/docs/reports/` quando tiver problemas
- Atualize docs ao mudar código
- Preserve reports históricos

### ❌ Evite
- Criar .md na raiz (exceto README.md)
- Duplicar documentação existente
- Deletar reports antigos
- Ignorar lições aprendidas

## 🆘 Ajuda

**Não encontrou o que procura?**
1. Leia [`/docs/INDEX.md`](INDEX.md) completo
2. Busque em [`/docs/reports/`](reports/)
3. Consulte [`.github/CONTRIBUTING.md`](../.github/CONTRIBUTING.md)
