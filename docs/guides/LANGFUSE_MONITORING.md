# Monitoramento com Langfuse

## 🎯 O que foi instrumentado

A geração de imagens está completamente instrumentada com o Langfuse, capturando:

- ✅ Prompt original do usuário
- ✅ Prompt melhorado (enhanced)
- ✅ Tempo de resposta da API OpenAI
- ✅ Tamanho da imagem gerada
- ✅ Erros e stack traces
- ✅ Metadados de requisição (requestId, timestamps)
- ✅ Usage da API (quando disponível)

## 📊 Acessando o Dashboard

1. Acesse [Langfuse Cloud](https://cloud.langfuse.com)
2. Faça login no seu projeto
3. Você verá automaticamente os traces das gerações

## 🔍 Entendendo os Traces

Cada geração de imagem cria um **trace** com a seguinte estrutura:

```
Trace: cake-topper-image-generation
├─ Input
│  ├─ originalPrompt: "Feliz Aniversário Maria"
│  └─ imageUrl: "data:image/png..."
│
├─ Generation: openai-image-generation
│  ├─ Model: gpt-image-1
│  ├─ Input Prompt: "Create a beautiful cake topper..."
│  ├─ Settings: { size: "1024x1024", quality: "standard" }
│  ├─ Output: { imageGenerated: true, imageSizeKB: 245 }
│  ├─ Latency: 4.2s
│  └─ Usage: (quando disponível)
│
└─ Output
   ├─ success: true
   ├─ imageUrl: "data:image/png;base64,..."
   └─ metadata: { processingTime: 4235ms }
```

## 📈 Métricas Importantes

### Latência
- **Localização**: Dashboard → Metrics → Latency
- **O que observar**: Média e P95 do tempo de geração
- **Meta**: < 5s para 95% das requisições

### Taxa de Erro
- **Localização**: Dashboard → Traces → Filter by Level: ERROR
- **O que observar**: Frequência de erros e mensagens
- **Meta**: < 1% de taxa de erro

### Custos
- **Localização**: Dashboard → Metrics → Costs
- **O que observar**: Custo por geração e total diário
- **Nota**: GPT Image 1 cobra por tokens (entrada de texto e saída de imagem)

### Throughput
- **Localização**: Dashboard → Metrics → Throughput
- **O que observar**: Número de gerações por hora/dia

## 🔎 Filtros Úteis

### Ver todas as gerações bem-sucedidas
```
level = DEFAULT
name = "cake-topper-image-generation"
```

### Ver apenas erros
```
level = ERROR
```

### Ver gerações lentas (> 10s)
```
name = "cake-topper-image-generation"
latency > 10000
```

### Ver por período
Use os filtros de data no topo do dashboard

## 🐛 Debugando Problemas

### Erro: "Missing required fields"
**Trace mostra**: Input vazio ou incompleto  
**Solução**: Verificar validação no frontend

### Erro: "OpenAI API error"
**Trace mostra**: Status HTTP e detalhes do erro  
**Possíveis causas**:
- Rate limit atingido
- Chave de API inválida
- Prompt violando políticas

### Latência alta (> 15s)
**Trace mostra**: Tempo gasto na API OpenAI  
**Possíveis causas**:
- Sobrecarga nos servidores OpenAI
- Prompt muito complexo
- Problemas de rede

## 📊 Análise de Prompts

### Comparar prompts
1. Vá em **Traces**
2. Filtre por data/período
3. Compare campos `input.originalPrompt` e `generation.input.prompt`
4. Observe correlação com latência e sucesso

### Identificar prompts problemáticos
1. Filtre traces com `level = ERROR`
2. Analise padrões nos prompts que falharam
3. Ajuste o prompt enhancement se necessário

## 🎨 Boas Práticas

### 1. Use Tags para Categorizar
Adicione tags aos traces para facilitar análise:
```typescript
trace?.update({
  tags: ["production", "user-generated", "celebration"],
});
```

### 2. Adicione User IDs
Se tiver autenticação, adicione o userId:
```typescript
trace?.update({
  userId: user.id,
  sessionId: session.id,
});
```

### 3. Crie Sessions
Agrupe múltiplas gerações do mesmo usuário:
```typescript
const trace = langfuse?.trace({
  sessionId: session.id,
  // ...
});
```

### 4. Versionamento de Prompts
Use o Prompt Management do Langfuse:
1. Vá em **Prompts** no dashboard
2. Crie um novo prompt template
3. Versione mudanças no prompt
4. Compare performance entre versões

## 🚨 Alertas e Monitoramento

### Configurar Alertas (via Langfuse)
1. Vá em **Settings** → **Alerts**
2. Configure alertas para:
   - Taxa de erro > 5%
   - Latência P95 > 10s
   - Custo diário > threshold

### Integração com Slack/Discord (futuro)
O Langfuse suporta webhooks para notificações:
- Erros críticos
- Threshold de custos
- Performance degradada

## 🔐 Segurança

### Dados Sensíveis
O Langfuse captura:
- ✅ Prompts (texto público)
- ✅ Metadados técnicos
- ✅ Erros e logs
- ❌ **NÃO** captura: imagens completas (apenas metadados)

### GDPR/Privacidade
- Dados são criptografados em trânsito e em repouso
- Você pode deletar traces específicos via API
- Configure data retention no dashboard

## 📚 Recursos Adicionais

- [Documentação Langfuse](https://langfuse.com/docs)
- [Langfuse OpenAI Integration](https://langfuse.com/docs/integrations/openai)
- [Prompt Management](https://langfuse.com/docs/prompts)
- [API Reference](https://langfuse.com/docs/api)

## 🎯 Próximos Passos

1. ✅ Configure as variáveis de ambiente (veja `LANGFUSE_SETUP.md`)
2. ✅ Gere algumas imagens para testar
3. ✅ Acesse o dashboard e explore os traces
4. 📊 Configure alertas para métricas críticas
5. 🎨 Experimente com versionamento de prompts
6. 📈 Analise dados semanalmente para otimizações
