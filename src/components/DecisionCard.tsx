import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Check, ArrowUpDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionCardProps {
  rank: number;
  dishName: string;
  description: string;
  station: string;
  mass: number;
  confidence: number;
  isOutlier?: boolean;
  swapOptions: Array<{
    name: string;
    description: string;
    sharedIngredients: number;
    prep_time: string;
  }>;
  allergens: string[];
  equipment: string[];
}

export function DecisionCard({
  rank,
  dishName,
  description,
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
            <div className="grid grid-cols-12 items-center gap-4">
              {/* Left cluster: Rank */}
              <div className="col-span-1 flex items-center justify-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-base font-bold",
                  rank <= 3 ? "bg-destructive text-destructive-foreground" :
                  rank <= 6 ? "bg-warning text-warning-foreground" :
                  "bg-muted text-foreground-muted"
                )}>
                  {rank}
                </div>
              </div>
              
              {/* Middle-left cluster: Name, Station */}
              <div className="col-span-5">
                <h3 className="font-semibold text-foreground text-lg">{dishName}</h3>
                <Badge variant="secondary">{station}</Badge>
              </div>

              {/* Middle-right cluster: Mass */}
              <div className="col-span-3 flex justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground tabular-nums">{mass.toFixed(1)}</p>
                  <p className="text-xs text-foreground-muted">lbs disposed</p>
                </div>
              </div>

              {/* Right cluster: Actions */}
              <div className="col-span-3 flex items-center justify-end gap-3">
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
          <div className="p-6 space-y-4">
            {/* Description */}
            <p className="text-sm text-foreground-muted">{description}</p>

            {/* Alternate Food Options */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Alternate Food Options</h4>
              <div className="space-y-3">
              {swapOptions.slice(0, 2).map((swap, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{swap.name}</p>
                    <p className="text-sm text-foreground-muted">{swap.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                      <Clock className="h-3 w-3" />
                      <span>{swap.prep_time}</span>
                    </div>
                    <span className="text-xs text-foreground-subtle">
                      {swap.sharedIngredients} similar ingredients
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
            </div>

          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}