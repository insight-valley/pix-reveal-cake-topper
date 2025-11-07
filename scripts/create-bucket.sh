#!/bin/bash

# Script para criar bucket generated-previews no Supabase
# Requer .env com NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY

set -e

# Carregar variáveis do .env
if [ -f .env ]; then
    export NEXT_PUBLIC_SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env | cut -d '=' -f2)
    export SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env | cut -d '=' -f2)
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing Supabase credentials in .env"
    exit 1
fi

echo "🚀 Creating generated-previews bucket..."

# Criar bucket via API
curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/bucket" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "generated-previews",
    "public": false,
    "file_size_limit": 5242880,
    "allowed_mime_types": ["image/jpeg", "image/jpg"]
  }' && echo "\n✅ Bucket created successfully!" || echo "\n⚠️ Bucket might already exist or check your credentials"
