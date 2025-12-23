
import jsPDF from 'jspdf';
import { ReportTheme } from './reportTheme';

export class ReportStyler {
  private pdf: jsPDF;
  private theme: ReportTheme;
  private readonly PAGE_WIDTH = 210;
  private readonly PAGE_HEIGHT = 297;
  private readonly MARGIN = 15;

  constructor(pdf: jsPDF, theme: ReportTheme) {
    this.pdf = pdf;
    this.theme = theme;
  }

  public addPageBackground(): void {
    this.pdf.setFillColor(...this.theme.colors.background);
    this.pdf.rect(0, 0, this.PAGE_WIDTH, this.PAGE_HEIGHT, 'F');
  }

  public addHeader(title: string, icon: string): void {
    this.pdf.setFillColor(...this.theme.colors.primary);
    this.pdf.rect(0, 10, this.PAGE_WIDTH, 20, 'F');
    this.pdf.setFont(this.theme.fonts.heading.family, this.theme.fonts.heading.style);
    this.pdf.setFontSize(this.theme.fonts.heading.size);
    this.pdf.setTextColor(...this.theme.colors.secondary);
    this.pdf.text(`${icon} ${title}`, this.MARGIN, 24);
  }

  public addFooter(): void {
    const pageCount = this.pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.pdf.setFont(this.theme.fonts.caption.family, this.theme.fonts.caption.style);
      this.pdf.setFontSize(this.theme.fonts.caption.size);
      this.pdf.setTextColor(...this.theme.colors.textSecondary);
      this.pdf.text(`Strona ${i} / ${pageCount}`, this.PAGE_WIDTH - this.MARGIN, this.PAGE_HEIGHT - 10, { align: 'right' });
      this.pdf.text('Cosmic Echoes Guide by ARCĀNUM', this.MARGIN, this.PAGE_HEIGHT - 10);
    }
  }

  public addCard(x: number, y: number, width: number, height: number, content: () => void): void {
    this.pdf.setFillColor(...this.theme.colors.cardBackground);
    this.pdf.setDrawColor(...this.theme.colors.cardBorder);
    this.pdf.roundedRect(x, y, width, height, 3, 3, 'FD');
    content();
  }

  public addWrappedText(text: string, options: any): number {
    const { x, y, maxWidth, lineHeight, align, font, size, color, style } = options;
    this.pdf.setFont(font, style || 'normal');
    this.pdf.setFontSize(size);
    this.pdf.setTextColor(...color);
    
    const splitText = this.pdf.splitTextToSize(text, maxWidth);
    this.pdf.text(splitText, x, y, { align: align, lineHeightFactor: lineHeight });
    return splitText.length * size * lineHeight * 0.35; // Estimate height
  }
}
