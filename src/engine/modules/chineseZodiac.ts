import { AnalysisModule, BirthData, ChineseZodiacAnalysis } from "../types";
import chineseZodiacData from "../data/chineseZodiac.json";

export class ChineseZodiacModule implements AnalysisModule {
  name: string = "chineseZodiac";

  async calculate(birthData: BirthData): Promise<ChineseZodiacAnalysis> {
    const birthYear = birthData.date.getFullYear();

    // Calculate animal
    const animalIndex = (birthYear - 4) % 12; // Chinese zodiac cycle starts with Rat in 1984, 1972, etc.
    const animal = chineseZodiacData.animals.find(a => a.yearOffset === animalIndex) || { name: "Nieznany", icon: "❔" };

    // Calculate element (based on last digit of the year)
    const lastDigit = birthYear % 10;
    let element = "Nieznany";

    if (lastDigit === 0 || lastDigit === 1) element = "Metal";
    else if (lastDigit === 2 || lastDigit === 3) element = "Woda";
    else if (lastDigit === 4 || lastDigit === 5) element = "Drewno";
    else if (lastDigit === 6 || lastDigit === 7) element = "Ogień";
    else if (lastDigit === 8 || lastDigit === 9) element = "Ziemia";

    return {
      animal: animal.name,
      icon: animal.icon,
      element,
    };
  }
}
