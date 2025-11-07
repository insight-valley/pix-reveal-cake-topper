import { NextRequest, NextResponse } from "next/server";
import { getAbacatePayClient } from "../../../lib/abacatepay";

/**
 * Endpoint de teste que usa o MCP/API do AbacatePay para simular pagamentos
 * 
 * Este endpoint é usado apenas em testes para simular pagamentos reais
 * usando a API do AbacatePay, permitindo validar o fluxo completo.
 * 
 * ⚠️ APENAS PARA TESTES - Não usar em produção
 */
export async function POST(req: NextRequest) {
  const requestId = `test_sim_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  console.log(`[${requestId}] Test simulate payment via AbacatePay API`);

  try {
    const body = await req.json();
    const { pixQrCodeId } = body;

    if (!pixQrCodeId) {
      return NextResponse.json(
        { error: "pixQrCodeId é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se estamos em ambiente de desenvolvimento/teste
    const isDev = process.env.NODE_ENV !== "production";
    if (!isDev) {
      return NextResponse.json(
        { error: "Este endpoint só está disponível em desenvolvimento" },
        { status: 403 }
      );
    }

    const abacatePay = getAbacatePayClient();

    // Tentar simular pagamento usando o método do cliente
    // Se o endpoint não existir, vamos usar uma abordagem alternativa
    try {
      const statusResponse = await abacatePay.simulatePixPayment(pixQrCodeId);
      
      return NextResponse.json({
        ok: true,
        message: "Pagamento simulado com sucesso via AbacatePay",
        status: statusResponse.status,
        amount: statusResponse.amount,
        paidAt: statusResponse.paidAt,
      });
    } catch (simulateError) {
      // Se a simulação falhar (endpoint não existe), vamos apenas verificar o status
      // e retornar sucesso se já estiver pago (para testes que já foram pagos)
      console.log(`[${requestId}] Simulate failed, checking status instead:`, simulateError);
      
      const statusCheck = await abacatePay.getPaymentStatus(pixQrCodeId);
      
      if (statusCheck.status === "PAID") {
        return NextResponse.json({
          ok: true,
          message: "Pagamento já está pago",
          status: statusCheck.status,
          amount: statusCheck.amount,
          paidAt: statusCheck.paidAt,
        });
      }

      // Se não está pago e não conseguimos simular, retornar erro
      return NextResponse.json(
        {
          ok: false,
          error: "Não foi possível simular pagamento. O endpoint de simulação pode não estar disponível.",
          currentStatus: statusCheck.status,
          details: simulateError instanceof Error ? simulateError.message : String(simulateError),
        },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[${requestId}] Test simulate failed:`, {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { ok: false, error: "Erro ao simular pagamento", details: message },
      { status: 500 }
    );
  }
}

// GET endpoint para verificação
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "test-simulate-payment",
    description: "Endpoint de teste para simular pagamentos via AbacatePay API",
    available: process.env.NODE_ENV !== "production",
    timestamp: new Date().toISOString(),
  });
}
