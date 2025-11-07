#!/bin/bash

# Script de Teste do Fluxo Completo
# PIX Reveal Cake Topper

set -e

echo "🧪 Iniciando teste do fluxo completo..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL base
BASE_URL="http://localhost:9876"

# Função para testar endpoint
test_endpoint() {
  local name=$1
  local method=${2:-GET}
  local url=$3
  local data=${4:-}
  
  echo -n "Testing $name... "
  
  if [ "$method" = "POST" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
      -H "Content-Type: application/json" \
      -d "$data")
  else
    response=$(curl -s -w "\n%{http_code}" "$url")
  fi
  
  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
    echo -e "${GREEN}✓ OK (${status_code})${NC}"
    return 0
  else
    echo -e "${RED}✗ FAIL (${status_code})${NC}"
    echo "$body" | jq . 2>/dev/null || echo "$body"
    return 1
  fi
}

echo "📡 Testando endpoints de saúde..."
test_endpoint "Health Check" GET "$BASE_URL/api/health"
test_endpoint "Healthz Check" GET "$BASE_URL/api/healthz"
echo ""

echo "💳 Testando criação de pagamento..."
PAYMENT_DATA='{
  "imageId":"img_test_'$(date +%s)'",
  "amount":100,
  "description":"Teste automatizado do fluxo",
  "customer":{
    "name":"Gabriel Dantas",
    "email":"gbi.dantas59@gmail.com",
    "taxId":"45238167865",
    "cellphone":"11959974473"
  }
}'

response=$(curl -s -X POST "$BASE_URL/api/create-payment" \
  -H "Content-Type: application/json" \
  -d "$PAYMENT_DATA")

if echo "$response" | jq -e '.payment_id' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Pagamento criado com sucesso${NC}"
  echo ""
  echo "Detalhes do pagamento:"
  echo "$response" | jq '{
    payment_id: .payment_id,
    abacate_pay_id: .abacate_pay_id,
    status: .status,
    amount: .amount,
    amount_formatted: "\(.amount / 100) reais"
  }'
  
  PAYMENT_ID=$(echo "$response" | jq -r '.payment_id')
  
  echo ""
  echo "🔍 Verificando status do pagamento..."
  sleep 2
  
  status_response=$(curl -s "$BASE_URL/api/payment-status?paymentId=$PAYMENT_ID")
  
  if echo "$status_response" | jq -e '.payment_id' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Status recuperado com sucesso${NC}"
    echo "$status_response" | jq '{
      payment_id: .payment_id,
      status: .status,
      can_download: .can_download
    }'
  else
    echo -e "${RED}✗ Erro ao recuperar status${NC}"
    echo "$status_response" | jq .
  fi
  
else
  echo -e "${RED}✗ Erro ao criar pagamento${NC}"
  echo "$response" | jq .
  exit 1
fi

echo ""
echo "================================================"
echo -e "${GREEN}✅ Todos os testes de backend passaram!${NC}"
echo "================================================"
echo ""
echo "📝 Próximos passos manuais:"
echo ""
echo "1. Abrir http://localhost:9876 no navegador"
echo "2. Gerar uma imagem simples"
echo "3. Prosseguir para o checkout"
echo "4. Gerar QR Code PIX"
echo "5. Pagar com o app do banco"
echo "6. Verificar download automático"
echo ""
echo "💡 Para simular pagamento em DEV:"
echo "   - Use a API de simulação do AbacatePay"
echo "   - Ou aguarde o timeout para testar fluxo de erro"
echo ""
