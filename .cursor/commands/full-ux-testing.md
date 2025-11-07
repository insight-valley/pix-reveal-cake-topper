# Full UX Testing Command

## Objetivo
Realizar teste completo end-to-end da aplicação, documentando todos os problemas encontrados com screenshots e evidências concretas.

## Escopo do Teste

### 1. **Pré-requisitos**
- [ ] Verificar se o build compila sem erros
- [ ] Verificar variáveis de ambiente configuradas
- [ ] Iniciar servidor de desenvolvimento
- [ ] Verificar health checks (API e banco de dados)

### 2. **Teste de Interface (Homepage)**
- [ ] Carregar página principal
- [ ] Capturar screenshot da homepage
- [ ] Verificar elementos visuais (título, campos, botões)
- [ ] Testar botões de exemplo
- [ ] Verificar textos e mensagens (sem menções a integrações antigas)
- [ ] Validar responsividade (se aplicável)

### 3. **Teste de Funcionalidade Principal**
- [ ] Preencher prompt (usar exemplo ou digitar)
- [ ] Clicar em "Gerar Imagem"
- [ ] Verificar loading state
- [ ] Aguardar geração completa (API OpenAI pode demorar 15-30s)
- [ ] Capturar screenshot do resultado
- [ ] Verificar se imagem foi gerada corretamente
- [ ] Verificar console logs para erros

### 4. **Teste de Fluxo de Pagamento**
- [ ] Clicar em botão de pagamento
- [ ] Verificar formulário de pagamento
- [ ] Preencher dados de teste
- [ ] Submeter formulário
- [ ] Verificar criação do pagamento (QR Code PIX)
- [ ] Capturar screenshots de cada etapa
- [ ] Verificar logs do console e network requests
- [ ] Documentar qualquer erro HTTP (400, 500, etc.)

### 5. **Teste de APIs**
- [ ] Testar `/api/health` ou `/api/healthz`
- [ ] Testar `/api/create-payment` (via curl) com payload realista:
```bash
curl -X POST http://localhost:8080/api/create-payment \
  -H "Content-Type: application/json" \
  --data-raw '{"imageId":"img_1760703572097_6hm35sdha","amount":1,"description":"Topo de bolo personalizado: \"Topo de bolo com a frase '\''Feliz Aniversário'\'' em po...\"","customer":{"name":"Gabriel Dantas","email":"gbi.dantas59@gmail.com","taxId":"45238167865","cellphone":"11959974473"}}'
```
- [ ] Verificar resposta de erros
- [ ] Documentar stack traces se houver

### 6. **Verificação de Integração Externa**
- [ ] Verificar se AbacatePay está acessível
- [ ] Verificar se Supabase está acessível
- [ ] Verificar se OpenAI está respondendo
- [ ] Documentar status de cada integração

### 7. **Documentação de Problemas**
- [ ] Criar TODO list com bugs encontrados
- [ ] Classificar severidade (🔴 Crítica, 🟡 Média, 🟢 Baixa)
- [ ] Incluir screenshots como evidência
- [ ] Sugerir fix para cada problema
- [ ] Listar funcionalidades que funcionaram

### 8. **Relatório Final**
- [ ] Gerar arquivo MARKDOWN com relatório completo
- [ ] Incluir sumário executivo
- [ ] Listar todos os testes realizados
- [ ] Documentar bugs com screenshots (usar sintaxe: `![Description](path/to/screenshot.png)`)
- [ ] Incluir métricas de performance
- [ ] Fornecer ações recomendadas (priorizadas)
- [ ] Conclusão com próximos passos

**Formato de Screenshots no Report:**
```markdown
![Homepage Inicial](.playwright-mcp/01-homepage-initial.png)
![Erro 500](.playwright-mcp/04-payment-error-500.png)
```

## Ferramentas a Utilizar

1. **Browser MCP (Playwright):**
   - `browser_navigate` - navegar para páginas
   - `browser_snapshot` - capturar estado da página
   - `browser_take_screenshot` - tirar screenshots
   - `browser_click` - interagir com elementos
   - `browser_fill_form` - preencher formulários
   - `browser_console_messages` - ver logs do console
   - `browser_network_requests` - ver requests HTTP

2. **Terminal:**
   - `curl` - testar APIs diretamente
   - `npm run build` - verificar build
   - `npm run dev` - iniciar servidor
   - `grep` - buscar variáveis de ambiente
   - `ps aux` - verificar processos rodando

3. **Arquivos:**
   - `read_file` - ler configurações
   - `write` - criar relatório
   - `search_replace` - corrigir bugs (se solicitado)

## Output Esperado

1. Arquivo `FULL_UX_TEST_REPORT.md` na raiz do projeto
2. Screenshots em `.playwright-mcp/` ou pasta similar
3. TODO list atualizado com bugs encontrados
4. Lista priorizada de ações a tomar

## Critérios de Sucesso

- ✅ Todos os testes foram executados
- ✅ Evidências concretas (screenshots, logs) foram coletadas
- ✅ Relatório final é completo e acionável
- ✅ Bugs são classificados por severidade
- ✅ Sugestões de fix são claras e específicas

## Exemplo de Uso

```
/full-ux-testing
```

O comando irá:
1. Iniciar servidor automaticamente (se não estiver rodando)
2. Executar todos os testes acima sequencialmente
3. Capturar screenshots em cada etapa
4. Gerar relatório final detalhado
5. Atualizar TODO list com bugs encontrados
