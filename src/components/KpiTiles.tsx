import { TrendingUp, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

export function KpiTiles() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {/* Dishes Tracked - Quiet */}
      <Card className="p-6 bg-gradient-card border-card-border shadow-card hover:shadow-elevated transition-smooth">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground-muted font-medium tracking-wide uppercase">
              Dishes Tracked
            </p>
            <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">
              47
            </p>
          </div>
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <Target className="h-5 w-5 text-foreground-muted" />
          </div>
        </div>
      </Card>

      {/* Swap Opportunities - Accent */}
      <Card className="p-6 bg-gradient-card border-card-border shadow-card hover:shadow-elevated transition-smooth group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground-muted font-medium tracking-wide uppercase">
              Swap Opportunities
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-foreground tabular-nums">
                12
              </p>
              <span className="text-sm text-success font-medium">+3</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-smooth">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
        </div>
      </Card>
    </div>
  );
}