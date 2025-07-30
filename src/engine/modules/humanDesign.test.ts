import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HumanDesignModule } from './humanDesign';
import humanDesignData from '../data/humanDesign.json';

describe('HumanDesignModule', () => {
  const mockBirthData = { date: new Date('2000-01-01T12:00:00Z') };

  // Store original Math.random
  const originalMathRandom = Math.random;

  beforeEach(() => {
    // Mock Math.random to return predictable values
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.1; // For type (e.g., Generator)
      if (callCount === 2) return 0.2; // For profile (e.g., 1/4)
      if (callCount === 3) return 0.3; // For authority (e.g., Emotional)
      return 0; // Default for subsequent calls if any
    });
  });

  afterEach(() => {
    // Restore original Math.random after each test
    vi.restoreAllMocks();
  });

  it('should return a Human Design analysis with expected structure', async () => {
    const module = new HumanDesignModule();
    const result = await module.calculate(mockBirthData);

    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('profile');
    expect(result).toHaveProperty('authority');
  });

  it('should return values from the predefined lists', async () => {
    const module = new HumanDesignModule();
    const result = await module.calculate(mockBirthData);

    expect(humanDesignData.types).toContain(result.type);
    expect(humanDesignData.profiles).toContain(result.profile);
    expect(humanDesignData.authorities).toContain(result.authority);
  });

  it('should return deterministic values based on mocked Math.random', async () => {
    const module = new HumanDesignModule();
    const result = await module.calculate(mockBirthData);

    // Based on the mock implementation:
    // 0.1 * types.length (4) = 0.4 -> floor = 0 (Generator)
    // 0.2 * profiles.length (11) = 2.2 -> floor = 2 (2/4)
    // 0.3 * authorities.length (6) = 1.8 -> floor = 1 (Sakralny)
    expect(result.type).toBe(humanDesignData.types[0]); // Generator
    expect(result.profile).toBe(humanDesignData.profiles[2]); // 2/4
    expect(result.authority).toBe(humanDesignData.authorities[1]); // Sakralny
  });
});