import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/engine/userProfile';
import { useAuth } from '@/hooks/useAuth';
import { CloudProfileManager } from '@/services/cloudProfileManager';
import { getProfiles, setActiveProfileId, getActiveProfileId } from '@/services/profileManager';
import { useToast } from '@/hooks/use-toast';

type AppState = 'loading' | 'auth' | 'welcome' | 'login' | 'app' | 'pricing';

interface ProfileContextType {
  appState: AppState;
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  isInitialized: boolean; // To prevent re-initialization
  handleProfileCreated: (profile: UserProfile) => Promise<void>;
  handleProfileSelected: (profile: UserProfile) => Promise<void>;
  handleCreateNew: () => void;
  handleDeleteProfile: (profileId: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleAuthSuccess: () => void;
  handleChooseFreePlan: () => void; // Added for PricingPage
  handleChoosePaidPlan: () => void; // Added for PricingPage
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false); // Our new state to prevent race conditions

  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate(); // Get navigate instance

  useEffect(() => {
    // This effect should only run ONCE to initialize the app state.
    // The isInitialized flag prevents it from re-running on navigation or other re-renders.
    if (authLoading || isInitialized) return;

    const initializeApp = async () => {
      if (user) {
        try {
          const cloudProfile = await CloudProfileManager.fetchUserProfile();
          if (cloudProfile) {
            setCurrentProfile(cloudProfile);
            setAppState('app');
          } else {
            const localProfiles = getProfiles();
            if (localProfiles.length > 0) {
              // If user is logged in but has no cloud profile, they might have local ones.
              // We show the login screen to let them choose which one to sync.
              setProfiles(localProfiles);
              setAppState('login');
            } else {
              setAppState('welcome');
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          toast({ title: "Błąd ładowania profilu", variant: "destructive" });
          setAppState('welcome');
        }
      } else {
        const localProfiles = getProfiles();
        if (localProfiles.length > 0) {
          const activeId = getActiveProfileId();
          if (activeId) {
            const activeProfile = localProfiles.find(p => p.id === activeId);
            if (activeProfile) {
              setCurrentProfile(activeProfile);
              setProfiles(localProfiles);
              setAppState('app');
            } else {
              // Active ID is stale, clear it and go to login
              setActiveProfileId(null);
              setProfiles(localProfiles);
              setAppState('login');
            }
          } else {
            setProfiles(localProfiles);
            setAppState('login');
          }
        } else {
          setAppState('welcome'); // New users go to create a profile
        }
      }
      // Mark initialization as complete.
      setIsInitialized(true);
    };

    initializeApp();
  }, [user, authLoading, isInitialized, toast]);

  const handleProfileCreated = async (profile: UserProfile) => {
    // Ensure new profiles from welcome page are marked as free plan
    const profileWithPlan = { ...profile, subscriptionPlan: 'free' };
    setProfiles(getProfiles()); // Re-fetch all profiles to ensure latest is included
    setCurrentProfile(profileWithPlan);
    setActiveProfileId(profileWithPlan.id); // Set active profile
    if (user) {
      await CloudProfileManager.saveUserProfile(profileWithPlan);
    }
    setAppState('app');
    navigate('/'); // Navigate to dashboard
  };

  const handleProfileSelected = async (profile: UserProfile) => {
    setCurrentProfile(profile);
    setActiveProfileId(profile.id); // Set active profile
    if (user) {
      await CloudProfileManager.saveUserProfile(profile);
    }
    setAppState('app');
    navigate('/'); // Navigate to dashboard
  };

  const handleCreateNew = () => {
    setActiveProfileId(null); // Clear active profile when starting fresh
    setAppState('welcome');
    navigate('/welcome'); // Navigate to welcome page
  };

  const handleDeleteProfile = async (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    if (getActiveProfileId() === profileId) {
      setActiveProfileId(null); // Clear active ID if it was the one deleted
    }
    if (user && currentProfile?.id === profileId) {
      await CloudProfileManager.deleteUserProfile();
    }
    if (profiles.length <= 1) {
      setAppState('welcome');
      navigate('/welcome'); // Navigate to welcome if no profiles left
    }
  };

  const handleLogout = async () => {
    if (user) await signOut();
    setCurrentProfile(null);
    setProfiles([]);
    setActiveProfileId(null); // Clear active profile on logout
    setIsInitialized(false); // Allow re-initialization on next login
    setAppState('pricing'); // Redirect to pricing after logout
    navigate('/pricing'); // Navigate to pricing page
  };

  const handleAuthSuccess = () => {
    setIsInitialized(false); // Allow re-initialization after auth
    setAppState('loading'); // Trigger re-initialization to load cloud profile
    navigate('/'); // Navigate to dashboard
  };

  const handleChooseFreePlan = () => {
    setAppState('welcome');
    navigate('/welcome');
  };

  const handleChoosePaidPlan = () => {
    setAppState('auth');
    navigate('/auth');
  };

  const value = {
    appState,
    profiles,
    currentProfile,
    isInitialized,
    handleProfileCreated,
    handleProfileSelected,
    handleCreateNew,
    handleDeleteProfile,
    handleLogout,
    handleAuthSuccess,
    handleChooseFreePlan,
    handleChoosePaidPlan,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
