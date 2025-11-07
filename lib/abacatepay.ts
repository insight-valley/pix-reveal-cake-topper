// AbacatePay SDK Client para Next.js
// SDK oficial: https://docs.abacatepay.com/pages/sdks

import AbacatePay from "abacatepay-nodejs-sdk";

export interface CreatePixPaymentRequest {
  imageId: string;
  amount: number; // em centavos (mínimo 100 = R$ 1,00)
  description: string;
  customer?: {
    name?: string;
    email?: string;
    taxId?: string;
    cellphone?: string;
  };
}

export interface PixPaymentResponse {
  id: string; // ID do AbacatePay
  url: string; // URL para pagamento
  status: string;
  qrCode?: string;
  qrCodeBase64?: string;
  amount: number;
}

export interface PaymentStatusResponse {
  id: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | "REFUNDED";
  amount: number;
  paidAt?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Cliente AbacatePay usando SDK oficial
 */
export class AbacatePayService {
  private client: ReturnType<typeof AbacatePay>;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = AbacatePay(apiKey);
  }

  /**
   * Cria uma cobrança PIX usando SDK do AbacatePay
   */
  async createPixPayment(
    request: CreatePixPaymentRequest
  ): Promise<PixPaymentResponse> {
    try {
      const { imageId, amount, description, customer } = request;
      console.log("[AbacatePay] Creating PIX QR Code with SDK...");
      console.log("[AbacatePay] Request:", request);

      // Validar valor mínimo
      if (amount !== 100) {
        throw new Error("Valor do pagamento deve ser R$ 1,00");
      }

      console.log("[AbacatePay] Creating PIX QR Code with SDK...");
      console.log("[AbacatePay] API Key configured:", !!this.apiKey);
      console.log("[AbacatePay] API Key length:", this.apiKey?.length || 0);
      console.log(
        "[AbacatePay] API Key preview:",
        this.apiKey?.substring(0, 10) + "..." || "N/A"
      );

      const requestPayload = {
        amount,
        description: description || `Pagamento - ${imageId}`,
        customer: {
          name: customer?.name || "Cliente",
          email: customer?.email || "cliente@example.com",
          cellphone: customer?.cellphone || "(00) 00000-0000",
          taxId: customer?.taxId || "000.000.000-00",
        },
        expiresIn: 86400, // 24 horas (requerido pelo SDK)
      };

      console.log(
        "[AbacatePay] Request payload:",
        JSON.stringify(requestPayload, null, 2)
      );
      console.log("[AbacatePay] Client type:", typeof this.client);
      console.log(
        "[AbacatePay] Client pixQrCode type:",
        typeof this.client.pixQrCode
      );
      console.log(
        "[AbacatePay] Client pixQrCode.create type:",
        typeof this.client.pixQrCode?.create
      );

      // Usar pixQrCode.create para gerar QR Code diretamente
      let pixQrCode;
      try {
        console.log("[AbacatePay] Calling SDK pixQrCode.create...");
        pixQrCode = await this.client.pixQrCode.create(requestPayload);
        console.log(
          "[AbacatePay] SDK call completed, response type:",
          typeof pixQrCode
        );
        console.log(
          "[AbacatePay] SDK call completed, response is null?",
          pixQrCode === null
        );
        console.log(
          "[AbacatePay] SDK call completed, response is undefined?",
          pixQrCode === undefined
        );
        console.log(
          "[AbacatePay] SDK call completed, response keys:",
          pixQrCode ? Object.keys(pixQrCode) : "null/undefined"
        );
        console.log(
          "[AbacatePay] SDK call completed, response stringified:",
          JSON.stringify(pixQrCode)
        );

        // Verificar se a resposta está vazia
        if (
          !pixQrCode ||
          (typeof pixQrCode === "object" && Object.keys(pixQrCode).length === 0)
        ) {
          console.error("[AbacatePay] SDK returned empty response!");
          throw new Error(
            "AbacatePay SDK retornou resposta vazia. Verifique a API key e os parâmetros da requisição."
          );
        }
      } catch (sdkError) {
        console.error("[AbacatePay] SDK call failed:", sdkError);
        console.error(
          "[AbacatePay] SDK call failed, error type:",
          typeof sdkError
        );
        console.error(
          "[AbacatePay] SDK call failed, error keys:",
          sdkError && typeof sdkError === "object"
            ? Object.keys(sdkError)
            : "N/A"
        );
        throw new Error(
          `Erro ao chamar SDK AbacatePay: ${
            sdkError instanceof Error ? sdkError.message : String(sdkError)
          }`
        );
      }

      console.log("[AbacatePay] PIX QR Code created successfully:", pixQrCode);
      console.log(
        "[AbacatePay] PIX QR Code data:",
        JSON.stringify(pixQrCode, null, 2)
      );

      // Verificar se houve erro na resposta
      // O SDK retorna { error: data.message } mas a API pode retornar { error: "mensagem" }
      // Então precisamos verificar ambos os formatos
      if ("error" in pixQrCode && pixQrCode.error) {
        const errorMessage =
          typeof pixQrCode.error === "string"
            ? pixQrCode.error
            : pixQrCode.error.message ||
              pixQrCode.error ||
              "Erro desconhecido do AbacatePay";
        console.error("[AbacatePay] Error in response:", errorMessage);
        console.error(
          "[AbacatePay] Full error object:",
          JSON.stringify(pixQrCode, null, 2)
        );
        throw new Error(`Erro AbacatePay: ${errorMessage}`);
      }

      // Se a resposta tem apenas { error: undefined }, pode ser que o SDK não capturou o erro corretamente
      // Nesse caso, vamos fazer uma chamada direta para ver o erro real
      if ("error" in pixQrCode && pixQrCode.error === undefined) {
        console.error(
          "[AbacatePay] SDK returned { error: undefined }, making direct API call to debug..."
        );
        // Fazer chamada direta para capturar o erro real
        try {
          const directResponse = await fetch(
            "https://api.abacatepay.com/v1/pixQrCode/create",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestPayload),
            }
          );
          const directData = await directResponse.json();
          console.error(
            "[AbacatePay] Direct API response:",
            JSON.stringify(directData, null, 2)
          );
          console.error(
            "[AbacatePay] Direct API status:",
            directResponse.status
          );

          if (!directResponse.ok || directData.error) {
            const errorMsg =
              directData.error ||
              directData.message ||
              "Erro desconhecido do AbacatePay";
            throw new Error(`Erro AbacatePay: ${errorMsg}`);
          }

          // Se a chamada direta funcionou, usar esses dados
          pixQrCode = directData;
        } catch (directError) {
          console.error(
            "[AbacatePay] Direct API call also failed:",
            directError
          );
          throw new Error(
            `Erro AbacatePay: ${
              directError instanceof Error
                ? directError.message
                : String(directError)
            }`
          );
        }
      }

