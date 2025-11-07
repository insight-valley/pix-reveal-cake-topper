# Credenciais de Teste

## AbacatePay (Desenvolvimento)

```bash
# API Key de Desenvolvimento
ABACATE_PAY_API_KEY=abc_dev_xf5cGzyzdSWMmHjY2W5uhwZ3
```

### Dados de Teste PIX

```
Email: teste@example.com
Nome: Cliente Teste
CPF: 111.444.777-35 (CPF válido para testes)
Celular: (11) 98765-4321 (opcional)
```

**⚠️ IMPORTANTE:** Use um CPF válido para testes. O CPF `123.456.789-01` é inválido e causará erro na API.

### Simular Pagamento

Em ambiente dev, pagamentos PIX são simulados automaticamente ou você pode usar o MCP do AbacatePay para simular pagamento aprovado:

```bash
# Via MCP (se disponível)
abacatepay simulate-payment <pix_id>
```

## OpenAI (Geração de Imagens)

```
Modelo: gpt-image-1
Tamanho: 1024x1024
Qualidade: high
```

---

**⚠️ Importante**: Estas são credenciais de **desenvolvimento**. Para produção, obtenha chaves separadas no dashboard de cada serviço.
