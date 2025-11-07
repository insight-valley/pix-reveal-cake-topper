import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const requestId = `health_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  const startTime = Date.now();

  console.log(`[${requestId}] Health check request started`);

  try {
    const checks: {
      api: { status: string; timestamp: string };
      database: { status: string; responseTime: number; error?: string };
      openai: { status: string; apiKey: boolean };
      abacatepay: { status: string; apiKey: boolean };
      environment: { nodeEnv: string; version: string };
    } = {
      api: { status: "ok", timestamp: new Date().toISOString() },
      database: { status: "unknown", responseTime: 0 },
      openai: { status: "unknown", apiKey: false },
      abacatepay: { status: "unknown", apiKey: false },
      environment: {
        nodeEnv: process.env.NODE_ENV || "unknown",
        version: process.env.npm_package_version || "unknown",
      },
    };

    // Check database connection
    console.log(`[${requestId}] Checking database connection`);
    const dbStartTime = Date.now();
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data, error } = await supabase
        .from("payments")
        .select("count")
        .limit(1);

      const dbResponseTime = Date.now() - dbStartTime;

      if (error) {
        console.error(`[${requestId}] Database check failed:`, error);
        checks.database = {
          status: "error",
          responseTime: dbResponseTime,
          error: error.message,
        };
      } else {
        console.log(
          `[${requestId}] Database check successful - Response time: ${dbResponseTime}ms`
        );
        checks.database = { status: "ok", responseTime: dbResponseTime };
      }
    } catch (dbError: unknown) {
      const dbResponseTime = Date.now() - dbStartTime;
      const message =
        dbError instanceof Error ? dbError.message : "Unknown error";
      console.error(`[${requestId}] Database connection error:`, dbError);
      checks.database = {
        status: "error",
        responseTime: dbResponseTime,
        error: message,
      };
    }

    // Check OpenAI API key
    console.log(`[${requestId}] Checking OpenAI configuration`);
    checks.openai = {
      status: process.env.OPENAI_API_KEY ? "configured" : "missing",
      apiKey: !!process.env.OPENAI_API_KEY,
    };

    // Check AbacatePay configuration
    console.log(`[${requestId}] Checking AbacatePay configuration`);
    checks.abacatepay = {
      status: process.env.ABACATE_PAY_API_KEY ? "configured" : "missing",
      apiKey: !!process.env.ABACATE_PAY_API_KEY,
    };

    const totalResponseTime = Date.now() - startTime;
    console.log(
      `[${requestId}] Health check completed - Total response time: ${totalResponseTime}ms`
    );

    // Determine overall status
    const hasErrors = Object.values(checks).some(
      (check) =>
        typeof check === "object" &&
        check !== null &&
        "status" in check &&
        (check.status === "error" || check.status === "missing")
    );

    const overallStatus = hasErrors ? "degraded" : "healthy";
    const statusCode = hasErrors ? 503 : 200;

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: totalResponseTime,
      requestId,
      checks,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: {
        node: process.version,
        platform: process.platform,
      },
    };

    console.log(`[${requestId}] Health check response:`, {
      status: overallStatus,
      responseTime: totalResponseTime,
      dbStatus: checks.database.status,
      dbResponseTime: checks.database.responseTime,
    });

    return NextResponse.json(response, { status: statusCode });
  } catch (error: unknown) {
    const totalResponseTime = Date.now() - startTime;
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[${requestId}] Health check failed:`, error);

    const errorResponse = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      responseTime: totalResponseTime,
      requestId,
      error: message,
      uptime: process.uptime(),
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}
