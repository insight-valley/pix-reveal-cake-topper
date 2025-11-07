import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAbacatePayClient } from "../../../lib/abacatepay";

/**
 * Endpoint para simular confirmação de pagamento PIX no modo de desenvolvimento
 *
 * ⚠️ APENAS FUNCIONA EM MODO DE DESENVOLVIMENTO
 *
 * Este endpoint permite confirmar manualmente pagamentos PIX para testes.
 * Em produção, pagamentos são confirmados automaticamente via webhook do AbacatePay.
 *
 * Uso:
 * POST /api/simulate-payment
 * Body: { "paymentId": "uuid" } ou { "abacatePayId": "pix_char_xxx" }
 */
export async function POST(req: NextRequest) {
  const requestId = `sim_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  console.log(`[${requestId}] Simulate payment request started`);

  try {
    const body = await req.json();
    const { paymentId, abacatePayId } = body;

    if (!paymentId && !abacatePayId) {
      return NextResponse.json(
        { error: "Informe paymentId ou abacatePayId" },
        { status: 400 }
      );
    }

    // Validar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

    if (!supabaseUrl || !serviceKey) {
      console.log(`[${requestId}] Supabase env not configured`);
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const abacatePay = getAbacatePayClient();

    // Buscar pagamento no banco
    let payment;
    if (paymentId) {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "Pagamento não encontrado" },
          { status: 404 }
        );
      }
      payment = data;
    } else if (abacatePayId) {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("abacate_pay_id", abacatePayId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: "Pagamento não encontrado" },
          { status: 404 }
        );
      }
      payment = data;
    }

    if (!payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      );
    }

    if (!payment.abacate_pay_id) {
      return NextResponse.json(
        { error: "Pagamento não possui abacate_pay_id" },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] Found payment:`, {
      paymentId: payment.id,
      abacatePayId: payment.abacate_pay_id,
      currentStatus: payment.status,
    });

    // Simular pagamento via AbacatePay
    console.log(`[${requestId}] Simulating payment via AbacatePay...`);
    const statusResponse = await abacatePay.simulatePixPayment(
      payment.abacate_pay_id
    );

    console.log(`[${requestId}] Payment simulated:`, {
      status: statusResponse.status,
      amount: statusResponse.amount,
    });

    // Atualizar status no banco
    const statusMap: Record<string, string> = {
      PENDING: "pending",
      PAID: "approved",
      EXPIRED: "expired",
      CANCELLED: "cancelled",
      REFUNDED: "refunded",
    };

    const mappedStatus =
      statusMap[statusResponse.status.toUpperCase()] || "pending";

    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: mappedStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updateError) {
      console.log(`[${requestId}] Failed to update payment:`, updateError);
      return NextResponse.json(
        { error: "Failed to update payment status" },
        { status: 500 }
      );
    }

    console.log(`[${requestId}] Payment updated:`, {
      paymentId: payment.id,
      oldStatus: payment.status,
      newStatus: mappedStatus,
    });

    // Se pagamento foi aprovado, gerar token de download
    if (mappedStatus === "approved" && payment.status !== "approved") {
      console.log(
        `[${requestId}] Payment approved! Generating download token...`
      );

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
          `[${requestId}] Failed to create download token:`,
          tokenError
        );
      } else {
        console.log(`[${requestId}] Download token created:`, {
          token: downloadToken,
          expiresAt: expiresAt.toISOString(),
        });

        // Log de auditoria
        await supabase.from("payment_logs").insert({
          payment_id: payment.id,
          event_type: "simulated_payment",
          event_data: {
            abacate_pay_id: payment.abacate_pay_id,
            old_status: payment.status,
            new_status: mappedStatus,
            simulated_at: new Date().toISOString(),
          },
        });
      }
    }

    // Log de auditoria
    await supabase.from("payment_logs").insert({
      payment_id: payment.id,
      event_type: "simulation_requested",
      event_data: {
        abacate_pay_id: payment.abacate_pay_id,
        old_status: payment.status,
        new_status: mappedStatus,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Payment simulated successfully",
      payment_id: payment.id,
      abacate_pay_id: payment.abacate_pay_id,
      old_status: payment.status,
      new_status: mappedStatus,
      status: statusResponse.status,
      amount: statusResponse.amount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[${requestId}] Simulate payment failed:`, {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: "Failed to simulate payment", details: message },
      { status: 500 }
    );
  }
}

// GET endpoint para verificação de saúde
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "simulate-payment",
    description:
      "Endpoint para simular pagamentos PIX no modo de desenvolvimento",
    timestamp: new Date().toISOString(),
  });
}
