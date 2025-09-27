import { RecommendationCard } from "@/components/RecommendationCard";
import { useData } from "@/contexts/DataContext";

export function RecommendationFeed() {
  const { recommendationsData } = useData();

  // Map data according to API docs - UI Mapping for Better Options Page
  const recommendations = recommendationsData?.most_disliked_foods?.map((item, index) => {
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
      station: item.keywords?.[1] || item.keywords?.[0] || "General", // Use second keyword as category per docs
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
      
      dietary: item.keywords || []
    };
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Better Options for Lunch</h2>
          <p className="text-foreground-muted">
            Recommended swaps to reduce waste and improve satisfaction
          </p>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-4">
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