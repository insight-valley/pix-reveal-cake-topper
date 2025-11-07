# 🌳 Árvore de Decisão - Pricing Strategy

Guia visual rápido para decisões de precificação.

---

## 🚦 Decisão Rápida (TL;DR)

```
┌─────────────────────────────────────┐
│ Qual preço devo cobrar?             │
└──────────────┬──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Fase do projeto?    │
    └──┬────────┬──────┬───┘
       │        │      │
       ▼        ▼      ▼
   ┌────┐   ┌────┐ ┌─────┐
   │MVP │   │Growth│Scale │
   │0-3m│   │4-12m│ Ano2+│
   └─┬──┘   └──┬─┘ └──┬──┘
     │         │      │
     ▼         ▼      ▼
  R$ 1,00  R$ 2,00  R$ 2-5
 (markup 9x)(18x)  (dinâmico)
```

---

## 📊 Matriz de Decisão

### Por Objetivo de Negócio

| Objetivo | Preço Recomendado | Razão |
|----------|-------------------|-------|
| 🧪 **Validar mercado** | R$ 1,00 | Barreira baixa, testes rápidos |
| 📈 **Crescer rápido** | R$ 1,00 | Maximiza conversão e volume |
| 💰 **Lucrar agora** | R$ 2,00 | Margem 87%, viável com menos volume |
| 🏆 **Premium/Branding** | R$ 3-5 | Posicionamento exclusivo |
| 🔄 **Subscription** | R$ 29,90/mês | LTV alto, receita previsível |

### Por Volume Atual

| Imagens/Mês | Preço Recomendado | Breakeven? | Margem |
|-------------|-------------------|------------|--------|
| 0-200 | R$ 1,00 | ⚠️ Próximo | 77% |
| 200-500 | R$ 1,50 | ✅ Lucrando | 82% |
| 500-1.000 | R$ 2,00 | ✅ Lucrando | 87% |
| 1.000+ | R$ 2-3 | 💰 Alto lucro | 87%+ |

### Por Perfil de Cliente

| Perfil | Willingness to Pay | Preço Sugerido |
|--------|-------------------|----------------|
| 👨‍👩‍👧 **Festas caseiras** | Baixo (R$ 0,50-2) | R$ 1,00 |
| 🎪 **Organizadores eventos** | Médio (R$ 5-20) | R$ 5,00 pacotes |
| 🏢 **Buffets/Confeitarias** | Alto (R$ 20-100) | R$ 50/mês B2B |
| 🎨 **Designers** | Muito alto (R$ 50+) | R$ 99/mês API |

---

## 🎯 Estratégia por Fase

### Fase 1: MVP (Meses 1-3) 🧪

**Objetivo:** Product-Market Fit

```
╔═══════════════════════════════════════╗
║ PREÇO: R$ 1,00 (fixo)                 ║
║ MARGEM: 77%                           ║
║ BREAKEVEN: 184 imgs/mês               ║
║ META: 300 imgs/mês                    ║
╚═══════════════════════════════════════╝

Táticas:
✓ Landing page otimizada
✓ SEO + Google My Business
✓ Ads Facebook/Instagram (R$ 300/mês)
✓ Grupos de festas (orgânico)
✓ Influencers nano (barter)

KPIs:
→ Conversão visitante → pagamento
→ NPS (Net Promoter Score)
→ Tempo médio de geração
→ Taxa de erro
```

### Fase 2: Growth (Meses 4-12) 📈

**Objetivo:** Scale + Repeat Purchase

```
╔═══════════════════════════════════════╗
║ PREÇO BASE: R$ 2,00                   ║
║ PROMOÇÃO: R$ 1,00 (primeira compra)   ║
║ MARGEM: 87% (preço base)              ║
║ BREAKEVEN: 81 imgs/mês                ║
║ META: 1.000 imgs/mês                  ║
╚═══════════════════════════════════════╝

Táticas:
✓ Pricing dinâmico (first-time vs repeat)
✓ Pacotes (5x = R$ 8, 10x = R$ 12)
✓ Programa de afiliados (20%)
✓ Parcerias estratégicas
✓ Retargeting ads

KPIs:
→ Repeat purchase rate
→ LTV (Lifetime Value)
→ CAC (Customer Acquisition Cost)
→ LTV/CAC ratio (alvo: >3x)
```

