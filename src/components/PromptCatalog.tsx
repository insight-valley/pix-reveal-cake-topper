import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles } from "lucide-react";

interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  category: string;
  imageUrl: string;
}

const PROMPT_CATALOG: PromptItem[] = [
  {
    id: "parabens-vermelho",
    title: "Parabéns Elegante Vermelho",
    category: "Aniversário",
    prompt: `Topo de bolo em estilo adesivo recortado, tema "Parabéns" 100% vermelho/bordo. Elemento principal: palavra "Parabéns" em lettering cursivo elegante, com preenchimento em degradê do vermelho ao bordo vibrante e contorno preto fino + contorno branco espesso para efeito de recorte. À esquerda da palavra, um mini buquê de rosas e flores vermelhas com folhagem verde-claro; à direita, uma borboleta delicada em silhueta vermelha com textura glitter. Abaixo do título, elementos avulsos: 3 rosas lilás com folhas verdes (efeito semi-realista, sombreamento suave) e 4 borboletas vermelhas rendadas com brilho glitter. Todos os itens têm borda branca uniforme (~3 mm) simulando linha de corte para impressão e recorte eletrônico. Paleta predominante: tons de vermelho, verde-folha suave, detalhes em preto e branco. Estilo vetor/clip-art de alta resolução (300 dpi), leve efeito 3D e brilho sutil. Fundo totalmente transparente.`,
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"
  },
  {
    id: "feliz-aniversario-dourado",
    title: "Feliz Aniversário Dourado",
    category: "Aniversário",
    prompt: `Topo de bolo em estilo adesivo recortado, tema "Feliz Aniversário" 100% dourado/champagne. Elemento principal: frase "Feliz Aniversário" em lettering script luxuoso, com preenchimento em degradê dourado metalizado e contorno preto fino + contorno branco espesso para efeito de recorte. Ao redor das palavras, elementos decorativos: estrelas douradas de 5 pontas com brilho, balões estilizados em tons dourado e champagne, confetes circulares pequenos espalhados. Elementos laterais: coroa imperial à esquerda em dourado com pedras preciosas coloridas, presente de aniversário à direita com laço dourado volumoso. Todos os elementos com borda branca uniforme (~3 mm) para recorte. Paleta: tons de dourado, champagne, detalhes em cores vibrantes nas pedras. Estilo vetor premium com textura metalizada, efeito 3D pronunciado. Fundo transparente.`,
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop"
  },
  {
    id: "love-you-rosa",
    title: "Love You Romântico Rosa",
    category: "Amor",
    prompt: `Topo de bolo em estilo adesivo recortado, tema "Love You" 100% rosa/magenta. Elemento principal: frase "Love You" em lettering cursivo romântico, com preenchimento em degradê rosa suave ao magenta vibrante e contorno preto fino + contorno branco espesso. Decorações românticas: coração grande estilizado à esquerda com padrão rendado rosa, cupido pequeno à direita com arco e flecha dourados. Elementos espalhados: pétalas de rosa voando, corações pequenos em tamanhos variados, borboletas delicadas rosa com detalhes dourados. Flores: 5 rosas abertas em tons de rosa com folhas verde-claro, posicionadas harmoniosamente. Todos com borda branca (~3 mm) para recorte limpo. Paleta: tons de rosa, magenta, verde suave, detalhes dourados. Estilo romântico vetor com textura suave, efeito 3D delicado e brilho pérola. Fundo transparente.`,
    imageUrl: "https://images.unsplash.com/photo-1518908777022-1e719ac4e5b8?w=400&h=300&fit=crop"
  },
  {
    id: "congratulations-azul",
    title: "Congratulations Elegante Azul",
    category: "Formatura",
    prompt: `Topo de bolo em estilo adesivo recortado, tema "Congratulations" 100% azul royal/marinho. Elemento principal: palavra "Congratulations" em lettering serif elegante, com preenchimento em degradê azul royal ao marinho e contorno preto fino + contorno branco espesso. Elementos acadêmicos: capelo de formatura à esquerda com borla dourada, diploma enrolado à direita com fita azul. Decorações de sucesso: estrelas de diferentes tamanhos em dourado, louros estilizados nas laterais, medalha de honra pequena. Elementos complementares: 3 livros empilhados em tons de azul, pena de escrever clássica dourada. Todos com borda branca uniforme (~3 mm) para recorte perfeito. Paleta: tons de azul, dourado metalizado, detalhes em preto e branco. Estilo clássico vetor com textura premium, efeito 3D sofisticado. Fundo transparente.`,
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop"
  },
  {
    id: "bem-vindos-verde",
    title: "Bem-vindos Tropical Verde",
    category: "Celebração",
    prompt: `Topo de bolo em estilo adesivo recortado, tema "Bem-vindos" 100% verde tropical/esmeralda. Elemento principal: frase "Bem-vindos" em lettering casual amigável, com preenchimento em degradê verde tropical ao esmeralda e contorno preto fino + contorno branco espesso. Elementos tropicais: folhas de palmeira estilizadas nas laterais, coqueiro pequeno à esquerda, flamingo rosa elegante à direita. Decorações festivas: guirlanda de flores tropicais multicoloridas, borboletas exóticas em azul e amarelo, sol estilizado dourado no canto. Elementos naturais: 4 flores hibisco em tons de coral e rosa, folhagem verde variada. Todos com borda branca (~3 mm) para recorte limpo. Paleta: tons de verde, coral, rosa, azul tropical, dourado. Estilo tropical vetor com textura natural, efeito 3D alegre. Fundo transparente.`,
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop"
  },
  {
    id: "obrigada-lilás",
    title: "Obrigada Delicado Lilás",
    category: "Gratidão",
    prompt: `Topo de bolo em estilo adesivo recortado, tema "Obrigada" 100% lilás/lavanda. Elemento principal: palavra "Obrigada" em lettering cursivo delicado, com preenchimento em degradê lilás claro ao lavanda intenso e contorno preto fino + contorno branco espesso. Elementos de gratidão: coração com fita à esquerda, mãos em oração estilizadas à direita, pomba da paz pequena no topo. Decorações florais: ramos de lavanda natural, flores de cerejeira japonesa, borboletas monarca em tons lilás. Elements complementares: 6 flores variadas em tons de lilás e rosa suave, folhas prateadas delicadas. Todos com borda branca uniforme (~3 mm) para recorte. Paleta: tons de lilás, lavanda, rosa suave, prata, detalhes em branco. Estilo delicado vetor com textura acetinada, efeito 3D suave e brilho pérola. Fundo transparente.`,
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop"
  }
];

