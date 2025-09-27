import { DecisionCard } from "./DecisionCard";

// Mock data for the decision feed
const decisions = [
  {
    rank: 1,
    dishName: "Herb-Crusted Chicken Breast",
    station: "Grill",
    mass: 24.3,
    confidence: 94,
    isOutlier: true,
    swapOptions: [
      {
        name: "Mediterranean Chicken",
        description: "Lemon herb marinade with olive tapenade",
        sharedIngredients: 8
      },
      {
        name: "Tuscan Grilled Chicken",
        description: "Rosemary and garlic with sun-dried tomatoes",
        sharedIngredients: 6
      }
    ],
    allergens: ["Gluten"],
    equipment: ["Grill", "Oven"]
  },
  {
    rank: 2,
    dishName: "Quinoa Power Bowl",
    station: "Salad Bar",
    mass: 18.7,
    confidence: 87,
    swapOptions: [
      {
        name: "Greek Quinoa Salad",
        description: "Feta, olives, and fresh vegetables",
        sharedIngredients: 9
      },
      {
        name: "Southwest Quinoa Bowl",
        description: "Black beans, corn, and lime vinaigrette",
        sharedIngredients: 7
      }
    ],
    allergens: ["Tree Nuts"],
    equipment: ["Steam Table"]
  },
  {
    rank: 3,
    dishName: "Creamy Mushroom Risotto",
    station: "Italian",
    mass: 16.2,
    confidence: 92,
    swapOptions: [
      {
        name: "Wild Mushroom Pilaf",
        description: "Basmati rice with seasonal mushrooms",
        sharedIngredients: 6
      },
      {
        name: "Parmesan Risotto",
        description: "Classic preparation with aged parmesan",
        sharedIngredients: 8
      }
    ],
    allergens: ["Dairy", "Gluten"],
    equipment: ["Stovetop", "Steam Table"]
  },
  {
    rank: 4,
    dishName: "Asian Fusion Stir-Fry",
    station: "Wok",
    mass: 14.8,
    confidence: 79,
    swapOptions: [
      {
        name: "Korean BBQ Stir-Fry",
        description: "Gochujang glaze with fresh vegetables",
        sharedIngredients: 7
      },
      {
        name: "Thai Basil Stir-Fry",
        description: "Traditional pad kra pao style",
        sharedIngredients: 5
      }
    ],
    allergens: ["Soy", "Sesame"],
    equipment: ["Wok", "High Heat"]
  },
  {
    rank: 5,
    dishName: "Loaded Sweet Potato",
    station: "Comfort",
    mass: 12.4,
    confidence: 85,
    swapOptions: [
      {
        name: "Stuffed Sweet Potato",
        description: "Black beans, cheese, and avocado",
        sharedIngredients: 4
      },
      {
        name: "Maple Glazed Sweet Potato",
        description: "Caramelized with autumn spices",
        sharedIngredients: 3
      }
    ],
    allergens: ["Dairy"],
    equipment: ["Oven", "Steam Table"]
  }
];

export function DecisionFeed() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Decision Feed</h2>
        <div className="text-sm text-foreground-muted">
          Showing top disposal risks • <span className="text-foreground">5 of 47 dishes</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {decisions.map((decision, index) => (
          <DecisionCard key={index} {...decision} />
        ))}
      </div>
      
      {/* Load more indicator */}
      <div className="text-center py-8">
        <div className="text-sm text-foreground-muted">
          Continue scrolling to see remaining 42 dishes
        </div>
        <div className="w-12 h-1 bg-gradient-accent rounded-full mx-auto mt-2" />
      </div>
    </div>
  );
}