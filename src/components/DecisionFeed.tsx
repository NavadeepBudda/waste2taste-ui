import { DecisionCard } from "./DecisionCard";
import { useData } from "@/contexts/DataContext";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DecisionFeed() {
  const { todayData: dashboardData, isTodayLoading, todayError } = useData();

  if (todayError) {
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
            {todayError}
          </div>
        </div>
      </div>
    );
  }

  if (isTodayLoading) {
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

  // Create a Map to handle duplicates by food name and combine disposal masses
  const uniqueFoods = new Map();
  
  dashboardData?.most_disliked_foods?.forEach((food) => {
    const foodName = food.food_name;
    
    if (!uniqueFoods.has(foodName)) {
      // First occurrence - create new entry
      uniqueFoods.set(foodName, {
        rank: food.rank,
        dishName: foodName,
        description: food.description, // Pass the description
        station: food.dish_summary || "Kitchen", // Use dish_summary as station
        mass: food.disposal_mass,
        confidence: Math.floor(80 + Math.random() * 20), // Simulated confidence score
        isOutlier: food.rank <= 3, // Top 3 are outliers
        swapOptions: food.alternative_recipes?.map((recipe) => ({
          name: recipe.recipe_name,
          description: recipe.improvements, // This is the one-sentence description
          sharedIngredients: recipe.similar_ingredients?.length || 0,
          prep_time: recipe.prep_time
        })) || [],
        allergens: [], // Not provided by API
        equipment: [] // Not provided by API
      });
    } else {
      // Duplicate found - combine disposal masses and keep the better rank (lower number)
      const existingFood = uniqueFoods.get(foodName);
      existingFood.mass += food.disposal_mass;
      existingFood.rank = Math.min(existingFood.rank, food.rank);
      
      // Update other fields if they're missing or if this entry has better data
      if (!existingFood.description && food.description) {
        existingFood.description = food.description;
      }
      if (!existingFood.station || existingFood.station === "Kitchen") {
        existingFood.station = food.dish_summary || existingFood.station;
      }
      
      // Merge alternative recipes if new ones are available
      if (food.alternative_recipes && food.alternative_recipes.length > 0) {
        const newRecipes = food.alternative_recipes.map((recipe) => ({
          name: recipe.recipe_name,
          description: recipe.improvements,
          sharedIngredients: recipe.similar_ingredients?.length || 0,
          prep_time: recipe.prep_time
        }));
        
        // Only add recipes that aren't already present (by name)
        const existingRecipeNames = new Set(existingFood.swapOptions.map(r => r.name));
        const uniqueNewRecipes = newRecipes.filter(recipe => !existingRecipeNames.has(recipe.name));
        existingFood.swapOptions = [...existingFood.swapOptions, ...uniqueNewRecipes];
      }
      
      // Update outlier status based on new combined rank
      existingFood.isOutlier = existingFood.rank <= 3;
    }
  });

  const decisions = Array.from(uniqueFoods.values()).sort((a, b) => a.rank - b.rank);
  const maxMass = decisions.reduce((highest, decision) => Math.max(highest, decision.mass), 0) || 1;
  const hoursBack = dashboardData?.analysis_summary?.hours_back ?? 24;

  return (
    <div className="space-y-4">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-foreground tracking-tight">Decision Feed</h2>
          <p className="text-lg text-foreground-muted">
            Impact-ranked dishes driving avoidable waste. Prioritise actions for the next service window.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full border border-border/60 px-3 py-1 text-xs uppercase tracking-[0.28em]">
            Top {decisions.length} of {dashboardData?.analysis_summary?.total_foods_analyzed ?? decisions.length}
          </Badge>
          <Badge variant="secondary" className="rounded-full border border-border/60 px-3 py-1 text-xs uppercase tracking-[0.28em]">
            Last {hoursBack}h window
          </Badge>
        </div>
      </div>
      
      <div className="space-y-8">
        {decisions.map((decision, index) => (
          <DecisionCard key={index} {...decision} maxMass={maxMass} />
        ))}
      </div>

      {/* Ranking Explanation */}
      <div className="text-center py-4">
        <p className="text-sm text-foreground-muted">
          The number on the left of each item indicates its rank as the most disliked food, with '1' being the most disliked.
        </p>
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
