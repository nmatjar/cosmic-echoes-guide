import jsPDF from 'jspdf';
import { UserProfile } from '@/engine/userProfile';
import { QRCodeService } from './qrCodeService';
import { ReportTheme, defaultTheme } from './pdf/reportTheme';
import { ReportStyler } from './pdf/reportStyler';

export class PDFExportService {
  private static readonly PAGE_WIDTH = 210;
  private static readonly PAGE_HEIGHT = 297;
  private static readonly MARGIN = 15;

  static async generateProfilePDF(profile: UserProfile): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const theme = this.getModernTheme();
      const styler = new ReportStyler(pdf, theme);

      this.addTitlePage(pdf, profile, styler, theme);
      this.addIntroductionPage(pdf, profile, styler, theme);

      this.addAstrologySection(pdf, profile, styler, theme);
      this.addNumerologySection(pdf, profile, styler, theme);
      this.addChineseZodiacSection(pdf, profile, styler, theme);
      this.addHumanDesignSection(pdf, profile, styler, theme);
      this.addMayanSection(pdf, profile, styler, theme);
      this.addBiorhythmsSection(pdf, profile, styler, theme);
      this.addElementalBalanceSection(pdf, profile, styler, theme);
      
      await this.addSummaryAndQRPage(pdf, profile, styler, theme);
      
      styler.addFooter();

