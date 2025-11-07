import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageUrl } = await req.json();

    console.log("Received request:", { prompt, imageUrl });

    if (!prompt || !imageUrl) {
      return new Response(
        JSON.stringify({ error: "Prompt e imageUrl são obrigatórios" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY não configurada");
      return new Response(
        JSON.stringify({ error: "Chave da API OpenAI não configurada" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Criar prompt melhorado para gerar imagem de topo de bolo
    const enhancedPrompt = `Create a beautiful cake topper design with the text "${prompt}". The design should be elegant, festive, and suitable for a celebration cake. Use beautiful fonts, decorative elements, and vibrant colors that would look great on a cake. The background should be transparent or white. Style: modern, elegant, celebratory.`;

    console.log("Calling OpenAI with enhanced prompt:", enhancedPrompt);

    // Chamar a API da OpenAI para gerar imagem
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({
          error: "Erro na API da OpenAI",
          details: errorData,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status,
        }
      );
    }

    const data = await response.json();
    console.log("OpenAI response received, processing...");

    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
      console.error("Invalid OpenAI response:", data);
      return new Response(
        JSON.stringify({ error: "Resposta inválida da OpenAI" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Converter base64 para data URL
    const imageData = data.data[0].b64_json;
    const imageUrl_generated = `${imageData}`;

    // Criar metadata da resposta
    const metadata = {
      usage: {
        totalTokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        inputTokensDetails: {
          textTokens: 0,
          imageTokens: 0,
        },
      },
      cost: {
        inputCost: "0.00",
        outputCost: "0.00",
        totalCost: "0.00",
      },
      processingTime: Date.now(),
      model: "gpt-image-1",
    };

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({
        imageUrl: imageUrl_generated,
        metadata: metadata,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-image function:", error);
    return new Response(
      JSON.stringify({
        error: "Erro interno do servidor",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
