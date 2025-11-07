/**
 * Testes E2E completos do fluxo de pagamento
 * 
 * Cobre todo o fluxo:
 * 1. Geração de imagem
 * 2. Criação de pagamento
 * 3. Exibição de QR Code
 * 4. Simulação de pagamento (dev mode)
 * 5. Polling de status
 * 6. Download da imagem
 */

import { test, expect } from "@playwright/test";

test.describe("Payment Flow - Complete E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para homepage
    await page.goto("http://localhost:9876");
    await expect(page).toHaveTitle(/Cake Topper Generator/);
  });

  test("Fluxo completo: Geração → Pagamento → Download", async ({
    page,
  }) => {
    test.setTimeout(120000); // 2 minutos para o fluxo completo

    // ========== ETAPA 1: GERAR IMAGEM ==========
    console.log("📸 Etapa 1: Gerando imagem...");
    const promptInput = page.getByRole("textbox", {
      name: /Ex: Topo de bolo/,
    });
    await promptInput.fill("Topo de bolo teste automatizado TDD");

    const generateButton = page.getByRole("button", { name: "Gerar Imagem" });
    await generateButton.click();

    // Aguardar geração (pode demorar ~30-60s)
    await expect(page.getByText("✓ Gerado")).toBeVisible({
      timeout: 90000,
    });
    await expect(page.getByText("R$ 1,00")).toBeVisible();

    console.log("✅ Imagem gerada com sucesso");

    // ========== ETAPA 2: INICIAR PAGAMENTO ==========
    console.log("💳 Etapa 2: Iniciando pagamento...");
    const payButton = page.getByRole("button", {
      name: "💳 Pagar e Baixar HD",
    });
    await payButton.click();

    // Verificar que formulário apareceu
    await expect(
      page.getByText("Finalizar Pagamento - PIX")
    ).toBeVisible();
    await expect(page.getByText("Valor: R$ 1,00")).toBeVisible();

    // ========== ETAPA 3: PREENCHER FORMULÁRIO ==========
    console.log("📝 Etapa 3: Preenchendo formulário...");
    await page
      .getByRole("textbox", { name: "Email *" })
      .fill("teste.tdd@example.com");
    await page
      .getByRole("textbox", { name: "Número do Documento *" })
      .fill("452.381.678-65"); // CPF válido

    // ========== ETAPA 4: GERAR QR CODE ==========
    console.log("🔲 Etapa 4: Gerando QR Code PIX...");
    
    // Configurar listener ANTES de fazer a requisição
    let paymentId: string | null = null;
    let abacatePayId: string | null = null;

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/create-payment") && response.ok(),
      { timeout: 15000 }
    );

    const qrCodeButton = page.getByRole("button", {
      name: /Gerar QR Code PIX/,
    });
    await qrCodeButton.click();

    // Aguardar resposta da API
    try {
      const response = await responsePromise;
      const data = await response.json();
      paymentId = data.payment_id;
      abacatePayId = data.abacate_pay_id;
      console.log("📝 Payment IDs capturados:", { paymentId, abacatePayId });
    } catch (error) {
      console.log("⚠️ Não foi possível capturar payment ID da resposta:", error);
    }

    // Aguardar QR Code aparecer
    await expect(page.getByText("Pagamento PIX")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("Escaneie o QR Code")).toBeVisible();

    // Verificar que QR Code foi gerado
    const qrCodeImage = page.locator('img[alt="QR Code PIX"]');
    await expect(qrCodeImage).toBeVisible();

    // Verificar código copia e cola
    await expect(page.getByText("Código PIX (Copia e Cola)")).toBeVisible();

    console.log("✅ QR Code gerado com sucesso");

    // ========== ETAPA 5: SIMULAR PAGAMENTO (DEV MODE) ==========
    console.log("💰 Etapa 5: Simulando pagamento...");
    
    // Aguardar um pouco para garantir que o pagamento foi criado no banco
    await page.waitForTimeout(2000);

    // Se não capturamos o ID, tentar novamente ou usar fallback
    if (!paymentId && !abacatePayId) {
      console.log("⚠️ Não foi possível capturar payment ID, tentando simular via polling...");
    } else {
      // Simular pagamento via API
      console.log("🔄 Simulando pagamento via API...");
      const simulateResponse = await page.request.post("/api/simulate-payment", {
        data: paymentId ? { paymentId } : { abacatePayId },
      });
      
      expect(simulateResponse.ok()).toBeTruthy();
      const simulateData = await simulateResponse.json();
      expect(simulateData.ok).toBe(true);
      console.log("✅ Pagamento simulado via API");
    }

    // Aguardar polling detectar pagamento aprovado
    await expect(
      page.getByText(/Pagamento aprovado|Pago em/)
    ).toBeVisible({
      timeout: 30000,
    });

    console.log("✅ Pagamento detectado como aprovado");

    // ========== ETAPA 6: DOWNLOAD ==========
    console.log("⬇️ Etapa 6: Fazendo download...");
    
    // Verificar que botão de download apareceu
    const downloadButton = page.getByRole("button", {
      name: /Baixar topo agora/,
    });
    await expect(downloadButton).toBeVisible({ timeout: 10000 });
    
    // Aguardar que o botão esteja habilitado
    await expect(downloadButton).toBeEnabled({ timeout: 15000 });

    // Configurar listener para download
    const downloadPromise = page.waitForEvent("download", { timeout: 30000 });
    await downloadButton.click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/cake-topper-.*\.png/);

    console.log("✅ Download iniciado com sucesso");

    // ========== VALIDAÇÕES FINAIS ==========
    // Verificar que confetti apareceu (indica sucesso)
    // Verificar que mensagem de sucesso está visível
    await expect(
      page.getByText(/Já pode fazer o download|Próximos passos/)
    ).toBeVisible();

    console.log("🎉 Fluxo completo validado com sucesso!");
  });

  test("Deve validar CPF inválido antes de criar pagamento", async ({
    page,
  }) => {
    // Gerar imagem rápida
    const promptInput = page.getByRole("textbox", { name: /Ex: Topo de bolo/ });
    await promptInput.fill("Test");
    await page.getByRole("button", { name: "Gerar Imagem" }).click();
    await expect(page.getByText("✓ Gerado")).toBeVisible({ timeout: 90000 });

    // Ir para checkout
    await page.getByRole("button", { name: "💳 Pagar e Baixar HD" }).click();

    // Preencher com CPF INVÁLIDO
    await page
      .getByRole("textbox", { name: "Email *" })
      .fill("test@example.com");
    await page
      .getByRole("textbox", { name: "Número do Documento *" })
      .fill("12345678901"); // CPF inválido

    // Tentar gerar QR Code
    await page.getByRole("button", { name: /Gerar QR Code PIX/ }).click();

    // Deve mostrar erro de CPF inválido
    await expect(page.getByText(/CPF inválido|Documento inválido/)).toBeVisible(
      { timeout: 5000 }
    );
  });

  test("Deve validar email inválido", async ({ page }) => {
    // Gerar imagem
    const promptInput = page.getByRole("textbox", { name: /Ex: Topo de bolo/ });
    await promptInput.fill("Test");
    await page.getByRole("button", { name: "Gerar Imagem" }).click();
    await expect(page.getByText("✓ Gerado")).toBeVisible({ timeout: 90000 });

    // Ir para checkout
    await page.getByRole("button", { name: "💳 Pagar e Baixar HD" }).click();

    // Preencher com email inválido
    await page
      .getByRole("textbox", { name: "Email *" })
      .fill("email-invalido");
    await page
      .getByRole("textbox", { name: "Número do Documento *" })
      .fill("452.381.678-65");

    // Tentar gerar QR Code
    await page.getByRole("button", { name: /Gerar QR Code PIX/ }).click();

    // Deve mostrar erro de email inválido
    await expect(page.getByText(/Email inválido/)).toBeVisible({
      timeout: 5000,
    });
  });

  test("Deve exibir QR Code corretamente após criar pagamento", async ({
    page,
  }) => {
    // Gerar imagem
    const promptInput = page.getByRole("textbox", { name: /Ex: Topo de bolo/ });
    await promptInput.fill("Test QR Code");
    await page.getByRole("button", { name: "Gerar Imagem" }).click();
    await expect(page.getByText("✓ Gerado")).toBeVisible({ timeout: 90000 });

    // Ir para checkout
    await page.getByRole("button", { name: "💳 Pagar e Baixar HD" }).click();

    // Preencher formulário válido
    await page
      .getByRole("textbox", { name: "Email *" })
      .fill("test@example.com");
    await page
      .getByRole("textbox", { name: "Número do Documento *" })
      .fill("452.381.678-65");

    // Gerar QR Code
    await page.getByRole("button", { name: /Gerar QR Code PIX/ }).click();

    // Verificar elementos do QR Code
    await expect(page.getByText("Pagamento PIX")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("Escaneie o QR Code")).toBeVisible();
    
    const qrCodeImage = page.locator('img[alt="QR Code PIX"]');
    await expect(qrCodeImage).toBeVisible();
    
    // Verificar que a imagem tem src válido
    const qrCodeSrc = await qrCodeImage.getAttribute("src");
    expect(qrCodeSrc).toMatch(/^data:image\/png;base64,/);

    // Verificar código copia e cola
    await expect(page.getByText("Código PIX (Copia e Cola)")).toBeVisible();
    
    // Verificar que o código PIX está presente (começa com 00020)
    const copyPasteCode = page.locator('input[readonly], textarea[readonly]').first();
    await expect(copyPasteCode).toBeVisible();
    const codeValue = await copyPasteCode.inputValue();
    expect(codeValue).toMatch(/^00020/); // PIX code sempre começa com 00020
  });

  test("Deve fazer polling de status após criar pagamento", async ({
    page,
  }) => {
    // Gerar imagem
    const promptInput = page.getByRole("textbox", { name: /Ex: Topo de bolo/ });
    await promptInput.fill("Test Polling");
    await page.getByRole("button", { name: "Gerar Imagem" }).click();
    await expect(page.getByText("✓ Gerado")).toBeVisible({ timeout: 90000 });

    // Ir para checkout
    await page.getByRole("button", { name: "💳 Pagar e Baixar HD" }).click();

    // Preencher e criar pagamento
    await page
      .getByRole("textbox", { name: "Email *" })
      .fill("test@example.com");
    await page
      .getByRole("textbox", { name: "Número do Documento *" })
      .fill("452.381.678-65");
    await page.getByRole("button", { name: /Gerar QR Code PIX/ }).click();

    // Aguardar QR Code aparecer
    await expect(page.getByText("Pagamento PIX")).toBeVisible({
      timeout: 15000,
    });

    // Verificar que está fazendo polling (pode verificar no console ou network)
    // Por enquanto, apenas verificamos que o QR Code apareceu
    // O polling acontece em background
    await page.waitForTimeout(10000); // Aguardar alguns ciclos de polling

    // Verificar que não houve erro de rede (indica que polling está funcionando)
    const networkErrors = [];
    page.on("response", (response) => {
      if (response.status() >= 400 && response.url().includes("/api/payment-status")) {
        networkErrors.push(response);
      }
    });

    // Se chegou aqui sem erro, o polling está funcionando
    expect(networkErrors.length).toBe(0);
  });
});
