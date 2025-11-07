import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAbacatePayClient } from "../../../lib/abacatepay";

/**
 * Valida um token de download e autoriza o download da imagem
 *
 * Este endpoint faz validação REAL com a API do AbacatePay antes de permitir o download,
 * garantindo que o pagamento está realmente aprovado.
 */
export async function POST(req: NextRequest) {
  const validateId = `validate_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  console.log(`[${validateId}] Download validation started`);

  try {
    const { token, imageId } = (await req.json()) as {
      token: string;
      imageId: string;
    };

    console.log(`[${validateId}] Request params:`, {
      tokenLength: token?.length,
      imageId,
    });

    if (!token || !imageId) {
      console.log(`[${validateId}] Missing required parameters`);
      return NextResponse.json(
        { valid: false, error: "Missing token or imageId" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const supabase = createClient(supabaseUrl, serviceKey);

    // 1. Buscar download token com pagamento associado
    const { data: downloadToken, error: tokenError } = await supabase
      .from("download_tokens")
      .select(
        `
        *,
        payments!inner(
          id,
          image_id,
          status,
          abacate_pay_id,
          amount,
          created_at
        )
      `
      )
      .eq("token", token)
      .eq("image_id", imageId)
      .single();

    if (tokenError || !downloadToken) {
      console.log(`[${validateId}] Token not found:`, tokenError);
      return NextResponse.json(
        { valid: false, error: "Token inválido ou não encontrado" },
        { status: 401 }
      );
    }

    console.log(`[${validateId}] Token found:`, {
      tokenId: downloadToken.id,
      paymentId: downloadToken.payments.id,
      paymentStatus: downloadToken.payments.status,
      abacatePayId: downloadToken.payments.abacate_pay_id,
    });

    // 2. Validar expiração do token
    const now = new Date();
    const expiresAt = new Date(downloadToken.expires_at);
    if (now > expiresAt) {
      console.log(`[${validateId}] Token expired:`, {
        now: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      });
      return NextResponse.json(
        { valid: false, error: "Token expirado" },
        { status: 401 }
      );
    }

    // 3. Verificar se token já foi usado
    if (downloadToken.used_at) {
      console.log(
        `[${validateId}] Token already used at:`,
        downloadToken.used_at
      );
      return NextResponse.json(
        { valid: false, error: "Token já foi utilizado" },
        { status: 401 }
      );
    }

    const payment = downloadToken.payments;

    // 4. VALIDAÇÃO REAL: Consultar API do AbacatePay
    if (!payment.abacate_pay_id) {
      console.log(`[${validateId}] Payment without abacate_pay_id`);
      return NextResponse.json(
        { valid: false, error: "Pagamento não possui ID do AbacatePay" },
        { status: 400 }
      );
    }

    console.log(`[${validateId}] Validating payment with AbacatePay API...`);
    let isPaymentValid = false;
    let realStatus = payment.status;

    try {
      const abacatePay = getAbacatePayClient();
      const statusCheck = await abacatePay.getPaymentStatus(
        payment.abacate_pay_id
      );

      console.log(`[${validateId}] AbacatePay status check:`, {
        abacateStatus: statusCheck.status,
        paidAt: statusCheck.paidAt,
        amount: statusCheck.amount,
      });

      // Status PAID na API do AbacatePay é a fonte da verdade
      isPaymentValid = statusCheck.status === "PAID";
      realStatus = statusCheck.status;

      // Atualizar status no banco se mudou
      if (statusCheck.status === "PAID" && payment.status !== "approved") {
        console.log(`[${validateId}] Payment approved, updating database`);
        await supabase
          .from("payments")
          .update({
            status: "approved",
            updated_at: new Date().toISOString(),
          })
          .eq("id", payment.id);

        // Log de auditoria
        await supabase.from("payment_logs").insert({
          payment_id: payment.id,
          event_type: "validation_update",
          event_data: {
            old_status: payment.status,
            new_status: "approved",
            source: "download_validation",
            abacate_status: statusCheck.status,
          },
        });
      }
    } catch (error) {
      console.error(
        `[${validateId}] CRITICAL: Failed to validate with AbacatePay:`,
        error
      );
      // Se falhar a validação com AbacatePay, NEGAR o download por segurança
      return NextResponse.json(
        {
          valid: false,
          error: "Falha ao validar pagamento. Tente novamente.",
        },
        { status: 503 }
      );
    }

    // 5. Verificar se pagamento está aprovado
    if (!isPaymentValid) {
      console.log(`[${validateId}] Payment not approved:`, {
        realStatus,
        dbStatus: payment.status,
      });
      return NextResponse.json(
        {
          valid: false,
          error: "Pagamento não aprovado",
          status: realStatus,
        },
        { status: 402 }
      );
    }

    console.log(`[${validateId}] Payment validated! Marking token as used...`);

    // 6. Marcar token como usado
    await supabase
      .from("download_tokens")
      .update({ used_at: now.toISOString() })
      .eq("id", downloadToken.id);

    // 7. Gerar URL assinada para download
    console.log(`[${validateId}] Generating signed URL for image...`);
    const storagePath = `${imageId}.png`;
    console.log(`[${validateId}] Storage path:`, storagePath);
    
    const { data: signedUrl, error: storageError } = await supabase.storage
      .from("generated-images")
      .createSignedUrl(storagePath, 3600); // 1 hora

    if (storageError || !signedUrl) {
      console.error(
        `[${validateId}] Failed to generate signed URL:`,
        storageError
      );
      console.log(`[${validateId}] Attempted path:`, storagePath);
      return NextResponse.json(
        { valid: false, error: "Falha ao gerar URL de download" },
        { status: 500 }
      );
    }

    console.log(`[${validateId}] Download authorized successfully:`, {
      imageId,
      expiresIn: "1 hour",
    });

    // Log de download autorizado
    await supabase.from("payment_logs").insert({
      payment_id: payment.id,
      event_type: "download_authorized",
      event_data: {
        token: token.substring(0, 10) + "...",
        image_id: imageId,
        validated_at: now.toISOString(),
      },
    });

    return NextResponse.json({
      valid: true,
      imageUrl: signedUrl.signedUrl,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[${validateId}] Validation failed:`, {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { valid: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
