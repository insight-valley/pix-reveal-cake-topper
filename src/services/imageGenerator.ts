interface GenerateImageParams {
  prompt: string;
  imageId: string;
}

export interface GenerateImageResponse {
  imageId: string;
  previewUrl: string;
  metadata: Record<string, unknown>;
}

export const generateImageAPI = async (
  params: GenerateImageParams,
  signal?: AbortSignal
): Promise<GenerateImageResponse> => {
  const response = await fetch(`/api/generate-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: params.prompt,
      imageId: params.imageId,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "Erro desconhecido ao processar a solicitação",
    }));
    
    // Usar mensagem amigável da API ou mensagem padrão
    const errorMessage =
      errorData.error ||
      (response.status >= 500
        ? "Ocorreu um erro inesperado. Tente novamente."
        : "Erro ao processar sua solicitação. Tente novamente.");
    
    const error = new Error(errorMessage) as Error & {
      status?: number;
      errorType?: string;
      retryable?: boolean;
    };
    
    error.status = response.status;
    error.errorType = errorData.errorType;
    error.retryable = errorData.retryable;
    
    throw error;
  }

  return await response.json();
};
