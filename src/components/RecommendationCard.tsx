import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  dish: {
    id: string;
    name: string;
    station: string;
    reason: string;
    overlapPercentage: number;
    swapA: {
      name: string;
      description: string;
      timeDelta: string;
      overlapItems: string[];
      newItems: string[];
    };
    swapB: {
      name: string;
      description: string;
      timeDelta: string;
      overlapItems: string[];
      newItems: string[];
    };
    dietary: string[];
    hasConflict?: boolean;
  };
  rank: number;
}

export function RecommendationCard({ dish, rank }: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "bg-gradient-card border border-card-border rounded-2xl shadow-lg overflow-hidden",
      "transition-all duration-300 ease-smooth",
      isExpanded && "shadow-xl -translate-y-1"
    )}>
      {/* Collapsed Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-surface-elevated/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="grid grid-cols-12 items-center gap-4">
          {/* Left cluster: Rank */}
          <div className="col-span-1 flex items-center justify-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border",
              rank <= 3 ? "bg-red-100 text-red-700 border-red-200" :
              rank <= 6 ? "bg-orange-100 text-orange-700 border-orange-200" :
              "bg-muted text-foreground border-border"
            )}>
              {rank}
            </div>
          </div>

          {/* Middle cluster: Name, Station */}
          <div className="col-span-8">
            <h3 className="font-semibold text-foreground text-lg leading-tight mb-1 break-words">{dish.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">{dish.station}</Badge>
            </div>
          </div>

          {/* Right cluster: Actions */}
          <div className="col-span-3 flex items-center justify-end gap-3 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              className="hidden sm:flex"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
            >
              Review swaps
            </Button>
            
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-foreground-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-foreground-muted" />
            )}
          </div>
        </div>

      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-card-border bg-surface/30">
          <div className="p-6 space-y-6">

            {/* Swap Options */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Swap A */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Option A</h4>
                  <h5 className="text-lg font-semibold text-foreground">{dish.swapA.name}</h5>
                  <p className="text-sm text-foreground-muted mt-1">{dish.swapA.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-foreground-muted" />
                    <span className="text-foreground-muted">Prep time:</span>
                    <span className="text-foreground font-medium">{dish.swapA.timeDelta}</span>
                  </div>

                  <div>
                    <p className="text-sm text-foreground-muted mb-2">Ingredients:</p>
                    <div className="flex flex-wrap gap-1 text-xs">
                      {dish.swapA.overlapItems.map((item) => (
                        <Badge key={item} variant="secondary" className="bg-success/10 text-success">
                          ✓ {item}
                        </Badge>
                      ))}
                      {dish.swapA.newItems.map((item) => (
                        <Badge key={item} variant="outline" className="bg-accent/10">
                          • {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Accept Option A
                  </Button>
                </div>
              </div>

              {/* Swap B */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Option B</h4>
                  <h5 className="text-lg font-semibold text-foreground">{dish.swapB.name}</h5>
                  <p className="text-sm text-foreground-muted mt-1">{dish.swapB.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-foreground-muted" />
                    <span className="text-foreground-muted">Prep time:</span>
                    <span className="text-foreground font-medium">{dish.swapB.timeDelta}</span>
                  </div>

                  <div>
                    <p className="text-sm text-foreground-muted mb-2">Ingredients:</p>
                    <div className="flex flex-wrap gap-1 text-xs">
                      {dish.swapB.overlapItems.map((item) => (
                        <Badge key={item} variant="secondary" className="bg-success/10 text-success">
                          ✓ {item}
                        </Badge>
                      ))}
                      {dish.swapB.newItems.map((item) => (
                        <Badge key={item} variant="outline" className="bg-accent/10">
                          • {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    Accept Option B
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}