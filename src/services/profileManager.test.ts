import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getProfiles, saveProfiles, createProfile, updateProfile, deleteProfile } from './profileManager';
import { UserProfile } from '@/engine/userProfile';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock uuidv4
vi.mock('uuid', () => {
  let callCount = 0;
  return {
    v4: () => `mock-uuid-${++callCount}`,
  };
});

describe('profileManager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('getProfiles should return an empty array if no profiles exist', () => {
    expect(getProfiles()).toEqual([]);
  });

  it('saveProfiles should save profiles to localStorage', () => {
    const profiles: UserProfile[] = [
      {
        id: 'test-id-1',
        name: 'Test User 1',
        birthData: { date: new Date().toISOString() },
        analysis: { numerology: { lifePathNumber: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    saveProfiles(profiles);
    expect(localStorage.getItem('cosmic-echoes-profiles')).toEqual(JSON.stringify(profiles));
  });

  it('createProfile should add a new profile and save it', () => {
    const initialProfiles = getProfiles();
    expect(initialProfiles.length).toBe(0);

    const newProfile = createProfile('New User', new Date(), { numerology: { lifePathNumber: 5 } });

    expect(newProfile.name).toBe('New User');
    expect(newProfile.id).toBe('mock-uuid-1');

    const updatedProfiles = getProfiles();
    expect(updatedProfiles.length).toBe(1);
    expect(updatedProfiles[0].name).toBe('New User');
    expect(updatedProfiles[0].analysis.numerology.lifePathNumber).toBe(5);
  });

  it('updateProfile should modify an existing profile', () => {
    const profile1 = createProfile('User One', new Date(), { numerology: { lifePathNumber: 1 } });
    const profile2 = createProfile('User Two', new Date(), { numerology: { lifePathNumber: 2 } });

    const updatedName = 'Updated User One';
    const updatedProfile = { ...profile1, name: updatedName };
    updateProfile(updatedProfile);

    const profiles = getProfiles();
    expect(profiles.length).toBe(2);
    const foundProfile = profiles.find(p => p.id === profile1.id);
    expect(foundProfile?.name).toBe(updatedName);
  });

  it('deleteProfile should remove a profile', () => {
    const profile1 = createProfile('User One', new Date(), { numerology: { lifePathNumber: 1 } });
    const profile2 = createProfile('User Two', new Date(), { numerology: { lifePathNumber: 2 } });

    expect(getProfiles().length).toBe(2);

    deleteProfile(profile1.id);

    const profiles = getProfiles();
    expect(profiles.length).toBe(1);
    expect(profiles[0].name).toBe('User Two');
  });
});