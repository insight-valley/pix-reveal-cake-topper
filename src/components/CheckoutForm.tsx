import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LoadingIcon,
  CheckCircleIcon,
  XCircleIcon,
  PixIcon,
  DownloadIcon,
} from "@/components/LordIcon";
import { toast } from "sonner";
import { usePayment } from "@/hooks/usePayment";
import { paymentService } from "@/services/paymentService";
import { validateDocument } from "@/lib/validators";
import { APP_CONFIG } from "@/constants";
import { QRCodeDisplay } from "./QRCodeDisplay";
import { FeedbackForm } from "./FeedbackForm";
import {
  Confetti,
  type ConfettiRef,
  type ConfettiOptions,
} from "@/components/ui/confetti";

interface CheckoutFormProps {
  imageId: string;
  description: string;
  prompt?: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

interface PaymentFormData {
  email: string;
  docType: string;
  docNumber: string;
  name?: string;
  cellphone?: string;
}

interface FormErrors {
  email?: string;
  docNumber?: string;
  cellphone?: string;
}

export function CheckoutForm({
  imageId,
  description,
  prompt,
  onPaymentSuccess,
  onPaymentError,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    email: "",
    docType: "CPF",
    docNumber: "",
    name: "",
    cellphone: "",
  });

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const confettiRef = useRef<ConfettiRef>(null);
  const confettiTimeouts = useRef<NodeJS.Timeout[]>([]);

  const createConfettiBursts = useCallback((): ConfettiOptions[] => {
    const palette = ["#34d399", "#22c55e", "#f97316", "#facc15", "#a855f7"];

    return [
      {
        particleCount: 160,
        spread: 80,
        startVelocity: 55,
        ticks: 210,
        gravity: 0.9,
        scalar: 1.1,
        origin: { x: 0.2, y: 0.6 },
        decay: 0.92,
        colors: palette,
      },
      {
        particleCount: 200,
        spread: 120,
        startVelocity: 60,
        ticks: 220,
        gravity: 0.9,
        scalar: 1.15,
        origin: { x: 0.5, y: 0.4 },
        decay: 0.9,
        colors: palette,
      },
      {
        particleCount: 160,
        spread: 90,
        startVelocity: 65,
        ticks: 210,
        gravity: 0.9,
        scalar: 1.1,
        origin: { x: 0.8, y: 0.6 },
        decay: 0.92,
        colors: palette,
      },
    ];
  }, []);

  const {
    createPayment,
    isCreatingPayment,
    paymentError,
    paymentStatus,
    startPolling,
    downloadImage,
    isDownloading,
    downloadProgress,
    cancelDownload,
    reset,
    pollingAttempts,
  } = usePayment();

  useEffect(() => {
    return () => {
      confettiTimeouts.current.forEach((timeoutId) => clearTimeout(timeoutId));
      confettiTimeouts.current = [];
    };
  }, []);

  useEffect(() => {
    const status = paymentStatus?.status;

    if (status !== "approved") {
      if (hasTriggeredConfetti) {
        setHasTriggeredConfetti(false);
      }
      confettiTimeouts.current.forEach((timeoutId) => clearTimeout(timeoutId));
      confettiTimeouts.current = [];
      return;
    }

    if (hasTriggeredConfetti) {
      return;
    }

    setHasTriggeredConfetti(true);
    confettiTimeouts.current.forEach((timeoutId) => clearTimeout(timeoutId));
    confettiTimeouts.current = [];

    const queuedBursts = createConfettiBursts();

    queuedBursts.forEach((burst, index) => {
      const timeoutId = setTimeout(() => {
        confettiRef.current?.fire(burst);
      }, index * 220);
      confettiTimeouts.current.push(timeoutId);
    });
  }, [paymentStatus?.status, hasTriggeredConfetti, createConfettiBursts]);

