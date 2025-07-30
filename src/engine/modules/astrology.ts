import { AnalysisModule, BirthData, AstrologyAnalysis } from "../types";
import astrologyData from "../data/astrology.json";

export class AstrologyModule implements AnalysisModule {
  name: string = "astrology";

  async calculate(birthData: BirthData): Promise<AstrologyAnalysis> {
    const birthDate = birthData.date;
    const month = birthDate.getMonth() + 1; // getMonth() returns 0-11
    const day = birthDate.getDate();

    let sunSign = { name: "Nieznany", icon: "❔" };

    const currentYear = birthDate.getFullYear();
    const currentMonth = birthDate.getMonth() + 1; // 1-12
    const currentDay = birthDate.getDate();

    for (const sign of astrologyData.sunSigns) {
      // Create dates for the current year to compare
      let startDate = new Date(currentYear, sign.startMonth - 1, sign.startDay);
      let endDate = new Date(currentYear, sign.endMonth - 1, sign.endDay);

      // Handle signs that cross year boundaries (e.g., Capricorn: Dec 22 - Jan 19)
      if (sign.startMonth > sign.endMonth) {
        // If the birth date is in the "earlier" part of the cross-year sign (e.g., Jan for Capricorn)
        // then the start date should be in the previous year.
        if (currentMonth < sign.startMonth) {
          startDate = new Date(currentYear - 1, sign.startMonth - 1, sign.startDay);
        } else {
          // If the birth date is in the "later" part of the cross-year sign (e.g., Dec for Capricorn)
          // then the end date should be in the next year.
          endDate = new Date(currentYear + 1, sign.endMonth - 1, sign.endDay);
        }
      }

      const birthMoment = new Date(currentYear, currentMonth - 1, currentDay);

      if (birthMoment >= startDate && birthMoment <= endDate) {
        sunSign = { name: sign.name, icon: sign.icon };
        break;
      }
    }

    return {
      sunSign,
    };
  }
}