### Fase 3: Scale (Ano 2+) 🚀

**Objetivo:** Diversificação + Dominância

```
╔═══════════════════════════════════════╗
║ TIER BÁSICO: R$ 2,00                  ║
║ TIER PREMIUM: R$ 5,00                 ║
║ SUBSCRIPTION: R$ 29,90/mês (20 imgs)  ║
║ B2B/API: R$ 0,50/img (volume)         ║
║ WHITE-LABEL: R$ 199/mês               ║
╚═══════════════════════════════════════╝

Táticas:
✓ Modelo freemium (1 grátis/mês)
✓ Marketplace de templates
✓ API B2B para gráficas
✓ White-label para marcas
✓ Eventos e feiras

KPIs:
→ MRR (Monthly Recurring Revenue)
→ Revenue per customer segment
→ Churn rate (assinaturas)
→ Expansion revenue
```

---

## ⚖️ Matriz de Prós e Contras

### R$ 0,55 (Markup 5x) - ❌ NÃO RECOMENDADO

**Prós:**
- Nenhum (inviável)

**Contras:**
- ❌ Abaixo do mínimo PIX
- ❌ Margem insuficiente (60%)
- ❌ Taxa fixa desproporcional (18%)
- ❌ Desvaloriza produto
- ❌ Impossível escalar
- ❌ Sem margem para CAC

**Veredito:** ⛔ **INVIÁVEL** técnica e economicamente

---

### R$ 1,00 (Markup 9x) - ✅ RECOMENDADO PARA MVP

**Prós:**
- ✅ Mínimo PIX (viável tecnicamente)
- ✅ Margem saudável (77%)
- ✅ Preço redondo (facilita decisão)
- ✅ "Pocket money" - compra impulsiva
- ✅ Barreira baixa para validação
- ✅ Cliente ainda economiza 95%+

**Contras:**
- ⚠️ Breakeven alto (184 imgs/mês)
- ⚠️ Margem apertada para alto CAC
- ⚠️ Pode dificultar premium positioning

**Veredito:** ✅ **IDEAL PARA MVP** (meses 1-3)

---

### R$ 2,00 (Markup 18x) - ✅ RECOMENDADO PARA GROWTH

**Prós:**
- ✅ Margem excelente (87%)
- ✅ Breakeven baixo (81 imgs/mês)
- ✅ Espaço para investir em marketing
- ✅ Valor percebido alto
- ✅ Permite programa de afiliados
- ✅ Escalável e sustentável

**Contras:**
- ⚠️ Requer mais justificativa de valor
- ⚠️ Pode reduzir conversão inicial

**Veredito:** ✅ **IDEAL PARA GROWTH** (meses 4-12)

---

### R$ 5,00 (Markup 45x) - 💎 PREMIUM

**Prós:**
- ✅ Margem premium (94%)
- ✅ Posicionamento exclusivo
- ✅ Atrai clientes B2B
- ✅ Permite value-adds (revisões, HD+, etc)

**Contras:**
- ⚠️ Volume menor
- ⚠️ Exige diferenciação clara
- ⚠️ Concorrência com designers

**Veredito:** 💎 **TIER PREMIUM** (após validação)

---

## 🧮 Calculadora Rápida

### Quanto preciso vender para lucrar X?

```python
# Fórmula simplificada
imagens_necessarias = (lucro_desejado + custos_fixos) / margem_contribuicao

# Exemplos:
Lucro R$ 1.000/mês @ R$ 1,00:
→ (1.000 + 141) / 0,77 = 1.482 imagens

Lucro R$ 1.000/mês @ R$ 2,00:
→ (1.000 + 141) / 1,75 = 652 imagens

Lucro R$ 5.000/mês @ R$ 2,00:
→ (5.000 + 141) / 1,75 = 2.938 imagens
```

