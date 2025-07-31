import { AnalysisModule, BirthData, MayanAnalysis } from "../types";
import mayanData from "../data/mayan.json";

// Funkcja do obliczenia liczby dni od daty bazowej kalendarza Majów
const getTzolkinDay = (date: Date): number => {
  // Data bazowa: 1 stycznia 2000 to 11 Ajaw (kin 60)
  // Inna data bazowa: 11 sierpnia 3114 p.n.e. (start Długiej Rachuby)
  // Użyjemy prostszej metody korelacji z datą gregoriańską.
  // Korelacja Goodmana-Martineza-Thompsona (GMT)
  // JDN (Julian Day Number) dla 11.08.-3113 (proleptyczny) to 584283
  
  // Obliczanie Julian Day Number (JDN) dla podanej daty
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;
  
  const jdn = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Liczba dni od startu Długiej Rachuby
  const daysSinceStart = jdn - 584283;

  return daysSinceStart;
};

export class MayanModule implements AnalysisModule {
  name: string = "mayan";

  async calculate(birthData: BirthData): Promise<MayanAnalysis> {
    const birthDate = new Date(birthData.date);

    const totalDays = getTzolkinDay(birthDate);

    // Kalendarz Tzolkin ma 260 dni
    const tzolkinCycleDay = totalDays % 260;

    // Obliczanie Tonu (1-13)
    const toneNumber = (tzolkinCycleDay % 13) + 1;
    
    // Obliczanie Znaku (0-19)
    // Kin 1 to 1 Imix. Imix to pozycja 0 w naszej tablicy.
    // Musimy dostosować, bo cykl tonów i znaków jest przesunięty.
    // Prosta korelacja: (totalDays + 3) % 13 + 1 dla tonu, (totalDays + 19) % 20 dla znaku
    const signIndex = (totalDays + 19) % 20;

    const signData = mayanData.signs[signIndex] || mayanData.signs[0];
    const toneData = mayanData.tones.find(t => t.number === toneNumber) || mayanData.tones[0];

    return {
      sign: signData.name,
      tone: toneData.number,
      // Można w przyszłości dodać więcej danych z plików json
    };
  }
}