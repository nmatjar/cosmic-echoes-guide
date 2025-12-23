import { AnalysisModule, BirthData, HumanDesignAnalysis } from "../types";

const FUNCTION_PATH = "/api/calculate-human-design";

export class HumanDesignModule implements AnalysisModule {
  name: string = "humanDesign";

  async calculate(birthData: BirthData): Promise<HumanDesignAnalysis> {
    const { date, time, place } = birthData;

    try {
      const response = await fetch(FUNCTION_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthDate: date.toISOString().split('T')[0],
          birthTime: time,
          birthLocation: place,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`Błąd funkcji serwerowej: ${errorBody.error || response.statusText}`);
      }

      const data: HumanDesignAnalysis = await response.json();

      // Zwracamy dane otrzymane z naszej funkcji serwerowej
      return data;

    } catch (error) {
      console.error("Błąd podczas wywoływania funkcji Human Design:", error);
      // W przypadku błędu, zwracamy pusty lub domyślny obiekt, aby nie psuć reszty aplikacji
      return {
        type: "Błąd",
        profile: "Błąd",
        authority: "Błąd",
        centers: {},
        channels: {},
        gates: {},
      };
    }
  }
}