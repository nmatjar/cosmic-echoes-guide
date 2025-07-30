import { describe, it, expect } from 'vitest';
import { BioRhythmModule } from './biorhythms';

describe('BioRhythmModule', () => {
  // Test date: January 1, 2000 (arbitrary fixed date for consistent calculation)
  const birthDate = new Date('2000-01-01T00:00:00Z');

  it('should calculate bio-rhythms with expected structure', async () => {
    const module = new BioRhythmModule();
    const birthData = { date: birthDate };
    const result = await module.calculate(birthData);

    expect(result).toHaveProperty('physical');
    expect(result).toHaveProperty('emotional');
    expect(result).toHaveProperty('intellectual');

    expect(result.physical).toHaveProperty('cycle');
    expect(result.physical).toHaveProperty('phase');
    expect(result.physical).toHaveProperty('energy');
  });

  // Note: Exact cycle values depend on the current date relative to birthDate.
  // These tests will check for general phase correctness based on typical cycle behavior.
  // For precise testing, one would mock the current date or calculate expected values for a fixed date.

  it('should return a valid phase and energy description for physical cycle', async () => {
    const module = new BioRhythmModule();
    const birthData = { date: birthDate };
    const result = await module.calculate(birthData);

    expect(['high', 'medium', 'low', 'critical']).toContain(result.physical.phase);
    expect(typeof result.physical.energy).toBe('string');
  });

  it('should return a valid phase and energy description for emotional cycle', async () => {
    const module = new BioRhythmModule();
    const birthData = { date: birthDate };
    const result = await module.calculate(birthData);

    expect(['high', 'medium', 'low', 'critical']).toContain(result.emotional.phase);
    expect(typeof result.emotional.energy).toBe('string');
  });

  it('should return a valid phase and energy description for intellectual cycle', async () => {
    const module = new BioRhythmModule();
    const birthData = { date: birthDate };
    const result = await module.calculate(birthData);

    expect(['high', 'medium', 'low', 'critical']).toContain(result.intellectual.phase);
    expect(typeof result.intellectual.energy).toBe('string');
  });
});