  // Buscar preview da imagem quando pagamento aprovado
  useEffect(() => {
    if (
      paymentStatus?.status === "approved" &&
      paymentStatus.payment_id &&
      imageId &&
      !imagePreviewUrl &&
      !isLoadingPreview
    ) {
      setIsLoadingPreview(true);
      paymentService
        .getImagePreview(paymentStatus.payment_id, imageId)
        .then((url) => {
          setImagePreviewUrl(url);
        })
        .catch((error) => {
          console.error("Error loading image preview:", error);
          toast.error("Erro ao carregar preview da imagem");
        })
        .finally(() => {
          setIsLoadingPreview(false);
        });
    }
  }, [
    paymentStatus?.status,
    paymentStatus?.payment_id,
    imageId,
    imagePreviewUrl,
    isLoadingPreview,
  ]);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email inválido";
    }
    return undefined;
  };

  const validateDocNumber = (doc: string, type: string): string | undefined => {
    if (!doc) return undefined;
    const cleanDoc = doc.replace(/\D/g, "");
    if (type === "CPF" && cleanDoc.length > 0 && cleanDoc.length < 11) {
      return "CPF incompleto";
    }
    if (type === "CNPJ" && cleanDoc.length > 0 && cleanDoc.length < 14) {
      return "CNPJ incompleto";
    }
    if (cleanDoc.length > 0) {
      const validation = validateDocument(doc, type as "CPF" | "CNPJ");
      if (!validation.valid) {
        return validation.error;
      }
    }
    return undefined;
  };

  const formatDocNumber = (value: string, type: string): string => {
    const clean = value.replace(/\D/g, "");
    if (type === "CPF") {
      if (clean.length <= 3) return clean;
      if (clean.length <= 6) return clean.replace(/(\d{3})(\d+)/, "$1.$2");
      if (clean.length <= 9) return clean.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
      return clean.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      if (clean.length <= 2) return clean;
      if (clean.length <= 5) return clean.replace(/(\d{2})(\d+)/, "$1.$2");
      if (clean.length <= 8) return clean.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
      if (clean.length <= 12) return clean.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
      return clean.substring(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
  };

  const handleFormChange = (field: keyof PaymentFormData, value: string) => {
    // Formatação automática de documentos
    if (field === "docNumber") {
      value = formatDocNumber(value, formData.docType);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validação em tempo real
    const errors: FormErrors = { ...formErrors };
    
    if (field === "email") {
      const emailError = validateEmail(value);
      if (emailError) {
        errors.email = emailError;
      } else {
        delete errors.email;
      }
    }

    if (field === "docNumber") {
      const docError = validateDocNumber(value, formData.docType);
      if (docError) {
        errors.docNumber = docError;
      } else {
        delete errors.docNumber;
      }
    }

    setFormErrors(errors);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.email) {
      errors.email = "Email é obrigatório";
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) errors.email = emailError;
    }

    if (!formData.docNumber) {
      errors.docNumber = "Documento é obrigatório";
    } else {
      const docError = validateDocNumber(formData.docNumber, formData.docType);
      if (docError) errors.docNumber = docError;
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Corrija os erros no formulário");
      return false;
    }

    return true;
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const paymentRequest = {
      imageId,
      description,
      customer: {
        name: formData.name || undefined,
        email: formData.email,
        taxId: formData.docNumber.replace(/\D/g, ""),
        cellphone: formData.cellphone || undefined,
      },
    };

    const response = await createPayment(paymentRequest);
    console.log(
      "[CheckoutForm] Payment response:",
      JSON.stringify(response, null, 2)
    );

    if (response) {
      console.log("[CheckoutForm] Payment response received:", {
        payment_id: response.payment_id,
        status: response.status,
        hasQrCode: !!response.qr_code,
        hasQrCodeBase64: !!response.qr_code_base64,
        qrCodeBase64Preview: response.qr_code_base64?.substring(0, 50),
      });

      if (response.status === "approved") {
        onPaymentSuccess?.(response.payment_id);
      } else {
        // PIX gerado, mostrar QR Code
        setQrCode(response.qr_code_base64 || null);
        setPixCopyPaste(response.qr_code || null);

        console.log("[CheckoutForm] QR Code state set:", {
          hasQrCode: !!response.qr_code_base64,
          hasPixCopyPaste: !!response.qr_code,
        });

        // Iniciar polling com status inicial
        startPolling(response.payment_id);
      }
    } else {
      onPaymentError?.(paymentError || "Erro ao processar pagamento");
    }
  };

  const handleDownload = async () => {
    if (paymentStatus?.download_token) {
      await downloadImage(paymentStatus.download_token, imageId);
    }
  };

  console.log(
    "[CheckoutForm] Payment status:",
    JSON.stringify(paymentStatus, null, 2)
  );
  console.log("[CheckoutForm] Payment status status:", paymentStatus?.status);

  // Pagamento aprovado
  if (paymentStatus?.status === "approved") {
    const approvedAt = new Date(paymentStatus.created_at).toLocaleString(
      "pt-BR"
    );
    return (
      <div className="relative">
        <Confetti
          ref={confettiRef}
          manualstart
          className="fixed inset-0 pointer-events-none z-[2000]"
        />
        <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-xl">
          <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.35),_transparent_60%)]" />
          <CardHeader className="relative z-10 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-green-700">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-inner">
                <CheckCircleIcon
                  size={30}
                  trigger="loop"
                  colors={{ primary: "#22c55e" }}
                />
              </span>
              Pagamento aprovado!
            </CardTitle>
            <CardDescription className="text-base text-green-700/80">
              Já pode fazer o download do seu topo! Se quiser gerar outro, é só
              voltar e criar um novo design.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="grid gap-4 rounded-2xl border border-green-100 bg-white/80 p-4 shadow-inner sm:grid-cols-3">
              <div className="sm:col-span-1">
                <p className="text-xs font-medium uppercase text-green-700/70">
                  Valor pago
                </p>
                <p className="mt-1 text-3xl font-bold text-success-600">
                  {paymentService.formatCurrency(
                    APP_CONFIG.payment.priceInCents
                  )}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase text-green-700/70">
                  Resumo
                </p>
                <p className="mt-1 text-sm text-green-800">
                  {paymentStatus.description || "Topo personalizado"}
                </p>
                <p className="text-xs text-green-700/80">
                  Pago em {approvedAt}
                </p>
              </div>
            </div>

            {/* Preview da imagem */}
            {isLoadingPreview ? (
              <div className="flex items-center justify-center rounded-xl border border-green-100 bg-white/80 p-8">
                <LoadingIcon size={32} trigger="loop" className="text-success-600" />
                <span className="ml-3 text-sm text-green-700">
                  Carregando imagem...
                </span>
              </div>
            ) : imagePreviewUrl ? (
              <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-white shadow-lg">
                <img
                  src={imagePreviewUrl}
                  alt="Seu topo personalizado"
                  className="w-full h-auto object-contain"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  draggable={false}
                />
                <div className="absolute top-2 right-2 rounded-md bg-success-500 px-2 py-1 text-xs font-semibold text-white shadow-md">
                  ✓ Sua imagem
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading || !paymentStatus.can_download}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-success-500 to-success-600 py-3 text-base font-semibold text-white shadow-lg transition-all hover:from-success-600 hover:to-success-700 hover:shadow-xl disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <LoadingIcon size={18} trigger="loop" className="mr-1" />
                    <span>Baixando... {downloadProgress.percentage}%</span>
                  </>
                ) : (
                  <>
                    <DownloadIcon size={18} trigger="hover" className="mr-1" />
                    Baixar topo agora
                  </>
                )}
              </Button>
              {isDownloading && downloadProgress.isInProgress && (
                <div className="space-y-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-green-100">
                    <div
                      className="h-full bg-gradient-to-r from-success-500 to-success-600 transition-all duration-300"
                      style={{ width: `${downloadProgress.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-green-700">
                    <span>
                      {downloadProgress.size > 0
                        ? `${(downloadProgress.size / 1024 / 1024).toFixed(2)} MB`
                        : "Calculando..."}
                    </span>
                    <span>{downloadProgress.elapsed}s</span>
                  </div>
                  <Button
                    onClick={cancelDownload}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Cancelar download
                  </Button>
                </div>
              )}
              {!paymentStatus.can_download && !isDownloading && (
                <p className="text-center text-xs font-medium text-green-700/80">
                  Estamos finalizando o link seguro do arquivo. Se demorar
                  alguns segundos, pode atualizar esta seção.
                </p>
              )}
            </div>

            {/* Mensagem sobre email */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4 text-sm text-blue-900 shadow-sm">
              <p className="font-semibold flex items-center gap-2">
                <span>📧</span>
                Envio por email
              </p>
              <p className="mt-2 text-xs text-blue-800">
                Sua imagem também será enviada por email para{" "}
                <span className="font-medium">{formData.email}</span>. Verifique
                sua caixa de entrada e spam.
              </p>
            </div>

            <div className="rounded-xl border border-green-100 bg-white/70 p-4 text-sm text-green-800 shadow-sm">
              <p className="font-semibold">Próximos passos</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-green-700">
                <li>Faça o download e salve o arquivo em um lugar seguro.</li>
                <li>
                  Imprima em papel fotográfico ou couche 250g para melhor
                  resultado.
                </li>
                <li>Quer outro topo? Volte e gere quantas variações quiser.</li>
              </ul>
            </div>

            {/* Feedback Form */}
            <FeedbackForm
              imageId={imageId}
              prompt={prompt || description}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pagamento rejeitado/expirado
  if (
    ["rejected", "expired", "cancelled"].includes(paymentStatus?.status || "")
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <XCircleIcon
              size={24}
              trigger="click"
              colors={{ primary: "#ef4444" }}
              className="mr-2"
            />
            {paymentStatus?.status === "expired"
              ? "Pagamento Expirado"
              : "Pagamento não Concluído"}
          </CardTitle>
          <CardDescription>
            {paymentService.getStatusDisplayText(paymentStatus?.status || "")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={reset} className="w-full">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Aguardando pagamento PIX
  // Renderizar QR Code se tiver o QR Code E (status seja pending OU ainda não carregou)
  if (
    qrCode &&
    pixCopyPaste &&
    (!paymentStatus || paymentStatus?.status === "pending")
  ) {
    return (
      <QRCodeDisplay
        qrCodeBase64={qrCode}
        pixCopyPaste={pixCopyPaste}
        amount={APP_CONFIG.payment.priceInCents}
        isPolling={true}
        pollingAttempts={pollingAttempts}
      />
    );
  }

  // Formulário inicial
  return (
    <Card data-testid="checkout-form">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PixIcon size={24} trigger="hover" className="mr-2" />
          Finalizar Pagamento - PIX
        </CardTitle>
        <CardDescription>
          Valor:{" "}
          {paymentService.formatCurrency(APP_CONFIG.payment.priceInCents)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          {/* Informações do cliente */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome (opcional)</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cellphone">Celular (opcional)</Label>
              <Input
                id="cellphone"
                name="cellphone"
                type="tel"
                value={formData.cellphone}
                onChange={(e) => handleFormChange("cellphone", e.target.value)}
                placeholder="(11) 98765-4321"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="docType">Tipo de Documento *</Label>
                <Select
                  value={formData.docType}
                  onValueChange={(value) => {
                    handleFormChange("docType", value);
                    // Limpar documento ao trocar tipo
                    setFormData((prev) => ({ ...prev, docNumber: "" }));
                    setFormErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.docNumber;
                      return newErrors;
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPF">CPF</SelectItem>
                    <SelectItem value="CNPJ">CNPJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="docNumber">Número do Documento *</Label>
                <Input
                  id="docNumber"
                  name="docNumber"
                  value={formData.docNumber}
                  onChange={(e) =>
                    handleFormChange("docNumber", e.target.value)
                  }
                  placeholder={
                    formData.docType === "CPF"
                      ? "000.000.000-00"
                      : "00.000.000/0000-00"
                  }
                  required
                  className={formErrors.docNumber ? "border-red-500" : ""}
                />
                {formErrors.docNumber && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.docNumber}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <PixIcon size={20} trigger="hover" className="mr-2" />
              Pagamento via PIX
            </h4>
            <p className="text-sm text-blue-700 mb-2">
              PIX é uma forma rápida e segura de pagar, como uma transferência instantânea.
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Pagamento instantâneo e seguro</li>
              <li>• Você receberá um código QR para escanear</li>
              <li>• Use o aplicativo do seu banco para pagar</li>
              <li>• Assim que o pagamento for confirmado, você poderá baixar sua imagem</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isCreatingPayment || Object.keys(formErrors).length > 0}
          >
            {isCreatingPayment ? (
              <>
                <LoadingIcon size={16} trigger="loop" className="mr-2" />
                Gerando PIX...
              </>
            ) : (
              `Gerar QR Code PIX - ${paymentService.formatCurrency(
                APP_CONFIG.payment.priceInCents
              )}`
            )}
          </Button>

          {paymentError && (
            <p className="text-sm text-red-600 text-center">{paymentError}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
