import { Button } from "@/components/ui/button";
import { 
  Home, 
  Waves, 
  Network, 
  BookOpen, 
  TreePine 
} from "lucide-react";

export type GardenView = "sanctuary" | "mirror" | "loom" | "library" | "mycelium";

interface GardenNavigationProps {
  activeView: GardenView;
  onViewChange: (view: GardenView) => void;
}

export const GardenNavigation = ({ activeView, onViewChange }: GardenNavigationProps) => {
  const navigationItems = [
    {
      id: "sanctuary" as GardenView,
      label: "Sanctuary",
      icon: Home,
      description: "Personal Center"
    },
    {
      id: "mirror" as GardenView,
      label: "Mirror Pool",
      icon: Waves,
      description: "Self Reflection"
    },
    {
      id: "loom" as GardenView,
      label: "The Loom",
      icon: Network,
      description: "Social Weaving"
    },
    {
      id: "library" as GardenView,
      label: "Library",
      icon: BookOpen,
      description: "Knowledge"
    },
    {
      id: "mycelium" as GardenView,
      label: "Mycelium",
      icon: TreePine,
      description: "Deep Connections"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-cosmic-purple/20 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-around items-center py-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-300 ${
                  isActive 
                    ? 'text-cosmic-gold bg-cosmic-purple/20 shadow-lg shadow-cosmic-purple/20' 
                    : 'text-cosmic-gold/60 hover:text-cosmic-gold hover:bg-cosmic-purple/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-cosmic-gold animate-pulse" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
