# Documentação do Projeto

Este diretório contém toda a documentação do projeto organizada de forma estruturada.

> 💡 **Atalho**: Para referência rápida por cenário, veja [`QUICK_REFERENCE.md`](QUICK_REFERENCE.md)  
> 📋 **Como foi organizado**: Veja [`REORGANIZATION_SUMMARY.md`](REORGANIZATION_SUMMARY.md) ⭐ Novo!  
> 📚 **Princípios de organização**: Veja [`DOCUMENTATION_ORGANIZATION.md`](DOCUMENTATION_ORGANIZATION.md)

## 📁 Estrutura

### `/docs/setup/`
Documentação de configuração e setup inicial do projeto:
- `ABACATEPAY_INTEGRATION.md` - Integração com Abacate Pay
- `DEV_MODE_PAYMENT_SIMULATION.md` - 🧪 Simulação de pagamentos no modo dev ⭐ Novo!
- `SUPABASE_SETUP.md` - Configuração do Supabase (Database)
- `SUPABASE_STORAGE_SETUP.md` - 📦 Configuração do Supabase Storage (Buckets e Políticas) ⭐ Novo!
- `LANGFUSE_SETUP.md` - Configuração do Langfuse (monitoramento de IA)
- `DEPLOYMENT.md` - Instruções de deploy
- `HEALTHCHECK.md` - Endpoints e verificações de saúde
- `ContasTestes.md` - Contas e credenciais de teste

### `/docs/`
Documentação estratégica e análises:
- `PRICING_CHEAT_SHEET.md` - 🎯 **Cheat sheet** (30 segundos - números-chave) ⭐ Novo!
- `PRICING_DECISION_TREE.md` - 🌳 **Árvore de decisão visual** (2 minutos - guia rápido) ⭐ Novo!
- `PRICING_EXECUTIVE_SUMMARY.md` - 💰 **Resumo executivo** (5 minutos - apresentação) ⭐ Novo!
- `FINANCIAL_VIABILITY_ANALYSIS.md` - 📊 **Análise completa** (30 minutos - estudo detalhado) ⭐ Novo!

### `/docs/guides/`
Guias e tutoriais de uso:
- `QUICK_START.md` - Início rápido (comece aqui!)
- `AGENT.md` - Documentação técnica completa
- `LANGFUSE_MONITORING.md` - Guia de monitoramento com Langfuse ⭐ Novo!
- `MANUAL_TEST_GUIDE.md` - Guia de teste manual do fluxo E2E
- `LANDING_PAGE_SHOWCASE.md` - Showcase completo da Landing Page
- `PROMPT_SAMPLES.md` - Exemplos de prompts
- `README_PROMPT_LIBRARY.md` - Biblioteca de prompts
- `PROMPT_LIBRARY_SUMMARY.md` - Resumo da biblioteca
- `PROMPT_LIBRARY_UPDATE.md` - Atualizações da biblioteca
- `PROMPT_COMPARISON.md` - Comparação de prompts
- `VISUAL_SHOWCASE.md` - Demonstração visual
- `LANDING_PAGE_INFO.md` - Informações sobre landing page

