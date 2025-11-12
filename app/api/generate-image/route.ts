import { NextRequest, NextResponse } from "next/server";
import { Langfuse } from "langfuse";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

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
    const { prompt, imageId } = (await req.json()) as {
      prompt: string;
      imageId: string;
    };

    console.log(`[${requestId}] Request payload:`, {
      prompt: prompt?.substring(0, 100) + (prompt?.length > 100 ? "..." : ""),
      promptLength: prompt?.length,
      imageId,
    });

    // Adicionar input ao trace
    trace?.update({
      input: {
        originalPrompt: prompt,
        imageId,
      },
    });

    if (!prompt || !imageId) {
      console.log(`[${requestId}] Missing required fields:`, {
        prompt: !!prompt,
        imageId: !!imageId,
      });

      trace?.update({
        output: { error: "Missing required fields" },
      });

      await langfuse?.flushAsync();

      return NextResponse.json(
        { error: "Prompt e imageId são obrigatórios" },
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
        {
          error:
            "Ocorreu um erro inesperado ao gerar sua imagem. Por favor, tente novamente. Se o problema persistir, entre em contato conosco para que possamos ajudar.",
          errorType: "server_error",
          retryable: true,
        },
        { status: 500 }
      );
    }

    const enhancedPrompt = `Create a beautiful cake topper design with the text "${prompt}". 

CRITICAL REQUIREMENTS FOR PRINT AND CUT:
- Each design element (text, characters, decorations) MUST have a solid white border of at least 1cm (approximately 10-12% of the image size) around it
- Leave adequate spacing (minimum 1.5cm) between different elements to allow clean cutting
- Use a flat sticker-style design with clear white outlines that separate each element from the background
- The design should look like individual stickers that can be cut out separately with scissors

STYLE: The design should be elegant, festive, and suitable for a celebration cake. Use vibrant colors but ensure contrast with the white borders. The overall style must be clean and printable.`;

    console.log(`[${requestId}] Enhanced prompt created:`, {
      originalLength: prompt.length,
      enhancedLength: enhancedPrompt.length,
    });

    // Criar generation no Langfuse para rastrear a chamada OpenAI
    const generation = trace?.generation({
      name: "openai-image-generation",
      model: "gpt-image-1",
      input: enhancedPrompt,
      metadata: {
        requestId,
        originalPrompt: prompt,
        size: "1024x1024",
        quality: "high",
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
          model: "gpt-image-1",
          prompt: enhancedPrompt,
          n: 1,
          size: "1024x1024",
          quality: "high",
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

      // Determinar mensagem amigável baseada no tipo de erro
      const isServerError = response.status >= 500;
      const errorMessage = isServerError
        ? "Ocorreu um erro inesperado ao gerar sua imagem. Por favor, tente novamente. Se o problema persistir, entre em contato conosco para que possamos ajudar."
        : errorData.error?.message ||
          "Erro ao processar sua solicitação. Tente novamente.";

      return NextResponse.json(
        {
          error: errorMessage,
          errorType: isServerError ? "server_error" : "client_error",
          retryable: isServerError,
        },
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
        {
          error:
            "Ocorreu um erro inesperado ao gerar sua imagem. Por favor, tente novamente. Se o problema persistir, entre em contato conosco para que possamos ajudar.",
          errorType: "server_error",
          retryable: true,
        },
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
      model: "gpt-image-1",
    };

    console.log(`[${requestId}] Image generation successful:`, {
      totalDuration: `${totalDuration}ms`,
      imageSize: imageData.length
        ? `${Math.round(imageData.length / 1024)}KB`
        : "URL",
      model: "gpt-image-1",
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        `[${requestId}] Missing Supabase configuration for image persistence`
      );

      generation?.update({
        output: { error: "Missing Supabase configuration" },
        statusMessage: "supabase-config-missing",
      });

      trace?.update({
        output: { error: "Supabase configuration missing" },
      });

      await langfuse?.flushAsync();

      return NextResponse.json(
        {
          error:
            "Ocorreu um erro inesperado ao gerar sua imagem. Por favor, tente novamente. Se o problema persistir, entre em contato conosco para que possamos ajudar.",
          errorType: "server_error",
          retryable: true,
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const hdStoragePath = `${imageId}.png`;
    const previewStoragePath = `${imageId}.jpeg`;

    let uploadError: Error | null = null;
    let imageBuffer: Buffer | null = null;

    // Obter buffer da imagem
    if (data?.data?.[0]?.b64_json) {
      console.log(`[${requestId}] Processing image from base64`);
      imageBuffer = Buffer.from(data.data[0].b64_json, "base64");
    } else if (data?.data?.[0]?.url) {
      console.log(`[${requestId}] Fetching image from OpenAI URL`);
      try {
        const imageResponse = await fetch(data.data[0].url);
        if (!imageResponse.ok) {
          uploadError = new Error(
            `Failed to fetch image from OpenAI URL: HTTP ${imageResponse.status}`
          );
        } else {
          const imageArrayBuffer = await imageResponse.arrayBuffer();
          imageBuffer = Buffer.from(imageArrayBuffer);
        }
      } catch (error) {
        uploadError = error as Error;
        console.error(`[${requestId}] Unexpected error fetching image:`, error);
      }
    }

    if (!imageBuffer && !uploadError) {
      uploadError = new Error("No image data available");
    }

    if (imageBuffer && !uploadError) {
      try {
        // 1. Salvar imagem HD original
        console.log(`[${requestId}] Uploading HD image to Supabase Storage`);
        const { error: hdError } = await supabase.storage
          .from("generated-images")
          .upload(hdStoragePath, imageBuffer, {
            contentType: "image/png",
            upsert: true,
          });

        if (hdError) {
          uploadError = hdError;
          console.error(`[${requestId}] Failed to upload HD image:`, hdError);
        } else {
          // 2. Criar preview degradado com watermark
          console.log(`[${requestId}] Creating watermarked preview`);

          const sharpImage = sharp(imageBuffer);
          const metadata = await sharpImage.metadata();

          // Redimensionar para 800px de largura mantendo aspect ratio
          const previewWidth = 800;
          const previewHeight = Math.round(
            (metadata.height || 1024) *
              (previewWidth / (metadata.width || 1024))
          );

          // Criar texto do watermark SVG
          const watermarkText = "Cake Maker";
          const fontSize = 60;
          const textWidth = watermarkText.length * fontSize * 0.6; // Aproximação

          // SVG com texto diagonal e semi-transparente
          const watermarkSvg = `
            <svg width="${previewWidth}" height="${previewHeight}">
              <defs>
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&amp;display=swap');
                </style>
              </defs>
              <g transform="translate(${previewWidth / 2}, ${
            previewHeight / 2
          }) rotate(-30)">
                <text
                  x="0"
                  y="0"
                  text-anchor="middle"
                  font-family="Inter, Arial, sans-serif"
                  font-size="${fontSize}"
                  font-weight="700"
                  fill="white"
                  fill-opacity="0.4"
                  stroke="black"
                  stroke-width="2"
                  stroke-opacity="0.3"
                >${watermarkText}</text>
              </g>
            </svg>
          `;

          const previewBuffer = await sharpImage
            .resize(previewWidth, previewHeight, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .composite([
              {
                input: Buffer.from(watermarkSvg),
                top: 0,
                left: 0,
              },
            ])
            .jpeg({ quality: 70 })
            .toBuffer();

          console.log(`[${requestId}] Uploading preview to Supabase Storage`);
          const { error: previewError } = await supabase.storage
            .from("generated-previews")
            .upload(previewStoragePath, previewBuffer, {
              contentType: "image/jpeg",
              upsert: true,
            });

          if (previewError) {
            console.error(
              `[${requestId}] Failed to upload preview:`,
              previewError
            );
            // Não falhar se preview não subir, mas logar
          }
        }
      } catch (error) {
        uploadError = error as Error;
        console.error(
          `[${requestId}] Unexpected error processing images:`,
          error
        );
      }
    }

    if (uploadError) {
      generation?.update({
        output: { error: uploadError.message },
        statusMessage: "storage-upload-failed",
      });

      trace?.update({
        output: { error: uploadError.message },
      });

      await langfuse?.flushAsync();

      return NextResponse.json(
        {
          error:
            "Ocorreu um erro inesperado ao salvar sua imagem. Por favor, tente novamente. Se o problema persistir, entre em contato conosco para que possamos ajudar.",
          errorType: "server_error",
          retryable: true,
        },
        { status: 500 }
      );
    }

    // Gerar URL assinada apenas para o PREVIEW (não para HD)
    const previewSignedUrlResult = await supabase.storage
      .from("generated-previews")
      .createSignedUrl(previewStoragePath, 60 * 60 * 12);

    if (
      previewSignedUrlResult.error ||
      !previewSignedUrlResult.data?.signedUrl
    ) {
      const signedUrlError = previewSignedUrlResult.error;
      generation?.update({
        output: {
          error: signedUrlError?.message ?? "preview-signed-url-failed",
        },
        statusMessage: "preview-signed-url-failed",
      });

      trace?.update({
        output: {
          error: signedUrlError?.message ?? "preview-signed-url-failed",
        },
      });

      await langfuse?.flushAsync();

      return NextResponse.json(
        {
          error:
            "Ocorreu um erro inesperado ao processar sua imagem. Por favor, tente novamente. Se o problema persistir, entre em contato conosco para que possamos ajudar.",
          errorType: "server_error",
          retryable: true,
        },
        { status: 500 }
      );
    }

    // Retornar apenas preview URL, NÃO imageUrl HD
    const responsePayload = {
      imageId,
      previewUrl: previewSignedUrlResult.data.signedUrl,
      metadata,
    };

    generation?.update({
      output: {
        imageGenerated: true,
        imageId,
        hdStoragePath,
        previewStoragePath,
        signed: true,
      },
      usage: generationUsage,
      metadata: {
        latencyMs: totalDuration,
      },
    });

    trace?.update({
      output: {
        success: true,
        imageId,
        hdStoragePath,
        previewStoragePath,
        metadata,
      },
      metadata: {
        latencyMs: totalDuration,
      },
    });

    await langfuse?.flushAsync();

    return NextResponse.json(responsePayload);
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
      {
        error:
          "Ocorreu um erro inesperado ao gerar sua imagem. Por favor, tente novamente. Se o problema persistir, entre em contato conosco para que possamos ajudar.",
        errorType: "server_error",
        retryable: true,
      },
      { status: 500 }
    );
  }
}
