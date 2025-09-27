import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, AlertCircle, Check, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionCardProps {
  rank: number;
  dishName: string;
  station: string;
  mass: number;
  confidence: number;
  isOutlier?: boolean;
  swapOptions: Array<{
    name: string;
    description: string;
    sharedIngredients: number;
  }>;
  allergens: string[];
  equipment: string[];
}

export function DecisionCard({
  rank,
  dishName,
  station,
  mass,
  confidence,
  isOutlier = false,
  swapOptions,
  allergens,
  equipment,
}: DecisionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  const handleAccept = (swapName: string) => {
    setIsScheduled(true);
    // Focus would move to next card in real implementation
  };

  return (
    <Card className={cn(
      "group transition-smooth hover:shadow-card border-card-border",
      isScheduled && "bg-success/5 border-success/20"
    )}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer">
            <div className="flex items-center justify-between">
              {/* Left cluster: Rank, Name, Station */}
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  rank <= 3 ? "bg-destructive text-destructive-foreground" :
                  rank <= 6 ? "bg-warning text-warning-foreground" :
                  "bg-muted text-foreground-muted"
                )}>
                  {rank}
                </div>
                
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground text-lg">{dishName}</h3>
                  {isOutlier && (
                    <div className="w-2 h-2 bg-destructive rounded-full" title="Significant variance detected" />
                  )}
                  <Badge variant="outline" className="text-xs">
                    {station}
                  </Badge>
                </div>
              </div>

              {/* Middle cluster: Mass, Trend, Confidence */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground tabular-nums">{mass}</p>
                  <p className="text-xs text-foreground-muted">lbs disposed</p>
                </div>
                
                {/* Mini trend spark - simplified */}
                <div className="w-12 h-6 bg-muted rounded flex items-end gap-px p-1">
                  <div className="w-1 bg-destructive/60 h-2 rounded-sm" />
                  <div className="w-1 bg-destructive/80 h-3 rounded-sm" />
                  <div className="w-1 bg-destructive h-4 rounded-sm" />
                  <div className="w-1 bg-destructive/70 h-2 rounded-sm" />
                </div>
                
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  confidence >= 90 ? "bg-success" :
                  confidence >= 70 ? "bg-warning" :
                  "bg-destructive"
                )} title={`${confidence}% confidence`} />
              </div>

              {/* Right cluster: Actions */}
              <div className="flex items-center gap-3">
                {!isScheduled ? (
                  <Button variant="outline" size="sm" className="h-8">
                    <ArrowUpDown className="h-3 w-3 mr-2" />
                    Swap options
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-success">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Scheduled</span>
                  </div>
                )}
                
                <ChevronDown className={cn(
                  "h-4 w-4 text-foreground-muted transition-transform",
                  isExpanded && "rotate-180"
                )} />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="border-t border-card-border">
          <div className="p-4 space-y-4">
            {/* Why now */}
            <div>
              <p className="text-sm text-foreground-muted leading-relaxed">
                High disposal rate suggests flavor profile mismatch. Similar dishes with shared ingredients show 40% better acceptance.
              </p>
            </div>

            {/* Ingredient overlap visualization */}
            <div>
              <p className="text-xs text-foreground-subtle uppercase tracking-wide font-medium mb-2">
                Ingredient Overlap
              </p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-success rounded-full" />
              </div>
            </div>

            {/* Top swap options */}
            <div className="space-y-3">
              {swapOptions.slice(0, 2).map((swap, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{swap.name}</p>
                    <p className="text-sm text-foreground-muted">{swap.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-foreground-subtle">
                      {swap.sharedIngredients} shared ingredients
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => handleAccept(swap.name)}
                      disabled={isScheduled}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Chips: Allergens & Equipment */}
            <div className="flex flex-wrap gap-2">
              {allergens.map((allergen) => (
                <Badge key={allergen} variant="secondary" className="text-xs">
                  {allergen}
                </Badge>
              ))}
              {equipment.map((item) => (
                <Badge key={item} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}