### `/docs/reports/`
Relatórios de testes, fixes e lições aprendidas (consultar quando houver problemas):
- `FULL_UX_TEST_REPORT_V11_PLAYWRIGHT.md` - 🧪 Relatório de testes UX v11 com Playwright MCP (bugs críticos de build/runtime) ⭐ Novo!
- `FULL_UX_TEST_REPORT_V10_VISUAL.md` - 🧪 Relatório de testes UX v10 (análise visual)
- `PRINT_CUT_IMPROVEMENT.md` - 📐 Melhoria do prompt base para impressão e recorte ⭐ Novo!
- `FULL_UX_TEST_REPORT_V7.md` - 🔴 Relatório de testes UX v7 (bug crítico: bucket não existe) ⭐ Novo!
- `FULL_UX_TEST_REPORT_V6.md` - 🧪 Relatório de testes UX v6
- `QRCODE_PREFIX_FIX.md` - Correção de prefixo duplicado no QR Code
- `PAYMENT_VALIDATION_REFACTOR.md` - Refatoração do fluxo de validação de pagamentos
- `LANGFUSE_IMPLEMENTATION_REPORT.md` - Implementação de monitoramento com Langfuse
- `FULL_UX_TEST_REPORT.md` - Relatório de testes UX v1
- `FULL_UX_TEST_REPORT_V2.md` - Relatório de testes UX v2
- `FULL_UX_TEST_REPORT_V3.md` - Relatório de testes UX v3
- `FULL_UX_TEST_REPORT_V4.md` - Relatório de testes UX v4
- `FULL_UX_TEST_REPORT_V5.md` - Relatório de testes UX v5
- `FULL_UX_TEST_REPORT_LANDING.md` - Relatório de testes da Landing Page
- `FIX_FINAL_QR_CODE.md` - Correção final do QR Code PIX
- `FIX_SUMMARY.md` - Resumo da correção de valor mínimo
- `SUMMARY_QR_CODE_FIX.md` - Resumo executivo da correção do QR Code
- `QR_CODE_FIX_COMPLETE.md` - Documentação completa do fix do QR Code
- `VALIDATION_TEST.md` - Validação do fluxo completo
- `COMPLETE_FIXES_SUMMARY.md` - Resumo completo de correções
- `FIXES_APPLIED.md` - Correções aplicadas
- `FIXES_STATUS.md` - Status das correções
- `README_FIXES.md` - Documentação de fixes

## 🔄 Manutenção

**IMPORTANTE**: Ao criar ou atualizar documentação:
1. Sempre verifique se já existe um documento similar em `/docs`
2. Atualize documentos existentes ao invés de criar duplicatas
3. Siga a estrutura de diretórios definida acima
4. Adicione referências a este INDEX quando criar novos docs
5. Mantenha os reports históricos para referência futura

## 📝 Como Contribuir com a Documentação

1. **Antes de criar um novo doc**: Pesquise em `/docs` se já existe algo similar
2. **Atualize ao invés de criar**: Se encontrar um doc desatualizado, atualize-o
3. **Use a pasta correta**: 
   - Setup/configuração → `/docs/setup/`
   - Guias/tutoriais → `/docs/guides/`
   - Reports/lições → `/docs/reports/`
4. **Nomeie adequadamente**: Use nomes descritivos e em UPPER_SNAKE_CASE
5. **Referencie aqui**: Adicione o novo doc a este INDEX

## 🎯 Quando Consultar Reports

Os relatórios em `/docs/reports/` contêm lições aprendidas valiosas. Consulte-os quando:
- Encontrar bugs similares aos já corrigidos
- Precisar entender decisões de design/UX tomadas
- Implementar features que já foram testadas
- Resolver problemas de pagamento ou integração
- Entender o histórico de evolução do projeto

## 💰 Análise Financeira

**Escolha seu nível de profundidade:**

| Documento | Tempo | Quando Usar |
|-----------|-------|-------------|
| 🎯 [PRICING_CHEAT_SHEET.md](./PRICING_CHEAT_SHEET.md) | 30 seg | Consulta ultra-rápida de números |
| 🌳 [PRICING_DECISION_TREE.md](./PRICING_DECISION_TREE.md) | 2 min | Preciso decidir preço **agora** |
| 💰 [PRICING_EXECUTIVE_SUMMARY.md](./PRICING_EXECUTIVE_SUMMARY.md) | 5 min | Apresentação executiva |
| 📊 [FINANCIAL_VIABILITY_ANALYSIS.md](./FINANCIAL_VIABILITY_ANALYSIS.md) | 30 min | Análise profunda, planejamento |

**Consulte quando precisar:**
- ⚡ Decisão rápida sobre preço → PRICING_DECISION_TREE.md
- 💡 Entender viabilidade de markup 5x vs 9x vs 18x
- 📈 Projeções de receita e lucratividade
- 🎯 Planejar estratégia de pricing e growth
- 🧮 Calcular breakeven e margem
