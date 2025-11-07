/**
 * Langfuse Integration
 *
 * Utilitários para instrumentação e monitoramento de geração de imagens
 * usando Langfuse Cloud para observabilidade e análise.
 */

import { Langfuse } from "langfuse";

/**
 * Cria e retorna uma instância do cliente Langfuse
 *
 * @returns Instância do Langfuse ou null se não configurado
 */
export function createLangfuseClient(): Langfuse | null {
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  const baseUrl = process.env.LANGFUSE_HOST || "https://cloud.langfuse.com";

  if (!publicKey || !secretKey) {
    console.warn(
      "[Langfuse] Credenciais não configuradas - monitoramento desativado"
    );
    return null;
  }

  try {
    const langfuse = new Langfuse({
      publicKey,
      secretKey,
      baseUrl,
    });
    console.log("[Langfuse] Cliente inicializado com sucesso");
    return langfuse;
  } catch (error) {
    console.error("[Langfuse] Erro ao inicializar cliente:", error);
    return null;
  }
}

/**
 * Instância singleton do Langfuse (lazy initialization)
 */
let langfuseInstance: Langfuse | null | undefined = undefined;

/**
 * Retorna a instância singleton do Langfuse
 */
export function getLangfuseClient(): Langfuse | null {
  if (langfuseInstance === undefined) {
    langfuseInstance = createLangfuseClient();
  }
  return langfuseInstance;
}

/**
 * Tipo de metadados para rastreamento
 */
export interface GenerationMetadata {
  requestId: string;
  originalPrompt: string;
  enhancedPrompt: string;
  imageUrl?: string;
  userId?: string;
  sessionId?: string;
}

/**
 * Opções para geração de imagem com rastreamento
 */
export interface ImageGenerationOptions {
  model?: string;
  size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
}

/**
 * Níveis de observação do Langfuse
 */
export type ObservationLevel = "DEBUG" | "DEFAULT" | "WARNING" | "ERROR";
