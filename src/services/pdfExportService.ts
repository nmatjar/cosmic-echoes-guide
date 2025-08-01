import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserProfile } from '@/engine/userProfile';
import { QRCodeService } from './qrCodeService';

export class PDFExportService {
  private static readonly PAGE_WIDTH = 210;
  private static readonly PAGE_HEIGHT = 297;
  private static readonly MARGIN = 15;
  private static readonly FONT_COLOR_GOLD = [255, 215, 0];
  private static readonly FONT_COLOR_LIGHT = [200, 200, 255];
  private static readonly FONT_COLOR_DARK = [0, 0, 0];
  private static readonly BRAND_COLOR_PURPLE = [75, 0, 130];

  static async generateProfilePDF(profile: UserProfile): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      this.addTitlePage(pdf, profile);
      
      this.addAstrologySection(pdf, profile);
      this.addNumerologySection(pdf, profile);
      this.addChineseZodiacSection(pdf, profile);
      this.addHumanDesignSection(pdf, profile);
      this.addMayanSection(pdf, profile);
      this.addBiorhythmsSection(pdf, profile);
      this.addElementalBalanceSection(pdf, profile);
      
      await this.addQRCodePage(pdf, profile);
      
      const fileName = `CosmicEchoes-${profile.name.replace(/\s+/g, '-')}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Nie udało się wygenerować PDF');
    }
  }

  private static addHeader(pdf: jsPDF, title: string): void {
    pdf.setFillColor(...this.BRAND_COLOR_PURPLE);
    pdf.rect(0, 0, this.PAGE_WIDTH, 20, 'F');
    pdf.setFontSize(14);
    pdf.setTextColor(...this.FONT_COLOR_GOLD);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✨ CosmoFlow by ARCĀNUM ✨', this.MARGIN, 13);
    pdf.setTextColor(...this.FONT_COLOR_LIGHT);
    pdf.setFontSize(12);
    pdf.text(title, this.PAGE_WIDTH - this.MARGIN, 13, { align: 'right' });
  }

  private static addFooter(pdf: jsPDF): void {
    const pageCount = pdf.getNumberOfPages();
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.text(`Strona ${i} z ${pageCount}`, this.PAGE_WIDTH / 2, this.PAGE_HEIGHT - 10, { align: 'center' });
    }
  }

  private static addTitlePage(pdf: jsPDF, profile: UserProfile): void {
    pdf.setFillColor(...this.BRAND_COLOR_PURPLE);
    pdf.rect(0, 0, this.PAGE_WIDTH, this.PAGE_HEIGHT, 'F');
    
    pdf.setFontSize(36);
    pdf.setTextColor(...this.FONT_COLOR_GOLD);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Kosmiczny Portret Duszy', this.PAGE_WIDTH / 2, 80, { align: 'center' });
    
    pdf.setFontSize(28);
    pdf.setTextColor(255, 255, 255);
    pdf.text(profile.name, this.PAGE_WIDTH / 2, 110, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setTextColor(...this.FONT_COLOR_LIGHT);
    const birthDate = new Date(profile.birthData.date).toLocaleDateString('pl-PL');
    const birthTime = profile.birthData.time || 'Nieznana godzina';
    const birthPlace = profile.birthData.place || 'Nieznane miejsce';
    pdf.text(`${birthDate} • ${birthTime} • ${birthPlace}`, this.PAGE_WIDTH / 2, 130, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text('Wygenerowano przez CosmoFlow by ARCĀNUM', this.PAGE_WIDTH / 2, this.PAGE_HEIGHT - 30, { align: 'center' });
    pdf.text(new Date().toLocaleDateString('pl-PL'), this.PAGE_WIDTH / 2, this.PAGE_HEIGHT - 20, { align: 'center' });
  }

  private static createNewPage(pdf: jsPDF, title: string): void {
    pdf.addPage();
    this.addHeader(pdf, title);
  }

  private static addSectionContent(pdf: jsPDF, yPos: number, content: { label: string; value: string }[]): number {
    pdf.setFont('helvetica', 'normal');
    content.forEach(item => {
      pdf.setFontSize(12);
      pdf.setTextColor(...this.FONT_COLOR_DARK);
      pdf.text(item.label, this.MARGIN, yPos);
      
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      const splitText = pdf.splitTextToSize(item.value, this.PAGE_WIDTH - this.MARGIN * 2 - 30);
      pdf.text(splitText, this.MARGIN + 30, yPos);
      yPos += splitText.length * 5 + 5;
    });
    return yPos;
  }

  private static addAstrologySection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.astrology) return;
    this.createNewPage(pdf, '♓ Astrologia');
    let yPos = 30;
    
    const data = profile.analysis.astrology;
    this.addSectionContent(pdf, yPos, [
      { label: 'Znak Słońca:', value: `${data.sunSign?.name} - ${data.sunSign?.description}` },
      { label: 'Ascendent:', value: `${data.ascendant?.name} - ${data.ascendant?.description}` },
      { label: 'MC (Medium Coeli):', value: `${data.midheaven?.name} - ${data.midheaven?.description}` },
    ]);
  }

  private static addNumerologySection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.numerology) return;
    this.createNewPage(pdf, '🔢 Numerologia');
    let yPos = 30;

    const data = profile.analysis.numerology;
    this.addSectionContent(pdf, yPos, [
        { label: 'Liczba Ścieżki Życia:', value: `${data.lifePathNumber} - ${data.description}` },
        { label: 'Liczba Ekspresji:', value: `${data.expressionNumber}` },
        { label: 'Liczba Duszy:', value: `${data.soulNumber}` },
    ]);
  }

  private static addChineseZodiacSection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.chineseZodiac) return;
    this.createNewPage(pdf, '🐉 Zodiak Chiński');
    let yPos = 30;

    const data = profile.analysis.chineseZodiac;
    this.addSectionContent(pdf, yPos, [
        { label: 'Zwierzę:', value: data.animal },
        { label: 'Element:', value: data.element },
        { label: 'Polarność:', value: data.polarity },
        { label: 'Opis:', value: data.description },
    ]);
  }

  private static addHumanDesignSection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.humanDesign) return;
    this.createNewPage(pdf, '⚡ Human Design');
    let yPos = 30;

    const data = profile.analysis.humanDesign;
    this.addSectionContent(pdf, yPos, [
        { label: 'Typ:', value: data.type },
        { label: 'Profil:', value: data.profile },
        { label: 'Autorytet:', value: data.authority },
        { label: 'Opis:', value: data.description },
    ]);
  }

  private static addMayanSection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.mayan) return;
    this.createNewPage(pdf, '🏛️ Kalendarz Majów');
    let yPos = 30;

    const data = profile.analysis.mayan;
    this.addSectionContent(pdf, yPos, [
        { label: 'Znak (Nagual):', value: data.sign },
        { label: 'Ton:', value: data.tone.toString() },
        { label: 'Opis znaku:', value: data.description },
    ]);
  }

  private static addBiorhythmsSection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.biorhythms) return;
    this.createNewPage(pdf, '🧬⏰ Bio-Rytmy');
    let yPos = 30;

    const data = profile.analysis.biorhythms;
    this.addSectionContent(pdf, yPos, [
        { label: 'Fizyczny:', value: `${data.physical}%` },
        { label: 'Emocjonalny:', value: `${data.emotional}%` },
        { label: 'Intelektualny:', value: `${data.intellectual}%` },
        { label: 'Duchowy:', value: `${data.spiritual}%` },
        { label: 'Opis:', value: data.description },
    ]);
  }

  private static addElementalBalanceSection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.elementalBalance) return;
    this.createNewPage(pdf, '☯️🌳 Równowaga Żywiołów');
    let yPos = 30;

    const data = profile.analysis.elementalBalance;
    this.addSectionContent(pdf, yPos, [
        { label: 'Ogień:', value: `${data.fire}%` },
        { label: 'Woda:', value: `${data.water}%` },
        { label: 'Ziemia:', value: `${data.earth}%` },
        { label: 'Powietrze:', value: `${data.air}%` },
        { label: 'Opis:', value: data.description },
    ]);
  }

  private static async addQRCodePage(pdf: jsPDF, profile: UserProfile): Promise<void> {
    this.createNewPage(pdf, 'Udostępnij Profil');
    
    const appUrl = import.meta.env.VITE_APP_URL || 'https://cosmic-echoes.netlify.app';
    const publicProfileUrl = `${appUrl}/profile/${profile.id}`;

    try {
      const qrDataUrl = await QRCodeService.generateQRCode(publicProfileUrl, {
        size: 200,
        color: { dark: '#4B0082', light: '#FFFFFF' },
        margin: 2,
      });
      
      const qrSize = 80;
      const qrX = (this.PAGE_WIDTH - qrSize) / 2;
      const qrY = 60;
      pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      
      pdf.setTextColor(...this.FONT_COLOR_DARK);
      pdf.setFontSize(12);
      pdf.text('Zeskanuj kod, aby otworzyć publiczny profil', this.PAGE_WIDTH / 2, qrY + qrSize + 20, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 255);
      pdf.textWithLink(publicProfileUrl, this.PAGE_WIDTH / 2, qrY + qrSize + 30, { align: 'center', url: publicProfileUrl });
      
    } catch (error) {
      console.error('Error generating QR code for PDF:', error);
      pdf.setTextColor(255, 0, 0);
      pdf.text('Błąd generowania kodu QR.', this.PAGE_WIDTH / 2, 100, { align: 'center' });
      pdf.text(publicProfileUrl, this.PAGE_WIDTH / 2, 110, { align: 'center' });
    }
    
    this.addFooter(pdf);
  }

  static async captureElementAsPDF(elementId: string, filename: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error(`Element with id "${elementId}" not found`);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1a1a2e'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = this.PAGE_WIDTH - 2 * this.MARGIN;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      this.addHeader(pdf, 'Zrzut Ekranu');
      pdf.addImage(imgData, 'PNG', this.MARGIN, this.MARGIN + 15, imgWidth, imgHeight);
      this.addFooter(pdf);
      
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error capturing element as PDF:', error);
      throw new Error('Nie udało się wygenerować PDF z elementu');
    }
  }
}
