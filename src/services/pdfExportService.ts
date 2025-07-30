import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserProfile } from '@/engine/userProfile';
import { QRCodeService } from './qrCodeService';

export class PDFExportService {
  private static readonly PAGE_WIDTH = 210; // A4 width in mm
  private static readonly PAGE_HEIGHT = 297; // A4 height in mm
  private static readonly MARGIN = 20;

  static async generateProfilePDF(profile: UserProfile): Promise<void> {
    try {
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add title page
      this.addTitlePage(pdf, profile);
      
      // Add profile sections
      await this.addProfileSections(pdf, profile);
      
      // Add QR code page
      await this.addQRCodePage(pdf);
      
      // Save the PDF
      const fileName = `CosmoFlow-${profile.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Nie udało się wygenerować PDF');
    }
  }

  private static addTitlePage(pdf: jsPDF, profile: UserProfile): void {
    // Background gradient effect (simulated with rectangles)
    pdf.setFillColor(75, 0, 130); // Purple
    pdf.rect(0, 0, this.PAGE_WIDTH, this.PAGE_HEIGHT, 'F');
    
    pdf.setFillColor(138, 43, 226); // Blue violet
    pdf.rect(0, 0, this.PAGE_WIDTH, this.PAGE_HEIGHT / 2, 'F');
    
    // Title
    pdf.setTextColor(255, 215, 0); // Gold
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✨ CosmoFlow by ARCĀNUM ✨', this.PAGE_WIDTH / 2, 60, { align: 'center' });
    
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Kosmiczny Portret Duszy', this.PAGE_WIDTH / 2, 80, { align: 'center' });
    
    // Profile name
    pdf.setFontSize(20);
    pdf.setTextColor(255, 215, 0);
    pdf.text(profile.name, this.PAGE_WIDTH / 2, 110, { align: 'center' });
    
    // Birth info
    pdf.setFontSize(14);
    pdf.setTextColor(200, 200, 255);
    const birthDate = new Date(profile.birthData.date).toLocaleDateString('pl-PL');
    const birthTime = profile.birthData.time || 'Nieznana godzina';
    const birthPlace = profile.birthData.place || 'Nieznane miejsce';
    pdf.text(`${birthDate} • ${birthTime} • ${birthPlace}`, this.PAGE_WIDTH / 2, 130, { align: 'center' });
    
    // Systems overview
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Systemy analizy:', this.PAGE_WIDTH / 2, 160, { align: 'center' });
    
    const systems = [
      `♓ ${profile.analysis.astrology?.sunSign?.name || 'Astrologia'}`,
      `🔢 Numerologia ${profile.analysis.numerology?.lifePathNumber || ''}`,
      `${profile.analysis.chineseZodiac?.icon || '🐉'} ${profile.analysis.chineseZodiac?.animal || 'Zodiak Chiński'}`,
      `⚡ ${profile.analysis.humanDesign?.type || 'Human Design'}`,
      `🏛️ ${profile.analysis.mayan?.sign || 'Kalendarz Majów'}`,
      '🧬⏰ Bio-Rytmy',
      '☯️🌳 Równowaga Żywiołów'
    ];
    
    let yPos = 180;
    systems.forEach(system => {
      pdf.setFontSize(12);
      pdf.text(system, this.PAGE_WIDTH / 2, yPos, { align: 'center' });
      yPos += 15;
    });
    
    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Wygenerowano przez CosmoFlow by ARCĀNUM', this.PAGE_WIDTH / 2, 280, { align: 'center' });
    pdf.text(new Date().toLocaleDateString('pl-PL'), this.PAGE_WIDTH / 2, 290, { align: 'center' });
  }

  private static async addProfileSections(pdf: jsPDF, profile: UserProfile): Promise<void> {
    // Add new page for content
    pdf.addPage();
    
    let yPos = this.MARGIN;
    
    // Page header
    pdf.setFillColor(75, 0, 130);
    pdf.rect(0, 0, this.PAGE_WIDTH, 25, 'F');
    pdf.setTextColor(255, 215, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Szczegółowa Analiza Profilu', this.PAGE_WIDTH / 2, 15, { align: 'center' });
    
    yPos = 40;
    
    // Astrologia
    if (profile.analysis.astrology) {
      yPos = this.addSection(pdf, yPos, '♓ Astrologia', [
        `Znak Słońca: ${profile.analysis.astrology.sunSign?.name || 'N/A'}`,
        `Ascendent: ${profile.analysis.astrology.ascendant?.name || 'N/A'}`,
        `MC: ${profile.analysis.astrology.midheaven?.name || 'N/A'}`,
        `Opis: ${profile.analysis.astrology.sunSign?.description || 'Brak opisu'}`
      ]);
    }
    
    // Numerologia
    if (profile.analysis.numerology) {
      yPos = this.addSection(pdf, yPos, '🔢 Numerologia', [
        `Liczba Ścieżki Życia: ${profile.analysis.numerology.lifePathNumber || 'N/A'}`,
        `Liczba Ekspresji: ${profile.analysis.numerology.expressionNumber || 'N/A'}`,
        `Liczba Duszy: ${profile.analysis.numerology.soulNumber || 'N/A'}`,
        `Opis: ${profile.analysis.numerology.description || 'Brak opisu'}`
      ]);
    }
    
    // Zodiak Chiński
    if (profile.analysis.chineseZodiac) {
      yPos = this.addSection(pdf, yPos, '🐉 Zodiak Chiński', [
        `Zwierzę: ${profile.analysis.chineseZodiac.animal || 'N/A'}`,
        `Element: ${profile.analysis.chineseZodiac.element || 'N/A'}`,
        `Polarność: ${profile.analysis.chineseZodiac.polarity || 'N/A'}`,
        `Opis: ${profile.analysis.chineseZodiac.description || 'Brak opisu'}`
      ]);
    }
    
    // Human Design
    if (profile.analysis.humanDesign) {
      yPos = this.addSection(pdf, yPos, '⚡ Human Design', [
        `Typ: ${profile.analysis.humanDesign.type || 'N/A'}`,
        `Profil: ${profile.analysis.humanDesign.profile || 'N/A'}`,
        `Autorytet: ${profile.analysis.humanDesign.authority || 'N/A'}`,
        `Opis: ${profile.analysis.humanDesign.description || 'Brak opisu'}`
      ]);
    }
  }

  private static addSection(pdf: jsPDF, startY: number, title: string, content: string[]): number {
    let yPos = startY;
    
    // Check if we need a new page
    if (yPos > 250) {
      pdf.addPage();
      yPos = this.MARGIN;
    }
    
    // Section title
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 215, 0);
    pdf.text(title, this.MARGIN, yPos);
    yPos += 10;
    
    // Section content
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    content.forEach(line => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = this.MARGIN;
      }
      
      // Split long lines
      const splitText = pdf.splitTextToSize(line, this.PAGE_WIDTH - 2 * this.MARGIN);
      splitText.forEach((textLine: string) => {
        pdf.text(textLine, this.MARGIN, yPos);
        yPos += 5;
      });
    });
    
    return yPos + 10; // Add spacing after section
  }

  private static async addQRCodePage(pdf: jsPDF): Promise<void> {
    pdf.addPage();
    
    // Page header
    pdf.setFillColor(75, 0, 130);
    pdf.rect(0, 0, this.PAGE_WIDTH, 25, 'F');
    pdf.setTextColor(255, 215, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Udostępnij Swój Profil', this.PAGE_WIDTH / 2, 15, { align: 'center' });
    
    try {
      // Generate actual QR code
      const qrDataUrl = await QRCodeService.generateQRCode(window.location.href, {
        size: 200,
        color: {
          dark: '#4B0082', // Cosmic purple
          light: '#FFFFFF'
        },
        margin: 2,
        errorCorrectionLevel: 'M'
      });
      
      // Add QR code image
      const qrSize = 60;
      const qrX = (this.PAGE_WIDTH - qrSize) / 2;
      const qrY = 80;
      pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      
      // QR Code label
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.text('QR Code do Twojego profilu', this.PAGE_WIDTH / 2, qrY + qrSize + 15, { align: 'center' });
      
      // URL
      pdf.setFontSize(10);
      pdf.text(window.location.href, this.PAGE_WIDTH / 2, qrY + qrSize + 25, { align: 'center' });
      
      // Instructions
      pdf.setFontSize(12);
      pdf.setTextColor(75, 0, 130);
      pdf.text('Zeskanuj kod, aby otworzyć profil na telefonie', this.PAGE_WIDTH / 2, qrY + qrSize + 40, { align: 'center' });
      
    } catch (error) {
      console.error('Error generating QR code for PDF:', error);
      
      // Fallback: draw placeholder rectangle
      pdf.setFillColor(200, 200, 200);
      const qrSize = 60;
      const qrX = (this.PAGE_WIDTH - qrSize) / 2;
      const qrY = 80;
      pdf.rect(qrX, qrY, qrSize, qrSize, 'F');
      
      // Error message
      pdf.setTextColor(255, 0, 0);
      pdf.setFontSize(10);
      pdf.text('Błąd generowania QR kodu', this.PAGE_WIDTH / 2, qrY + qrSize + 15, { align: 'center' });
      
      // URL as fallback
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text(window.location.href, this.PAGE_WIDTH / 2, qrY + qrSize + 25, { align: 'center' });
    }
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('🌟 CosmoFlow by ARCĀNUM - Odkryj rytm swojego życia', this.PAGE_WIDTH / 2, 280, { align: 'center' });
  }

  static async captureElementAsPDF(elementId: string, filename: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
      }

      // Capture element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#1a1a2e'
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit page
      const imgWidth = this.PAGE_WIDTH - 2 * this.MARGIN;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', this.MARGIN, this.MARGIN, imgWidth, imgHeight);
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error capturing element as PDF:', error);
      throw new Error('Nie udało się wygenerować PDF z elementu');
    }
  }
}
