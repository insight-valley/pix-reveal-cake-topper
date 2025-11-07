# Project Knowledge Base
_Consolidated long-term memory - patterns, decisions, and learnings_

## Architecture & Design Decisions

### Stack Principal
- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Functions + Database)
- **Pagamentos**: MercadoPago PIX
- **Geração de Imagem**: Replicate AI

### Fluxo de Pagamento PIX (Correto)
1. Cliente gera imagem via Replicate
2. **Automaticamente** criamos pagamento PIX no MercadoPago
3. Renderizamos QR CODE da resposta do pagamento
4. Usuário escaneia e paga
5. Validamos status usando `@mercadopago/sdk-react`
6. Liberamos download após confirmação

## Coding Standards & Conventions

### Estrutura de Arquivos
```
src/
├── components/         # React components
├── hooks/             # Custom hooks
├── services/          # API services
├── constants/         # App constants
├── integrations/      # External services
└── pages/            # Page components
```

### Padrões de Nomenclatura
- Components: PascalCase (ex: `CakeTopperGenerator`)
- Hooks: camelCase com 'use' prefix (ex: `useImageGeneration`)
- Services: camelCase (ex: `paymentService`)
- Constants: UPPER_SNAKE_CASE

## Domain Knowledge

### Fluxo Principal do App
1. **Geração**: Cliente escolhe prompt e gera imagem
2. **Pagamento**: Criação automática de PIX após imagem
3. **Validação**: Monitoramento em tempo real do status
4. **Download**: Liberação após confirmação do pagamento

### Integrações Críticas
- **Replicate**: Geração de imagens AI
- **MercadoPago**: Processamento de pagamentos PIX
- **Supabase**: Backend e database

## Recurring Patterns

### Error Handling
```typescript
try {
  // operation
} catch (error) {
  console.error('Context:', error);
  // specific error handling
}
```

### API Service Pattern
```typescript
export const serviceName = {
  async method(params: Type): Promise<ReturnType> {
    // implementation
  }
};
```

## API Contracts

### MercadoPago Payment Creation
```typescript
interface PaymentRequest {
  transaction_amount: number;
  description: string;
  payment_method_id: "pix";
  payer: {
    email: string;
  };
}

interface PaymentResponse {
  id: string;
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      qr_code_base64: string;
    };
  };
  status: "pending" | "approved" | "rejected";
}
```

### Supabase Functions
- `generate-image`: Chama Replicate e retorna URL
- `create-payment`: Cria pagamento PIX no MercadoPago
- `payment-status`: Verifica status de pagamento
- `validate-download`: Valida e libera download

## Technical Learnings

### MercadoPago PIX Implementation
- QR CODE é gerado automaticamente na criação
- Status pode ser monitorado via webhook ou polling
- SDK React facilita validação em tempo real
- Usuários de teste têm credenciais específicas 