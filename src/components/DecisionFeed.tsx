import { DecisionCard } from "./DecisionCard";
import { useTodayData } from "@/hooks/useTodayData";
import { Loader2 } from "lucide-react";

export function DecisionFeed() {
  const { todayData: dashboardData, isLoading, error } = useTodayData(); // Use today's 24-hour data

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Decision Feed</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-sm text-foreground-muted">
            Unable to load decision feed data
          </div>
          <div className="text-xs text-foreground-muted mt-2">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Decision Feed</h2>
          <div className="text-sm text-foreground-muted">
            Loading disposal risks...
          </div>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Create a Map to handle duplicates by food name
  const uniqueFoods = new Map();
  
  dashboardData?.most_disliked_foods?.forEach((food) => {
    if (!uniqueFoods.has(food.food_name)) {
      uniqueFoods.set(food.food_name, {
        rank: food.rank,
        dishName: food.food_name,
        station: food.keywords?.[0] || "Kitchen", // Use first keyword as station
        mass: food.disposal_mass,
        confidence: Math.floor(80 + Math.random() * 20), // Simulated confidence score
        isOutlier: food.rank <= 3, // Top 3 are outliers
        swapOptions: food.alternative_recipes?.map((recipe) => ({
          name: recipe.recipe_name,
          description: recipe.improvements, // This is the one-sentence description
          sharedIngredients: recipe.similar_ingredients?.length || 0
        })) || [],
        allergens: [], // Not provided by API
        equipment: [] // Not provided by API
      });
    }
  });

  const decisions = Array.from(uniqueFoods.values()).sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Decision Feed</h2>
        <div className="text-sm text-foreground-muted">
          Showing top disposal risks
        </div>
      </div>
      
      <div className="space-y-3">
        {decisions.map((decision, index) => (
          <DecisionCard key={index} {...decision} />
        ))}
      </div>
      
      {/* Load more indicator */}
      {decisions.length > 0 && (
        <div className="text-center py-8">
          <div className="text-sm text-foreground-muted">
            Continue scrolling to see remaining {Math.max(0, (dashboardData?.analysis_summary?.total_foods_analyzed || 0) - decisions.length)} dishes
          </div>
          <div className="w-12 h-1 bg-gradient-accent rounded-full mx-auto mt-2" />
        </div>
      )}
    </div>
  );
}