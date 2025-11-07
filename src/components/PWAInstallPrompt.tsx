import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadIcon, CloseIcon, SmartphoneIcon } from "./LordIcon";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
        return;
      }

      if (
        (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true
      ) {
        setIsInstalled(true);
        return;
      }

      if (document.referrer.includes("android-app://")) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show install prompt after a short delay (better UX)
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true);
        }
      }, 5000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      toast.success("App instalado com sucesso! 🎉");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS or browsers that don't support install prompt
      toast.info(
        'Para instalar no iOS: toque em "Compartilhar" e depois "Adicionar à Tela de Início"'
      );
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        toast.success("Instalação iniciada! 🚀");
      } else {
        toast.info("Instalação cancelada. Você pode instalar depois!");
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error: unknown) {
      console.error("Erro ao instalar PWA:", error);
      toast.error("Erro ao instalar. Tente novamente.");
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Don't show if already installed or dismissed
  if (
    isInstalled ||
    !showInstallPrompt ||
    sessionStorage.getItem("pwa-prompt-dismissed")
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in">
      <Card className="bg-gradient-primary border-0 shadow-hero max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SmartphoneIcon size={20} trigger="hover" colors={{ primary: "white" }} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm mb-1">
                Instalar App
              </h3>
              <p className="text-white/90 text-xs mb-3 leading-relaxed">
                Acesse rapidamente e gere toppers offline! Instale em sua tela
                inicial.
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 text-xs font-medium"
                >
                  <DownloadIcon size={12} trigger="click" className="mr-1" />
                  Instalar
                </Button>

                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 text-xs"
                >
                  Agora não
                </Button>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 w-6 h-6 flex-shrink-0"
            >
              <CloseIcon size={12} trigger="hover" colors={{ primary: "white" }} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
