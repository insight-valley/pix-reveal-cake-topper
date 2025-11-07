# Guia de Contribuição

## 📚 Documentação

### Estrutura
Toda documentação está organizada em `/docs/`:
- **`/docs/setup/`** - Configurações e setup
- **`/docs/guides/`** - Guias e tutoriais  
- **`/docs/reports/`** - Reports e lições aprendidas

### Regras de Documentação

#### ❌ NÃO Faça
- Criar arquivos `.md` na raiz (exceto README.md)
- Duplicar documentação existente
- Deletar reports históricos
- Escrever docs sem consultar existentes

#### ✅ Faça
- Consulte `/docs/INDEX.md` antes de criar qualquer doc
- Busque docs existentes antes de criar novos
- Atualize docs existentes ao invés de criar duplicatas
- Adicione novos docs ao INDEX.md
- Preserve reports antigos (lições aprendidas)

### Ao Criar Documentação

1. **Verifique** se já existe doc similar em `/docs/`
2. **Escolha** a pasta correta (setup/guides/reports)
3. **Crie** com nome descritivo em UPPER_SNAKE_CASE
4. **Adicione** referência ao `/docs/INDEX.md`
5. **Atualize** README da pasta se necessário

### Ao Atualizar Código

Atualize docs relacionados quando você:
- ✏️ Adicionar variáveis de ambiente → `/docs/setup/`
- ✏️ Modificar APIs/integrações → `/docs/setup/`
- ✏️ Adicionar features → `/docs/guides/`
- ✏️ Corrigir bugs complexos → `/docs/reports/`
- ✏️ Mudar processo de deploy → `/docs/setup/DEPLOYMENT.md`
- ✏️ Alterar prompts → `/docs/guides/PROMPT_*.md`

## 🔍 Consultando Documentação

### Antes de Começar
1. Leia `/docs/INDEX.md` para overview
2. Para setup inicial: `/docs/setup/`
3. Para entender features: `/docs/guides/`

### Quando Encontrar Problemas
1. **Busque** em `/docs/reports/` por problemas similares
2. **Leia** as lições aprendidas documentadas
3. **Aplique** soluções já testadas
4. **Documente** novas descobertas

### Palavras-chave para Buscar
- Pagamento/PIX → `/docs/setup/PAYMENT_SETUP.md`, `/docs/reports/`
- UX/Interface → `/docs/reports/FULL_UX_TEST_REPORT_V*.md`
- Deploy → `/docs/setup/DEPLOYMENT.md`
- Prompts/IA → `/docs/guides/PROMPT_*.md`
- Integração → `/docs/setup/ABACATEPAY_INTEGRATION.md`, `SUPABASE_SETUP.md`

## 🎯 Workflow Completo

```mermaid
graph TD
    A[Tarefa Nova] --> B{Consultar Docs}
    B --> C[/docs/INDEX.md]
    C --> D{Problema Similar?}
    D -->|Sim| E[/docs/reports/]
    D -->|Não| F[Implementar]
    E --> G[Aplicar Lição Aprendida]
    G --> F
    F --> H{Mudança Significativa?}
    H -->|Sim| I[Atualizar Docs]
    H -->|Não| J[Fim]
    I --> J
```

## 🚀 Quick Start

```bash
# 1. Clone e instale
git clone [repo]
npm install

# 2. Leia documentação essencial
cat docs/INDEX.md
cat docs/guides/START_HERE.md
cat docs/setup/SUPABASE_SETUP.md

# 3. Configure ambiente
cp .env.example .env
# Edite .env com suas credenciais

# 4. Execute
npm run dev
```

## 📝 Commits

Use conventional commits:
- `feat:` - Nova feature
- `fix:` - Bug fix
- `docs:` - Mudanças em documentação
- `refactor:` - Refatoração de código
- `test:` - Adição de testes

Exemplos:
```
feat: adicionar preview de imagem antes do pagamento
fix: corrigir timeout na geração de imagens
docs: atualizar guia de setup do Supabase
```

## ⚠️ Importante

- Sempre teste localmente antes de fazer push
- Mantenha `.env` fora do git
- Consulte reports antes de reimplementar soluções
- Documente decisões importantes
- Preserve histórico em `/docs/reports/`
