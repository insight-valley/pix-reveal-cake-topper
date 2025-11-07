import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAbacatePayClient } from "../../../lib/abacatepay";

/**
 * Retorna URL assinada da imagem para preview (sem marcar token como usado)
 * Requer que o pagamento esteja aprovado
 */
export async function POST(req: NextRequest) {
  const previewId = `preview_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  console.log(`[${previewId}] Image preview request started`);

  try {
    const { paymentId, imageId } = (await req.json()) as {
      paymentId: string;
      imageId: string;
    };

    if (!paymentId || !imageId) {
      return NextResponse.json(
        { error: "Missing paymentId or imageId" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Buscar pagamento
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .eq("image_id", imageId)
      .single();

    if (paymentError || !payment) {
      console.log(`[${previewId}] Payment not found:`, paymentError);
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se pagamento está aprovado
    if (payment.status !== "approved") {
      return NextResponse.json(
        { error: "Pagamento não aprovado" },
        { status: 403 }
      );
    }

    // Verificar status real com AbacatePay
    let isPaymentValid = false;
    if (payment.abacate_pay_id) {
      try {
        const abacatePay = getAbacatePayClient();
        const statusCheck = await abacatePay.getPaymentStatus(
          payment.abacate_pay_id
        );
        isPaymentValid = statusCheck.status === "PAID";
      } catch (error) {
        console.log(`[${previewId}] Failed to verify payment:`, error);
        // Se falhar, usar status do banco
        isPaymentValid = payment.status === "approved";
      }
    } else {
      isPaymentValid = payment.status === "approved";
    }

    if (!isPaymentValid) {
      return NextResponse.json(
        { error: "Pagamento não aprovado" },
        { status: 403 }
      );
    }

    // Gerar URL assinada para preview (não marca token como usado)
    const storagePath = `${imageId}.png`;
    const { data: signedUrl, error: storageError } = await supabase.storage
      .from("generated-images")
      .createSignedUrl(storagePath, 3600); // 1 hora

    if (storageError || !signedUrl) {
      console.error(`[${previewId}] Failed to generate signed URL:`, storageError);
      return NextResponse.json(
        { error: "Falha ao gerar URL de preview" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl: signedUrl.signedUrl,
      expiresIn: 3600,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao obter preview";
    console.error(`[${previewId}] Error:`, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
