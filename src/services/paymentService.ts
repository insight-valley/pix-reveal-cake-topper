import { getSupabase } from "@/integrations/supabase/client";

export interface CreatePaymentRequest {
  imageId: string;
  description: string;
  customer?: {
    name?: string;
    email?: string;
    taxId?: string;
    cellphone?: string;
  };
}

export interface CreatePaymentResponse {
  payment_id: string;
  external_reference: string;
  abacate_pay_id: string;
  abacate_pay_url: string;
  status: string;
  qr_code?: string;
  qr_code_base64?: string;
  amount: number;
  description: string;
  expires_at?: string;
}

export interface PaymentStatus {
  payment_id: string;
  image_id: string;
  status: string;
  abacate_pay_id?: string;
  amount: number;
  description: string;
  created_at: string;
  updated_at?: string;
  expires_at?: string;
  download_token?: string;
  download_expires_at?: string;
  can_download: boolean;
}

export interface ValidateDownloadRequest {
  token: string;
  imageId: string;
}

export interface ValidateDownloadResponse {
  valid: boolean;
  imageUrl?: string;
  expiresAt?: string;
  error?: string;
}

class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = ``; // relative to Next.js API
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const supabase = getSupabase();
    const { data: { session } = { session: null } } =
      await supabase.auth.getSession();

    // Determinar se deve usar cache baseado no endpoint
    const isStatusCheck = endpoint.includes("/payment-status");
    const cacheOption = isStatusCheck ? "no-store" : "default";

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      cache: cacheOption as RequestCache,
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error("[PaymentService] API Error:", {
        endpoint,
        status: response.status,
        error,
      });
      throw new Error(
        error.error || error.message || `HTTP ${response.status}`
      );
    }

    const data = await response.json();
    console.log("[PaymentService] API Success:", {
      endpoint,
      dataKeys: Object.keys(data),
    });
    return data;
  }

  /**
   * Cria um novo pagamento PIX com AbacatePay
   */
  async createPayment(
    request: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    return this.makeRequest<CreatePaymentResponse>("/api/create-payment", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Consulta o status de um pagamento
   */
  async getPaymentStatus(
    paymentId?: string,
    externalReference?: string,
    abacatePayId?: string
  ): Promise<PaymentStatus> {
    const params = new URLSearchParams();

    if (paymentId) params.set("paymentId", paymentId);
    if (externalReference) params.set("externalReference", externalReference);
    if (abacatePayId) params.set("abacatePayId", abacatePayId);
    
    // Adicionar timestamp para evitar cache do navegador
    params.set("_t", Date.now().toString());

    return this.makeRequest<PaymentStatus>(
      `/api/payment-status?${params.toString()}`
    );
  }

  /**
   * Valida token de download e retorna URL da imagem
   */
  async validateDownload(
    request: ValidateDownloadRequest
  ): Promise<ValidateDownloadResponse> {
    return this.makeRequest<ValidateDownloadResponse>(
      "/api/validate-download",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  /**
   * Baixa a imagem usando o token
   */
  async downloadImage(token: string, imageId: string): Promise<string> {
    const validation = await this.validateDownload({ token, imageId });

    if (!validation.valid || !validation.imageUrl) {
      throw new Error(validation.error || "Token de download inválido");
    }

    return validation.imageUrl;
  }

  /**
   * Polling do status do pagamento até aprovado ou rejeitado
   */
  async pollPaymentStatus(
    paymentId: string,
    maxAttempts: number = 60, // 5 minutos com 5 segundos de intervalo
    intervalMs: number = 5000
  ): Promise<PaymentStatus> {
    let attempts = 0;

    const poll = async (): Promise<PaymentStatus> => {
      const status = await this.getPaymentStatus(paymentId);

      // Se pagamento finalizado (aprovado, rejeitado, expirado, cancelado)
      if (
        status.status === "approved" ||
        status.status === "rejected" ||
        status.status === "cancelled" ||
        status.status === "expired"
      ) {
        return status;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error("Timeout ao aguardar confirmação do pagamento");
      }

      // Aguardar e tentar novamente
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      return poll();
    };

    return poll();
  }

  /**
   * Formata valor em centavos para reais
   */
  formatCurrency(amountInCents: number, currency: string = "BRL"): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(amountInCents / 100);
  }

  /**
   * Retorna o nome do método de pagamento
   */
  getPaymentMethodDisplayName(paymentMethodId: string): string {
    const methods: Record<string, string> = {
      pix: "PIX",
    };

    return methods[paymentMethodId] || paymentMethodId.toUpperCase();
  }

  /**
   * Retorna texto amigável para o status
   */
  getStatusDisplayText(status: string): string {
    const statusTexts: Record<string, string> = {
      pending: "Aguardando pagamento PIX",
      approved: "Pagamento aprovado",
      rejected: "Pagamento rejeitado",
      cancelled: "Pagamento cancelado",
      expired: "Pagamento expirado",
      refunded: "Pagamento reembolsado",
    };

    return statusTexts[status] || status;
  }

  /**
   * Verifica se o status é final (não vai mudar mais)
   */
  isFinalStatus(status: string): boolean {
    return [
      "approved",
      "rejected",
      "cancelled",
      "expired",
      "refunded",
    ].includes(status);
  }

  /**
   * Verifica se pode fazer download
   */
  canDownload(status: PaymentStatus): boolean {
    return status.can_download && !!status.download_token;
  }

  /**
   * Obtém URL assinada da imagem para preview (sem marcar token como usado)
   */
  async getImagePreview(
    paymentId: string,
    imageId: string
  ): Promise<string> {
    const response = await this.makeRequest<{ imageUrl: string }>(
      "/api/image-preview",
      {
        method: "POST",
        body: JSON.stringify({ paymentId, imageId }),
      }
    );

    if (!response.imageUrl) {
      throw new Error("Falha ao obter preview da imagem");
    }

    return response.imageUrl;
  }
}

export const paymentService = new PaymentService();
