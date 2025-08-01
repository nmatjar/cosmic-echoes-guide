import jsPDF from 'jspdf';
import { UserProfile } from '@/engine/userProfile';
import { QRCodeService } from './qrCodeService';

// Helper function to add multi-line text with advanced styling
const addWrappedText = (pdf: jsPDF, text: string, options: any) => {
  const { x, y, maxWidth, lineHeight, align, font, size, color, style } = options;
  pdf.setFont(font, style || 'normal');
  pdf.setFontSize(size);
  pdf.setTextColor(color[0], color[1], color[2]);
  
  const splitText = pdf.splitTextToSize(text, maxWidth);
  pdf.text(splitText, x, y, { align: align, lineHeightFactor: lineHeight });
  return splitText.length * size * lineHeight * 0.35; // Estimate height
};

export class PDFExportService {
  private static readonly PAGE_WIDTH = 210;
  private static readonly PAGE_HEIGHT = 297;
  private static readonly MARGIN = 15;
  private static readonly FONT_COLOR_GOLD = [255, 215, 0];
  private static readonly FONT_COLOR_DARK = [45, 45, 45];
  private static readonly BRAND_COLOR_PURPLE = [75, 0, 130];
  private static readonly BG_COLOR_LIGHT_LAVENDER = [230, 230, 250];
  private static readonly CARD_BG_COLOR = [255, 255, 255];

  static async generateProfilePDF(profile: UserProfile): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      this.addTitlePage(pdf, profile);
      this.addIntroductionPage(pdf, profile);

      this.addAstrologySection(pdf, profile);
      this.addNumerologySection(pdf, profile);
      this.addChineseZodiacSection(pdf, profile);
      this.addHumanDesignSection(pdf, profile);
      this.addMayanSection(pdf, profile);
      this.addBiorhythmsSection(pdf, profile);
      this.addElementalBalanceSection(pdf, profile);
      
      await this.addSummaryAndQRPage(pdf, profile);
      
      this.addFooter(pdf);

