# Plano de Implementação – Proteção de Imagens Geradas

## Objetivo
Garantir que imagens em alta resolução sejam entregues apenas após pagamento aprovado, mitigando fraudes e acessos não autorizados.

---

## 1. Ajustes no Backend

### 1.1 `/api/generate-image` – Persistência Segura
- Salvar a imagem original recebida da OpenAI no Supabase Storage (`generated-images/<imageId>.png`).
- Gerar uma prévia degradada com `sharp` ou `node-canvas` (downscale + watermark) e salvar como `generated-previews/<imageId>.jpeg`.
- Retornar ao frontend somente:

  ```json
  { "imageId": "<uuid>", "previewUrl": "https://storage/.../generated-previews/<imageId>.jpeg" }
  ```

- Registrar `imageId` e chave de storage para uso posterior.

### 1.2 Persistência de Metadados
- Na criação do pagamento (`/api/create-payment`), vincular `image_id` ao registro em `payments`.
- Assegurar que logs (`payment_logs`) capturem `image_id` para auditoria.

### 1.3 `/api/abacate-webhook`
- Validar status real no AbacatePay antes de gerar token (já existente).
- Gerar token vinculado ao `image_id`. Caso o schema atual não tenha a coluna, incluir campo `image_id` em `download_tokens`.

### 1.4 `/api/payment-status`
- Responder com `image_id` e token quando disponível:

  ```json
  {
    "payment_id": "...",
    "status": "...",
    "image_id": "...",
    "can_download": true,
    "download_token": "...",
    "download_expires_at": "..."
  }
  ```

- Garantir que tokens expirados ou usados não apareçam como válidos.

### 1.5 `/api/validate-download`
- Validar `token` + `imageId`, checar status `PAID` na API do AbacatePay e marcar token como usado.
- Retornar `signedUrl` da imagem HD (`generated-images/<imageId>.png`).

---

## 2. Ajustes no Frontend

### 2.1 `useImageGeneration`
- Esperar `{ imageId, previewUrl }`.
- Guardar preview usando utilitário de watermark.
- Expor método `loadFullImage` que usa `downloadImage` após pagamento.

### 2.2 `CakeTopperGenerator`
- Renderizar preview via `<canvas>` com overlay “Prévia protegida”.
- Bloquear `contextmenu` e `dragstart` enquanto não pago.
- Remover blur e watermark apenas quando `paymentStatus.status === "approved"`.

### 2.3 `CheckoutForm`
- Guardar `imageId` a partir da resposta de `createPayment`.
- Exibir botão “Baixar HD” somente quando `paymentStatus.can_download` for `true`.
- Após download, atualizar o estado para mostrar preview HD removendo filtros.

### 2.4 Utilitário `imagePreview`
- Funções recomendadas:

  ```ts
  async function createWatermarkedPreview(url: string, watermark: string): Promise<string>;
  async function drawFullImage(url: string, canvas: HTMLCanvasElement): Promise<void>;
  ```

- Reutilizar funções para evitar duplicação de lógica de canvas.

### 2.5 Telemetria
- Logar tentativas de copiar a imagem na prévia (context menu, arrastar) via `lib/langfuse` ou outro analytics existente.

---

## 3. Testes Recomendados

### 3.1 Automatizados
- **Unitários**
  - `imagePreview.test.ts`: garante redução de resolução e adição de watermark.
  - `useImageGeneration.test.ts`: cobre fluxos de sucesso/erro ao receber `imageId` e `previewUrl`.
  - `usePayment.test.ts`: valida manipulação de tokens e bloqueio de download sem aprovação.

- **API (Supertest)**
  - `/api/generate-image`: mock da OpenAI; verifica persistência no storage e retorno apenas da prévia.
  - `/api/payment-status`: cenários com token válido, expirado e ausente.
  - `/api/validate-download`: token válido retorna `signedUrl`; inválido/expirado retorna `4xx`; falha na API AbacatePay retorna `503`.

- **End-to-end (Playwright/Cypress)**
  - Fluxo completo: gerar prévia, simular pagamento aprovado (mock), liberar download e tentar reusar token (deve falhar).

### 3.2 Manuais
1. Gerar imagem, inspecionar DOM: confirmar prévia degradada com overlay e sem acesso ao arquivo HD.
2. Copiar link da imagem: verificar que aponta para a prévia protegida.
3. Concluir pagamento em sandbox: verificar habilitação do botão de download e remoção do filtro após sucesso.
4. Reutilizar token depois de marcado como usado: garantir retorno de erro apropriado.
5. Simular falha de validação (indisponibilidade do AbacatePay): download deve ser bloqueado com mensagem amigável.

---

## Observações Finais
- A segurança depende do backend para nunca devolver o arquivo HD antes do pagamento aprovado.
- Após implementação e testes, atualizar `docs/reports/FULL_UX_TEST_REPORT_V6.md` (ou versão vigente) com o novo fluxo antifraude.

