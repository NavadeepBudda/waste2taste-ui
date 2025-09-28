import { FoodFrequencyData } from "@/types/api";
import { Badge } from "@/components/ui/badge";

interface PatternAnalysisProps {
  frequencyAnalysis: FoodFrequencyData[];
}

export function PatternAnalysis({ frequencyAnalysis }: PatternAnalysisProps) {
  if (!frequencyAnalysis.length) {
    return (
      <div className="text-center py-8">
        <p className="text-foreground-muted mb-2">No frequency data available</p>
        <p className="text-sm text-foreground-muted">
          Add disposal data to see frequency analysis
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-lg font-semibold text-foreground mb-6">
        Frequency Analysis ({frequencyAnalysis.length} foods)
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frequencyAnalysis.slice(0, 9).map((food, index) => (
          <div key={food.food_name} className="bg-surface/30 rounded-lg p-5 border border-border/50">
            <div className="flex items-start justify-between mb-4">
              <h5 className="font-medium text-foreground leading-tight">{food.food_name}</h5>
              <Badge variant="secondary" className="text-xs">
                #{index + 1}
              </Badge>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Frequency:</span>
                <span className="font-medium">{food.disposal_frequency} times</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Total waste:</span>
                <span className="font-medium">{food.total_mass_wasted.toFixed(1)} lbs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Avg per disposal:</span>
                <span className="font-medium">{food.avg_mass_per_disposal.toFixed(1)} lbs</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {frequencyAnalysis.length > 9 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-foreground-muted">
            Showing top 9 of {frequencyAnalysis.length} foods tracked
          </p>
        </div>
      )}
    </div>
  );
}