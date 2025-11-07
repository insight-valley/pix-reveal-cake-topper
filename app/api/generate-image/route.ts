import { NextRequest, NextResponse } from "next/server";
import { Langfuse } from "langfuse";

// Inicializar Langfuse Client (apenas se credenciais estiverem configuradas)
let langfuse: Langfuse | null = null;
if (process.env.LANGFUSE_PUBLIC_KEY && process.env.LANGFUSE_SECRET_KEY) {
  langfuse = new Langfuse({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    baseUrl: process.env.LANGFUSE_HOST || "https://cloud.langfuse.com",
  });
  console.log("[Langfuse] Instrumentação ativada");
} else {
  console.warn(
    "[Langfuse] Credenciais não configuradas - monitoramento desativado"
  );
}

export async function POST(req: NextRequest) {
  const requestId = `img_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;
  console.log(`[${requestId}] Image generation request started`);

  // Criar trace no Langfuse
  const trace = langfuse?.trace({
    name: "cake-topper-image-generation",
    id: requestId,
    metadata: {
      source: "next-api-route",
      timestamp: new Date().toISOString(),
    },
  });

  if (req.method !== "POST") {
    console.log(`[${requestId}] Method not allowed: ${req.method}`);
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { prompt, imageUrl } = (await req.json()) as {
      prompt: string;
      imageUrl: string;
    };

    console.log(`[${requestId}] Request payload:`, {
      prompt: prompt?.substring(0, 100) + (prompt?.length > 100 ? "..." : ""),
      imageUrl: imageUrl?.substring(0, 50) + "...",
      promptLength: prompt?.length,
    });

    // Adicionar input ao trace
    trace?.update({
      input: {
        originalPrompt: prompt,
        imageUrl: imageUrl?.substring(0, 100),
      },
    });

    if (!prompt || !imageUrl) {
      console.log(`[${requestId}] Missing required fields:`, {
        prompt: !!prompt,
        imageUrl: !!imageUrl,
      });

      trace?.update({
        output: { error: "Missing required fields" },
      });

      await langfuse?.flushAsync();

      return NextResponse.json(
        { error: "Prompt e imageUrl são obrigatórios" },
        { status: 400 }
      );
    }

    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      console.log(`[${requestId}] OpenAI API key not configured`);

      trace?.update({
        output: { error: "OpenAI API key not configured" },
      });

      await langfuse?.flushAsync();

      return NextResponse.json(
        { error: "Chave da API OpenAI não configurada" },
        { status: 500 }
      );
    }

    const enhancedPrompt = `Create a beautiful cake topper design with the text "${prompt}". The design should be elegant, festive, and suitable for a celebration cake. The background should be transparent or white.`;

    console.log(`[${requestId}] Enhanced prompt created:`, {
      originalLength: prompt.length,
      enhancedLength: enhancedPrompt.length,
    });

    // Criar generation no Langfuse para rastrear a chamada OpenAI
    const generation = trace?.generation({
      name: "openai-image-generation",
      model: "dall-e-3",
      input: enhancedPrompt,
      metadata: {
        requestId,
        originalPrompt: prompt,
        size: "1024x1024",
        quality: "standard",
      },
    });

    console.log(`[${requestId}] Calling OpenAI API...`);
    const startTime = Date.now();

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: enhancedPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        }),
      }
    );

    const apiCallDuration = Date.now() - startTime;
    console.log(`[${requestId}] OpenAI API call completed:`, {
      status: response.status,
      statusText: response.statusText,
      duration: `${apiCallDuration}ms`,
    });

    if (!response.ok) {
      console.log(`[${requestId}] OpenAI API error:`, {
        status: response.status,
        statusText: response.statusText,
      });

      const errorData = await response.json().catch((e) => {
        console.log(
          `[${requestId}] Failed to parse error response:`,
          e.message
        );
        return { error: "Failed to parse error response" };
      });

      console.log(`[${requestId}] OpenAI error details:`, errorData);

      // Registrar erro no Langfuse
      generation?.update({
        output: { error: errorData },
        statusMessage: `HTTP ${response.status}: ${response.statusText}`,
      });

      trace?.update({
        output: { error: "OpenAI API error", details: errorData },
      });

      await langfuse?.flushAsync();

      return NextResponse.json(
        { error: "Erro na API da OpenAI", details: errorData },
        { status: response.status }
      );
    }

    console.log(`[${requestId}] Parsing OpenAI response...`);
    const data = await response.json();
    console.log(`[${requestId}] OpenAI response:`, data);
    const imageData = data?.data?.[0]?.url || data?.data?.[0]?.b64_json;
    const generationUsage = data?.usage;

    console.log(`[${requestId}] Generation usage:`, generationUsage);

    console.log(`[${requestId}] OpenAI response structure:`, {
      hasData: !!data?.data,
      dataLength: data?.data?.length || 0,
      hasImageData: !!imageData,
      imageDataLength: imageData?.length || 0,
    });

    if (!imageData) {
      console.log(
        `[${requestId}] Invalid OpenAI response - no image data found`
      );

      generation?.update({
        output: { error: "No image data in response" },
      });

      trace?.update({
        output: { error: "Invalid OpenAI response" },
      });

      await langfuse?.flushAsync();

      return NextResponse.json(
        { error: "Resposta inválida da OpenAI" },
        { status: 500 }
      );
    }

    // Se retornou URL, converter para base64
    let imageUrlGenerated: string;
    if (data?.data?.[0]?.url) {
      imageUrlGenerated = data.data[0].url;
    } else {
      imageUrlGenerated = `${imageData}`;
    }

    const totalDuration = Date.now() - startTime;

    const metadata = {
      usage: generationUsage,
      processingTime: totalDuration,
      model: "dall-e-3",
    };

    console.log(`[${requestId}] Image generation successful:`, {
      totalDuration: `${totalDuration}ms`,
      imageSize: imageData.length
        ? `${Math.round(imageData.length / 1024)}KB`
        : "URL",
      model: "dall-e-3",
    });

    // Registrar sucesso no Langfuse
    generation?.update({
      output: {
        imageGenerated: true,
        imageSizeKB: imageData.length
          ? Math.round(imageData.length / 1024)
          : null,
        url: data?.data?.[0]?.url ? true : false,
      },
      usage: generationUsage,
      metadata: {
        latencyMs: totalDuration,
      },
    });

    trace?.update({
      output: {
        success: true,
        imageUrl: imageUrlGenerated.substring(0, 100) + "...",
        metadata,
      },
      metadata: {
        latencyMs: totalDuration,
      },
    });

    // Flush para garantir que os dados sejam enviados ao Langfuse
    await langfuse?.flushAsync();

    return NextResponse.json({ imageUrl: imageUrlGenerated, metadata });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log(`[${requestId}] Unexpected error:`, {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Registrar erro no Langfuse
    trace?.update({
      output: { error: message },
    });

    await langfuse?.flushAsync();

    return NextResponse.json(
      { error: "Erro interno do servidor", details: message },
      { status: 500 }
    );
  }
}
