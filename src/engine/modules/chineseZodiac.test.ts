import { describe, it, expect } from 'vitest';
import { ChineseZodiacModule } from './chineseZodiac';

describe('ChineseZodiacModule', () => {
  it('should correctly calculate animal for a Rat year', async () => {
    const module = new ChineseZodiacModule();
    const birthData = { date: new Date('2020-01-01T12:00:00Z') }; // Year of the Rat
    const result = await module.calculate(birthData);
    expect(result.animal).toBe('Szczur');
    expect(result.icon).toBe('🐀');
  });

  it('should correctly calculate animal for an Ox year', async () => {
    const module = new ChineseZodiacModule();
    const birthData = { date: new Date('2021-01-01T12:00:00Z') }; // Year of the Ox
    const result = await module.calculate(birthData);
    expect(result.animal).toBe('Wół');
    expect(result.icon).toBe('🐂');
  });

  it('should correctly calculate element for a Metal year (ending in 0)', async () => {
    const module = new ChineseZodiacModule();
    const birthData = { date: new Date('2020-01-01T12:00:00Z') }; // Year ending in 0 (Metal)
    const result = await module.calculate(birthData);
    expect(result.element).toBe('Metal');
  });

  it('should correctly calculate element for a Water year (ending in 2)', async () => {
    const module = new ChineseZodiacModule();
    const birthData = { date: new Date('2022-01-01T12:00:00Z') }; // Year ending in 2 (Water)
    const result = await module.calculate(birthData);
    expect(result.element).toBe('Woda');
  });

  it('should correctly calculate element for a Wood year (ending in 4)', async () => {
    const module = new ChineseZodiacModule();
    const birthData = { date: new Date('2024-01-01T12:00:00Z') }; // Year ending in 4 (Wood)
    const result = await module.calculate(birthData);
    expect(result.element).toBe('Drewno');
  });

  it('should correctly calculate element for a Fire year (ending in 6)', async () => {
    const module = new ChineseZodiacModule();
    const birthData = { date: new Date('2026-01-01T12:00:00Z') }; // Year ending in 6 (Fire)
    const result = await module.calculate(birthData);
    expect(result.element).toBe('Ogień');
  });

  it('should correctly calculate element for an Earth year (ending in 8)', async () => {
    const module = new ChineseZodiacModule();
    const birthData = { date: new Date('2028-01-01T12:00:00Z') }; // Year ending in 8 (Earth)
    const result = await module.calculate(birthData);
    expect(result.element).toBe('Ziemia');
  });
});