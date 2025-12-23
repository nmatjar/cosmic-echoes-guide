
export interface ThemeColors {
  primary: [number, number, number];
  secondary: [number, number, number];
  accent: [number, number, number];
  background: [number, number, number];
  textPrimary: [number, number, number];
  textSecondary: [number, number, number];
  cardBackground: [number, number, number];
  cardBorder: [number, number, number];
}

export interface ThemeFonts {
  title: { family: string; style: string; size: number };
  heading: { family: string; style: string; size: number };
  subheading: { family: string; style: string; size: number };
  body: { family: string; style: string; size: number };
  caption: { family: string; style: string; size: number };
}

export class ReportTheme {
  public colors: ThemeColors;
  public fonts: ThemeFonts;

  constructor(colors: ThemeColors, fonts: ThemeFonts) {
    this.colors = colors;
    this.fonts = fonts;
  }
}

export const defaultTheme = new ReportTheme(
  {
    primary: [75, 0, 130], // Cosmic Purple
    secondary: [255, 215, 0], // Gold
    accent: [0, 191, 255], // Deep Sky Blue
    background: [240, 240, 255], // Light Lavender
    textPrimary: [45, 45, 45],
    textSecondary: [100, 100, 100],
    cardBackground: [255, 255, 255],
    cardBorder: [220, 220, 220],
  },
  {
    title: { family: 'helvetica', style: 'bold', size: 36 },
    heading: { family: 'helvetica', style: 'bold', size: 22 },
    subheading: { family: 'helvetica', style: 'bold', size: 16 },
    body: { family: 'helvetica', style: 'normal', size: 12 },
    caption: { family: 'helvetica', style: 'italic', size: 10 },
  }
);
