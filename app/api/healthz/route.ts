import { NextRequest, NextResponse } from "next/server";

// Simple health check endpoint (lightweight)
export async function GET(request: NextRequest) {
  const requestId = `healthz_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;

  console.log(`[${requestId}] Simple health check request`);

  try {
    const response = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "unknown",
    };

    console.log(`[${requestId}] Simple health check successful`);

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[${requestId}] Simple health check failed:`, error);

    return NextResponse.json(
      { status: "error", timestamp: new Date().toISOString(), error: message },
      { status: 503 }
    );
  }
}
