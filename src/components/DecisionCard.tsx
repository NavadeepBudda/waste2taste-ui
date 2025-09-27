import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const massFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface DecisionCardProps {
  rank: number;
  dishName: string;
  description: string;
  station: string;
  mass: number;
  confidence: number;
  maxMass: number;
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

const riskLabels = {
  critical: {
    label: "Critical Waste",
    tone: "text-destructive",
    badge: "bg-destructive/10 text-destructive",
  },
  high: {
    label: "High Waste",
    tone: "text-warning",
    badge: "bg-warning/20 text-warning",
  },
  watch: {
    label: "Watchlist",
    tone: "text-foreground-muted",
    badge: "bg-muted text-foreground",
  },
} as const;

export function DecisionCard({
  rank,
  dishName,
  description,
  station,
  mass,
  confidence,
  maxMass,
  isOutlier = false,
  swapOptions,
  allergens,
  equipment,
}: DecisionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  const massPercent = useMemo(() => {
    if (!maxMass) return 0;
    return Math.min(100, Math.round((mass / maxMass) * 100));
  }, [mass, maxMass]);

  const readiness = useMemo(() => {
    return isScheduled ? 100 : Math.min(100, confidence);
  }, [confidence, isScheduled]);

  const riskLevel = useMemo(() => {
    if (massPercent >= 70) return riskLabels.critical;
    if (massPercent >= 40) return riskLabels.high;
    return riskLabels.watch;
  }, [massPercent]);

  const handleAccept = (swapName: string) => {
    setIsScheduled(true);
    if (!isExpanded) {
      setIsExpanded(true);
    }
    // Focus would move to next card in real implementation
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border border-card-border bg-[hsla(var(--surface-glass))] shadow-lg transition-all duration-350 hover:-translate-y-1 hover:shadow-xl",
        isOutlier && "border-orange-200/80 bg-orange-50/20",
        isScheduled && "border-green-200/60 bg-green-50/20"
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-accent" />
      {isOutlier && <div className="pointer-events-none absolute inset-0 bg-gradient-warning opacity-5" />}

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="relative space-y-5 p-5">
          <div className="grid gap-6 lg:grid-cols-[auto,1fr,auto] lg:items-start">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold",
                    rank <= 3
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : rank <= 6
                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                      : "bg-muted text-foreground border border-border"
                  )}
                >
                  {rank}
                </span>
                <div className="relative flex h-14 w-2 items-end justify-center rounded-full bg-border/70">
                  <span
                    className="w-full rounded-full bg-gradient-accent transition-all duration-500"
                    style={{ height: `${Math.max(10, massPercent)}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-foreground-muted">
                  Mass
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-foreground tracking-tight">{dishName}</h3>
                <Badge variant="secondary" className="rounded-full border border-border/60 px-3 py-0.5 text-xs font-medium">
                  {station}
                </Badge>
                {isOutlier && (
                  <Badge className="rounded-full px-3 py-0.5 text-xs font-medium uppercase tracking-wide">
                    Signal: Outlier
                  </Badge>
                )}
                <Badge className={cn("rounded-full px-3 py-0.5 text-xs font-medium", riskLevel.badge)}>
                  {riskLevel.label}
                </Badge>
              </div>

              <p className="text-sm text-foreground-muted max-w-3xl">{description}</p>

              <div className="rounded-xl border border-border/60 bg-background/60 p-4 shadow-sm inline-block">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground-subtle">
                  Disposal Mass
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
                  {massFormatter.format(mass)} lbs
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-white/40 bg-[hsla(var(--surface-glass))] px-3 py-1 text-xs font-semibold tracking-wide",
                  isScheduled ? "text-success" : "text-foreground"
                )}
              >
                {isScheduled ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Scheduled
                  </>
                ) : (
                  <>Ready for action</>
                )}
              </span>

              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/60 text-foreground transition-all duration-300 hover:border-accent hover:text-accent"
                    aria-label={isExpanded ? "Collapse decision" : "Expand decision"}
                  >
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isExpanded && "rotate-180")}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>

          {!isScheduled && swapOptions.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4 text-sm text-foreground-muted">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
                {swapOptions.length} curated swap {swapOptions.length === 1 ? "path" : "paths"} ready
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)}>
                Review swaps
              </Button>
            </div>
          )}
        </div>

        <CollapsibleContent className="space-y-6 border-t border-border/60 bg-background/60 p-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground tracking-tight">
              Alternate Food Options
            </h4>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {swapOptions.slice(0, 3).map((swap, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-xl border border-border/70 bg-[hsla(var(--surface-glass))] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{swap.name}</p>
                      <p className="text-sm text-foreground-muted mt-1">{swap.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-foreground-subtle">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {swap.prep_time}
                      </span>
                      <span>{swap.sharedIngredients} shared ingredients</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/70">
                      <div
                        className="h-full rounded-full bg-gradient-accent transition-all duration-500"
                        style={{ width: `${Math.min(100, 40 + swap.sharedIngredients * 8)}%` }}
                      />
                    </div>
                    <Button 
                      size="default" 
                      className="w-full" 
                      onClick={() => handleAccept(swap.name)} 
                      disabled={isScheduled}
                    >
                      {isScheduled ? "Queued" : "Accept & Schedule"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
