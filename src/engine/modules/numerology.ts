
import { AnalysisModule, AnalysisResult, BirthData } from "../types";

// Funkcja pomocnicza do redukcji liczby do pojedynczej cyfry
const reduceToSingleDigit = (num: number): number => {
  // Liczby mistrzowskie nie są redukowane
  if (num === 11 || num === 22 || num === 33) {
    return num;
  }
  let sum = num;
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    // Sprawdzenie po redukcji, czy nie uzyskaliśmy liczby mistrzowskiej
    if (sum === 11 || sum === 22 || sum === 33) {
      return sum;
    }
  }
  return sum;
};

// Główna funkcja obliczająca Drogę Życia
const calculateLifePathNumber = (date: Date): number => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() jest 0-indeksowane
  const year = date.getFullYear();

  const allDigits = `${day}${month}${year}`;
  const initialSum = allDigits
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);

  return reduceToSingleDigit(initialSum);
};

export interface NumerologyResult extends AnalysisResult {
  lifePathNumber: number;
}

export class NumerologyModule implements AnalysisModule {
  public name = 'numerology';

  public async calculate(birthData: BirthData): Promise<NumerologyResult> {
    const lifePathNumber = calculateLifePathNumber(birthData.date);
    
    return Promise.resolve({ lifePathNumber });
  }
}
