import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAbacatePayClient } from "../../../lib/abacatepay";

/**
 * Webhook do AbacatePay
 * Documentação: https://docs.abacatepay.com/pages/webhooks
 *
 * O AbacatePay envia notificações quando o status de uma cobrança muda:
 * - PENDING -> PAID
 * - PENDING -> EXPIRED
 * - PAID -> REFUNDED
 */
interface WebhookPayload {
  event: string;
  data: {
    id: string;
    status: string;
    [key: string]: unknown;
  };
}

export async function POST(req: NextRequest) {
  const webhookId = `webhook_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  console.log(`[${webhookId}] AbacatePay webhook received`);

  try {
    const payload: WebhookPayload = await req.json();

    console.log(`[${webhookId}] Webhook payload:`, {
      event: payload.event,
      billingId: payload.data?.id,
      status: payload.data?.status,
    });

    // Validar estrutura do payload
    if (!payload.event || !payload.data) {
      console.log(`[${webhookId}] Invalid webhook payload structure`);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Inicializar clientes
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const abacatePay = getAbacatePayClient();
    const billingId = payload.data.id;
    const incomingStatus = String(payload.data.status || "")
      .trim()
      .toUpperCase();

    console.log(`[${webhookId}] Processing webhook for billing ${billingId}`);

    // Buscar pagamento no banco pelo abacate_pay_id
    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select("*")
      .eq("abacate_pay_id", billingId)
      .single();

    if (fetchError || !payment) {
      console.log(`[${webhookId}] Payment not found in database:`, fetchError);

      // Log do webhook mesmo sem encontrar pagamento
      await supabase.from("payment_logs").insert({
        payment_id: null,
        event_type: "webhook_orphan",
        event_data: payload,
      });

      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    console.log(`[${webhookId}] Found payment:`, {
      paymentId: payment.id,
      currentStatus: payment.status,
      newStatus: incomingStatus,
    });

    // Verificar status com a API do AbacatePay (validação adicional)
    let verifiedStatus: string | null = null;
    try {
      const statusCheck = await abacatePay.getPaymentStatus(billingId);
      const normalizedStatus = String(statusCheck.status || "")
        .trim()
        .toUpperCase();

      if (normalizedStatus) {
        verifiedStatus = normalizedStatus;
        console.log(
          `[${webhookId}] Verified status from API:`,
          normalizedStatus
        );
      }
    } catch (error) {
      console.log(`[${webhookId}] Failed to verify status:`, error);
      // Continua com o status do webhook se a verificação falhar
    }

    // Atualizar status no banco
    const statusMap: Record<string, string> = {
      PENDING: "pending",
      PAID: "approved",
      EXPIRED: "expired",
      CANCELLED: "cancelled",
      REFUNDED: "refunded",
      ACTIVE: "pending",
    };

    const statusFromVerification = verifiedStatus
      ? statusMap[verifiedStatus]
      : undefined;
    const statusFromWebhook = statusMap[incomingStatus];

    const mappedStatus =
      statusFromVerification && statusFromVerification !== "pending"
        ? statusFromVerification
        : statusFromWebhook || statusFromVerification || "pending";

    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: mappedStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updateError) {
      console.log(`[${webhookId}] Failed to update payment:`, updateError);
      return NextResponse.json(
        { error: "Failed to update payment" },
        { status: 500 }
      );
    }

    console.log(`[${webhookId}] Payment updated successfully:`, {
      paymentId: payment.id,
      oldStatus: payment.status,
      newStatus: mappedStatus,
    });

    // Log de auditoria
    await supabase.from("payment_logs").insert({
      payment_id: payment.id,
      event_type: "webhook_received",
      event_data: {
        event: payload.event,
        billing_id: billingId,
        old_status: payment.status,
        new_status: mappedStatus,
        verified: verifiedStatus === incomingStatus,
      },
    });

    // Se pagamento foi aprovado, gerar token de download
    if (mappedStatus === "approved" && payment.status !== "approved") {
      console.log(
        `[${webhookId}] Payment approved! Generating download token...`
      );

      // Gerar token de download (expira em 24h)
      const downloadToken = `dl_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 16)}`;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: tokenError } = await supabase
        .from("download_tokens")
        .insert({
          payment_id: payment.id,
          image_id: payment.image_id,
          token: downloadToken,
          expires_at: expiresAt.toISOString(),
        });

      if (tokenError) {
        console.log(
          `[${webhookId}] Failed to create download token:`,
          tokenError
        );
      } else {
        console.log(`[${webhookId}] Download token created:`, {
          token: downloadToken,
          expiresAt: expiresAt.toISOString(),
        });

        // Log de download concedido
        await supabase.from("payment_logs").insert({
          payment_id: payment.id,
          event_type: "download_granted",
          event_data: {
            token: downloadToken,
            expires_at: expiresAt.toISOString(),
          },
        });
      }
    }

    console.log(`[${webhookId}] Webhook processed successfully`);

    return NextResponse.json({
      ok: true,
      message: "Webhook processed",
      paymentId: payment.id,
      status: mappedStatus,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log(`[${webhookId}] Webhook processing failed:`, {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// GET endpoint para verificação de saúde do webhook
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "abacate-webhook",
    timestamp: new Date().toISOString(),
  });
}