      const fileName = `CosmicEchoes-Report-${profile.name.replace(/\s+/g, '-')}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Błąd podczas generowania PDF:', error);
      throw new Error('Nie udało się wygenerować raportu PDF.');
    }
  }

  private static getModernTheme(): ReportTheme {
    return new ReportTheme(
      {
        primary: [25, 25, 112], // Midnight Blue
        secondary: [255, 182, 193], // Light Pink
        accent: [137, 207, 240], // Baby Blue
        background: [255, 255, 255], // White
        textPrimary: [0, 0, 0], // Black
        textSecondary: [105, 105, 105], // Dim Gray
        cardBackground: [245, 245, 245], // White Smoke
        cardBorder: [211, 211, 211], // Light Gray
      },
      {
        title: { family: 'Garamond', style: 'bold', size: 32 },
        heading: { family: 'Garamond', style: 'bold', size: 20 },
        subheading: { family: 'Garamond', style: 'bold', size: 14 },
        body: { family: 'Garamond', style: 'normal', size: 12 },
        caption: { family: 'Garamond', style: 'italic', size: 10 },
      }
    );
  }

  private static addTitlePage(pdf: jsPDF, profile: UserProfile, styler: ReportStyler, theme: ReportTheme): void {
    styler.addPageBackground();
    
    pdf.setFont(theme.fonts.title.family, theme.fonts.title.style);
    pdf.setFontSize(theme.fonts.title.size);
    pdf.setTextColor(...theme.colors.primary);
    pdf.text('Kosmiczny Portret Duszy', this.PAGE_WIDTH / 2, 120, { align: 'center' });
    
    pdf.setFont(theme.fonts.heading.family, theme.fonts.heading.style);
    pdf.setFontSize(theme.fonts.heading.size);
    pdf.setTextColor(...theme.colors.textPrimary);
    pdf.text(profile.name, this.PAGE_WIDTH / 2, 150, { align: 'center' });
    
    pdf.setFont(theme.fonts.body.family, theme.fonts.body.style);
    pdf.setFontSize(theme.fonts.body.size);
    pdf.setTextColor(...theme.colors.textSecondary);
    const birthDate = new Date(profile.birthData.date).toLocaleDateString('pl-PL');
    pdf.text(`${birthDate} • ${profile.birthData.time} • ${profile.birthData.place}`, this.PAGE_WIDTH / 2, 170, { align: 'center' });
  }

  private static addIntroductionPage(pdf: jsPDF, profile: UserProfile, styler: ReportStyler, theme: ReportTheme): void {
    pdf.addPage();
    styler.addPageBackground();
    styler.addHeader('Wprowadzenie', '✨');

    let yPos = 50;
    styler.addWrappedText(`Witaj, ${profile.name}!`, {
      x: this.MARGIN, y: yPos, maxWidth: 180, lineHeight: 1.5, align: 'left',
      font: theme.fonts.heading.family, size: theme.fonts.heading.size, color: theme.colors.primary, style: 'bold'
    });

    yPos += 20;
    const introText = "Ten raport to Twój osobisty przewodnik po kosmicznym krajobrazie Twojej duszy. Łączy on siedem starożytnych systemów mądrości, aby dać Ci głęboki wgląd w Twoje dary, wyzwania i życiową ścieżkę. Użyj tej wiedzy, by żyć w zgodzie ze swoim prawdziwym ja.";
    styler.addWrappedText(introText, {
      x: this.MARGIN, y: yPos, maxWidth: 180, lineHeight: 1.5, align: 'left',
      font: theme.fonts.body.family, size: theme.fonts.body.size, color: theme.colors.textPrimary, style: 'normal'
    });
  }

  private static createSectionPage(pdf: jsPDF, title: string, icon: string, intro: string, styler: ReportStyler, theme: ReportTheme): number {
    pdf.addPage();
    styler.addPageBackground();
    styler.addHeader(title, icon);
    let yPos = 50;
    styler.addWrappedText(intro, {
      x: this.MARGIN, y: yPos, maxWidth: 180, lineHeight: 1.4, align: 'left',
      font: theme.fonts.caption.family, size: theme.fonts.caption.size, color: theme.colors.textSecondary, style: 'italic'
    });
    return yPos + 20;
  }

  private static addAstrologySection(pdf: jsPDF, profile: UserProfile, styler: ReportStyler, theme: ReportTheme): void {
    if (!profile.analysis.astrology) return;
    const intro = "Astrologia odkrywa mapę nieba w momencie Twoich narodzin, ukazując Twoje wrodzone cechy, potencjał i życiowe lekcje.";
    let yPos = this.createSectionPage(pdf, 'Astrologia', '♓', intro, styler, theme);

    const data = profile.analysis.astrology;
    const items = [
      { title: 'Znak Słońca', value: data.sunSign?.name || 'N/A', desc: data.sunSign?.description || '' },
      { title: 'Ascendent', value: data.ascendant?.name || 'N/A', desc: data.ascendant?.description || '' },
      { title: 'Medium Coeli (MC)', value: data.midheaven?.name || 'N/A', desc: data.midheaven?.description || '' },
    ];

    items.forEach(item => {
      styler.addCard(this.MARGIN, yPos, 180, 40, () => {
        styler.addWrappedText(item.title, { x: this.MARGIN + 5, y: yPos + 8, maxWidth: 170, font: theme.fonts.subheading.family, size: theme.fonts.subheading.size, color: theme.colors.primary, style: 'bold' });
        styler.addWrappedText(item.value, { x: this.MARGIN + 5, y: yPos + 16, maxWidth: 170, font: theme.fonts.body.family, size: theme.fonts.body.size, color: theme.colors.textPrimary });
        styler.addWrappedText(item.desc, { x: this.MARGIN + 5, y: yPos + 24, maxWidth: 170, font: theme.fonts.caption.family, size: theme.fonts.caption.size, color: theme.colors.textSecondary, style: 'italic' });
      });
      yPos += 45;
    });
  }
  
  private static addNumerologySection(pdf: jsPDF, profile: UserProfile, styler: ReportStyler, theme: ReportTheme): void {
    if (!profile.analysis.numerology) return;
    const intro = "Numerologia bada wibracyjną moc liczb w Twoim życiu, odkrywając Twoją ścieżkę, talenty i pragnienia duszy.";
    let yPos = this.createSectionPage(pdf, 'Numerologia', '🔢', intro, styler, theme);

    const data = profile.analysis.numerology;
    const items = [
        { title: 'Liczba Ścieżki Życia', value: data.lifePathNumber?.toString() || 'N/A', desc: data.description || '' },
        { title: 'Liczba Ekspresji', value: data.expressionNumber?.toString() || 'N/A', desc: 'Jak wyrażasz siebie w świecie.' },
        { title: 'Liczba Duszy', value: data.soulNumber?.toString() || 'N/A', desc: 'Twoje najgłębsze pragnienia i motywacje.' },
    ];

    items.forEach(item => {
      styler.addCard(this.MARGIN, yPos, 180, 35, () => {
        styler.addWrappedText(item.title, { x: this.MARGIN + 5, y: yPos + 8, maxWidth: 130, font: theme.fonts.subheading.family, size: theme.fonts.subheading.size, color: theme.colors.primary, style: 'bold' });
        styler.addWrappedText(item.value, { x: this.MARGIN + 150, y: yPos + 12, maxWidth: 20, align: 'center', font: theme.fonts.heading.family, size: theme.fonts.heading.size, color: theme.colors.secondary, style: 'bold' });
        styler.addWrappedText(item.desc, { x: this.MARGIN + 5, y: yPos + 18, maxWidth: 130, font: theme.fonts.caption.family, size: theme.fonts.caption.size, color: theme.colors.textSecondary, style: 'italic' });
      });
      yPos += 40;
    });
  }

  private static addChineseZodiacSection(pdf: jsPDF, profile: UserProfile, styler: ReportStyler, theme: ReportTheme): void {
    if (!profile.analysis.chineseZodiac) return;
    const intro = "Chiński Zodiak, oparty na kalendarzu księżycowym, oferuje wgląd w Twoją osobowość, relacje i zgodność energetyczną.";
    let yPos = this.createSectionPage(pdf, 'Zodiak Chiński', '🐉', intro, styler, theme);
    const data = profile.analysis.chineseZodiac;

    styler.addCard(this.MARGIN, yPos, 180, 60, () => {
      styler.addWrappedText(`${data.animal} (${data.element}, ${data.polarity})`, { x: this.MARGIN + 5, y: yPos + 10, maxWidth: 170, font: theme.fonts.heading.family, size: theme.fonts.heading.size, color: theme.colors.primary, style: 'bold' });
      styler.addWrappedText(data.description || '', { x: this.MARGIN + 5, y: yPos + 22, maxWidth: 170, lineHeight: 1.3, font: theme.fonts.body.family, size: theme.fonts.body.size, color: theme.colors.textPrimary });
    });
  }

  private static addHumanDesignSection(pdf: jsPDF, profile: UserProfile, styler: ReportStyler, theme: ReportTheme): void {
    if (!profile.analysis.humanDesign) return;
    const intro = "Human Design to synteza starożytnych mądrości i współczesnej nauki, która pokazuje Twoją unikalną strategię podejmowania decyzji i interakcji ze światem.";
    let yPos = this.createSectionPage(pdf, 'Human Design', '⚡', intro, styler, theme);
    const data = profile.analysis.humanDesign;

    styler.addCard(this.MARGIN, yPos, 180, 60, () => {
      styler.addWrappedText(`${data.type} - Profil ${data.profile}`, { x: this.MARGIN + 5, y: yPos + 10, maxWidth: 170, font: theme.fonts.heading.family, size: theme.fonts.heading.size, color: theme.colors.primary, style: 'bold' });
      styler.addWrappedText(`Autorytet: ${data.authority}`, { x: this.MARGIN + 5, y: yPos + 20, maxWidth: 170, font: theme.fonts.body.family, size: theme.fonts.body.size, color: theme.colors.textSecondary, style: 'italic' });
      styler.addWrappedText(data.description || '', { x: this.MARGIN + 5, y: yPos + 30, maxWidth: 170, lineHeight: 1.3, font: theme.fonts.body.family, size: theme.fonts.body.size, color: theme.colors.textPrimary });
    });
  }

  private static addMayanSection(pdf: jsPDF, profile: UserProfile, styler: ReportStyler, theme: ReportTheme): void {
    if (!profile.analysis.mayan) return;
    const intro = "Kalendarz Majów Tzolkin to święty kalendarz 260 dni, który opisuje Twoją kosmiczną tożsamość i cel energetyczny.";
    let yPos = this.createSectionPage(pdf, 'Kalendarz Majów', '🏛️', intro, styler, theme);
    const data = profile.analysis.mayan;

    styler.addCard(this.MARGIN, yPos, 180, 60, () => {
      styler.addWrappedText(`${data.sign} (Ton ${data.tone})`, { x: this.MARGIN + 5, y: yPos + 10, maxWidth: 170, font: theme.fonts.heading.family, size: theme.fonts.heading.size, color: theme.colors.primary, style: 'bold' });
      styler.addWrappedText(data.description || '', { x: this.MARGIN + 5, y: yPos + 22, maxWidth: 170, lineHeight: 1.3, font: theme.fonts.body.family, size: theme.fonts.body.size, color: theme.colors.textPrimary });
    });
  }

  private static addBiorhythmsSection(pdf: jsPDF, profile: UserProfile, styler: ReportStyler, theme: ReportTheme): void {
    if (!profile.analysis.biorhythms) return;
    const intro = "Biorytmy opisują cykliczne zmiany w Twojej energii fizycznej, emocjonalnej i intelektualnej, pomagając Ci planować działania w zgodzie z Twoim naturalnym rytmem.";
    let yPos = this.createSectionPage(pdf, 'Bio-Rytmy', '🧬⏰', intro, styler, theme);
    const data = profile.analysis.biorhythms;
    const items = [
      { label: 'Fizyczny', value: data.physical },
      { label: 'Emocjonalny', value: data.emotional },
      { label: 'Intelektualny', value: data.intellectual },
      { label: 'Duchowy', value: data.spiritual },
    ];

    let cardX = this.MARGIN;
    items.forEach(item => {
      styler.addCard(cardX, yPos, 42, 30, () => {
        styler.addWrappedText(item.label, { x: cardX + 21, y: yPos + 8, align: 'center', maxWidth: 40, font: theme.fonts.subheading.family, size: theme.fonts.subheading.size, color: theme.colors.primary, style: 'bold' });
        styler.addWrappedText(`${item.value}%`, { x: cardX + 21, y: yPos + 18, align: 'center', maxWidth: 40, font: theme.fonts.heading.family, size: theme.fonts.heading.size, color: theme.colors.textPrimary, style: 'bold' });
      });
      cardX += 45;
    });
    yPos += 40;
    styler.addWrappedText(data.description || '', { x: this.MARGIN, y: yPos, maxWidth: 180, lineHeight: 1.3, font: theme.fonts.body.family, size: theme.fonts.body.size, color: theme.colors.textPrimary });
  }

  private static addElementalBalanceSection(pdf: jsPDF, profile: UserProfile, styler: ReportStyler, theme: ReportTheme): void {
    if (!profile.analysis.elementalBalance) return;
    const intro = "Równowaga Pięciu Żywiołów (Woda, Drewno, Ogień, Ziemia, Metal) z medycyny chińskiej pokazuje, jak harmonizować swoje wewnętrzne energie dla zdrowia i dobrego samopoczucia.";
    let yPos = this.createSectionPage(pdf, 'Równowaga Żywiołów', '☯️🌳', intro, styler, theme);
    const data = profile.analysis.elementalBalance;
    const items = [
      { label: 'Ogień', value: data.fire },
      { label: 'Woda', value: data.water },
      { label: 'Ziemia', value: data.earth },
      { label: 'Powietrze', value: data.air },
    ];

    let cardX = this.MARGIN;
    items.forEach(item => {
      styler.addCard(cardX, yPos, 42, 30, () => {
        styler.addWrappedText(item.label, { x: cardX + 21, y: yPos + 8, align: 'center', maxWidth: 40, font: theme.fonts.subheading.family, size: theme.fonts.subheading.size, color: theme.colors.primary, style: 'bold' });
        styler.addWrappedText(`${item.value}%`, { x: cardX + 21, y: yPos + 18, align: 'center', maxWidth: 40, font: theme.fonts.heading.family, size: theme.fonts.heading.size, color: theme.colors.textPrimary, style: 'bold' });
      });
      cardX += 45;
    });
    yPos += 40;
    styler.addWrappedText(data.description || '', { x: this.MARGIN, y: yPos, maxWidth: 180, lineHeight: 1.3, font: theme.fonts.body.family, size: theme.fonts.body.size, color: theme.colors.textPrimary });
  }

  private static async addSummaryAndQRPage(pdf: jsPDF, profile: UserProfile, styler: ReportStyler, theme: ReportTheme): Promise<void> {
    this.createSectionPage(pdf, 'Podsumowanie i Twój Link', '🔗', 'Twoja unikalna kosmiczna sygnatura w pigułce. Podziel się swoim profilem z innymi!', styler, theme);
    
    const summary = `Jako ${profile.analysis.astrology?.sunSign?.name} z ascendentem w ${profile.analysis.astrology?.ascendant?.name}, Twoja ścieżka życia o numerze ${profile.analysis.numerology?.lifePathNumber} prowadzi Cię przez lekcje ${profile.analysis.humanDesign?.type}.`;
    styler.addWrappedText(summary, { x: this.MARGIN, y: 80, maxWidth: 180, lineHeight: 1.5, font: theme.fonts.body.family, size: theme.fonts.body.size, color: theme.colors.textPrimary, style: 'normal' });

    const appUrl = import.meta.env.VITE_APP_URL || 'https://cosmic-echoes.netlify.app';
    const publicProfileUrl = `${appUrl}/profile/${profile.id}`;

    try {
      const qrDataUrl = await QRCodeService.generateQRCode(publicProfileUrl, {
        size: 200,
        color: { dark: '#191970', light: '#FFFFFF' },
        margin: 2,
      });
      
      const qrSize = 60;
      pdf.addImage(qrDataUrl, 'PNG', (this.PAGE_WIDTH - qrSize) / 2, 120, qrSize, qrSize);
      pdf.setTextColor(...theme.colors.accent);
      pdf.textWithLink('Twój publiczny profil', this.PAGE_WIDTH / 2, 190, { align: 'center', url: publicProfileUrl });

    } catch (error) {
      console.error('Błąd generowania kodu QR:', error);
      pdf.setTextColor(255, 0, 0);
      pdf.text('Błąd generowania kodu QR.', this.PAGE_WIDTH / 2, 150, { align: 'center' });
    }
  }
}