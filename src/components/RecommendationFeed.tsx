import { RecommendationCard } from "@/components/RecommendationCard";

const mockRecommendations = [
  {
    id: "1",
    name: "Butternut Squash Ravioli",
    station: "Italian",
    reason: "Heavy cream sauce causing waste",
    overlapPercentage: 85,
    swapA: {
      name: "Sage Brown Butter Ravioli",
      description: "Light herb sauce, same pasta base",
      timeDelta: "+5 min",
      overlapItems: ["butternut squash", "pasta", "sage", "parmesan"],
      newItems: ["brown butter", "hazelnuts"]
    },
    swapB: {
      name: "Roasted Squash with Herb Oil",
      description: "Deconstructed version with fresh herbs",
      timeDelta: "-10 min",
      overlapItems: ["butternut squash", "sage", "parmesan"],
      newItems: ["herb oil", "pine nuts"]
    },
    dietary: ["vegetarian", "contains dairy"]
  },
  {
    id: "2",
    name: "Sesame Glazed Salmon",
    station: "Grill",
    reason: "Overcooked by end of service",
    overlapPercentage: 72,
    hasConflict: true,
    swapA: {
      name: "Miso Glazed Cod",
      description: "More forgiving fish with umami glaze",
      timeDelta: "same",
      overlapItems: ["sesame", "miso", "ginger", "scallions"],
      newItems: ["cod", "mirin"]
    },
    swapB: {
      name: "Sesame Crusted Tofu",
      description: "Plant-based option with same flavors",
      timeDelta: "-15 min",
      overlapItems: ["sesame", "ginger", "scallions", "soy sauce"],
      newItems: ["tofu", "cornstarch"]
    },
    dietary: ["contains fish", "gluten-free"]
  },
  {
    id: "3",
    name: "Truffle Mac & Cheese",
    station: "Comfort",
    reason: "Too rich, often left unfinished",
    overlapPercentage: 90,
    swapA: {
      name: "Three Cheese Mac",
      description: "Classic blend without truffle oil",
      timeDelta: "-5 min",
      overlapItems: ["pasta", "cheddar", "milk", "butter"],
      newItems: ["gruyere", "parmesan"]
    },
    swapB: {
      name: "Mac with Herb Breadcrumbs",
      description: "Lighter version with crispy herb topping",
      timeDelta: "same",
      overlapItems: ["pasta", "cheddar", "milk", "butter"],
      newItems: ["breadcrumbs", "parsley", "thyme"]
    },
    dietary: ["vegetarian", "contains dairy", "contains gluten"]
  }
];

export function RecommendationFeed() {
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
        {mockRecommendations.map((recommendation, index) => (
          <RecommendationCard
            key={recommendation.id}
            dish={recommendation}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}