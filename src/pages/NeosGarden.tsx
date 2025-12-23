import { useState } from "react";
import { GardenNavigation } from "@/components/neos/GardenNavigation";
import { TheSanctuary } from "@/components/neos/TheSanctuary";
import { TheMirrorPool } from "@/components/neos/TheMirrorPool";
import { TheLoom } from "@/components/neos/TheLoom";
import { TheLibrary } from "@/components/neos/TheLibrary";
import { TheMycelium } from "@/components/neos/TheMycelium";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { UserProfile } from "@/engine/types";

export type GardenView = "sanctuary" | "mirror" | "loom" | "library" | "mycelium";

interface NeosGardenProps {
  currentProfile?: UserProfile;
}

const NeosGarden = ({ currentProfile }: NeosGardenProps) => {
  const [activeView, setActiveView] = useState<GardenView>("sanctuary");

  const renderView = () => {
    switch (activeView) {
      case "sanctuary":
        return <TheSanctuary currentProfile={currentProfile} />;
      case "mirror":
        return <TheMirrorPool currentProfile={currentProfile} />;
      case "loom":
        return <TheLoom currentProfile={currentProfile} />;
      case "library":
        return <TheLibrary currentProfile={currentProfile} />;
      case "mycelium":
        return <TheMycelium currentProfile={currentProfile} />;
      default:
        return <TheSanctuary currentProfile={currentProfile} />;
    }
  };

  return (
    <div className="neos-garden min-h-screen bg-gradient-cosmic font-inter">
      {/* Back to Cosmic Echoes link */}
      <Link 
        to="/" 
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-cosmic-purple/10 hover:bg-cosmic-purple/20 text-cosmic-gold transition-all duration-300 backdrop-blur-sm border border-cosmic-purple/20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Cosmic Echoes</span>
      </Link>

      {/* Quantum Presence Indicator */}
      {currentProfile && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-cosmic-purple/10 backdrop-blur-sm border border-cosmic-purple/20">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-cosmic-gold">Quantum Presence Active</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pb-24 px-4 md:px-8 pt-16">
        <div className="max-w-6xl mx-auto">
          {/* ARCĀNUM Field Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cosmic-gold to-cosmic-purple bg-clip-text text-transparent mb-2">
              NEOS Garden
            </h1>
            <p className="text-cosmic-gold/80 text-lg">
              Sacred Space for Potential Field Mapping
            </p>
            {currentProfile && (
              <p className="text-cosmic-purple/60 text-sm mt-2">
                Resonating with {currentProfile.name}'s field
              </p>
            )}
          </div>
          
          {renderView()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <GardenNavigation activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
};

export default NeosGarden;
