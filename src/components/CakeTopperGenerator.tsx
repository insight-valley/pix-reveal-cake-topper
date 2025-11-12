import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SparklesIcon,
  HeartIcon,
  StarIcon,
  GiftIcon,
  ArrowLeftIcon,
  LoadingIcon,
} from "./LordIcon";
import { toast } from "sonner";
import cakeTopperExample from "@/assets/cake-topper-example.jpg";
import { PromptCatalog } from "./PromptCatalog";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { OfflineIndicator } from "./OfflineIndicator";
import { CheckoutForm } from "./CheckoutForm";
import { ImageHistory, addToImageHistory } from "./ImageHistory";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import {
  EXAMPLE_TEXTS,
  APP_MESSAGES,
  VALIDATION,
  APP_CONFIG,
} from "@/constants";
import { LottieAnimation } from "./LottieAnimation";
import loadingAnimation from "../../public/cake-loading-lottie.json";

export const CakeTopperGenerator = () => {
  const [text, setText] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [generatedImageId, setGeneratedImageId] = useState<string | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(
    null
  );
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<
    number | null
  >(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { generateImage, cancelGeneration, isGenerating, error } =
    useImageGeneration();

  // Atualizar tempo estimado durante geração
  useEffect(() => {
    if (isGenerating && generationStartTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - generationStartTime) / 1000; // segundos
        const estimatedTotal = 30; // ~30 segundos estimados
        const remaining = Math.max(0, estimatedTotal - elapsed);
        setEstimatedTimeRemaining(Math.ceil(remaining));
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setEstimatedTimeRemaining(null);
    }
  }, [isGenerating, generationStartTime]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error(APP_MESSAGES.errors.emptyText);
      return;
    }

    if (text.length > VALIDATION.text.maxLength) {
      toast.error(
        APP_MESSAGES.errors.invalidInput.replace(
          "{max}",
          VALIDATION.text.maxLength.toString()
        )
      );
      return;
    }

    setGeneratedImage(null);
    setShowCheckout(false);
    setGenerationStartTime(Date.now());

    // Gerar ID único para a imagem
    const imageId = `img_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setGeneratedImageId(imageId);

    // Gerar nova imagem com IA
    const result = await generateImage({
      prompt: text,
      imageId,
    });

    if (result) {
      setGeneratedImage(result.previewUrl);
      setGenerationStartTime(null);
      setEstimatedTimeRemaining(null);

      // Salvar no histórico
      addToImageHistory({
        id: imageId,
        previewUrl: result.previewUrl,
        prompt: text,
      });

      toast.success(
        "Prévia gerada com sucesso! Prossiga para o pagamento para baixar em HD."
      );
    } else {
      setGenerationStartTime(null);
      setEstimatedTimeRemaining(null);
    }
  };

  const handleSelectPrompt = (prompt: string, title: string) => {
    setSelectedPrompt(prompt);
    setText(prompt);
    toast.success(`${APP_MESSAGES.success.promptSelected} "${title}"`);
  };

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
  };

  const handleBackToEdit = () => {
    setShowCheckout(false);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    toast.success("Pagamento aprovado! Sua imagem está pronta para download.");
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Erro no pagamento: ${error}`);
    setShowCheckout(false);
  };

  const handleGenerateNew = () => {
    setGeneratedImage(null);
    setGeneratedImageId(null);
    setShowCheckout(false);
    setText("");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Gerador de Topo de Bolo
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Crie topos de bolo personalizados com textos lindos e designs
            únicos!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <Card className="shadow-soft border-2 border-primary/10">
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 block">
                  Digite a receita de imagem detalhada para seu topo de bolo:
                </label>
                <Textarea
                  ref={textareaRef}
                  placeholder={APP_MESSAGES.placeholders.promptInput}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="text-sm sm:text-base min-h-[100px] sm:min-h-[120px] border-2 border-primary/20 focus:border-primary resize-none overflow-hidden"
                  maxLength={VALIDATION.text.maxLength}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Seja específico para melhores resultados
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      text.length > VALIDATION.text.maxLength * 0.9
                        ? "text-red-500"
                        : text.length > VALIDATION.text.maxLength * 0.7
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {text.length}/{VALIDATION.text.maxLength}
                  </p>
                </div>
              </div>

              {/* Catálogo de Receitas de Imagem e Histórico */}
              <div className="flex gap-2">
                <PromptCatalog onSelectPrompt={handleSelectPrompt} />
                <ImageHistory
                  onSelectImage={(item) => {
                    setText(item.prompt);
                    setGeneratedImage(item.previewUrl);
                    setGeneratedImageId(item.id);
                    toast.success("Imagem do histórico carregada!");
                  }}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !text.trim()}
                variant="gradient"
                size="xl"
                className="w-full h-12 sm:h-14 text-sm sm:text-base"
              >
                {isGenerating ? (
                  <>
                    <div className="w-6 h-6 mr-2">
                      <LottieAnimation
                        animationData={loadingAnimation}
                        loop={true}
                        autoplay={true}
                        className="w-full h-full"
                      />
                    </div>
                    Gerando sua imagem...
                  </>
                ) : (
                  <>
                    <SparklesIcon size={20} trigger="hover" />
                    Gerar Imagem
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-soft border-2 border-primary/10">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <GiftIcon
                  size={20}
                  trigger="hover"
                  colors={{ primary: "hsl(var(--primary))" }}
                />
                Prévia da sua imagem:
              </h3>

              <div className="relative aspect-square bg-gradient-subtle border-2 border-dashed border-primary/30 rounded-lg overflow-hidden">
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4">
                        <LottieAnimation
                          animationData={loadingAnimation}
                          loop={true}
                          autoplay={true}
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-primary font-semibold text-sm sm:text-base animate-pulse">
                        {APP_MESSAGES.loading.generating}
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-2">
                        Criando sua imagem personalizada...
                      </p>
                      {estimatedTimeRemaining !== null && (
                        <p className="text-primary/70 text-xs mt-3 font-medium">
                          ⏱️ Tempo estimado: ~{estimatedTimeRemaining}s
                        </p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelGeneration}
                        className="mt-4"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {generatedImage && (
                  <div className="relative w-full h-full">
                    <img
                      src={generatedImage}
                      alt="Prévia da imagem"
                      className="w-full h-full object-cover rounded-lg transition-all duration-500"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      draggable={false}
                    />

                    {/* Overlay de prévia protegida */}
                    {!showCheckout && (
                      <div className="absolute inset-0 bg-black/5 pointer-events-none rounded-lg">
                        <div className="absolute top-4 left-4 bg-yellow-500/90 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
                          🔒 Prévia - Pague para HD
                        </div>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                      <Badge
                        variant="default"
                        className="bg-success-500 text-white shadow-soft text-xs sm:text-sm"
                      >
                        ✓ Prévia Gerada
                      </Badge>
                    </div>
                  </div>
                )}

                {!generatedImage && !isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                    <div>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <SparklesIcon
                          size={40}
                          trigger="hover"
                          colors={{ primary: "hsl(var(--primary))" }}
                        />
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Digite um texto e clique em "Gerar" para ver a prévia
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {generatedImage && !showCheckout && (
                <div className="mt-4 sm:mt-6 space-y-3 animate-fade-in">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-sm text-foreground font-medium mb-2">
                      💎 Sua imagem está pronta!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Para baixar em alta qualidade, efetue o pagamento de
                      apenas:
                    </p>
                    <p className="text-lg font-bold text-primary mt-1">
                      R${" "}
                      {(APP_CONFIG.payment.priceInCents / 100)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  </div>

                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full h-10 sm:h-12 text-sm sm:text-base"
                    onClick={handleProceedToCheckout}
                  >
                    💳 Pagar e Baixar HD
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-10 sm:h-12 text-sm sm:text-base"
                    onClick={handleGenerateNew}
                  >
                    🎨 Gerar Nova Imagem
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Checkout Section */}
        {showCheckout && generatedImageId && (
          <div className="mt-8 animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 text-center">
                <Button
                  variant="ghost"
                  onClick={handleBackToEdit}
                  className="mb-4"
                >
                  <ArrowLeftIcon size={16} trigger="hover" className="mr-2" />
                  Voltar para edição
                </Button>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Finalizar Pagamento
                </h2>
                <p className="text-muted-foreground">
                  Complete o pagamento para baixar sua imagem em alta qualidade
                </p>
              </div>

              {React.createElement(CheckoutForm, {
                imageId: generatedImageId,
                description: `Topo de bolo personalizado: "${text.substring(
                  0,
                  50
                )}${text.length > 50 ? "..." : ""}"`,
                prompt: text,
                onPaymentSuccess: handlePaymentSuccess,
                onPaymentError: handlePaymentError,
              })}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 sm:mt-16 text-center animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8 px-4">
            Por que escolher nosso gerador?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="p-4 sm:p-6 bg-card rounded-lg shadow-soft border border-primary/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <SparklesIcon
                  size={24}
                  trigger="hover"
                  colors={{ primary: "hsl(var(--primary-foreground))" }}
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                Design Único
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Cada imagem é gerada com IA, garantindo um design exclusivo para
                sua celebração
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-card rounded-lg shadow-soft border border-primary/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-accent rounded-full flex items-center justify-center">
                <HeartIcon
                  size={24}
                  trigger="hover"
                  colors={{ primary: "hsl(var(--accent-foreground))" }}
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                Alta Qualidade
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Imagens em alta resolução, perfeitas para impressão em qualquer
                tamanho
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-card rounded-lg shadow-soft border border-primary/10 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <StarIcon
                  size={24}
                  trigger="hover"
                  colors={{ primary: "hsl(var(--primary-foreground))" }}
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                Pagamento Seguro
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Pagamento seguro via AbacatePay com PIX instantâneo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PWA Components */}
      <PWAInstallPrompt />
      <OfflineIndicator />
    </div>
  );
};
