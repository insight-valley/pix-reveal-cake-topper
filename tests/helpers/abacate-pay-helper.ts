/**
 * Helper para usar MCP do AbacatePay em testes
 * 
 * Este helper permite simular pagamentos usando o MCP do AbacatePay
 * para validar o fluxo completo de pagamento e download.
 */

/**
 * Simula um pagamento PIX usando o MCP do AbacatePay
 * 
 * @param pixQrCodeId - ID do QR Code PIX retornado pelo AbacatePay
 * @returns Status do pagamento após simulação
 */
export async function simulatePaymentViaMCP(
  pixQrCodeId: string
): Promise<{ success: boolean; status?: string; error?: string }> {
  try {
    // Nota: Em um ambiente Node.js/Playwright, não temos acesso direto ao MCP
    // Mas podemos criar um endpoint de teste que usa o MCP internamente
    // ou usar a API do AbacatePay diretamente
    
    // Por enquanto, vamos usar a API do AbacatePay diretamente
    // que é o que o MCP faz internamente
    const response = await fetch(
      `https://api.abacatepay.com/v1/pixQrCode/simulate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ABACATE_PAY_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: pixQrCodeId,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        success: false,
        error: `AbacatePay API error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      status: data.status || data.data?.status || "PAID",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Verifica o status de um pagamento PIX no AbacatePay
 */
export async function checkPaymentStatusViaMCP(
  pixQrCodeId: string
): Promise<{ status: string; paidAt?: string } | null> {
  try {
    const response = await fetch(
      `https://api.abacatepay.com/v1/pixQrCode/check?id=${pixQrCodeId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ABACATE_PAY_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const paymentData = data.data || data;
    
    return {
      status: paymentData.status || "PENDING",
      paidAt: paymentData.paidAt || paymentData.paid_at,
    };
  } catch (error) {
    console.error("Error checking payment status:", error);
    return null;
  }
}
