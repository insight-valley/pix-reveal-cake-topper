import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAbacatePayClient } from "../../../lib/abacatepay";
import { IMAGE_PRICE_IN_CENTS } from "./constants";

interface PaymentRequest {
  imageId: string;
  description: string;
  customer?: {
    name?: string;
    email?: string;
    taxId?: string;
    cellphone?: string;
  };
}

export async function POST(req: NextRequest) {
  const requestId = `pay_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  console.log(`[${requestId}] Payment creation request started`);

  try {
    const requestBody = await req.json();
    const { imageId, description, customer }: PaymentRequest = requestBody;

    // Usar valor fixo do backend (NUNCA confiar no frontend)
    const amount = IMAGE_PRICE_IN_CENTS;

    console.log(`[${requestId}] Payment request payload:`, {
      imageId,
      amount,
      description: description?.substring(0, 50) + "...",
      hasCustomer: !!customer,
    });

    // Validação básica
    if (!imageId || !description) {
      console.log(`[${requestId}] Missing required fields`);
      return NextResponse.json(
        { error: "Campos obrigatórios: imageId, description" },
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

    console.log(`[${requestId}] Initializing AbacatePay client...`);
    const abacatePay = getAbacatePayClient();
    const supabase = createClient(supabaseUrl, serviceKey);

    const externalReference = `cake_topper_${imageId}_${Date.now()}`;

    console.log(`[${requestId}] Creating PIX payment with AbacatePay SDK...`);
    const paymentStartTime = Date.now();

    // Criar pagamento usando SDK
    const paymentResponse = await abacatePay.createPixPayment({
      imageId,
      amount,
      description,
      customer,
    });

    const paymentDuration = Date.now() - paymentStartTime;

    console.log(`[${requestId}] PIX payment created:`, {
      billingId: paymentResponse.id,
      status: paymentResponse.status,
      duration: `${paymentDuration}ms`,
      hasQrCode: !!paymentResponse.qrCode,
    });

    // Salvar no banco de dados
    console.log(`[${requestId}] Saving payment to database...`);
    const dbStartTime = Date.now();

    const { data: inserted, error: dbError } = await supabase
      .from("payments")
      .insert({
        image_id: imageId,
        external_reference: externalReference,
        amount: amount / 100, // Converter para decimal (reais)
        status: "pending",
        payment_method_id: "pix",
        payment_type_id: "pix",
        payer_email: customer?.email,
        payer_name: customer?.name,
        payer_document_number: customer?.taxId,
        description,
        abacate_pay_id: paymentResponse.id,
        abacate_pay_url: paymentResponse.url,
        qr_code: paymentResponse.qrCode,
        qr_code_base64: paymentResponse.qrCodeBase64,
      })
      .select()
      .single();

    const dbDuration = Date.now() - dbStartTime;

    if (dbError || !inserted) {
      console.log(`[${requestId}] Database save failed:`, {
        error: dbError,
        duration: `${dbDuration}ms`,
      });
      return NextResponse.json(
        { error: "Failed to save payment", details: dbError },
        { status: 500 }
      );
    }

    console.log(`[${requestId}] Payment saved:`, {
      paymentDbId: inserted.id,
      duration: `${dbDuration}ms`,
    });

    // Log de auditoria
    await supabase.from("payment_logs").insert({
      payment_id: inserted.id,
      event_type: "created",
      event_data: {
        abacate_pay_id: paymentResponse.id,
        abacate_pay_url: paymentResponse.url,
        status: paymentResponse.status,
      },
    });

    const response = {
      payment_id: inserted.id,
      external_reference: externalReference,
      abacate_pay_id: paymentResponse.id,
      abacate_pay_url: paymentResponse.url,
      status: paymentResponse.status,
      qr_code: paymentResponse.qrCode,
      qr_code_base64: paymentResponse.qrCodeBase64,
      amount,
      description,
    };

    console.log(`[${requestId}] Payment creation completed successfully`);

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[${requestId}] Payment creation failed:`, {
      message,
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
    });

    // Mensagem amigável para erros comuns
    let userMessage = "Erro ao processar pagamento. Tente novamente.";
    if (
      message.includes("taxId") ||
      message.includes("CPF") ||
      message.includes("CNPJ")
    ) {
      userMessage = "CPF/CNPJ inválido. Verifique o documento informado.";
    } else if (message.includes("email")) {
      userMessage = "Email inválido. Verifique o email informado.";
    } else if (message.includes("amount")) {
      userMessage = "Valor do pagamento inválido.";
    } else if (message.includes("ABACATE")) {
      userMessage = "Erro na integração de pagamento. Contate o suporte.";
    }

    return NextResponse.json(
      { error: userMessage, details: message },
      { status: 500 }
    );
  }
}
