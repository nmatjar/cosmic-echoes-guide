import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CosmicWelcome } from "./components/CosmicWelcome";
import { CosmicLogin } from "./components/CosmicLogin";
import { UserProfile } from "@/engine/userProfile";

import { getProfiles, createProfile } from "@/services/profileManager";

const queryClient = new QueryClient();

type AppState = 'loading' | 'welcome' | 'login' | 'app';

const App = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);

  // Load profiles from localStorage on app start
  useEffect(() => {
    const loadProfiles = () => {
      const savedProfiles = getProfiles();
      if (savedProfiles.length > 0) {
        setProfiles(savedProfiles);
        setAppState('login');
      } else {
        setAppState('welcome');
      }
    };

    // Simulate loading
    setTimeout(loadProfiles, 1000);
  }, []);

  const handleProfileCreated = (profile: UserProfile) => {
    // The profile is already created and saved by profileManager
    // We just need to update the state
    const allProfiles = getProfiles();
    setProfiles(allProfiles);
    setCurrentProfile(profile);
    setAppState('app');
  };

  const handleProfileSelected = (profile: UserProfile) => {
    setCurrentProfile(profile);
    setAppState('app');
  };

  const handleCreateNew = () => {
    setAppState('welcome');
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    if (profiles.length === 1) {
      setAppState('welcome');
    }
  };

  const handleLogout = () => {
    setCurrentProfile(null);
    setAppState(profiles.length > 0 ? 'login' : 'welcome');
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cosmic-purple mx-auto mb-4"></div>
          <p className="text-cosmic-gold text-lg">Ładowanie Kosmicznego Portretu...</p>
        </div>
      </div>
    );
  }

  if (appState === 'welcome') {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CosmicWelcome onProfileCreated={handleProfileCreated} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (appState === 'login') {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CosmicLogin 
            profiles={profiles}
            onProfileSelected={handleProfileSelected}
            onCreateNew={handleCreateNew}
            onDeleteProfile={handleDeleteProfile}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Main app with current profile
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <Index 
                  currentProfile={currentProfile} 
                  onLogout={handleLogout}
                />
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
