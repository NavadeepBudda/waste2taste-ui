import { RecommendationCard } from "@/components/RecommendationCard";
import { useData } from "@/contexts/DataContext";

export function RecommendationFeed() {
  const { recommendationsData } = useData();

  // First combine duplicate foods by name and sum their disposal masses
  const uniqueFoods = new Map();
  
  recommendationsData?.most_disliked_foods?.forEach((food) => {
    const foodName = food.food_name;
    
    if (!uniqueFoods.has(foodName)) {
      // First occurrence - create new entry
      uniqueFoods.set(foodName, {
        ...food,
        disposal_mass: food.disposal_mass
      });
    } else {
      // Duplicate found - combine disposal masses and keep the better rank (lower number)
      const existingFood = uniqueFoods.get(foodName);
      existingFood.disposal_mass += food.disposal_mass;
      existingFood.rank = Math.min(existingFood.rank, food.rank);
      
      // Update other fields if they're missing or if this entry has better data
      if (!existingFood.dish_summary && food.dish_summary) {
        existingFood.dish_summary = food.dish_summary;
      }
      
      // Merge alternative recipes if new ones are available
      if (food.alternative_recipes && food.alternative_recipes.length > 0) {
        if (!existingFood.alternative_recipes) {
          existingFood.alternative_recipes = [];
        }
        
        // Only add recipes that aren't already present (by name)
        const existingRecipeNames = new Set(existingFood.alternative_recipes.map(r => r.recipe_name));
        const uniqueNewRecipes = food.alternative_recipes.filter(recipe => !existingRecipeNames.has(recipe.recipe_name));
        existingFood.alternative_recipes = [...existingFood.alternative_recipes, ...uniqueNewRecipes];
      }
    }
  });

  const combinedFoods = Array.from(uniqueFoods.values()).sort((a, b) => a.rank - b.rank);

  // Map data according to API docs - UI Mapping for Better Options Page  
  const recommendations = combinedFoods?.map((item, index) => {
    // Calculate prep time based on recipe complexity as per docs
    const calculatePrepTime = (recipe) => {
      if (!recipe?.similar_ingredients) return "same";
      const complexity = recipe.similar_ingredients.length;
      if (complexity <= 4) return "-10 min";
      if (complexity <= 6) return "same";
      return "+5 min";
    };

    return {
      id: (index + 1).toString(),
      rank: index + 1,
      originalDish: item.food_name,
      name: item.food_name, // For compatibility with existing component
      station: "", // Removed keyword display
      reason: item.dish_summary,
      overlapPercentage: Math.floor(75 + Math.random() * 25), // Simulated
      hasConflict: false,
      
      // Option A - First alternative recipe
      swapA: {
        name: item.alternative_recipes?.[0]?.recipe_name || "No alternative",
        description: item.alternative_recipes?.[0]?.improvements || "",
        timeDelta: calculatePrepTime(item.alternative_recipes?.[0]),
        overlapItems: item.alternative_recipes?.[0]?.similar_ingredients || [],
        newItems: [], // Not provided by API
        ingredients: item.alternative_recipes?.[0]?.similar_ingredients || [],
        prepTime: calculatePrepTime(item.alternative_recipes?.[0]),
        popularity: item.alternative_recipes?.[0]?.estimated_popularity || 0
      },
      
      // Option B - Second alternative recipe  
      swapB: {
        name: item.alternative_recipes?.[1]?.recipe_name || "No alternative",
        description: item.alternative_recipes?.[1]?.improvements || "",
        timeDelta: calculatePrepTime(item.alternative_recipes?.[1]),
        overlapItems: item.alternative_recipes?.[1]?.similar_ingredients || [],
        newItems: [], // Not provided by API
        ingredients: item.alternative_recipes?.[1]?.similar_ingredients || [],
        prepTime: calculatePrepTime(item.alternative_recipes?.[1]),
        popularity: item.alternative_recipes?.[1]?.estimated_popularity || 0
      },
      
      dietary: Array.isArray(item.keywords)
        ? item.keywords
        : (item.keywords ? item.keywords.split(',').map((word: string) => word.trim()).filter(Boolean) : []),
    };
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-foreground tracking-tight mb-3">Better Options</h2>
        <p className="text-lg text-foreground-muted">
          Recommended swaps to reduce waste and improve satisfaction
        </p>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-8">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard
            key={recommendation.id}
            dish={recommendation}
            rank={index + 1}
          />
        ))}
      </div>
      
      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <div className="text-sm text-foreground-muted">No recommendations available</div>
        </div>
      )}
    </div>
  );
}