      const fileName = `CosmicEchoes-Report-${profile.name.replace(/\s+/g, '-')}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Błąd podczas generowania PDF:', error);
      throw new Error('Nie udało się wygenerować raportu PDF.');
    }
  }

  private static addPageBackground(pdf: jsPDF): void {
    pdf.setFillColor(...this.BG_COLOR_LIGHT_LAVENDER);
    pdf.rect(0, 0, this.PAGE_WIDTH, this.PAGE_HEIGHT, 'F');
  }

  private static addHeader(pdf: jsPDF, title: string, icon: string): void {
    pdf.setFillColor(...this.BRAND_COLOR_PURPLE);
    pdf.rect(0, 10, this.PAGE_WIDTH, 20, 'F');
    pdf.setFontSize(22);
    pdf.setTextColor(...this.FONT_COLOR_GOLD);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${icon} ${title}`, this.MARGIN, 24);
  }

  private static addFooter(pdf: jsPDF): void {
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Strona ${i} / ${pageCount}`, this.PAGE_WIDTH - this.MARGIN, this.PAGE_HEIGHT - 10, { align: 'right' });
      pdf.text('Cosmic Echoes Guide by ARCĀNUM', this.MARGIN, this.PAGE_HEIGHT - 10);
    }
  }

  private static addTitlePage(pdf: jsPDF, profile: UserProfile): void {
    pdf.setFillColor(...this.BRAND_COLOR_PURPLE);
    pdf.rect(0, 0, this.PAGE_WIDTH, this.PAGE_HEIGHT, 'F');
    
    pdf.setFontSize(40);
    pdf.setTextColor(...this.FONT_COLOR_GOLD);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Kosmiczny Portret Duszy', this.PAGE_WIDTH / 2, 120, { align: 'center' });
    
    pdf.setFontSize(30);
    pdf.setTextColor(255, 255, 255);
    pdf.text(profile.name, this.PAGE_WIDTH / 2, 150, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setTextColor(200, 200, 255);
    const birthDate = new Date(profile.birthData.date).toLocaleDateString('pl-PL');
    pdf.text(`${birthDate} • ${profile.birthData.time} • ${profile.birthData.place}`, this.PAGE_WIDTH / 2, 170, { align: 'center' });
  }

  private static addIntroductionPage(pdf: jsPDF, profile: UserProfile): void {
    pdf.addPage();
    this.addPageBackground(pdf);
    this.addHeader(pdf, 'Wprowadzenie', '✨');

    let yPos = 50;
    addWrappedText(pdf, `Witaj, ${profile.name}!`, {
      x: this.MARGIN, y: yPos, maxWidth: 180, lineHeight: 1.5, align: 'left',
      font: 'helvetica', size: 24, color: this.BRAND_COLOR_PURPLE, style: 'bold'
    });

    yPos += 20;
    const introText = "Ten raport to Twój osobisty przewodnik po kosmicznym krajobrazie Twojej duszy. Łączy on siedem starożytnych systemów mądrości, aby dać Ci głęboki wgląd w Twoje dary, wyzwania i życiową ścieżkę. Użyj tej wiedzy, by żyć w zgodzie ze swoim prawdziwym ja.";
    addWrappedText(pdf, introText, {
      x: this.MARGIN, y: yPos, maxWidth: 180, lineHeight: 1.5, align: 'left',
      font: 'helvetica', size: 14, color: this.FONT_COLOR_DARK, style: 'normal'
    });
  }

  private static createSectionPage(pdf: jsPDF, title: string, icon: string, intro: string): number {
    pdf.addPage();
    this.addPageBackground(pdf);
    this.addHeader(pdf, title, icon);
    let yPos = 50;
    addWrappedText(pdf, intro, {
      x: this.MARGIN, y: yPos, maxWidth: 180, lineHeight: 1.4, align: 'left',
      font: 'helvetica', size: 11, color: [100, 100, 100], style: 'italic'
    });
    return yPos + 20;
  }

  private static addCard(pdf: jsPDF, x: number, y: number, width: number, height: number, content: () => void): void {
    pdf.setFillColor(...this.CARD_BG_COLOR);
    pdf.roundedRect(x, y, width, height, 3, 3, 'F');
    pdf.setDrawColor(220, 220, 220);
    pdf.roundedRect(x, y, width, height, 3, 3, 'S');
    content();
  }

  private static addAstrologySection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.astrology) return;
    const intro = "Astrologia odkrywa mapę nieba w momencie Twoich narodzin, ukazując Twoje wrodzone cechy, potencjał i życiowe lekcje.";
    let yPos = this.createSectionPage(pdf, 'Astrologia', '♓', intro);

    const data = profile.analysis.astrology;
    const items = [
      { title: 'Znak Słońca', value: data.sunSign?.name || 'N/A', desc: data.sunSign?.description || '' },
      { title: 'Ascendent', value: data.ascendant?.name || 'N/A', desc: data.ascendant?.description || '' },
      { title: 'Medium Coeli (MC)', value: data.midheaven?.name || 'N/A', desc: data.midheaven?.description || '' },
    ];

    items.forEach(item => {
      this.addCard(pdf, this.MARGIN, yPos, 180, 40, () => {
        addWrappedText(pdf, item.title, { x: this.MARGIN + 5, y: yPos + 8, maxWidth: 170, font: 'helvetica', size: 14, color: this.BRAND_COLOR_PURPLE, style: 'bold' });
        addWrappedText(pdf, item.value, { x: this.MARGIN + 5, y: yPos + 16, maxWidth: 170, font: 'helvetica', size: 12, color: this.FONT_COLOR_DARK });
        addWrappedText(pdf, item.desc, { x: this.MARGIN + 5, y: yPos + 24, maxWidth: 170, font: 'helvetica', size: 10, color: [80, 80, 80], style: 'italic' });
      });
      yPos += 45;
    });
  }
  
  private static addNumerologySection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.numerology) return;
    const intro = "Numerologia bada wibracyjną moc liczb w Twoim życiu, odkrywając Twoją ścieżkę, talenty i pragnienia duszy.";
    let yPos = this.createSectionPage(pdf, 'Numerologia', '🔢', intro);

    const data = profile.analysis.numerology;
    const items = [
        { title: 'Liczba Ścieżki Życia', value: data.lifePathNumber?.toString() || 'N/A', desc: data.description || '' },
        { title: 'Liczba Ekspresji', value: data.expressionNumber?.toString() || 'N/A', desc: 'Jak wyrażasz siebie w świecie.' },
        { title: 'Liczba Duszy', value: data.soulNumber?.toString() || 'N/A', desc: 'Twoje najgłębsze pragnienia i motywacje.' },
    ];

    items.forEach(item => {
      this.addCard(pdf, this.MARGIN, yPos, 180, 35, () => {
        addWrappedText(pdf, item.title, { x: this.MARGIN + 5, y: yPos + 8, maxWidth: 130, font: 'helvetica', size: 14, color: this.BRAND_COLOR_PURPLE, style: 'bold' });
        addWrappedText(pdf, item.value, { x: this.MARGIN + 150, y: yPos + 12, maxWidth: 20, align: 'center', font: 'helvetica', size: 20, color: this.FONT_COLOR_GOLD, style: 'bold' });
        addWrappedText(pdf, item.desc, { x: this.MARGIN + 5, y: yPos + 18, maxWidth: 130, font: 'helvetica', size: 10, color: [80, 80, 80], style: 'italic' });
      });
      yPos += 40;
    });
  }

  private static addChineseZodiacSection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.chineseZodiac) return;
    const intro = "Chiński Zodiak, oparty na kalendarzu księżycowym, oferuje wgląd w Twoją osobowość, relacje i zgodność energetyczną.";
    let yPos = this.createSectionPage(pdf, 'Zodiak Chiński', '🐉', intro);
    const data = profile.analysis.chineseZodiac;

    this.addCard(pdf, this.MARGIN, yPos, 180, 60, () => {
      addWrappedText(pdf, `${data.animal} (${data.element}, ${data.polarity})`, { x: this.MARGIN + 5, y: yPos + 10, maxWidth: 170, font: 'helvetica', size: 18, color: this.BRAND_COLOR_PURPLE, style: 'bold' });
      addWrappedText(pdf, data.description || '', { x: this.MARGIN + 5, y: yPos + 22, maxWidth: 170, lineHeight: 1.3, font: 'helvetica', size: 11, color: this.FONT_COLOR_DARK });
    });
  }

  private static addHumanDesignSection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.humanDesign) return;
    const intro = "Human Design to synteza starożytnych mądrości i współczesnej nauki, która pokazuje Twoją unikalną strategię podejmowania decyzji i interakcji ze światem.";
    let yPos = this.createSectionPage(pdf, 'Human Design', '⚡', intro);
    const data = profile.analysis.humanDesign;

    this.addCard(pdf, this.MARGIN, yPos, 180, 60, () => {
      addWrappedText(pdf, `${data.type} - Profil ${data.profile}`, { x: this.MARGIN + 5, y: yPos + 10, maxWidth: 170, font: 'helvetica', size: 18, color: this.BRAND_COLOR_PURPLE, style: 'bold' });
      addWrappedText(pdf, `Autorytet: ${data.authority}`, { x: this.MARGIN + 5, y: yPos + 20, maxWidth: 170, font: 'helvetica', size: 12, color: this.FONT_COLOR_DARK, style: 'italic' });
      addWrappedText(pdf, data.description || '', { x: this.MARGIN + 5, y: yPos + 30, maxWidth: 170, lineHeight: 1.3, font: 'helvetica', size: 11, color: this.FONT_COLOR_DARK });
    });
  }

  private static addMayanSection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.mayan) return;
    const intro = "Kalendarz Majów Tzolkin to święty kalendarz 260 dni, który opisuje Twoją kosmiczną tożsamość i cel energetyczny.";
    let yPos = this.createSectionPage(pdf, 'Kalendarz Majów', '🏛️', intro);
    const data = profile.analysis.mayan;

    this.addCard(pdf, this.MARGIN, yPos, 180, 60, () => {
      addWrappedText(pdf, `${data.sign} (Ton ${data.tone})`, { x: this.MARGIN + 5, y: yPos + 10, maxWidth: 170, font: 'helvetica', size: 18, color: this.BRAND_COLOR_PURPLE, style: 'bold' });
      addWrappedText(pdf, data.description || '', { x: this.MARGIN + 5, y: yPos + 22, maxWidth: 170, lineHeight: 1.3, font: 'helvetica', size: 11, color: this.FONT_COLOR_DARK });
    });
  }

  private static addBiorhythmsSection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.biorhythms) return;
    const intro = "Biorytmy opisują cykliczne zmiany w Twojej energii fizycznej, emocjonalnej i intelektualnej, pomagając Ci planować działania w zgodzie z Twoim naturalnym rytmem.";
    let yPos = this.createSectionPage(pdf, 'Bio-Rytmy', '🧬⏰', intro);
    const data = profile.analysis.biorhythms;
    const items = [
      { label: 'Fizyczny', value: data.physical },
      { label: 'Emocjonalny', value: data.emotional },
      { label: 'Intelektualny', value: data.intellectual },
      { label: 'Duchowy', value: data.spiritual },
    ];

    let cardX = this.MARGIN;
    items.forEach(item => {
      this.addCard(pdf, cardX, yPos, 42, 30, () => {
        addWrappedText(pdf, item.label, { x: cardX + 21, y: yPos + 8, align: 'center', maxWidth: 40, font: 'helvetica', size: 12, color: this.BRAND_COLOR_PURPLE, style: 'bold' });
        addWrappedText(pdf, `${item.value}%`, { x: cardX + 21, y: yPos + 18, align: 'center', maxWidth: 40, font: 'helvetica', size: 16, color: this.FONT_COLOR_DARK, style: 'bold' });
      });
      cardX += 45;
    });
    yPos += 40;
    addWrappedText(pdf, data.description || '', { x: this.MARGIN, y: yPos, maxWidth: 180, lineHeight: 1.3, font: 'helvetica', size: 11, color: this.FONT_COLOR_DARK });
  }

  private static addElementalBalanceSection(pdf: jsPDF, profile: UserProfile): void {
    if (!profile.analysis.elementalBalance) return;
    const intro = "Równowaga Pięciu Żywiołów (Woda, Drewno, Ogień, Ziemia, Metal) z medycyny chińskiej pokazuje, jak harmonizować swoje wewnętrzne energie dla zdrowia i dobrego samopoczucia.";
    let yPos = this.createSectionPage(pdf, 'Równowaga Żywiołów', '☯️🌳', intro);
    const data = profile.analysis.elementalBalance;
    const items = [
      { label: 'Ogień', value: data.fire },
      { label: 'Woda', value: data.water },
      { label: 'Ziemia', value: data.earth },
      { label: 'Powietrze', value: data.air },
    ];

    let cardX = this.MARGIN;
    items.forEach(item => {
      this.addCard(pdf, cardX, yPos, 42, 30, () => {
        addWrappedText(pdf, item.label, { x: cardX + 21, y: yPos + 8, align: 'center', maxWidth: 40, font: 'helvetica', size: 12, color: this.BRAND_COLOR_PURPLE, style: 'bold' });
        addWrappedText(pdf, `${item.value}%`, { x: cardX + 21, y: yPos + 18, align: 'center', maxWidth: 40, font: 'helvetica', size: 16, color: this.FONT_COLOR_DARK, style: 'bold' });
      });
      cardX += 45;
    });
    yPos += 40;
    addWrappedText(pdf, data.description || '', { x: this.MARGIN, y: yPos, maxWidth: 180, lineHeight: 1.3, font: 'helvetica', size: 11, color: this.FONT_COLOR_DARK });
  }

  private static async addSummaryAndQRPage(pdf: jsPDF, profile: UserProfile): Promise<void> {
    this.createSectionPage(pdf, 'Podsumowanie i Twój Link', '🔗', 'Twoja unikalna kosmiczna sygnatura w pigułce. Podziel się swoim profilem z innymi!');
    
    const summary = `Jako ${profile.analysis.astrology?.sunSign?.name} z ascendentem w ${profile.analysis.astrology?.ascendant?.name}, Twoja ścieżka życia o numerze ${profile.analysis.numerology?.lifePathNumber} prowadzi Cię przez lekcje ${profile.analysis.humanDesign?.type}.`;
    addWrappedText(pdf, summary, { x: this.MARGIN, y: 80, maxWidth: 180, lineHeight: 1.5, font: 'helvetica', size: 12, color: this.FONT_COLOR_DARK, style: 'normal' });

    const appUrl = import.meta.env.VITE_APP_URL || 'https://cosmic-echoes.netlify.app';
    const publicProfileUrl = `${appUrl}/profile/${profile.id}`;

    try {
      const qrDataUrl = await QRCodeService.generateQRCode(publicProfileUrl, {
        size: 200,
        color: { dark: '#4B0082', light: '#FFFFFF' },
        margin: 2,
      });
      
      const qrSize = 60;
      pdf.addImage(qrDataUrl, 'PNG', (this.PAGE_WIDTH - qrSize) / 2, 120, qrSize, qrSize);
      pdf.setTextColor(0, 0, 255);
      pdf.textWithLink('Twój publiczny profil', this.PAGE_WIDTH / 2, 190, { align: 'center', url: publicProfileUrl });

    } catch (error) {
      console.error('Błąd generowania kodu QR:', error);
      pdf.setTextColor(255, 0, 0);
      pdf.text('Błąd generowania kodu QR.', this.PAGE_WIDTH / 2, 150, { align: 'center' });
    }
  }
}