### Qual preço para X% de margem?

```python
# Fórmula
preco = custo_variavel / (1 - margem_desejada) / (1 - taxa_pgto%)

# Exemplos:
Margem 70%:
→ 0,22 / 0,30 / 0,98 = R$ 0,75 (inviável PIX)

Margem 80%:
→ 0,22 / 0,20 / 0,98 = R$ 1,12 ✅

Margem 90%:
→ 0,22 / 0,10 / 0,98 = R$ 2,24 ✅
```

---

## 🎲 Teste A/B Recomendado

### Experimento: R$ 1,00 vs R$ 2,00

**Setup:**
```
Grupo A (50%): R$ 1,00
Grupo B (50%): R$ 2,00

Duração: 2 semanas
Tráfego: 1.000 visitantes
Meta: Maximizar receita
```

**Métricas:**
- Taxa de conversão
- Receita total
- Receita por visitante (RPV)
- NPS por grupo
- Repeat purchase (follow-up 30 dias)

**Decisão:**
```
SE Grupo B converte >43% do Grupo A:
  → Usar R$ 2,00 (mais receita)
SENÃO:
  → Usar R$ 1,00 (mais volume)
```

**Cálculo:**
```
Breakeven ponto:
R$ 1 com 10% conversão = R$ 0,10/visitante
R$ 2 com 4,3% conversão = R$ 0,086/visitante

Se R$ 2 converter >4,3%, é mais lucrativo!
```

---

## 📋 Checklist de Decisão

Antes de definir preço, pergunte-se:

### ✅ Viabilidade Técnica
- [ ] Preço está acima do mínimo PIX (R$ 1,00)?
- [ ] Gateway de pagamento suporta esse valor?
- [ ] Sistema consegue processar automaticamente?

### ✅ Viabilidade Econômica
- [ ] Margem de contribuição é >70%?
- [ ] Breakeven é atingível (<500 imgs/mês)?
- [ ] Há margem para investir em CAC?
- [ ] Há buffer para contingências (15-20%)?

### ✅ Viabilidade Comercial
- [ ] Cliente percebe valor nesse preço?
- [ ] É competitivo vs alternativas do mercado?
- [ ] Permite escala e crescimento?
- [ ] Alinha com posicionamento de marca?

### ✅ Teste de Sanidade
- [ ] Você pagaria esse preço?
- [ ] Seu público-alvo tem capacidade de pagar?
- [ ] O preço facilita ou dificulta a decisão?
- [ ] É sustentável no longo prazo?

**Regra de Ouro:** Se você respondeu "NÃO" a qualquer item acima, **repense o preço!**

---

## 🚀 Recomendação Final

```
╔════════════════════════════════════════════════════╗
║                                                    ║
║  🎯 ESTRATÉGIA RECOMENDADA: PROGRESSIVA            ║
║                                                    ║
║  Meses 1-3:   R$ 1,00  (validação)                ║
║  Meses 4-6:   R$ 1,50  (teste elasticidade)       ║
║  Meses 7-12:  R$ 2,00  (preço standard)           ║
║  Ano 2+:      R$ 2-5   (dinâmico/tiers)           ║
║                                                    ║
║  💡 Markup 5x (R$ 0,55) = ❌ INVIÁVEL              ║
║  💡 Markup 9x (R$ 1,00) = ✅ MVP IDEAL             ║
║  💡 Markup 18x (R$ 2,00) = ✅ GROWTH IDEAL         ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

---

## 📚 Documentos Relacionados

- **Resumo Executivo:** [PRICING_EXECUTIVE_SUMMARY.md](./PRICING_EXECUTIVE_SUMMARY.md)
- **Análise Completa:** [FINANCIAL_VIABILITY_ANALYSIS.md](./FINANCIAL_VIABILITY_ANALYSIS.md)
- **Integração Pagamentos:** [/docs/setup/ABACATEPAY_INTEGRATION.md](./setup/ABACATEPAY_INTEGRATION.md)

---

**Última atualização:** 12 de Outubro de 2025  
**Versão:** 1.0
