import { AnalysisModule, BirthData, ElementalBalanceAnalysis } from "../types";
import elementalData from "../data/elementalBalance.json";
import astrologyData from "../data/astrology.json";
import chineseZodiacData from "../data/chineseZodiac.json";

export class ElementalBalanceModule implements AnalysisModule {
  name: string = "elementalBalance";

  async calculate(birthData: BirthData): Promise<ElementalBalanceAnalysis> {
    const birthDate = birthData.date;
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1; // 1-12
    const day = birthDate.getDate();

    const elementalScores: { [key: string]: number } = {
      "Drewno": 0,
      "Ogień": 0,
      "Ziemia": 0,
      "Metal": 0,
      "Woda": 0,
    };

    // 1. Influence from Chinese Zodiac (Year Element)
    const lastDigit = year % 10;
    let chineseYearElement = "Nieznany";
    if (lastDigit === 0 || lastDigit === 1) chineseYearElement = "Metal";
    else if (lastDigit === 2 || lastDigit === 3) chineseYearElement = "Woda";
    else if (lastDigit === 4 || lastDigit === 5) chineseYearElement = "Drewno";
    else if (lastDigit === 6 || lastDigit === 7) chineseYearElement = "Ogień";
    else if (lastDigit === 8 || lastDigit === 9) chineseYearElement = "Ziemia";

    if (elementalScores[chineseYearElement] !== undefined) {
      elementalScores[chineseYearElement] += 2; // Strong influence
    }

    // 2. Influence from Western Astrology (Sun Sign Element)
    let sunSignElement = "Nieznany";
    for (const sign of astrologyData.sunSigns) {
      let startDate = new Date(year, sign.startMonth - 1, sign.startDay);
      let endDate = new Date(year, sign.endMonth - 1, sign.endDay);

      // Handle signs that cross year boundaries (e.g., Capricorn: Dec 22 - Jan 19)
      if (sign.startMonth > sign.endMonth) {
        // If the birth date is in the "earlier" part of the cross-year sign (e.g., Jan for Capricorn)
        // then the start date should be in the previous year.
        if (month < sign.startMonth) {
          startDate = new Date(year - 1, sign.startMonth - 1, sign.startDay);
        } else {
          // If the birth date is in the "later" part of the cross-year sign (e.g., Dec for Capricorn)
          // then the end date should be in the next year.
          endDate = new Date(year + 1, sign.endMonth - 1, sign.endDay);
        }
      }

      const birthMoment = new Date(year, month - 1, day);

      if (birthMoment >= startDate && birthMoment <= endDate) {
        const mappedElement = (elementalData.elementalMappings.astrology as any)[sign.name];
        if (mappedElement) {
          sunSignElement = mappedElement;
        }
        break;
      }
    }

    if (elementalScores[sunSignElement] !== undefined) {
      elementalScores[sunSignElement] += 1; // Moderate influence
    }

    // Determine dominant and weak elements
    let maxScore = -1;
    let minScore = Infinity;
    let dominantElements: string[] = [];
    let weakElements: string[] = [];

    for (const element in elementalScores) {
      if (elementalScores[element] > maxScore) {
        maxScore = elementalScores[element];
        dominantElements = [element];
      } else if (elementalScores[element] === maxScore) {
        dominantElements.push(element);
      }

      if (elementalScores[element] < minScore) {
        minScore = elementalScores[element];
        weakElements = [element];
      } else if (elementalScores[element] === minScore) {
        weakElements.push(element);
      }
    }

    dominantElements.sort();
    weakElements.sort();

    return {
      fire: elementalScores["Ogień"],
      earth: elementalScores["Ziemia"],
      metal: elementalScores["Metal"],
      water: elementalScores["Woda"],
      wood: elementalScores["Drewno"],
      dominantElements,
      weakElements,
    };
  }
}
