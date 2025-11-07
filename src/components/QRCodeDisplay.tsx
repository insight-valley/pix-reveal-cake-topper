import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PixIcon, LoadingIcon } from "./LordIcon";

interface QRCodeDisplayProps {
  qrCodeBase64: string;
  pixCopyPaste: string;
  amount: number;
  expiresAt?: string;
  isPolling?: boolean;
  pollingAttempts?: number;
}

export function QRCodeDisplay({
  qrCodeBase64,
  pixCopyPaste,
  amount,
  expiresAt,
  isPolling = false,
  pollingAttempts = 0,
}: QRCodeDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log("qrCodeBase64", qrCodeBase64);

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCopyPaste);
    toast.success("Código PIX copiado para a área de transferência!");
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const formatExpiresAt = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 0) return "Expirado";
    if (diffMins < 60) return `Expira em ${diffMins} minutos`;

    const diffHours = Math.floor(diffMins / 60);
    return `Expira em ${diffHours}h ${diffMins % 60}min`;
  };

  console.log("pixCopyPaste", pixCopyPaste);
  console.log("qrCodeBase64", qrCodeBase64);

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <PixIcon size={28} trigger="hover" className="text-primary" />
            <span>Pague com PIX</span>
          </CardTitle>
          {isPolling && (
            <Badge variant="secondary" className="animate-pulse">
              <LoadingIcon size={14} trigger="loop" className="mr-1" />
              Verificando...
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Valor */}
        <div className="text-center bg-primary/5 rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(amount)}
          </p>
          {expiresAt && (
            <p className="text-xs text-muted-foreground mt-2">
              {formatExpiresAt(expiresAt)}
            </p>
          )}
        </div>

        {/* QR Code */}
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm font-medium mb-3">
              Escaneie o QR Code com o app do seu banco
            </p>
            <div className="relative inline-block">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                  <LoadingIcon
                    size={32}
                    trigger="loop"
                    className="text-primary"
                  />
                </div>
              )}
              <div className="bg-white p-4 rounded-lg shadow-md inline-block border-2 border-primary/20">
                <img
                  src={qrCodeBase64}
                  alt="QR Code PIX"
                  className="w-64 h-64 sm:w-72 sm:h-72"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    toast.error("Erro ao carregar QR Code");
                    console.error(
                      "Failed to load QR Code image:",
                      qrCodeBase64.substring(0, 100)
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted-foreground/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              ou copie o código
            </span>
          </div>
        </div>

        {/* Código Copia e Cola */}
        <div className="space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 border border-muted-foreground/20">
            <p className="text-xs font-mono break-all text-muted-foreground leading-relaxed">
              {pixCopyPaste}
            </p>
          </div>
          <Button
            onClick={copyPixCode}
            variant="default"
            size="lg"
            className="w-full"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copiar Código PIX
          </Button>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Como pagar com PIX
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-200 mb-2">
            PIX é uma forma rápida e segura de pagamento. É como transferir dinheiro, só que instantâneo!
          </p>
          <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1.5 ml-1">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Abra o aplicativo do seu banco no celular</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Escolha a opção "Pagar com PIX" ou "Ler QR Code"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Escaneie o código acima ou cole o código copiado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>
                Confirme o pagamento. Em segundos, você poderá baixar sua imagem!
              </span>
            </li>
          </ol>
        </div>

        {/* Status de Verificação */}
        {isPolling && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <LoadingIcon size={16} trigger="loop" className="text-primary" />
              <span>Aguardando confirmação do pagamento...</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Verificando a cada 5 segundos... ({pollingAttempts} tentativas)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
