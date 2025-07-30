
import { AnalysisModule, BirthData, ComprehensiveAnalysis } from './types';
import { NumerologyModule } from './modules/numerology';
import { AstrologyModule } from './modules/astrology';
import { ChineseZodiacModule } from './modules/chineseZodiac';
import { HumanDesignModule } from './modules/humanDesign';
import { MayanModule } from './modules/mayan';
import { BioRhythmModule } from './modules/biorhythms';
import { ElementalBalanceModule } from './modules/elementalBalance';

export class AnalysisEngine {
  private modules: AnalysisModule[] = [];

  constructor() {
    this.registerModule(new NumerologyModule());
    this.registerModule(new AstrologyModule());
    this.registerModule(new ChineseZodiacModule());
    this.registerModule(new HumanDesignModule());
    this.registerModule(new MayanModule());
    this.registerModule(new BioRhythmModule());
    this.registerModule(new ElementalBalanceModule());
  }

  registerModule(module: AnalysisModule) {
    this.modules.push(module);
  }

  async runAnalysis(birthData: BirthData): Promise<ComprehensiveAnalysis> {
    const results: ComprehensiveAnalysis = {};

    for (const module of this.modules) {
      try {
        const result = await module.calculate(birthData);
        results[module.name as keyof ComprehensiveAnalysis] = result;
      } catch (error) {
        console.error(`Error calculating analysis for module: ${module.name}`, error);
      }
    }

    return results;
  }
}
