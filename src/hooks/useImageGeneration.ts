import { useState } from 'react';
import { toast } from 'sonner';

interface GenerateImageParams {
  prompt: string;
  imageUrl: string;
}

interface GenerateImageResponse {
  imageUrl: string;
  metadata: {
    usage: {
      totalTokens: number;
      inputTokens: number;
      outputTokens: number;
      inputTokensDetails: {
        textTokens: number;
        imageTokens: number;
      };
    };
    cost: {
      inputCost: string;
      outputCost: string;
      totalCost: string;
    };
    processingTime: number;
    model: string;
  };
}

interface UseImageGenerationReturn {
  generateImage: (params: GenerateImageParams) => Promise<string | null>;
  isGenerating: boolean;
  error: string | null;
}

export const useImageGeneration = (): UseImageGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkCredits = async (): Promise<boolean> => {
    try {
      // Verificar se window.supabase está disponível (projeto conectado)
      if (typeof window !== 'undefined' && (window as any).supabase) {
        const supabase = (window as any).supabase;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('Usuário não autenticado');
          return false;
        }

        // Buscar créditos do usuário
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('credits')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Erro ao verificar créditos:', userError);
          toast.error('Erro ao verificar créditos');
          return false;
        }

        if (!userData || userData.credits < 2) {
          toast.error('Créditos insuficientes. Você precisa de 2 créditos para gerar uma imagem.');
          return false;
        }

        return true;
      } else {
        // Projeto não conectado ao Supabase - simular verificação
        console.warn('Projeto não conectado ao Supabase. Pulando verificação de créditos.');
        return true;
      }
    } catch (err) {
      console.error('Erro na verificação de créditos:', err);
      toast.error('Erro ao verificar créditos');
      return false;
    }
  };

  const consumeCredits = async (amount: number): Promise<boolean> => {
    try {
      if (typeof window !== 'undefined' && (window as any).supabase) {
        const supabase = (window as any).supabase;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { error } = await supabase.rpc('consume_credits', {
          user_id: user.id,
          amount: amount
        });

        if (error) {
          console.error('Erro ao consumir créditos:', error);
          return false;
        }

        return true;
      } else {
        // Projeto não conectado - simular consumo
        console.warn('Projeto não conectado ao Supabase. Simulando consumo de créditos.');
        return true;
      }
    } catch (err) {
      console.error('Erro ao consumir créditos:', err);
      return false;
    }
  };

  const saveToDatabase = async (originalUrl: string, generatedUrl: string, prompt: string, metadata: any): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && (window as any).supabase) {
        const supabase = (window as any).supabase;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('generated_images')
          .insert({
            user_id: user.id,
            original_image_url: originalUrl,
            generated_image_url: generatedUrl,
            prompt: prompt,
            metadata: metadata,
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Erro ao salvar no banco:', error);
          toast.error('Erro ao salvar histórico da imagem');
        }
      } else {
        console.warn('Projeto não conectado ao Supabase. Não salvando no banco de dados.');
      }
    } catch (err) {
      console.error('Erro ao salvar no banco:', err);
    }
  };

  const showCelebration = () => {
    // Trigger confetti animation
    toast.success('🎉 Imagem gerada com sucesso!', {
      description: 'Sua nova imagem está pronta!'
    });
  };

  const generateImage = async (params: GenerateImageParams): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      // 1. Verificar créditos antes da geração
      const hasCredits = await checkCredits();
      if (!hasCredits) {
        return null;
      }

      // 2. Chamar a edge function
      console.log('Chamando edge function generate-image com:', params);
      
      if (typeof window !== 'undefined' && (window as any).supabase) {
        const supabase = (window as any).supabase;
        const { data, error: functionError } = await supabase.functions.invoke('generate-image', {
          body: {
            prompt: params.prompt,
            imageUrl: params.imageUrl
          }
        });

        if (functionError) {
          console.error('Erro na edge function:', functionError);
          setError(functionError.message || 'Erro ao gerar imagem');
          toast.error('Erro ao gerar imagem: ' + (functionError.message || 'Erro desconhecido'));
          return null;
        }

        if (!data || !data.imageUrl) {
          const errorMsg = data?.error || 'Resposta inválida da API';
          console.error('Resposta inválida:', data);
          setError(errorMsg);
          toast.error('Erro ao gerar imagem: ' + errorMsg);
          return null;
        }

        // 3. Consumir créditos apenas se bem-sucedida
        const creditsConsumed = await consumeCredits(2);
        if (!creditsConsumed) {
          toast.error('Erro ao consumir créditos');
          return null;
        }

        // 4. Salvar no banco
        await saveToDatabase(params.imageUrl, data.imageUrl, params.prompt, data.metadata);

        // 5. Mostrar celebração
        showCelebration();

        console.log('Imagem gerada com sucesso:', {
          imageUrl: data.imageUrl,
          metadata: data.metadata
        });

        return data.imageUrl;
      } else {
        // Projeto não conectado ao Supabase
        toast.error('Para usar esta funcionalidade, conecte o projeto ao Supabase clicando no botão verde no topo da interface.');
        setError('Projeto não conectado ao Supabase');
        return null;
      }

    } catch (err) {
      console.error('Erro na geração de imagem:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error('Erro ao gerar imagem: ' + errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateImage,
    isGenerating,
    error
  };
};