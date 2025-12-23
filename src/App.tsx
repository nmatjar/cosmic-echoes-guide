import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PublicProfile from "./pages/PublicProfile";
import { CouncilPage } from "./pages/CouncilPage";
import CouncilChat from "./pages/CouncilChat";
import Landing from "./pages/Landing";
import { CosmicWelcome } from "./components/CosmicWelcome";
import { CosmicLogin } from "./components/CosmicLogin";
import AuthPage from "./pages/AuthPage";
import { PricingPage } from "./pages/PricingPage";
import NeosGarden from "./pages/NeosGarden";
import { ProfileProvider, useProfile } from "./hooks/useProfile";
import { AdminExpertsPage } from "./pages/admin/AdminExpertsPage";
import { useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";

const queryClient = new QueryClient();

// A wrapper component to protect routes that require admin privileges
const ProtectedRoute = () => {
  const { currentProfile, isInitialized } = useProfile();
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!isInitialized || loading) {
    // Show a loading screen while we check auth status and initialize the profile
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cosmic-purple"></div>
      </div>
    );
  }

  if (!user) {
    // If not logged in, redirect to the new login page
    // Pass the original destination so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (currentProfile?.role !== 'admin') {
    // If logged in but not an admin, redirect to the home page
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // If all checks pass, render the admin page
};

const AppContent = () => {
  const {
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
  } = useProfile();

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

  // The main router logic
  return (
    <Routes>
      {/* Public and semi-public routes */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/profile/:profileId" element={<PublicProfile />} />
      <Route path="/pricing" element={<PricingPage onChooseFreePlan={handleChooseFreePlan} onChoosePaidPlan={handleChoosePaidPlan} />} />
      <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthSuccess} />} />
      <Route path="/welcome" element={<CosmicWelcome onProfileCreated={handleProfileCreated} />} />
      <Route path="/login" element={<CosmicLogin profiles={profiles} onProfileSelected={handleProfileSelected} onCreateNew={handleCreateNew} onDeleteProfile={handleDeleteProfile} />} />

      {/* Application core routes - protected by appState */}
      <Route 
        path="/" 
        element={appState === 'app' ? <Index currentProfile={currentProfile} onLogout={handleLogout} /> : <Navigate to="/landing" replace />}
      />
      <Route 
        path="/council" 
        element={appState === 'app' ? <CouncilPage currentProfile={currentProfile} /> : <Navigate to="/landing" replace />}
      />
      <Route 
        path="/council-chat" 
        element={appState === 'app' ? <CouncilChat /> : <Navigate to="/landing" replace />}
      />
      <Route 
        path="/neos-garden" 
        element={appState === 'app' ? <NeosGarden currentProfile={currentProfile} /> : <Navigate to="/landing" replace />}
      />

      {/* Protected Admin Route */}
      <Route path="/admin/experts" element={<ProtectedRoute />}>
        <Route index element={<AdminExpertsPage />} />
      </Route>

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
        <ThemeProvider defaultTheme="theme-cosmic-default" storageKey="cosmic-echoes-theme">
          <BrowserRouter>
            <ProfileProvider>
              <AppContent />
            </ProfileProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
