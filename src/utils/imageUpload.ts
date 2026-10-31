/**
 * Image upload and client-side optimization utility for Baunduilla
 * Allows uploading images directly from local files and cameras,
 * resizing and compressing them efficiently so they fit smoothly
 * in LocalStorage and Firestore without quota issues.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  dimensions: { width: number; height: number };
}

/**
 * Resizes and compresses an image File to an optimized JPEG data URL
 * Max dimensions default to 1600x1200, which is ideal for retina hero covers
 * and tour gallery lightboxes while reducing multi-MB files to ~80-160 KB.
 */
export async function compressAndProcessImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.82
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error(`File "${file.name}" is not an image.`));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error(`Failed to read file "${file.name}".`));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error(`Failed to decode image "${file.name}".`));
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Proportional scale down if exceeds max dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context is not available.'));
          return;
        }

        // Draw with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG (or PNG if has alpha channel and small, but JPEG is best for photos)
        const format = file.type === 'image/png' && hasTransparency(ctx, width, height)
          ? 'image/png'
          : 'image/jpeg';

        const dataUrl = canvas.toDataURL(format, quality);
        const compressedSize = Math.round((dataUrl.length * 3) / 4);

        resolve({
          dataUrl,
          name: file.name,
          originalSize: file.size,
          compressedSize,
          dimensions: { width, height },
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Quick heuristic to check if a PNG image contains actual alpha transparency
 */
function hasTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    // Sample a few pixels instead of entire massive buffer
    const step = Math.max(1, Math.floor(Math.min(width, height) / 10));
    const imgData = ctx.getImageData(0, 0, width, height).data;
    for (let i = 3; i < imgData.length; i += 4 * step) {
      if (imgData[i] < 250) return true;
    }
  } catch {
    // Ignore cross-origin error if any
  }
  return false;
}

/**
 * Checks if a string is a base64 uploaded image Data URL
 */
export function isUploadedDataUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('data:image/');
}

/**
 * Human-readable byte formatting helper (e.g. 145 KB, 1.2 MB)
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i] || 'MB'}`;
}

/**
 * Human-readable estimate of a Data URL's size
 */
export function estimateDataUrlSize(dataUrl: string): string {
  if (!dataUrl) return '0 KB';
  const bytes = Math.round((dataUrl.length * 3) / 4);
  return formatBytes(bytes);
}
