import QRCode from 'qrcode';

export interface QRCodeOptions {
  size?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export class QRCodeService {
  private static readonly DEFAULT_OPTIONS: QRCodeOptions = {
    size: 256,
    color: {
      dark: '#4B0082', // Cosmic purple
      light: '#FFFFFF'
    },
    margin: 2,
    errorCorrectionLevel: 'M'
  };

  /**
   * Generate QR code as data URL (base64 image)
   */
  static async generateQRCode(text: string, options?: QRCodeOptions): Promise<string> {
    try {
      const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
      
      const qrOptions = {
        width: finalOptions.size,
        margin: finalOptions.margin,
        color: finalOptions.color,
        errorCorrectionLevel: finalOptions.errorCorrectionLevel,
        type: 'image/png' as const
      };

      return await QRCode.toDataURL(text, qrOptions);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Nie udało się wygenerować kodu QR');
    }
  }

  /**
   * Generate QR code as SVG string
   */
  static async generateQRCodeSVG(text: string, options?: QRCodeOptions): Promise<string> {
    try {
      const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
      
      const qrOptions = {
        width: finalOptions.size,
        margin: finalOptions.margin,
        color: finalOptions.color,
        errorCorrectionLevel: finalOptions.errorCorrectionLevel
      };

      return await QRCode.toString(text, { 
        ...qrOptions,
        type: 'svg'
      });
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw new Error('Nie udało się wygenerować kodu QR SVG');
    }
  }

  /**
   * Generate QR code for profile sharing
   */
  static async generateProfileQR(profileId?: string, options?: QRCodeOptions): Promise<string> {
    const baseUrl = window.location.origin;
    const profileUrl = profileId ? `${baseUrl}/profile/${profileId}?ref=qr` : baseUrl;
    
    return this.generateQRCode(profileUrl, {
      ...options,
      size: 300,
      color: {
        dark: '#FFD700', // Cosmic gold
        light: '#1a1a2e'  // Dark background
      }
    });
  }

  /**
   * Download QR code as PNG file
   */
  static async downloadQRCode(text: string, filename: string, options?: QRCodeOptions): Promise<void> {
    try {
      const dataUrl = await this.generateQRCode(text, options);
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading QR code:', error);
      throw new Error('Nie udało się pobrać kodu QR');
    }
  }

  /**
   * Generate QR code with custom cosmic styling
   */
  static async generateCosmicQR(text: string, theme: 'purple' | 'gold' | 'teal' | 'pink' = 'purple'): Promise<string> {
    const themes = {
      purple: { dark: '#4B0082', light: '#E6E6FA' },
      gold: { dark: '#FFD700', light: '#1a1a2e' },
      teal: { dark: '#008B8B', light: '#F0FFFF' },
      pink: { dark: '#FF69B4', light: '#FFF0F5' }
    };

    return this.generateQRCode(text, {
      size: 400,
      color: themes[theme],
      margin: 3,
      errorCorrectionLevel: 'H' // High error correction for better scanning
    });
  }

  /**
   * Generate QR code canvas element for further manipulation
   */
  static async generateQRCanvas(text: string, options?: QRCodeOptions): Promise<HTMLCanvasElement> {
    try {
      const canvas = document.createElement('canvas');
      const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
      
      const qrOptions = {
        width: finalOptions.size,
        margin: finalOptions.margin,
        color: finalOptions.color,
        errorCorrectionLevel: finalOptions.errorCorrectionLevel
      };

      await QRCode.toCanvas(canvas, text, qrOptions);
      return canvas;
    } catch (error) {
      console.error('Error generating QR code canvas:', error);
      throw new Error('Nie udało się wygenerować canvas z kodem QR');
    }
  }

  /**
   * Validate if text can be encoded as QR code
   */
  static validateQRText(text: string): { valid: boolean; error?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, error: 'Tekst nie może być pusty' };
    }

    if (text.length > 2953) { // Max capacity for alphanumeric with L error correction
      return { valid: false, error: 'Tekst jest zbyt długi dla kodu QR' };
    }

    return { valid: true };
  }

  /**
   * Generate QR code with logo overlay (for branding)
   */
  static async generateQRWithLogo(text: string, logoUrl?: string, options?: QRCodeOptions): Promise<string> {
    try {
      // Generate base QR code
      const canvas = await this.generateQRCanvas(text, {
        ...options,
        errorCorrectionLevel: 'H' // High error correction needed for logo overlay
      });
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');

      // If logo provided, overlay it
      if (logoUrl) {
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        
        return new Promise((resolve, reject) => {
          logo.onload = () => {
            const logoSize = canvas.width * 0.2; // Logo is 20% of QR size
            const logoX = (canvas.width - logoSize) / 2;
            const logoY = (canvas.height - logoSize) / 2;
            
            // Draw white background for logo
            ctx.fillStyle = 'white';
            ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
            
            // Draw logo
            ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
            
            resolve(canvas.toDataURL('image/png'));
          };
          
          logo.onerror = () => {
            // If logo fails to load, return QR without logo
            resolve(canvas.toDataURL('image/png'));
          };
          
          logo.src = logoUrl;
        });
      }

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating QR with logo:', error);
      throw new Error('Nie udało się wygenerować kodu QR z logo');
    }
  }
}
