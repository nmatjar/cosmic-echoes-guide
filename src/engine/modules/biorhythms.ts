import { AnalysisModule, BirthData, BioRhythmAnalysis } from "../types";
import biorhythmData from "../data/biorhythms.json";

export class BioRhythmModule implements AnalysisModule {
  name: string = "biorhythms";

  async calculate(birthData: BirthData, targetDate?: Date): Promise<BioRhythmAnalysis> {
    const birthDate = birthData.date;
    const calculationDate = targetDate || new Date();

    // Calculate days since birth
    const diffTime = Math.abs(calculationDate.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const calculateCycle = (days: number, cycleLength: number) => {
      const cycle = Math.sin((2 * Math.PI * days) / cycleLength);
      let phase: string;
      let energy: string;

      if (cycle > 0.5) {
        phase = "high";
        energy = biorhythmData.phases.high;
      } else if (cycle < -0.5) {
        phase = "low";
        energy = biorhythmData.phases.low;
      } else if (cycle >= -0.1 && cycle <= 0.1) {
        phase = "critical";
        energy = biorhythmData.phases.critical;
      } else {
        phase = "medium";
        energy = biorhythmData.phases.medium;
      }
      return { cycle, phase, energy };
    };

    const physical = calculateCycle(diffDays, biorhythmData.cycleLengths.physical);
    const emotional = calculateCycle(diffDays, biorhythmData.cycleLengths.emotional);
    const intellectual = calculateCycle(diffDays, biorhythmData.cycleLengths.intellectual);

    return {
      physical: { cycle: physical.cycle, phase: physical.phase, energy: physical.energy },
      emotional: { cycle: emotional.cycle, phase: emotional.phase, energy: emotional.energy },
      intellectual: { cycle: intellectual.cycle, phase: intellectual.phase, energy: intellectual.energy },
    };
  }
}
