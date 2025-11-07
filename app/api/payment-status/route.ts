import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAbacatePayClient } from "../../../lib/abacatepay";

// Desabilitar cache do Next.js para esta rota
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Consulta o status de um pagamento no banco de dados
 *
 * O status no banco é atualizado de forma assíncrona pelo webhook do AbacatePay.
 * Para validação real no momento do download, use /api/validate-download
 */
export async function GET(req: NextRequest) {
  const requestId = `status_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  console.log(`[${requestId}] Payment status check started`);

  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("paymentId");
    const externalReference = searchParams.get("externalReference");
    const abacatePayId = searchParams.get("abacatePayId");

    console.log(`[${requestId}] Query params:`, {
      paymentId,
      externalReference,
      abacatePayId,
    });

    if (!paymentId && !externalReference && !abacatePayId) {
      return NextResponse.json(
        { error: "Informe paymentId, externalReference ou abacatePayId" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // Buscar pagamento no banco com token de download
    let query = supabase.from("payments").select(
      `
        *,
        download_tokens (
          token,
          expires_at,
          used_at
        )
      `
    );

    if (paymentId) {
      query = query.eq("id", paymentId);
    } else if (externalReference) {
      query = query.eq("external_reference", externalReference);
    } else if (abacatePayId) {
      query = query.eq("abacate_pay_id", abacatePayId);
    }

    const { data: payment, error: fetchError } = await query.single();

    if (fetchError || !payment) {
      console.log(`[${requestId}] Payment not found:`, fetchError);
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      );
    }

    console.log(`[${requestId}] Payment found:`, {
      paymentId: payment.id,
      status: payment.status,
      abacatePayId: payment.abacate_pay_id,
    });

    const finalStatuses = [
      "approved",
      "rejected",
      "cancelled",
      "expired",
      "refunded",
    ];

    const statusMap: Record<string, string> = {
      PENDING: "pending",
      ACTIVE: "pending",
      PAID: "approved",
      EXPIRED: "expired",
      CANCELLED: "cancelled",
      REFUNDED: "refunded",
      REJECTED: "rejected",
    };

    let shouldReloadPayment = false;
    let currentPayment = payment;

    const isFinalStatus = finalStatuses.includes(payment.status);
    const canQueryGateway =
      !!payment.abacate_pay_id && !!payment.abacate_pay_id?.trim?.();

    if (!isFinalStatus && canQueryGateway) {
      try {
        const abacatePay = getAbacatePayClient();
        const gatewayStatus = await abacatePay.getPaymentStatus(
          payment.abacate_pay_id
        );

        const normalizedStatus = String(gatewayStatus.status || "")
          .trim()
          .toUpperCase();

        const mappedStatus = statusMap[normalizedStatus] || "pending";

        console.log(`[${requestId}] Gateway status fetched:`, {
          gatewayId: gatewayStatus.id,
          normalizedStatus,
          mappedStatus,
        });

        if (mappedStatus !== payment.status) {
          console.log(
            `[${requestId}] Updating payment status via gateway check`,
            {
              paymentId: payment.id,
              oldStatus: payment.status,
              newStatus: mappedStatus,
            }
          );

          const { error: updateError } = await supabase
            .from("payments")
            .update({
              status: mappedStatus,
              updated_at: new Date().toISOString(),
            })
            .eq("id", payment.id);

          if (updateError) {
            console.log(`[${requestId}] Failed to update payment status`, {
              paymentId: payment.id,
              updateError,
            });
          } else {
            shouldReloadPayment = true;
            // Se aprovado, garantir token de download
            if (mappedStatus === "approved") {
              const hasValidToken = Array.isArray(payment.download_tokens)
                ? payment.download_tokens.some(
                    (token: { expires_at: string; used_at: string | null }) => {
                      return (
                        !token.used_at &&
                        new Date(token.expires_at) > new Date()
                      );
                    }
                  )
                : false;

              if (!hasValidToken) {
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
                    `[${requestId}] Failed to create download token after gateway approval`,
                    tokenError
                  );
                } else {
                  console.log(
                    `[${requestId}] Download token generated via gateway check`,
                    {
                      paymentId: payment.id,
                      token: downloadToken,
                      expiresAt: expiresAt.toISOString(),
                    }
                  );
                  shouldReloadPayment = true;
                }
              }
            }
          }
        }
      } catch (error) {
        console.log(`[${requestId}] Failed to fetch gateway status`, error);
      }
    }

    if (shouldReloadPayment) {
      const { data: refreshedPayment, error: refreshError } = await supabase
        .from("payments")
        .select(
          `
          *,
          download_tokens (
            token,
            expires_at,
            used_at
          )
        `
        )
        .eq("id", payment.id)
        .single();

      if (!refreshError && refreshedPayment) {
        currentPayment = refreshedPayment;
      }
    }

    // Verificar se tem token de download disponível (baseado no status atualizado)
    const downloadToken = currentPayment.download_tokens?.[0];
    const canDownload =
      currentPayment.status === "approved" &&
      downloadToken &&
      !downloadToken.used_at &&
      new Date(downloadToken.expires_at) > new Date();

    const response = {
      payment_id: currentPayment.id,
      image_id: currentPayment.image_id,
      status: currentPayment.status, // Status do banco ou atualizado via API
      abacate_pay_id: currentPayment.abacate_pay_id,
      amount: currentPayment.amount,
      description: currentPayment.description,
      created_at: currentPayment.created_at,
      updated_at: currentPayment.updated_at,
      expires_at: currentPayment.expires_at,
      can_download: canDownload,
      ...(canDownload && {
        download_token: downloadToken.token,
        download_expires_at: downloadToken.expires_at,
      }),
    };

    console.log(`[${requestId}] Status check completed:`, {
      paymentId: currentPayment.id,
      status: currentPayment.status,
      canDownload,
    });

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log(`[${requestId}] Status check failed:`, {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: "Internal server error", message },
      { status: 500 }
    );
  }
}
