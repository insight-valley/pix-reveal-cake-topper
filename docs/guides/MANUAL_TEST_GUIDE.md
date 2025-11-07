# 📱 Guia de Teste Manual - Fluxo E2E Completo

## 🎯 Objetivo
Validar todo o fluxo do usuário desde a landing page até o download da imagem após pagamento.

## ⏱️ Tempo Estimado
5-10 minutos

---

## 📋 PASSO 1: Landing Page → Plataforma

### Ações:
1. Abrir navegador
2. Acessar: `http://localhost:8080/landing`
3. Visualizar landing page
4. Clicar no botão principal (CTA)

### Resultado Esperado:
✅ Redirecionado para: `http://localhost:8080/`
✅ Ver interface do gerador de topo de bolo

---

## 🎨 PASSO 2: Gerar Imagem Simples

### Ações:
1. Na página principal, localizar campo de texto grande
2. Digitar prompt simples:
   ```
   Topo de bolo com o nome "Eduarda" em letras cursivas rosa, 
   decorado com flores pequenas, fundo branco, estilo adesivo
   ```
3. Clicar em "Gerar Imagem" (botão gradient grande)
4. Aguardar processamento

### Resultado Esperado:
✅ Aparecer loader animado com coração pulsando
✅ Após 10-30s, imagem aparece na prévia à direita
✅ Badge "✓ Gerado" no canto superior direito da imagem
✅ Toast de sucesso: "Imagem gerada com sucesso! Prossiga..."
✅ Botões aparecem abaixo da imagem:
   - "💳 Pagar e Baixar HD"
   - "🎨 Gerar Nova Imagem"

### ⚠️ Possíveis Problemas:
- **Timeout:** Tentar novamente
- **Erro de API:** Verificar console do browser (F12)
- **Imagem não carrega:** Verificar Network tab

---

## 💳 PASSO 3: Preencher Form + Gerar QR Code

### Ações:
1. Clicar em "💳 Pagar e Baixar HD"
2. Scroll automático para seção de checkout
3. Preencher formulário:

   | Campo | Valor |
   |-------|-------|
   | Nome | Gabriel Dantas |
   | Email | gbi.dantas59@gmail.com |
   | Celular | (11) 95997-4473 |
   | Tipo Doc | CPF |
   | CPF | 452.381.678-65 |

4. Verificar valor exibido: **"R$ 1,00"** ✅
5. Clicar em "Gerar QR Code PIX - R$ 1,00"
6. Aguardar 2-5 segundos

### Resultado Esperado:
✅ Loader: "Gerando PIX..."
✅ QR Code aparece na tela (imagem quadrada)
✅ Código "Copia e Cola" aparece abaixo
✅ Botão "Copiar" disponível
✅ Texto: "Valor: R$ 1,00"
✅ Texto: "Aguardando confirmação do pagamento..."
✅ Ícone de loading girando (polling automático)

### ⚠️ Possíveis Problemas:
- **"Valor mínimo é R$ 1,00":** ❌ Reabrir issue (não deveria acontecer)
- **Erro no formulário:** Verificar campos obrigatórios
- **QR Code não aparece:** Verificar console e logs do servidor

---

## 📱 PASSO 4: Pagar QR Code

### Ações:
1. Clicar em "Copiar" (botão ao lado do código PIX)
2. Abrir app do banco no celular
3. Ir em PIX → Pagar → Colar código
4. Verificar detalhes:
   - Valor: **R$ 1,00**
   - Destinatário: AbacatePay ou nome configurado
5. Confirmar pagamento
6. Aguardar confirmação no app do banco
7. **Não fechar a página do browser!**

### Resultado Esperado:
✅ Toast: "Código PIX copiado!"
✅ Pagamento confirmado no app do banco
✅ Após 5-15 segundos, página atualiza automaticamente
✅ QR Code desaparece
✅ Mensagem de sucesso aparece

### ⏱️ Timing:
- Polling a cada 3 segundos
- Webhook pode levar 5-30 segundos
- Máximo: 2 minutos

### ⚠️ Possíveis Problemas:
- **Polling não funciona:** Recarregar página manualmente
- **Webhook não recebido:** Verificar logs do servidor
- **Pagamento não confirmado:** Aguardar mais 30s

---

## 🎉 PASSO 5: Mensagem de Obrigado + Download

### Resultado Esperado:
✅ Card de sucesso aparece:
   - Título: "Pagamento Aprovado! ✅"
   - Ícone: CheckCircle verde
   - Texto: "Seu pagamento foi processado com sucesso"
