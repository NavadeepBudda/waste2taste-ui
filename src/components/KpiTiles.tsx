import { useId, useMemo } from "react";
import { TrendingUp, Target, Sparkles } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";

const numberFormatter = new Intl.NumberFormat("en-US");
const massFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const formatRelativeTime = (date: Date | null) => {
  if (!date) {
    return "Awaiting first sync";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Updated just now";
  if (diffMinutes === 1) return "Updated 1 minute ago";
  if (diffMinutes < 60) return `Updated ${diffMinutes} minutes ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return "Updated 1 hour ago";
  if (diffHours < 24) return `Updated ${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? "Updated 1 day ago" : `Updated ${diffDays} days ago`;
};

const buildFallbackTrend = () =>
  Array.from({ length: 8 }, (_, index) => ({ index, mass: 0 }));

export function KpiTiles() {
  const { todayData, isTodayLoading: isLoading, todayError: error, todayLastUpdated: lastUpdated } = useData();
  const gradientId = useId();

  const dishesTracked = todayData?.analysis_summary?.total_foods_analyzed ?? 0;
  const swapOpportunities = todayData?.analysis_summary?.most_disliked_count
    ? todayData.analysis_summary.most_disliked_count * 2
    : 0;
  const recommendationsGenerated = todayData?.analysis_summary?.recommendations_generated ?? 0;

  const combinedFoods = useMemo(() => {
    if (!todayData?.most_disliked_foods?.length) {
      return [];
    }

    // Combine duplicate foods by name and sum their disposal masses
    const uniqueFoods = new Map();
    
    todayData.most_disliked_foods.forEach((food) => {
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
      }
    });

    return Array.from(uniqueFoods.values()).sort((a, b) => a.rank - b.rank);
  }, [todayData?.most_disliked_foods]);

  const totalDisposalMass = useMemo(() => {
    return combinedFoods.reduce((sum, food) => sum + food.disposal_mass, 0);
  }, [combinedFoods]);

  const massTrend = useMemo(() => {
    if (!combinedFoods.length) {
      return buildFallbackTrend();
    }

    return combinedFoods
      .slice(0, 12)
      .map((food, index) => ({ index, mass: Number(food.disposal_mass.toFixed(2)) }))
      .sort((a, b) => a.index - b.index);
  }, [combinedFoods]);

  const coverage = useMemo(() => {
    if (!dishesTracked) {
      return 0;
    }

    return Math.min(100, Math.round((recommendationsGenerated / dishesTracked) * 100));
  }, [dishesTracked, recommendationsGenerated]);

  if (error) {
    return (
      <div className="mb-8">
        <Card className="relative overflow-hidden border border-destructive/30 bg-[hsla(var(--surface-glass))] p-6 text-left shadow-card">
          <div className="absolute inset-0 bg-destructive/10" />
          <div className="relative space-y-2">
            <p className="text-sm font-semibold text-destructive">Unable to load KPI tiles</p>
            <p className="text-xs text-foreground-muted">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((card) => (
        <Card
          key={card}
          className="relative overflow-hidden border border-white/30 bg-[hsla(var(--surface-glass))] p-6 shadow-card"
        >
          <div className="absolute inset-0 bg-gradient-card opacity-70" />
          <div className="relative space-y-4">
            <div className="h-3 w-24 rounded-full bg-foreground/10 animate-pulse" />
            <div className="h-8 w-32 rounded-full bg-foreground/10 animate-pulse" />
            <div className="h-16 w-full rounded-2xl bg-foreground/5 animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  const coverageBackground = `conic-gradient(from 12deg, hsl(var(--accent)) 0deg, hsl(var(--accent)) ${coverage * 3.6}deg, hsl(var(--muted)) ${
    coverage * 3.6
  }deg)`;

  return (
    <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="relative overflow-hidden rounded-2xl border border-card-border bg-[hsla(var(--surface-glass))] p-6 shadow-card transition-all duration-350 hover:shadow-elevated">
        <div className="absolute inset-0 bg-gradient-card opacity-90" />
        <div className="relative flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground-subtle">
                Dishes Tracked
              </p>
              <p className="text-4xl font-semibold text-foreground tabular-nums">
                {numberFormatter.format(dishesTracked)}
              </p>
              <p className="text-xs text-foreground-muted">Total plates analyzed in the last 24 hours</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/40 bg-white/30 text-foreground shadow-inner dark:bg-white/10 dark:text-white">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="-mx-4 h-20 flex items-center">
            <div className="w-full h-12 rounded-2xl bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/60 to-transparent"></div>
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-accent/10 via-accent/30 to-accent/10"></div>
              <div className="relative text-xs font-semibold text-white dark:text-white uppercase tracking-wider drop-shadow-md">
                Tracking Active
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-foreground-muted">
            <span>{massTrend.length} hotspots monitored</span>
            <span>{formatRelativeTime(lastUpdated)}</span>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden rounded-2xl border border-card-border bg-[hsla(var(--surface-glass))] p-6 shadow-card transition-all duration-350 hover:shadow-elevated">
        <div className="absolute inset-0 bg-gradient-card opacity-90" />
        <div className="relative flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground-subtle">
                Swap Opportunities
              </p>
              <p className="text-4xl font-semibold text-foreground tabular-nums">
                {numberFormatter.format(swapOpportunities)}
              </p>
              <p className="text-xs text-foreground-muted">
                {todayData?.analysis_summary?.most_disliked_count ?? 0} dishes with ready alternatives
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-foreground shadow-inner dark:bg-white/10 dark:text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-border/60 bg-background/50 p-4 text-xs text-foreground-muted">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Top disposal mass</span>
              <span>{massFormatter.format(massTrend[0]?.mass ?? 0)} lbs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Median mass</span>
              <span>{massFormatter.format(massTrend[Math.floor(massTrend.length / 2)]?.mass ?? 0)} lbs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Total mass</span>
              <span>{massFormatter.format(totalDisposalMass)} lbs</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
