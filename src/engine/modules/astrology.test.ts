import { describe, it, expect } from 'vitest';
import { AstrologyModule } from './astrology';

describe('AstrologyModule', () => {
  it('should correctly calculate sun sign for Aries', async () => {
    const module = new AstrologyModule();
    const birthData = { date: new Date('2000-04-10T12:00:00Z') }; // April 10, 2000
    const result = await module.calculate(birthData);
    expect(result.sunSign.name).toBe('Baran');
    expect(result.sunSign.icon).toBe('♈');
  });

  it('should correctly calculate sun sign for Capricorn (cross-year)', async () => {
    const module = new AstrologyModule();
    const birthData = { date: new Date('2000-12-25T12:00:00Z') }; // December 25, 2000
    const result = await module.calculate(birthData);
    expect(result.sunSign.name).toBe('Koziorożec');
    expect(result.sunSign.icon).toBe('♑');
  });

  it('should correctly calculate sun sign for Aquarius', async () => {
    const module = new AstrologyModule();
    const birthData = { date: new Date('2001-01-25T12:00:00Z') }; // January 25, 2001
    const result = await module.calculate(birthData);
    expect(result.sunSign.name).toBe('Wodnik');
    expect(result.sunSign.icon).toBe('♒');
  });

  it('should return default for invalid date (e.g., before first sign)', async () => {
    const module = new AstrologyModule();
    const birthData = { date: new Date('2000-01-01T12:00:00Z') }; // January 1, 2000 (before Capricorn start)
    const result = await module.calculate(birthData);
    expect(result.sunSign.name).toBe('Koziorożec'); // Should default to Capricorn as it's the first sign in the data that wraps around
  });
});