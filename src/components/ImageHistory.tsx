import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HistoryIcon, XIcon } from "./LordIcon";
import { toast } from "sonner";

interface ImageHistoryItem {
  id: string;
  previewUrl: string;
  prompt: string;
  createdAt: number;
}

const STORAGE_KEY = "cake-topper-image-history";
const MAX_HISTORY_ITEMS = 20;

export function ImageHistory({
  onSelectImage,
}: {
  onSelectImage?: (item: ImageHistoryItem) => void;
}) {
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ImageHistoryItem[];
        // Ordenar por data mais recente primeiro
        const sorted = parsed.sort((a, b) => b.createdAt - a.createdAt);
        setHistory(sorted);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  };

  const clearHistory = () => {
    if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
      toast.success("Histórico limpo");
    }
  };

  const removeItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.success("Item removido do histórico");
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HistoryIcon size={16} trigger="hover" />
          Histórico ({history.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <HistoryIcon size={24} trigger="loop" />
              Histórico de Imagens Geradas
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="text-xs"
            >
              Limpar tudo
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
            {history.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-lg transition-all"
              >
                <CardContent className="p-3 space-y-2">
                  <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={item.previewUrl}
                      alt={item.prompt.substring(0, 50)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                      >
                        <XIcon size={12} trigger="hover" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.prompt.substring(0, 80)}
                    {item.prompt.length > 80 ? "..." : ""}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                    </Badge>
                    {onSelectImage && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => {
                          onSelectImage(item);
                          setIsOpen(false);
                        }}
                      >
                        Usar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Função utilitária para adicionar item ao histórico
export function addToImageHistory(item: Omit<ImageHistoryItem, "createdAt">) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let history: ImageHistoryItem[] = stored ? JSON.parse(stored) : [];

    // Adicionar novo item
    const newItem: ImageHistoryItem = {
      ...item,
      createdAt: Date.now(),
    };

    // Remover duplicatas (mesmo ID)
    history = history.filter((h) => h.id !== item.id);

    // Adicionar no início
    history.unshift(newItem);

    // Limitar tamanho do histórico
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Erro ao salvar no histórico:", error);
  }
}
