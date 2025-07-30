
import { UserProfile } from '@/engine/userProfile';
import { v4 as uuidv4 } from 'uuid';

const PROFILES_STORAGE_KEY = 'cosmic-echoes-profiles';

// Pobiera wszystkie profile z localStorage
export const getProfiles = (): UserProfile[] => {
  try {
    const profilesJson = localStorage.getItem(PROFILES_STORAGE_KEY);
    return profilesJson ? JSON.parse(profilesJson) : [];
  } catch (error) {
    console.error("Error getting profiles from localStorage", error);
    return [];
  }
};

// Zapisuje wszystkie profile do localStorage
export const saveProfiles = (profiles: UserProfile[]): void => {
  try {
    const profilesJson = JSON.stringify(profiles);
    localStorage.setItem(PROFILES_STORAGE_KEY, profilesJson);
  } catch (error) {
    console.error("Error saving profiles to localStorage", error);
  }
};

// Tworzy nowy profil i go zwraca
export const createProfile = (
  name: string, 
  birthDate: Date, 
  analysis: any, 
  pin: string,
  time?: string,
  place?: string
): UserProfile => {
  const newProfile: UserProfile = {
    id: uuidv4(),
    name,
    birthData: {
      date: birthDate.toISOString(),
      time,
      place,
    },
    analysis,
    pin,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const profiles = getProfiles();
  profiles.push(newProfile);
  saveProfiles(profiles);

  return newProfile;
};

// Aktualizuje istniejący profil
export const updateProfile = (updatedProfile: UserProfile): void => {
  let profiles = getProfiles();
  profiles = profiles.map(p => 
    p.id === updatedProfile.id ? { ...updatedProfile, updatedAt: new Date().toISOString() } : p
  );
  saveProfiles(profiles);
};

// Usuwa profil
export const deleteProfile = (profileId: string): void => {
  let profiles = getProfiles();
  profiles = profiles.filter(p => p.id !== profileId);
  saveProfiles(profiles);
};
