/**
 * Image Preview Utilities
 * Funções para manipulação de previews com watermark e proteção
 */

/**
 * Verifica se uma URL é de preview protegido
 */
export function isPreviewProtected(imageUrl: string): boolean {
  return imageUrl.includes("generated-previews");
}

/**
 * Cria uma prévia com watermark em canvas
 * @param url URL da imagem
 * @param watermarkText Texto do watermark
 * @returns Promise com data URL do canvas
 */
export async function createWatermarkedPreview(
  url: string,
  watermarkText: string = "Cake Maker"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Desenhar imagem
      ctx.drawImage(img, 0, 0);

      // Aplicar watermark
      applyWatermarkToCanvas(canvas, watermarkText);

      // Retornar data URL
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Aplica watermark em um canvas existente
 * @param canvas Canvas HTML
 * @param text Texto do watermark
 */
export function applyWatermarkToCanvas(
  canvas: HTMLCanvasElement,
  text: string = "Cake Maker"
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Salvar estado do contexto
  ctx.save();

  // Configurar fonte e estilo
  const fontSize = Math.min(canvas.width, canvas.height) * 0.08;
  ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Transladar para o centro e rotacionar
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-30 * (Math.PI / 180));

  // Desenhar sombra/contorno preto
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 3;
  ctx.strokeText(text, 0, 0);

  // Desenhar texto branco
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText(text, 0, 0);

  // Restaurar contexto
  ctx.restore();
}

/**
 * Desenha imagem completa em canvas
 * @param url URL da imagem
 * @param canvas Canvas onde desenhar
 */
export async function drawFullImage(
  url: string,
  canvas: HTMLCanvasElement
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve();
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Previne download não autorizado de imagem
 * @param e Event de contexto ou drag
 */
export function preventImageDownload(e: Event): void {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Adiciona listeners de proteção a uma imagem
 * @param imgElement Elemento img
 */
export function protectImageElement(imgElement: HTMLImageElement): void {
  imgElement.addEventListener("contextmenu", preventImageDownload);
  imgElement.addEventListener("dragstart", preventImageDownload);
  imgElement.setAttribute("draggable", "false");
}

/**
 * Remove listeners de proteção de uma imagem
 * @param imgElement Elemento img
 */
export function unprotectImageElement(imgElement: HTMLImageElement): void {
  imgElement.removeEventListener("contextmenu", preventImageDownload);
  imgElement.removeEventListener("dragstart", preventImageDownload);
  imgElement.setAttribute("draggable", "true");
}
