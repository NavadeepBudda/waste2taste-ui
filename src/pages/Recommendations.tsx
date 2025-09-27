import { HeroStrip } from "@/components/HeroStrip";
import { RecommendationFeed } from "@/components/RecommendationFeed";
import { useData } from "@/contexts/DataContext";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const Recommendations = () => {
  const { recommendationsData, isRecommendationsLoading, recommendationsError, refetchRecommendationsData } = useData();
  
  useEffect(() => {
    refetchRecommendationsData();
  }, [refetchRecommendationsData]);

  // Calculate swap opportunities based on returned data
  const swapOpportunities = (recommendationsData?.most_disliked_foods?.length || 0) * 2; // 2 recommendations per item

  // Show loading state until data is ready
  if (isRecommendationsLoading) {
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
  if (recommendationsError) {
    return (
      <div className="min-h-screen bg-background">
        <HeroStrip />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Recommendations</h3>
              <p className="text-foreground-muted">{recommendationsError}</p>
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
        {/* Ready to Accept Section */}
        <div className="mb-8">
          <div className="bg-gradient-card border border-card-border rounded-lg p-6 shadow-card">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm font-medium text-foreground-muted mb-1">Ready to Accept</p>
                <span className="text-3xl font-bold text-foreground tabular-nums">
                  {swapOpportunities}
                </span>
                <p className="text-sm text-foreground-muted mt-2">Recommendations ready for implementation</p>
              </div>
              <div className="w-2 h-2 bg-accent rounded-full opacity-60" />
            </div>
          </div>
        </div>
        
        {/* Full-width Recommendation Feed */}
        <RecommendationFeed />
      </div>
    </div>
  );
};

export default Recommendations;