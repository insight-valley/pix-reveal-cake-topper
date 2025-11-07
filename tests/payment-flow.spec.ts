import { test, expect } from "@playwright/test";

test.describe("Payment Flow E2E", () => {
  test("Complete flow: Image generation → Payment → QR Code", async ({
    page,
  }) => {
    test.setTimeout(90000); // 90 segundos para a geração de imagem

    // 1. Navegar para homepage
    await page.goto("http://localhost:9876");
    await expect(page).toHaveTitle(/Cake Topper Generator/);

    // 2. Preencher prompt e gerar imagem
    const promptInput = page.getByRole("textbox", { name: /Ex: Topo de bolo/ });
    await promptInput.fill("Topo de bolo simples teste automatizado");

    const generateButton = page.getByRole("button", { name: "Gerar Imagem" });
    await generateButton.click();

    // 3. Aguardar geração de imagem (pode demorar ~30s)
    await expect(page.getByText("✓ Gerado")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("R$ 1,00")).toBeVisible();

    // 4. Clicar em "Pagar e Baixar HD"
    const payButton = page.getByRole("button", {
      name: "💳 Pagar e Baixar HD",
    });
    await payButton.click();

    // 5. Verificar que formulário de checkout apareceu
    await expect(page.getByText("Finalizar Pagamento - PIX")).toBeVisible();
    await expect(page.getByText("Valor: R$ 1,00")).toBeVisible();

    // 6. Preencher formulário com CPF VÁLIDO
    await page
      .getByRole("textbox", { name: "Email *" })
      .fill("test@example.com");
    await page
      .getByRole("textbox", { name: "Número do Documento *" })
      .fill("452.381.678-65");

    // 7. Gerar QR Code PIX
    const qrCodeButton = page.getByRole("button", {
      name: /Gerar QR Code PIX/,
    });
    await qrCodeButton.click();

    // 8. Aguardar QR Code aparecer
    await expect(page.getByText("Pagamento PIX")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Escaneie o QR Code")).toBeVisible();

    // 9. Verificar que QR Code foi gerado
    const qrCodeImage = page.locator('img[alt="QR Code PIX"]');
    await expect(qrCodeImage).toBeVisible();

    // 10. Verificar código copia e cola
    await expect(page.getByText("Código PIX (Copia e Cola)")).toBeVisible();

    console.log("✅ Fluxo completo validado com sucesso!");
  });

  test("Should validate invalid CPF", async ({ page }) => {
    await page.goto("http://localhost:9876");

    // Gerar imagem rápida
    const promptInput = page.getByRole("textbox", { name: /Ex: Topo de bolo/ });
    await promptInput.fill("Test");
    await page.getByRole("button", { name: "Gerar Imagem" }).click();
    await expect(page.getByText("✓ Gerado")).toBeVisible({ timeout: 60000 });

    // Ir para checkout
    await page.getByRole("button", { name: "💳 Pagar e Baixar HD" }).click();

    // Preencher com CPF INVÁLIDO
    await page
      .getByRole("textbox", { name: "Email *" })
      .fill("test@example.com");
    await page
      .getByRole("textbox", { name: "Número do Documento *" })
      .fill("12345678901");

    // Tentar gerar QR Code
    await page.getByRole("button", { name: /Gerar QR Code PIX/ }).click();

    // Deve mostrar erro de CPF inválido
    await expect(page.getByText(/CPF inválido/)).toBeVisible({ timeout: 5000 });

    console.log("✅ Validação de CPF inválido funcionando!");
  });
});
