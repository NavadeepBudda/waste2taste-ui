import { TrendingUp, Target, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTodayData } from "@/hooks/useTodayData";

export function KpiTiles() {
  const { todayData, isLoading, error } = useTodayData(); // Use today's 24-hour data

  // Calculate metrics from today's analysis data
  const dishesTracked = todayData?.analysis_summary?.total_foods_analyzed || 0;
  const swapOpportunities = todayData?.analysis_summary?.most_disliked_count ? 
    todayData.analysis_summary.most_disliked_count * 2 : 0; // 2 recommendations per item

  if (error) {
    return (
      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-gradient-card border-card-border shadow-card">
          <div className="text-center text-foreground-muted">
            <p className="text-sm">Unable to load data</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-card border-card-border shadow-card">
          <div className="text-center text-foreground-muted">
            <p className="text-sm">Unable to load data</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

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
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                dishesTracked
              )}
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
            <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                swapOpportunities
              )}
            </p>
          </div>
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-smooth">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
        </div>
      </Card>
    </div>
  );
}