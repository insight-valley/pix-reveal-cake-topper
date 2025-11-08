import { useState, useCallback, useRef, useEffect } from "react";
import {
  paymentService,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatus,
} from "@/services/paymentService";
import { toast } from "sonner";
import useDownloader from "react-use-downloader";

interface UsePaymentReturn {
  // Payment creation
  createPayment: (
    request: CreatePaymentRequest
  ) => Promise<CreatePaymentResponse | null>;
  isCreatingPayment: boolean;
  paymentError: string | null;

  // Payment status
  paymentStatus: PaymentStatus | null;
  isCheckingStatus: boolean;
  checkPaymentStatus: (paymentId: string) => Promise<void>;
  startPolling: (paymentId: string) => void;
  stopPolling: () => void;
  isPolling: boolean;
  pollingAttempts: number;

  // Download
  downloadImage: (token: string, imageId: string) => Promise<void>;
  isDownloading: boolean;
  downloadError: string | null;
  downloadProgress: {
    percentage: string;
    size: number;
    elapsed: number;
    isInProgress: boolean;
  };
  cancelDownload: () => void;

  // Reset
  reset: () => void;
}

export function usePayment(): UsePaymentReturn {
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingPaymentIdRef = useRef<string | null>(null);

  // react-use-downloader hook
  const {
    size,
    elapsed,
    percentage,
    download: downloadFile,
    cancel: cancelDownloadFile,
    error: downloaderError,
    isInProgress: isDownloaderInProgress,
  } = useDownloader();

  // Clear polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const createPayment = useCallback(
    async (
      request: CreatePaymentRequest
    ): Promise<CreatePaymentResponse | null> => {
      try {
        setIsCreatingPayment(true);
        setPaymentError(null);

        const response = await paymentService.createPayment(request);

        toast.success("Pagamento criado com sucesso!");
        return response;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao criar pagamento";
        setPaymentError(message);
        toast.error(message);
        return null;
      } finally {
        setIsCreatingPayment(false);
      }
    },
    []
  );

  const checkPaymentStatus = useCallback(
    async (paymentId: string): Promise<void> => {
      try {
        setIsCheckingStatus(true);
        const status = await paymentService.getPaymentStatus(paymentId);
        setPaymentStatus(status);

        // Show status updates
        if (
          status.status === "approved" &&
          paymentStatus?.status !== "approved"
        ) {
          toast.success("Pagamento aprovado! Você pode baixar sua imagem.");
        } else if (status.status === "rejected") {
          toast.error(
            `Pagamento rejeitado: ${paymentService.getStatusDisplayText(
              status.status
            )}`
          );
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Erro ao verificar status do pagamento";
        toast.error(message);
      } finally {
        setIsCheckingStatus(false);
      }
    },
    [paymentStatus?.status]
  );

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    pollingPaymentIdRef.current = null;
    setIsPolling(false);
    setPollingAttempts(0);
  }, []);

  const startPolling = useCallback(
    (paymentId: string) => {
      // Stop any existing polling
      stopPolling();

      pollingPaymentIdRef.current = paymentId;
      setIsPolling(true);

      // Initial check
      checkPaymentStatus(paymentId);

      // Set up polling interval
      let attempts = 0;
      pollingIntervalRef.current = setInterval(async () => {
        attempts++;
        setPollingAttempts(attempts);
        try {
          const status = await paymentService.getPaymentStatus(paymentId);
          setPaymentStatus(status);

          // Stop polling if payment is finalized
          if (
            status.status === "approved" ||
            status.status === "rejected" ||
            status.status === "cancelled"
          ) {
            stopPolling();

            if (status.status === "approved") {
              toast.success("Pagamento aprovado! Você pode baixar sua imagem.");
            }
          }
        } catch (error) {
          console.error("Error polling payment status:", error);
          // Continue polling even on errors, but limit attempts
        }
      }, 5000); // Poll every 5 seconds
    },
    [checkPaymentStatus, stopPolling]
  );

  const downloadImage = useCallback(
    async (token: string, imageId: string): Promise<void> => {
      try {
        setIsDownloading(true);
        setDownloadError(null);

        // Get signed URL for download
        const imageUrl = await paymentService.downloadImage(token, imageId);

        // Use react-use-downloader for download with progress
        const filename = `cake-topper-${imageId}.png`;
        await downloadFile(imageUrl, filename);

        toast.success("Download iniciado!");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao baixar imagem";
        setDownloadError(message);
        toast.error(message);
      } finally {
        setIsDownloading(false);
      }
    },
    [downloadFile]
  );

  const cancelDownload = useCallback(() => {
    cancelDownloadFile();
    setIsDownloading(false);
    setDownloadError(null);
  }, [cancelDownloadFile]);

  // Sync downloader error with our error state
  useEffect(() => {
    if (downloaderError) {
      setDownloadError(
        downloaderError instanceof Error
          ? downloaderError.message
          : "Erro no download"
      );
    }
  }, [downloaderError]);

  // Sync downloader progress with our downloading state
  useEffect(() => {
    setIsDownloading(isDownloaderInProgress);
  }, [isDownloaderInProgress]);

  const reset = useCallback(() => {
    stopPolling();
    setPaymentError(null);
    setPaymentStatus(null);
    setDownloadError(null);
    setIsCreatingPayment(false);
    setIsCheckingStatus(false);
    setIsDownloading(false);
  }, [stopPolling]);

  return {
    createPayment,
    isCreatingPayment,
    paymentError,

    paymentStatus,
    isCheckingStatus,
    checkPaymentStatus,
    startPolling,
    stopPolling,
    isPolling,
    pollingAttempts,

    downloadImage,
    isDownloading,
    downloadError,
    downloadProgress: {
      percentage: String(percentage || 0),
      size,
      elapsed,
      isInProgress: isDownloaderInProgress,
    },
    cancelDownload,

    reset,
  };
}
