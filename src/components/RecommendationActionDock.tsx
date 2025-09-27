import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { useRecommendationsData } from "@/hooks/useRecommendationsData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function RecommendationActionDock() {
  const { recommendationsData, isLoading } = useRecommendationsData();
  const [acceptedSwaps, setAcceptedSwaps] = useState<string[]>([]);
  const { toast } = useToast();

  // Map ready to accept items according to API docs
  const readyToAccept = recommendationsData?.most_disliked_foods?.map(food => ({
    original: food.food_name,
    alternative: food.alternative_recipes?.[0]?.recipe_name || "No alternative"
  })).slice(0, 3) || []; // Show only first 3 as per original design

  const handleAcceptAll = () => {
    const swapTexts = readyToAccept.map(swap => `${swap.original} → ${swap.alternative}`);
    setAcceptedSwaps([...acceptedSwaps, ...swapTexts]);
    
    toast({
      title: "Swaps Accepted",
      description: `${readyToAccept.length} food swaps have been accepted for implementation.`,
    });
  };

  const handlePrintOptions = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Smart Summary */}
      <Card className="bg-gradient-card border-card-border shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Ready to Accept
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded" />
            </div>
          ) : readyToAccept.length > 0 ? (
            <div className="space-y-3">
              {readyToAccept.slice(0, 3).map((swap, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-foreground-muted truncate mr-2">{swap.original}</span>
                  <span className="text-foreground font-medium">→ {swap.alternative}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-foreground-muted text-center py-4">
              No recommendations available
            </div>
          )}
          
          <Button 
            className="w-full" 
            size="sm" 
            disabled={readyToAccept.length === 0 || isLoading}
            onClick={handleAcceptAll}
          >
            Accept All ({readyToAccept.length})
          </Button>
        </CardContent>
      </Card>

      {/* Utilities */}
      <Card className="bg-gradient-card border-card-border shadow-card">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-foreground-muted"
              onClick={handlePrintOptions}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Better Options
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}