import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SparklesIcon, SearchIcon } from "@/components/LordIcon";
import { Input } from "@/components/ui/input";
import {
  PROMPT_CATALOG,
  PROMPT_CATEGORIES,
  APP_MESSAGES,
  type PromptItem,
  searchPrompts,
} from "@/constants";

interface PromptCatalogProps {
  onSelectPrompt: (prompt: string, title: string) => void;
}

export const PromptCatalog = ({ onSelectPrompt }: PromptCatalogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = ["Todos", ...PROMPT_CATEGORIES.map((cat) => cat.name)];

  const getFilteredPrompts = (): PromptItem[] => {
    let prompts = PROMPT_CATALOG;

    // Filtrar por categoria
    if (selectedCategory !== "Todos") {
      prompts = prompts.filter((p) => p.category === selectedCategory);
    }

    // Filtrar por busca
    if (searchTerm.trim()) {
      prompts = searchPrompts(searchTerm);
      // Se há categoria selecionada, aplicar filtro adicional
      if (selectedCategory !== "Todos") {
        prompts = prompts.filter((p) => p.category === selectedCategory);
      }
    }

    return prompts;
  };

  const filteredPrompts = getFilteredPrompts();

  const handleSelectPrompt = (prompt: string, title: string) => {
    onSelectPrompt(prompt, title);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <SparklesIcon 
            size={20} 
            trigger="hover" 
            className="mr-2"
          />
          Catálogo de Prompts
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <SparklesIcon 
              size={24} 
              trigger="loop" 
              colors={{ primary: "hsl(var(--primary))" }}
            />
            Catálogo de Prompts para Topo de Bolo
          </DialogTitle>
        </DialogHeader>

        {/* Barra de busca */}
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <SearchIcon 
              size={16} 
              trigger="hover"
              colors={{ primary: "hsl(var(--muted-foreground))" }}
            />
          </div>
          <Input
            type="text"
            placeholder={APP_MESSAGES.placeholders.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros por categoria */}
        <div className="flex flex-wrap gap-2 py-4 border-b">
          {categories.map((category) => {
            const categoryInfo = PROMPT_CATEGORIES.find(
              (cat) => cat.name === category
            );
            return (
              <Badge
                key={category}
                variant={
                  selectedCategory === category ? "default" : "secondary"
                }
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchTerm(""); // Limpar busca ao trocar categoria
                }}
              >
                {category}
                {categoryInfo && (
                  <span
                    className={`ml-1 w-2 h-2 rounded-full ${categoryInfo.color}`}
                  />
                )}
              </Badge>
            );
          })}
        </div>

        {/* Grid de prompts */}
        <div className="flex-1 overflow-y-auto pr-2">
          {filteredPrompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SparklesIcon 
                size={48} 
                trigger="hover" 
                colors={{ primary: "hsl(var(--muted-foreground))" }}
                className="mb-4"
              />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum prompt encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar sua busca ou escolher uma categoria diferente.
              </p>
            </div>
          ) : (
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

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

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
                      <SparklesIcon 
                        size={16} 
                        trigger="click" 
                        className="mr-1"
                      />
                      Usar este Prompt
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
