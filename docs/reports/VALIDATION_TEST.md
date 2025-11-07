# Validação do Fluxo Completo - PIX Reveal Cake Topper

## ✅ Correção Aplicada

**Problema:** Amount estava sendo enviado em reais (1) ao invés de centavos (100)
**Solução:** Alterado `IMAGE_PRICE` de `1.0` para `100` centavos

## 🧪 Fluxo de Teste Manual

### 1. Landing Page → Plataforma
- [ ] Acessar `http://localhost:8080/landing`
- [ ] Clicar no botão principal para ir para a plataforma
- [ ] Verificar redirecionamento para `http://localhost:8080/`

### 2. Gerar Imagem Simples
- [ ] Na tela principal, ver o campo de texto
- [ ] Digitar um prompt simples, exemplo:
  ```
  Topo de bolo com o nome "Eduarda" em letras cursivas rosa, decorado com flores
  ```
- [ ] Clicar em "Gerar Imagem"
- [ ] Aguardar a imagem ser gerada (~10-30s)
- [ ] Verificar que a imagem aparece na prévia

### 3. Preencher Form de Pagamento + Gerar QR Code
- [ ] Clicar em "💳 Pagar e Baixar HD"
- [ ] Preencher formulário:
  - Nome: Gabriel Dantas
  - Email: gbi.dantas59@gmail.com
  - Celular: 11959974473
  - Tipo Doc: CPF
  - CPF: 452.381.678-65
- [ ] Clicar em "Gerar QR Code PIX - R$ 1,00"
- [ ] Verificar que o QR Code é gerado
- [ ] Verificar que o valor exibido é R$ 1,00

### 4. Pagar QR Code
- [ ] Copiar código PIX (botão "Copiar")
- [ ] Abrir app do banco
- [ ] Colar código PIX
- [ ] Confirmar pagamento de R$ 1,00
- [ ] Aguardar confirmação automática na tela

### 5. Mensagem de Obrigado + Download
- [ ] Verificar que aparece mensagem "Pagamento Aprovado!"
- [ ] Verificar botão "Baixar Imagem em Alta Qualidade"
- [ ] Clicar no botão de download

### 6. Teste do Download
- [ ] Verificar que o download inicia automaticamente
- [ ] Verificar que o arquivo baixado é uma imagem válida
- [ ] Abrir a imagem e verificar qualidade
- [ ] Confirmar que é a imagem gerada no passo 2

## 🧪 Teste via CURL (Backend)

```bash
# Testar criação de pagamento diretamente
curl -X POST 'http://localhost:8080/api/create-payment' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "imageId":"img_test_manual",
    "amount":100,
    "description":"Teste manual do fluxo",
    "customer":{
      "name":"Gabriel Dantas",
      "email":"gbi.dantas59@gmail.com",
      "taxId":"45238167865",
      "cellphone":"11959974473"
    }
  }'
```

**Resposta esperada:**
```json
{
  "payment_id": "uuid-here",
  "external_reference": "cake_topper_img_test_manual_timestamp",
  "abacate_pay_id": "bill_xxxxx",
  "abacate_pay_url": "https://abacatepay.com/pay/bill_xxxxx",
  "status": "PENDING",
  "amount": 100,
  "description": "Teste manual do fluxo"
}
```

## ✅ Validações de Negócio

- [x] Valor mínimo aceito: 100 centavos (R$ 1,00) ✅
- [ ] QR Code gerado com sucesso
- [ ] Polling de status funcionando
- [ ] Download bloqueado antes do pagamento
- [ ] Download liberado após pagamento aprovado
- [ ] Webhook recebendo notificações do AbacatePay

## 🐛 Problemas Conhecidos Resolvidos

1. ✅ **Valor inválido:** "Valor mínimo é R$ 1,00 (100 centavos)"
   - **Causa:** IMAGE_PRICE estava em reais (1.0) ao invés de centavos (100)
   - **Solução:** Alterado para 100 centavos
   - **Status:** CORRIGIDO

## 📝 Checklist Final

- [x] Código corrigido (IMAGE_PRICE = 100)
- [x] API testada via curl (sucesso)
- [ ] Fluxo E2E testado no browser
- [ ] Pagamento real efetuado
- [ ] Download validado
- [ ] UX aprovada

## 🚀 Próximos Passos

1. Executar o fluxo manual completo no browser
2. Efetuar um pagamento real de teste
3. Validar download da imagem
4. Testar webhook do AbacatePay
5. Deploy para produção
