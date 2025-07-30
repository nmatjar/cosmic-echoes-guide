import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MayanModule } from './mayan';
import mayanData from '../data/mayan.json';

describe('MayanModule', () => {
  const mockBirthData = { date: new Date('2000-01-01T12:00:00Z') };

  // Store original Math.random
  const originalMathRandom = Math.random;

  beforeEach(() => {
    // Mock Math.random to return predictable values
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.1; // For sign (e.g., Biały Wiatr)
      if (callCount === 2) return 0.2; // For tone (e.g., 3)
      return 0; // Default for subsequent calls if any
    });
  });

  afterEach(() => {
    // Restore original Math.random after each test
    vi.restoreAllMocks();
  });

  it('should return a Mayan analysis with expected structure', async () => {
    const module = new MayanModule();
    const result = await module.calculate(mockBirthData);

    expect(result).toHaveProperty('sign');
    expect(result).toHaveProperty('tone');
  });

  it('should return values from the predefined lists', async () => {
    const module = new MayanModule();
    const result = await module.calculate(mockBirthData);

    expect(mayanData.signs).toContain(result.sign);
    expect(mayanData.tones).toContain(result.tone);
  });

  it('should return deterministic values based on mocked Math.random', async () => {
    const module = new MayanModule();
    const result = await module.calculate(mockBirthData);

    // Based on the mock implementation:
    // 0.1 * signs.length (20) = 2 -> floor = 2 (Niebieska Noc)
    // 0.2 * tones.length (13) = 2.6 -> floor = 2 (3)
    expect(result.sign).toBe(mayanData.signs[2]); // Niebieska Noc
    expect(result.tone).toBe(mayanData.tones[2]); // 3
  });
});