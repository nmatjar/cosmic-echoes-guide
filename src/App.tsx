import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PublicProfile from "./pages/PublicProfile";
import CouncilChat from "./pages/CouncilChat";
import Landing from "./pages/Landing";
import { CosmicWelcome } from "./components/CosmicWelcome";
import { CosmicLogin } from "./components/CosmicLogin";
import { UserProfile } from "@/engine/userProfile";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/components/auth/AuthPage";
import { CloudProfileManager } from "@/services/cloudProfileManager";
import { useToast } from "@/hooks/use-toast";

import { getProfiles, createProfile, saveProfiles } from "@/services/profileManager";

const queryClient = new QueryClient();

type AppState = 'loading' | 'auth' | 'welcome' | 'login' | 'app';

// Component to handle main app logic
const AppContent = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Check if current route is a public route (no auth required)
  const isPublicRoute = location.pathname.startsWith('/profile/') || location.pathname === '/landing';

  // Handle auth state and profile loading
  useEffect(() => {
    // If it's a public route, skip app initialization and go directly to app state
    if (isPublicRoute) {
      setAppState('app');
      return;
    }

    if (authLoading) return;

    const initializeApp = async () => {
      if (user) {
        // User is authenticated - try to load cloud profile
        try {
          const cloudProfile = await CloudProfileManager.fetchUserProfile();
          if (cloudProfile) {
            setCurrentProfile(cloudProfile);
            setAppState('app');
          } else {
            // No cloud profile - check local profiles or go to welcome
            const localProfiles = getProfiles();
            if (localProfiles.length > 0) {
              setProfiles(localProfiles);
              setAppState('login');
            } else {
              setAppState('welcome');
            }
          }
        } catch (error) {
          console.error('Error loading cloud profile:', error);
          toast({
            title: "Błąd synchronizacji",
            description: "Nie udało się załadować profilu z chmury.",
            variant: "destructive",
          });
          // Fallback to local profiles
          const localProfiles = getProfiles();
          if (localProfiles.length > 0) {
            setProfiles(localProfiles);
            setAppState('login');
          } else {
            setAppState('welcome');
          }
        }
      } else {
        // Not authenticated - check for local profiles
        const localProfiles = getProfiles();
        if (localProfiles.length > 0) {
          setProfiles(localProfiles);
          setAppState('login'); // Show login for existing profiles
        } else {
          // New users - redirect to landing page
          window.location.href = '/landing';
          return;
        }
      }
    };

    // Add a small delay for better UX
    setTimeout(initializeApp, 1000);
  }, [user, authLoading, toast, isPublicRoute]);

  const handleProfileCreated = async (profile: UserProfile) => {
    // Save locally first
    const allProfiles = getProfiles();
    setProfiles(allProfiles);
    setCurrentProfile(profile);

    // If user is authenticated, sync to cloud
    if (user) {
      try {
        await CloudProfileManager.saveUserProfile(profile);
        toast({
          title: "Profil zsynchronizowany",
          description: "Twój profil został zapisany w chmurze.",
        });
      } catch (error) {
        console.error('Error syncing profile to cloud:', error);
        toast({
          title: "Błąd synchronizacji",
          description: "Profil zapisano lokalnie, ale nie udało się zsynchronizować z chmurą.",
          variant: "destructive",
        });
      }
    }

    setAppState('app');
  };

  const handleProfileSelected = async (profile: UserProfile) => {
    setCurrentProfile(profile);

    // If user is authenticated, sync selected profile to cloud
    if (user) {
      try {
        await CloudProfileManager.saveUserProfile(profile);
      } catch (error) {
        console.error('Error syncing profile to cloud:', error);
      }
    }

    setAppState('app');
  };

  const handleCreateNew = () => {
    setAppState('welcome');
  };

  const handleDeleteProfile = async (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    
    // If user is authenticated and this is the current profile, delete from cloud
    if (user && currentProfile?.id === profileId) {
      try {
        await CloudProfileManager.deleteUserProfile();
      } catch (error) {
        console.error('Error deleting profile from cloud:', error);
      }
    }

    if (profiles.length === 1) {
      setAppState('welcome');
    }
  };

  const handleLogout = async () => {
    if (user) {
      await signOut();
    }
    setCurrentProfile(null);
    setAppState(profiles.length > 0 ? 'login' : 'auth');
  };

  const handleAuthSuccess = () => {
    setAppState('loading'); // Trigger re-initialization
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cosmic-purple mx-auto mb-4"></div>
          <p className="text-cosmic-gold text-lg">Inicjalizacja CosmoFlow...</p>
        </div>
      </div>
    );
  }

  if (appState === 'auth') {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        </TooltipProvider>
      </QueryClientProvider>
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

  // Main app with routing - always render router for public profiles
  return (
    <Routes>
      <Route 
        path="/landing" 
        element={<Landing />} 
      />
      <Route 
        path="/" 
        element={
          <Index 
            currentProfile={currentProfile} 
            onLogout={handleLogout}
          />
        } 
      />
      <Route 
        path="/profile/:profileId" 
        element={<PublicProfile />} 
      />
      <Route 
        path="/council-chat" 
        element={<CouncilChat />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
