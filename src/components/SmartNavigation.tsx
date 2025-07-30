import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp } from "lucide-react";

const sections = [
  { id: 'astro', icon: '♓', label: 'Astrologia', color: 'cosmic-pink' },
  { id: 'numerology', icon: '🔢', label: 'Numerologia', color: 'cosmic-gold' },
  { id: 'chinese', icon: '🐕', label: 'Zodiak Chiński', color: 'cosmic-purple' },
  { id: 'human-design', icon: '⚡', label: 'Human Design', color: 'cosmic-teal' },
  { id: 'mayan', icon: '🏛️', label: 'Majowie', color: 'cosmic-blue' },
  { id: 'guides', icon: '🌟', label: 'Przewodnicy', color: 'cosmic-starlight' }
];

export function SmartNavigation() {
  const { progress, activeSection, scrollToSection } = useScrollProgress();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Fixed Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="container mx-auto px-4">
          {/* Progress Bar */}
          <Progress 
            value={progress} 
            className="h-1 bg-cosmic-purple/20"
          />
          
          {/* Navigation Items */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-300 ${
                    activeSection === section.id 
                      ? `bg-${section.color}/20 text-${section.color} border border-${section.color}/30` 
                      : 'hover:bg-cosmic-purple/10'
                  }`}
                >
                  <span className="text-sm">{section.icon}</span>
                  <span className="hidden sm:inline text-xs">{section.label}</span>
                </Button>
              ))}
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-cosmic-purple/20 border-cosmic-purple/30 text-cosmic-purple text-xs">
                {Math.round(progress)}%
              </Badge>
              
              {/* Back to Top Button */}
              {progress > 10 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollToTop}
                  className="p-2 bg-cosmic-gold/20 border-cosmic-gold/30 hover:bg-cosmic-gold/30 transition-all duration-300"
                >
                  <ArrowUp className="h-3 w-3 text-cosmic-gold" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer to prevent content overlap */}
      <div className="h-16"></div>
    </>
  );
}
