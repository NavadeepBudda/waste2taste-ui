import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { ApiStatus } from "@/components/ApiStatus";
import heroImage from "@/assets/hero-dining.jpg";

export function HeroStrip() {
  return (
    <div className="relative h-14 bg-gradient-hero border-b border-border overflow-hidden">
      {/* Ambient background image */}
      <div 
        className="absolute inset-0 opacity-[0.03] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-pattern-dots opacity-50" style={{ backgroundSize: '20px 20px' }} />
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Brand moment + Navigation */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              What needs love at Lunch
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-foreground-muted">Live</span>
            </div>
          </div>
          
          <Navigation />
        </div>

        {/* Right: Service control and API status */}
        <div className="flex items-center gap-3">
          <ApiStatus />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-smooth"
          >
            North Dining Hall
            <ChevronDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}