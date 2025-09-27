import { HeroStrip } from "@/components/HeroStrip";
import { KpiTiles } from "@/components/KpiTiles";
import { RecommendationFeed } from "@/components/RecommendationFeed";
import { RecommendationActionDock } from "@/components/RecommendationActionDock";
import { useRecommendationsData } from "@/hooks/useRecommendationsData";
import { Loader2 } from "lucide-react";

const Recommendations = () => {
  const { recommendationsData, isLoading, error } = useRecommendationsData();

  // Calculate swap opportunities based on returned data
  const swapOpportunities = (recommendationsData?.most_disliked_foods?.length || 0) * 2; // 2 recommendations per item

  // Show loading state until data is ready
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <HeroStrip />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Loading Better Options</h3>
              <p className="text-foreground-muted">Analyzing food waste data and generating recommendations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <HeroStrip />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Recommendations</h3>
              <p className="text-foreground-muted">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Strip */}
      <HeroStrip />
      
      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Tiles - Different metrics for recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
          <div className="bg-gradient-card border border-card-border rounded-lg p-6 shadow-card">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm font-medium text-foreground-muted mb-1">Swap Opportunities</p>
                <span className="text-3xl font-bold text-foreground tabular-nums">
                  {swapOpportunities}
                </span>
              </div>
              <div className="w-2 h-2 bg-accent rounded-full opacity-60" />
            </div>
          </div>
        </div>
        
        {/* Two-column layout: Recommendation Feed + Action Dock */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left 8 columns: Recommendation Feed */}
          <div className="col-span-12 lg:col-span-8">
            <RecommendationFeed />
          </div>
          
          {/* Right 4 columns: Action Dock */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-8">
              <RecommendationActionDock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;