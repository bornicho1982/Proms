/**
 * Converts a File object to a Base64 string (without the data:image prefix).
 */
export const fileToBase64 = async (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      resolve((reader.result as string).split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Client-side Image Resizing for Gemini Optimization.
 * Reduces payload size and prevents 10MB JSON truncation.
 */
export const resizeImage = (file: File, maxDim: number = 1024): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          } else {
            resolve(file); // Fallback to original
          }
        }, 'image/jpeg', 0.85); // High quality JPEG reduction
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Parses color strings to extract Hex codes using regex.
 */
export function extractHexColors(colors: string[] | undefined | null): { text: string; hex: string | null }[] {
  if (!colors || !Array.isArray(colors)) return [];
  return colors.map(c => {
    if (typeof c !== 'string') return { text: String(c), hex: null };
    const hexMatch = c.match(/#[0-9a-fA-F]{6}/);
    return { text: c, hex: hexMatch ? hexMatch[0] : null };
  });
}