✅ Informações exibidas:
   - "Valor pago: R$ 1,00"
   - "Data: [data/hora atual]"
✅ Botão grande: "Baixar Imagem em Alta Qualidade"
✅ Botão habilitado (não disabled)

### Ações:
1. Clicar em "Baixar Imagem em Alta Qualidade"
2. Aguardar download

---

## 💾 PASSO 6: Teste do Download

### Resultado Esperado:
✅ Download inicia automaticamente
✅ Arquivo baixado: `cake_topper_[imageId].png`
✅ Tamanho: ~500KB - 2MB (alta qualidade)
✅ Toast: "Download iniciado com sucesso!"

### Validações:
1. Abrir arquivo baixado
2. Verificar:
   - ✅ Imagem abre sem erro
   - ✅ Qualidade está boa (não pixelada)
   - ✅ Texto está legível
   - ✅ Cores corretas
   - ✅ Mesmo design da prévia

### ⚠️ Possíveis Problemas:
- **Download não inicia:** Verificar popup blocker
- **Erro 403:** Token expirou ou inválido
- **Imagem corrompida:** Verificar geração da imagem

---

## 📊 Checklist Final

### Interface
- [ ] Landing page carregou corretamente
- [ ] Redirecionamento funcionou
- [ ] Campo de texto responsivo
- [ ] Botão de gerar funcionando

### Geração de Imagem
- [ ] Loader animado apareceu
- [ ] Imagem gerada em ~30s
- [ ] Prévia exibida corretamente
- [ ] Badge "✓ Gerado" visível

### Checkout
- [ ] Formulário validando campos
- [ ] Valor "R$ 1,00" exibido corretamente
- [ ] QR Code gerado com sucesso
- [ ] Código "Copia e Cola" disponível

### Pagamento
- [ ] Código PIX copiado
- [ ] Pagamento efetuado no app do banco
- [ ] Polling detectou pagamento
- [ ] Status atualizado automaticamente

### Download
- [ ] Mensagem de sucesso exibida
- [ ] Botão de download disponível
- [ ] Download funcionou
- [ ] Imagem válida e de qualidade

---

## 🐛 Troubleshooting

### Problema: QR Code não aparece
**Solução:**
1. F12 → Console → Verificar erros
2. Network tab → Procurar request `create-payment`
3. Verificar response: deve ter `qr_code_base64`
4. Verificar logs do servidor: `console.log` no terminal

### Problema: Pagamento não é detectado
**Solução:**
1. Verificar webhook configurado no AbacatePay
2. Verificar logs: `tail -f logs/webhook.log`
3. Testar manualmente: `curl http://localhost:8080/api/payment-status?paymentId=<UUID>`
4. Verificar banco de dados: status do pagamento

### Problema: Download bloqueado
**Solução:**
1. Verificar se pagamento foi aprovado
2. Verificar `can_download: true` no status
3. Verificar token de download gerado
4. Testar endpoint: `curl http://localhost:8080/api/validate-download?token=<TOKEN>&imageId=<ID>`

---

## 📝 Notas de Teste

### Dados de Teste Válidos:
```
Nome: Gabriel Dantas
Email: gbi.dantas59@gmail.com
CPF: 452.381.678-65
Celular: (11) 95997-4473
```

### Prompts Sugeridos:
1. `Topo de bolo com o nome "Eduarda" em rosa`
2. `Parabéns Ana em letras douradas, fundo branco`
3. `Feliz Aniversário Pedro tema futebol`

### Comandos Úteis:
```bash
# Ver logs do servidor
tail -f .next/server-logs.txt

# Verificar pagamento no banco
psql -h localhost -U postgres -d pix_reveal -c "SELECT * FROM payments ORDER BY created_at DESC LIMIT 1;"

# Simular pagamento (DEV)
curl -X POST http://localhost:8080/api/abacate-webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"payment.approved","data":{"id":"bill_xxxxx"}}'
```

---

## ✅ Critérios de Sucesso

O teste é considerado **APROVADO** se:

1. ✅ Todas as 6 etapas completadas sem erros
2. ✅ Valor R$ 1,00 aceito pela API
3. ✅ QR Code gerado com sucesso
4. ✅ Pagamento detectado automaticamente
5. ✅ Download funcionou na primeira tentativa
6. ✅ Imagem baixada com qualidade

---

## 🎯 Próximos Passos Após Validação

Se todos os testes passarem:

1. [ ] Commitar mudanças
2. [ ] Criar PR com fix
3. [ ] Deploy para staging
4. [ ] Testar em staging
5. [ ] Deploy para produção
6. [ ] Monitorar métricas

**Boa sorte! 🚀**
