import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Heart, Star, Gift } from "lucide-react";
import { toast } from "sonner";
import cakeTopperExample from "@/assets/cake-topper-example.jpg";
import { PromptCatalog } from "./PromptCatalog";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Digite um texto para o topo do bolo!");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    
    // Simula geração da imagem
    setTimeout(() => {
      setGeneratedImage(cakeTopperExample);
      setIsGenerating(false);
      setShowPayment(true);
      toast.success("Imagem gerada com sucesso!");
    }, 3000);
  };

  const handlePayment = () => {
    // Simula pagamento PIX
    toast.success("Pagamento realizado! Baixando imagem...");
    setIsPaid(true);
    setShowPayment(false);
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-bounce-soft" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Gerador de Topo de Bolo
            </h1>
            <Sparkles className="w-8 h-8 text-primary animate-bounce-soft" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crie topos de bolo personalizados com textos lindos e designs únicos para suas celebrações especiais!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <Card className="shadow-soft border-2 border-primary/10">
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="text-lg font-semibold text-foreground mb-4 block">
                  Digite o prompt detalhado para seu topo de bolo:
                </label>
                <Textarea
                  placeholder="Ex: Topo de bolo em estilo adesivo recortado, tema 'Parabéns Ana' 100% rosa..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="text-base min-h-[120px] border-2 border-primary/20 focus:border-primary resize-vertical"
                  maxLength={2000}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Máximo 2000 caracteres - Seja específico para melhores resultados
                </p>
              </div>

              {/* Examples */}
              <div>
                <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Exemplos populares:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_TEXTS.map((example) => (
                    <Badge
                      key={example}
                      variant="secondary"
                      className="cursor-pointer hover:scale-105 transition-transform bg-secondary/80 hover:bg-secondary text-secondary-foreground"
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
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando sua imagem...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar Topo de Bolo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-soft border-2 border-primary/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Prévia da sua imagem:
              </h3>
              
              <div className="relative aspect-square bg-gradient-subtle border-2 border-dashed border-primary/30 rounded-lg overflow-hidden">
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto mb-4">
                          <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-primary animate-pulse-slow" />
                        </div>
                      </div>
                      <p className="text-primary font-medium animate-pulse-slow">
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
                      className={`w-full h-full object-cover rounded-lg transition-all duration-500 ${
                        !isPaid ? 'blur-md' : ''
                      }`}
                    />
                    
                    {!isPaid && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center rounded-lg">
                        <div className="text-center p-6 bg-background/90 rounded-lg shadow-cake border-2 border-primary/20">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                            <Gift className="w-8 h-8 text-primary-foreground" />
                          </div>
                          <h4 className="text-xl font-bold text-foreground mb-2">
                            Sua imagem está pronta!
                          </h4>
                          <p className="text-muted-foreground mb-4">
                            Faça o pagamento para baixar em alta qualidade
                          </p>
                          <div className="space-y-3">
                            <div className="text-2xl font-bold text-primary">
                              R$ 9,90
                            </div>
                            <Button
                              onClick={handlePayment}
                              variant="cake"
                              size="lg"
                              className="w-full"
                            >
                              Pagar via PIX
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {isPaid && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="default" className="bg-green-500 text-white shadow-soft">
                          ✓ Pago
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {!generatedImage && !isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div>
                      <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Digite um texto e clique em "Gerar" para ver a prévia
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {isPaid && (
                <div className="mt-6 space-y-3 animate-fade-in">
                  <Button variant="gradient" size="lg" className="w-full">
                    📥 Baixar Imagem HD
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    🎨 Gerar Nova Imagem
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Por que escolher nosso gerador?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-card rounded-lg shadow-soft border border-primary/10">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Design Único</h3>
              <p className="text-muted-foreground text-sm">
                Cada imagem é gerada com IA, garantindo um design exclusivo para sua celebração
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-soft border border-primary/10">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-accent rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Alta Qualidade</h3>
              <p className="text-muted-foreground text-sm">
                Imagens em alta resolução, perfeitas para impressão em qualquer tamanho
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-soft border border-primary/10">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Entrega Rápida</h3>
              <p className="text-muted-foreground text-sm">
                Receba sua imagem em segundos após o pagamento via PIX
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};