interface PromptCatalogProps {
  onSelectPrompt: (prompt: string, title: string) => void;
}

export const PromptCatalog = ({ onSelectPrompt }: PromptCatalogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = ["Todos", ...Array.from(new Set(PROMPT_CATALOG.map(p => p.category)))];
  
  const filteredPrompts = selectedCategory === "Todos" 
    ? PROMPT_CATALOG 
    : PROMPT_CATALOG.filter(p => p.category === selectedCategory);

  const handleSelectPrompt = (prompt: string, title: string) => {
    onSelectPrompt(prompt, title);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <BookOpen className="w-5 h-5 mr-2" />
          Catálogo de Prompts
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Catálogo de Prompts para Topo de Bolo
          </DialogTitle>
        </DialogHeader>

        {/* Filtros por categoria */}
        <div className="flex flex-wrap gap-2 py-4 border-b">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Grid de prompts */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {filteredPrompts.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:shadow-soft transition-all duration-300 hover:scale-[1.02] border-2 border-primary/10 hover:border-primary/30"
                onClick={() => handleSelectPrompt(item.prompt, item.title)}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Imagem preview */}
                  <div className="aspect-video bg-gradient-subtle rounded-lg overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Informações */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm">
                        {item.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {item.prompt.substring(0, 120)}...
                    </p>
                  </div>

                  {/* Botão de seleção */}
                  <Button 
                    size="sm" 
                    variant="gradient" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPrompt(item.prompt, item.title);
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Usar este Prompt
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};