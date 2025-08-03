import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Palette, Check, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sections = [
  { id: 'astro', icon: '♓', label: 'Astrologia' },
  { id: 'numerology', icon: '🔢', label: 'Numerologia' },
  { id: 'chinese', icon: '🐕', label: 'Zodiak Chiński' },
  { id: 'human-design', icon: '⚡', label: 'Human Design' },
  { id: 'mayan', icon: '🏛️', label: 'Majowie' },
  { id: 'guides', icon: '🌟', label: 'Przewodnicy' }
];

const themes = [
    { value: "theme-cosmic-default", label: "Cosmic Default" },
    { value: "theme-starlight", label: "Starlight" },
    { value: "theme-nebula", label: "Nebula" },
    { value: "theme-solar-flare", label: "Solar Flare" },
    { value: "theme-aurora", label: "Aurora" },
]

export function SmartNavigation() {
  const { progress, activeSection, scrollToSection } = useScrollProgress();
  const { theme, setTheme } = useTheme();

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
            className="h-1 bg-primary/20"
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
                      ? `bg-primary/20 text-primary border border-primary/30` 
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <span className="text-sm">{section.icon}</span>
                  <span className="hidden sm:inline text-xs">{section.label}</span>
                </Button>
              ))}
            </div>
            
            {/* Progress Indicator & Theme Switcher */}
            <div className="flex items-center gap-2">
              <Link to="/pricing" className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Ulepsz do Wizjonera
              </Link>

              <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                {Math.round(progress)}%
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Palette className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {themes.map((item) => (
                    <DropdownMenuItem key={item.value} onClick={() => setTheme(item.value as any)}>
                      <span className="flex-grow">{item.label}</span>
                      {theme === item.value && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Back to Top Button */}
              {progress > 10 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollToTop}
                  className="p-2"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer to prevent content overlap */}
      <div className="h-20"></div>
    </>
  );
}
