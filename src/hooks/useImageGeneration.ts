import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  generateImageAPI,
  type GenerateImageResponse,
} from "@/services/imageGenerator";
import { APP_MESSAGES, APP_CONFIG } from "@/constants";

interface GenerateImageParams {
  prompt: string;
  imageId: string;
}

interface UseImageGenerationReturn {
  generateImage: (
    params: GenerateImageParams
  ) => Promise<GenerateImageResponse | null>;
  cancelGeneration: () => void;
  isGenerating: boolean;
  error: string | null;
}

export const useImageGeneration = (): UseImageGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const showCelebration = () => {
    toast.success(APP_MESSAGES.success.imageGenerated, {
      description: "Sua nova imagem está pronta!",
    });
  };

  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
      setError(null);
      toast.info("Geração cancelada");
    }
  };

  const generateImage = async (
    params: GenerateImageParams
  ): Promise<GenerateImageResponse | null> => {
    // Cancelar qualquer geração anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsGenerating(true);
    setError(null);

    try {
      console.log("Gerando imagem com:", params);

      const data = await generateImageAPI(params, abortControllerRef.current.signal);

      if (!data || !data.previewUrl || !data.imageId) {
        const errorMsg = "Resposta inválida da API";
        console.error("Resposta inválida:", data);
        setError(errorMsg);
        toast.error(`${APP_MESSAGES.errors.generationFailed}: ${errorMsg}`);
        return null;
      }

      showCelebration();

      console.log("Imagem gerada com sucesso:", {
        imageId: data.imageId,
        previewUrl: data.previewUrl,
        metadata: data.metadata,
      });

      abortControllerRef.current = null;
      return data;
    } catch (err) {
      // Se foi cancelado, não mostrar erro
      if (err instanceof Error && err.name === "AbortError") {
        setIsGenerating(false);
        abortControllerRef.current = null;
        return null;
      }

      console.error("Erro na geração de imagem:", err);

      const error = err as Error & {
        status?: number;
        errorType?: string;
        retryable?: boolean;
      };

      const errorMessage = error.message || "Erro desconhecido";
      setError(errorMessage);

      // Determinar mensagem apropriada baseada no tipo de erro
      let message: string;

      if (error.status && error.status >= 500) {
        // Erro do servidor (500+)
        message = APP_MESSAGES.errors.serverError;
      } else if (error.errorType === "server_error") {
        // Erro do servidor identificado pela API
        message = APP_MESSAGES.errors.openAIError;
      } else if (
        errorMessage.includes("fetch") ||
        errorMessage.includes("network") ||
        errorMessage.includes("Failed to fetch")
      ) {
        // Erro de rede
        message = APP_MESSAGES.errors.networkError;
      } else {
        // Outros erros - usar mensagem da API se disponível, senão mensagem genérica
        message =
          errorMessage !== "Erro desconhecido"
            ? errorMessage
            : APP_MESSAGES.errors.generationFailed;
      }

      toast.error(message, {
        duration: 8000,
        description: error.retryable
          ? `Você pode tentar novamente. Se o problema persistir, entre em contato: ${APP_CONFIG.urls.support.replace(
              "mailto:",
              ""
            )}`
          : undefined,
      });

      return null;
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    }
  };

  return {
    generateImage,
    cancelGeneration,
    isGenerating,
    error,
  };
};
