# Health Check Endpoints

Este projeto inclui dois endpoints de health check para monitoramento da saúde da aplicação.

## Endpoints Disponíveis

### `/api/healthz` - Health Check Simples

**Método:** GET  
**Propósito:** Verificação rápida se a API está respondendo  
**Tempo de resposta:** ~50ms  

#### Resposta de Sucesso (200)
```json
{
  "status": "ok",
  "timestamp": "2025-08-23T02:23:33.309Z",
  "uptime": 4495.799961083,
  "environment": "development"
}
```

#### Resposta de Erro (503)
```json
{
  "status": "error",
  "timestamp": "2025-08-23T02:23:33.309Z",
  "error": "Error message"
}
```

---

### `/api/health` - Health Check Completo

**Método:** GET  
**Propósito:** Verificação detalhada de todos os serviços e dependências  
**Tempo de resposta:** ~200ms  

#### Resposta de Sucesso (200)
```json
{
  "status": "healthy",
  "timestamp": "2025-08-23T02:23:40.653Z",
  "responseTime": 40,
  "requestId": "health_1755915820613_g913l",
  "checks": {
    "api": {
      "status": "ok",
      "timestamp": "2025-08-23T02:23:40.614Z"
    },
    "database": {
      "status": "ok",
      "responseTime": 38
    },
    "openai": {
      "status": "configured",
      "apiKey": true
    },
    "abacatepay": {
      "status": "configured",
      "apiKey": true
    },
    "environment": {
      "nodeEnv": "production",
      "version": "1.0.0"
    }
  },
  "uptime": 4503.1446555,
  "memory": {
    "rss": 515489792,
    "heapTotal": 516833280,
    "heapUsed": 473679024,
    "external": 503118249,
    "arrayBuffers": 493219376
  },
  "version": {
    "node": "v20.11.1",
    "platform": "darwin"
  }
}
```

#### Resposta Degradada (503)
```json
{
  "status": "degraded",
  "timestamp": "2025-08-23T02:23:40.653Z",
  "responseTime": 40,
  "requestId": "health_1755915820613_g913l",
  "checks": {
    "database": {
      "status": "error",
      "responseTime": 38,
      "error": "Connection timeout"
    }
    // ... outros checks
  }
}
```

## Status Possíveis

### Status Gerais
- `healthy` - Todos os serviços funcionando
- `degraded` - Alguns serviços com problemas
- `unhealthy` - Falha crítica

### Status de Componentes
- `ok` - Funcionando normalmente
- `configured` - Configurado corretamente
- `missing` - Configuração ausente
- `error` - Erro detectado

## Componentes Verificados

### 1. **API**
- Verifica se a aplicação está respondendo
- Sempre retorna `ok` se chegou até aqui

### 2. **Database (Supabase)**
- Testa conexão com banco de dados
- Mede tempo de resposta
- Executa query simples para verificar conectividade

### 3. **OpenAI**
- Verifica se a API key está configurada
- Não faz chamadas reais (para evitar custos)

### 4. **AbacatePay**
- Verifica se API key está configurada
- Não faz chamadas reais

### 5. **Environment**
- Informa ambiente (development/production)
- Versão da aplicação

## Uso Recomendado

### Para Monitoring/Alertas
Use `/api/health` para monitoramento detalhado:
```bash
curl -f http://localhost:3001/api/health || echo "API unhealthy"
```

### Para Load Balancers
Use `/api/healthz` para verificações frequentes:
```bash
curl -f http://localhost:3001/api/healthz
```

### Docker Health Check
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/healthz || exit 1
```

### Kubernetes Readiness/Liveness
```yaml
readinessProbe:
  httpGet:
    path: /api/healthz
    port: 3001
  initialDelaySeconds: 10
  periodSeconds: 5

livenessProbe:
  httpGet:
    path: /api/healthz
    port: 3001
  initialDelaySeconds: 30
  periodSeconds: 10
```

## Logs

Todos os health checks geram logs estruturados com:
- Request ID único
- Timestamps
- Tempos de resposta
- Status de cada componente
- Erros detalhados quando aplicável

Exemplo de log:
```
[health_1755915820613_g913l] Health check request started
[health_1755915820613_g913l] Checking database connection  
[health_1755915820613_g913l] Database check successful - Response time: 45ms
[health_1755915820613_g913l] Health check completed - Total response time: 67ms
```