      // O SDK pode retornar { data: IPixQrCode } ou diretamente o objeto
      // Verificar ambos os formatos para maior robustez
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pixData = ("data" in pixQrCode ? pixQrCode.data : pixQrCode) as any;

      // DEBUG: Log completo da resposta do AbacatePay
      console.log(
        "[AbacatePay] Full response from SDK:",
        JSON.stringify(pixQrCode, null, 2)
      );
      console.log(
        "[AbacatePay] Extracted pixData:",
        JSON.stringify(pixData, null, 2)
      );

      if (!pixData || !pixData.id) {
        throw new Error("AbacatePay não retornou dados do PIX QR Code");
      }

      // A API retorna brCode e brCodeBase64 (não qrCode!)
      const brCode = pixData.brCode;
      const brCodeBase64 = pixData.brCodeBase64;

      console.log("[AbacatePay] PIX QR Code created successfully:", {
        id: pixData.id,
        status: pixData.status,
        hasBrCode: !!brCode,
        hasBrCodeBase64: !!brCodeBase64,
        brCodeLength: brCode?.length || 0,
        brCodeBase64Length: brCodeBase64?.length || 0,
        brCodeBase64Preview: brCodeBase64?.substring(0, 100),
      });

      return {
        id: pixData.id,
        url: `https://app.abacatepay.com/pix/${pixData.id}`,
        status: pixData.status,
        qrCode: brCode || undefined, // brCode = código copia e cola
        qrCodeBase64: brCodeBase64 || undefined, // brCodeBase64 = garantido ter data:image/png;base64, UMA vez
        amount,
      };
    } catch (error) {
      console.error("[AbacatePay] SDK error:", error);
      throw error;
    }
  }

  /**
   * Consulta status de um pagamento PIX QRCode
   * Endpoint: GET /v1/pixQrCode/check?id={pixQrCodeId}
   */
  async getPaymentStatus(pixQrCodeId: string): Promise<PaymentStatusResponse> {
    const id = extractBillingId(pixQrCodeId);

    try {
      const response = await fetch(
        `https://api.abacatepay.com/v1/pixQrCode/check?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error("[AbacatePay] Failed to retrieve PIX QRCode status:", {
          id,
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(
          `AbacatePay PIX QRCode status check failed with HTTP ${response.status}`
        );
      }

      const payload = await response.json().catch(() => null);

      if (!payload || typeof payload !== "object") {
        throw new Error("AbacatePay returned an invalid status payload");
      }

      const data =
        "data" in payload && payload.data && typeof payload.data === "object"
          ? payload.data
          : payload;

      const rawStatus = String((data as Record<string, unknown>).status || "")
        .trim()
        .toUpperCase();

      const allowedStatuses: PaymentStatusResponse["status"][] = [
        "PENDING",
        "PAID",
        "EXPIRED",
        "CANCELLED",
        "REFUNDED",
      ];

      const status = allowedStatuses.includes(
        rawStatus as PaymentStatusResponse["status"]
      )
        ? (rawStatus as PaymentStatusResponse["status"])
        : "PENDING";

      const amount = Number(
        (data as Record<string, unknown>).amount ??
          (data as Record<string, unknown>).total ??
          (data as Record<string, unknown>).value ??
          0
      );

      const paidAt =
        (data as Record<string, unknown>).paidAt ||
        (data as Record<string, unknown>).paid_at;

      return {
        id,
        status,
        amount: Number.isFinite(amount) ? amount : 0,
        paidAt:
          typeof paidAt === "string"
            ? paidAt
            : typeof paidAt === "number"
            ? new Date(paidAt * 1000).toISOString()
            : undefined,
        metadata:
          typeof (data as Record<string, unknown>).metadata === "object"
            ? ((data as Record<string, unknown>).metadata as Record<
                string,
                unknown
              >)
            : undefined,
      };
    } catch (error) {
      console.error("[AbacatePay] Error fetching payment status:", error);
      throw error;
    }
  }

  /**
   * Lista todas as cobranças
   */
  async listBillings() {
    try {
      return await this.client.billing.list();
    } catch (error) {
      console.error("AbacatePay SDK error listing billings:", error);
      throw error;
    }
  }

  /**
   * Simula um pagamento PIX no modo de desenvolvimento
   * Apenas funciona com chaves de desenvolvimento do AbacatePay
   *
   * @param pixQrCodeId - ID do QR Code PIX (formato: pix_char_xxx)
   * @returns Status atualizado do pagamento
   */
  async simulatePixPayment(
    pixQrCodeId: string
  ): Promise<PaymentStatusResponse> {
    try {
      console.log("[AbacatePay] Simulating PIX payment:", pixQrCodeId);

      // Usar a API diretamente para simular pagamento
      // Endpoint: POST /v1/pixQrCode/simulate
      const response = await fetch(
        `https://api.abacatepay.com/v1/pixQrCode/simulate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
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
        console.error("[AbacatePay] Failed to simulate PIX payment:", {
          id: pixQrCodeId,
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(
          `AbacatePay simulate payment failed with HTTP ${response.status}: ${errorText}`
        );
      }

      const payload = await response.json().catch(() => null);

      if (!payload || typeof payload !== "object") {
        throw new Error("AbacatePay returned an invalid simulation payload");
      }

      const data =
        "data" in payload && payload.data && typeof payload.data === "object"
          ? payload.data
          : payload;

      console.log("[AbacatePay] Payment simulated successfully:", data);

      // Buscar status atualizado
      return await this.getPaymentStatus(pixQrCodeId);
    } catch (error) {
      console.error("[AbacatePay] Error simulating payment:", error);
      throw error;
    }
  }
}

/**
 * Helper para formatar valores em reais
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/**
 * Helper para validar valor mínimo
 */
export function validateAmount(cents: number): {
  valid: boolean;
  error?: string;
} {
  if (cents < 100) {
    return {
      valid: false,
      error: "Valor mínimo é R$ 1,00 (100 centavos)",
    };
  }
  return { valid: true };
}

/**
 * Helper para extrair ID da billing do AbacatePay
 */
export function extractBillingId(urlOrId: string): string {
  // Se for uma URL, extrair o ID
  if (urlOrId.includes("http")) {
    const match = urlOrId.match(/\/billing\/([^/?]+)/);
    return match ? match[1] : urlOrId;
  }
  return urlOrId;
}

/**
 * Singleton para uso no backend
 */
let abacatePayInstance: AbacatePayService | null = null;

export function getAbacatePayClient(): AbacatePayService {
  if (!abacatePayInstance) {
    const apiKey = process.env.ABACATE_PAY_API_KEY;
    if (!apiKey) {
      throw new Error("ABACATE_PAY_API_KEY não configurada");
    }
    abacatePayInstance = new AbacatePayService(apiKey);
  }
  return abacatePayInstance;
}
