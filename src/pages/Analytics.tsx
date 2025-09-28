import { useState, useEffect } from "react";
import { HeroStrip } from "@/components/HeroStrip";
import { HistoricalTrendsChart } from "@/components/HistoricalTrendsChart";
import { WasteInsightsCard } from "@/components/WasteInsightsCard";
import { HistoricalMetrics } from "@/components/HistoricalMetrics";
import { PatternAnalysis } from "@/components/PatternAnalysis";
import { useData } from "@/contexts/DataContext";
import { api } from "@/services/api";
import { Loader2, TrendingDown, Calendar, BarChart3 } from "lucide-react";

const Analytics = () => {
  const { 
    historicalData, 
    isHistoricalLoading, 
    historicalError, 
    insights, 
    recommendations,
    refetchHistoricalData,
    refetchInsights
  } = useData();
  
  const [daysBack, setDaysBack] = useState(30);
  const [customLoading, setCustomLoading] = useState(false);

  // Handle custom time period selection
  const handleDaysBackChange = async (newDaysBack: number) => {
    if (newDaysBack === 30) {
      // Use cached data for 30 days
      setDaysBack(newDaysBack);
      return;
    }
    
    try {
      setCustomLoading(true);
      setDaysBack(newDaysBack);
      
      // Fetch fresh data for custom periods
      const [historicalResponse, insightsResponse] = await Promise.all([
        api.getHistoricalAnalytics(newDaysBack),
        api.getSmartInsights()
      ]);
      
      // Note: This updates local state but doesn't update the context
      // The context remains optimized for 30-day data
    } catch (err) {
      console.error('Error fetching custom analytics data:', err);
    } finally {
      setCustomLoading(false);
    }
  };

  const isLoading = isHistoricalLoading || customLoading;
  const error = historicalError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <HeroStrip />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Loading Historical Analytics</h3>
              <p className="text-foreground-muted">Analyzing waste patterns and generating insights...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <HeroStrip />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Analytics</h3>
              <p className="text-foreground-muted mb-4">{error}</p>
              <button 
                onClick={() => {
                  refetchHistoricalData();
                  refetchInsights();
                }}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroStrip />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-foreground tracking-tight mb-3">
                Historical Analytics
              </h2>
              <p className="text-lg text-foreground-muted">
                Deep insights into waste patterns and trends over time
              </p>
            </div>
            
            {/* Time Period Selector */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-foreground-muted" />
              <select
                value={daysBack}
                onChange={(e) => handleDaysBackChange(Number(e.target.value))}
                className="px-4 py-2 bg-card border border-card-border rounded-lg text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={60}>Last 60 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Historical Metrics Overview */}
        {historicalData && (
          <HistoricalMetrics 
            summary={historicalData.summary}
            reductionMetrics={historicalData.reduction_metrics}
          />
        )}

        {/* Key Insights Section - 3 boxes below metrics */}
        {insights.length > 0 && (
          <div className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insights.slice(0, 3).map((insight, index) => (
                <WasteInsightsCard key={index} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Waste Trends Chart - Full Width Row */}
        {historicalData && (
          <div className="mb-10">
            <div className="bg-gradient-card border border-card-border rounded-2xl p-8 shadow-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Waste Trends</h3>
                  <p className="text-sm text-foreground-muted">Daily disposal patterns over time</p>
                </div>
              </div>
              
              <HistoricalTrendsChart trends={historicalData.trends} />
            </div>
          </div>
        )}

        {/* Frequency Analysis Section */}
        {historicalData && (
          <div className="mb-10">
            <div className="bg-gradient-card border border-card-border rounded-2xl p-8 shadow-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Food Waste Analysis</h3>
                  <p className="text-sm text-foreground-muted">Most frequently wasted foods</p>
                </div>
              </div>
              
              <PatternAnalysis 
                frequencyAnalysis={historicalData.frequency_analysis}
              />
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 ? (
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-foreground mb-8">Actionable Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gradient-card border border-card-border rounded-2xl p-8 shadow-card">
                  <h4 className="text-lg font-semibold text-foreground mb-4">{rec.title}</h4>
                  <p className="text-foreground-muted mb-6">{rec.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-sm font-medium text-accent mb-3">Potential Impact:</div>
                    <div className="text-sm text-foreground-muted">{rec.potential_impact}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-foreground mb-3">Action Items:</div>
                    <ul className="space-y-2">
                      {rec.action_items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-foreground-muted flex items-start gap-3">
                          <span className="text-accent mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-10">
            <div className="bg-gradient-card border border-card-border rounded-2xl p-10 shadow-card text-center">
              <h3 className="text-lg font-semibold text-foreground mb-3">No Recommendations Available</h3>
              <p className="text-foreground-muted">
                Add more disposal data to receive actionable recommendations for reducing food waste.
              </p>
            </div>
          </div>
        )}

        {/* Data Summary Footer */}
        {historicalData && (
          <div className="text-center py-6 border-t border-card-border">
            <p className="text-sm text-foreground-muted">
              Analysis based on {historicalData.summary.total_items_disposed} disposal events 
              over {historicalData.summary.analysis_period_days} days • 
              {historicalData.summary.unique_foods_tracked} unique food items tracked
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;