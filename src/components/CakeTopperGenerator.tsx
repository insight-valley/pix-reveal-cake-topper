import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Heart, Star, Gift } from "lucide-react";
import { toast } from "sonner";
import cakeTopperExample from "@/assets/cake-topper-example.jpg";
import { PromptCatalog } from "./PromptCatalog";
import { useImageGeneration } from "@/hooks/useImageGeneration";

const EXAMPLE_TEXTS = [
  "Parabéns",
  "Feliz Aniversário",
  "Happy Birthday",
  "Ana 25 Anos",
  "Bem-vindos",
  "Obrigada",
  "Love You",
  "Congratulations"
];

interface CakeTopperGeneratorProps {}

export const CakeTopperGenerator = ({}: CakeTopperGeneratorProps) => {
  const [text, setText] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

  const { generateImage, isGenerating, error } = useImageGeneration();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Digite um texto para o topo do bolo!");
      return;
    }

    setGeneratedImage(null);
    
    // Usar a imagem de exemplo como base (para o fluxo de edição de imagem)
    const result = await generateImage({
      prompt: text,
      imageUrl: cakeTopperExample
    });

    if (result) {
      setGeneratedImage(result);
    }
  };


  const handleExampleClick = (example: string) => {
    setText(example);
  };

  const handleSelectPrompt = (prompt: string, title: string) => {
    setSelectedPrompt(prompt);
    setText(prompt);
    toast.success(`Prompt "${title}" selecionado!`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-bounce-soft" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Gerador de Topo de Bolo
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-bounce-soft" />
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Crie topos de bolo personalizados com textos lindos e designs únicos para suas celebrações especiais!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <Card className="shadow-soft border-2 border-primary/10">
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 block">
                  Digite o prompt detalhado para seu topo de bolo:
                </label>
                <Textarea
                  placeholder="Ex: Topo de bolo em estilo adesivo recortado, tema 'Parabéns Ana' 100% rosa..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="text-sm sm:text-base min-h-[100px] sm:min-h-[120px] border-2 border-primary/20 focus:border-primary resize-vertical"
                  maxLength={2000}
                />
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Máximo 2000 caracteres - Seja específico para melhores resultados
                </p>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-sm sm:text-base font-medium text-foreground mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Exemplos populares:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_TEXTS.map((example) => (
                    <Badge
                      key={example}
                      variant="secondary"
                      className="cursor-pointer hover:scale-105 transition-transform bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs sm:text-sm py-1 px-2 sm:py-1.5 sm:px-3"
                      onClick={() => handleExampleClick(example)}
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Catálogo de Prompts */}
              <PromptCatalog onSelectPrompt={handleSelectPrompt} />

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !text.trim()}
                variant="gradient"
                size="xl"
                className="w-full h-12 sm:h-14 text-sm sm:text-base"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Gerando sua imagem...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    Gerar Topo de Bolo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-soft border-2 border-primary/10">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Prévia da sua imagem:
              </h3>
              
              <div className="relative aspect-square bg-gradient-subtle border-2 border-dashed border-primary/30 rounded-lg overflow-hidden">
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse-slow" />
                        </div>
                      </div>
                      <p className="text-primary font-medium animate-pulse-slow text-sm sm:text-base">
                        Criando sua imagem mágica...
                      </p>
                    </div>
                  </div>
                )}

                 {generatedImage && (
                   <div className="relative w-full h-full">
                     <img
                       src={generatedImage}
                       alt="Topo de bolo gerado"
                       className="w-full h-full object-cover rounded-lg transition-all duration-500"
                     />
                     
                     <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                       <Badge variant="default" className="bg-green-500 text-white shadow-soft text-xs sm:text-sm">
                         ✓ Gerado
                       </Badge>
                     </div>
                   </div>
                 )}

                {!generatedImage && !isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                    <div>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Digite um texto e clique em "Gerar" para ver a prévia
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="mt-4 sm:mt-6 space-y-3 animate-fade-in">
                  <Button variant="gradient" size="lg" className="w-full h-10 sm:h-12 text-sm sm:text-base">
                    📥 Baixar Imagem HD
                  </Button>
                  <Button variant="outline" size="lg" className="w-full h-10 sm:h-12 text-sm sm:text-base">
                    🎨 Gerar Nova Imagem
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 sm:mt-16 text-center animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8 px-4">
            Por que escolher nosso gerador?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="p-4 sm:p-6 bg-card rounded-lg shadow-soft border border-primary/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Design Único</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Cada imagem é gerada com IA, garantindo um design exclusivo para sua celebração
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-card rounded-lg shadow-soft border border-primary/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-accent rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Alta Qualidade</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Imagens em alta resolução, perfeitas para impressão em qualquer tamanho
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-card rounded-lg shadow-soft border border-primary/10 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Entrega Rápida</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Receba sua imagem em segundos após o pagamento via PIX
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};