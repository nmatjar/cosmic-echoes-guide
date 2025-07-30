import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CosmicCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "mystical" | "stellar" | "aurora";
}

export function CosmicCard({ children, className, variant = "default" }: CosmicCardProps) {
  const variants = {
    default: "bg-card shadow-cosmic border border-border/20",
    mystical: "bg-gradient-mystical shadow-mystical border border-cosmic-pink/20",
    stellar: "bg-gradient-stellar shadow-cosmic border border-cosmic-blue/20", 
    aurora: "bg-gradient-aurora shadow-glow border border-cosmic-gold/20"
  };

  return (
    <div className={cn(
      "rounded-lg p-6 backdrop-blur-sm",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}