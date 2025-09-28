import { HistoricalAnalyticsSummary, WasteReductionMetrics } from "@/types/api";
import { TrendingDown, TrendingUp, Calendar, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";

interface HistoricalMetricsProps {
  summary: HistoricalAnalyticsSummary;
  reductionMetrics: WasteReductionMetrics;
}

const numberFormatter = new Intl.NumberFormat("en-US");
const massFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function HistoricalMetrics({ summary, reductionMetrics }: HistoricalMetricsProps) {
  const getTrendIcon = (change: number) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Scale;
  };

  const getTrendColor = (change: number) => {
    // For new data where previous period is 0, don't show negative colors
    if (change === 100) return "text-blue-500"; // New data
    if (change < -5) return "text-green-500"; // Reduction is good
    if (change > 5) return "text-red-500";   // Increase is bad
    return "text-foreground-muted";          // Stable
  };

  const formatChange = (change: number) => {
    if (change === 100) return "New data";
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      
      {/* Total Items Disposed */}
      <Card className="relative overflow-hidden border border-card-border bg-gradient-card p-6 shadow-card">
        <div className="absolute inset-0 bg-gradient-card opacity-90" />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground-subtle">
                Total Items
              </p>
              <p className="text-3xl font-semibold text-foreground tabular-nums">
                {numberFormatter.format(summary.total_items_disposed)}
              </p>
              <p className="text-xs text-foreground-muted">
                Items disposed in {summary.analysis_period_days} days
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-foreground">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          
          {reductionMetrics.changes && (
            <div className="flex items-center gap-2 text-sm">
              {(() => {
                const TrendIcon = getTrendIcon(reductionMetrics.changes.items_change_percent);
                return (
                  <TrendIcon className={`h-4 w-4 ${getTrendColor(reductionMetrics.changes.items_change_percent)}`} />
                );
              })()}
              <span className={getTrendColor(reductionMetrics.changes.items_change_percent)}>
                {formatChange(reductionMetrics.changes.items_change_percent)}
              </span>
              <span className="text-foreground-muted">vs previous period</span>
            </div>
          )}
        </div>
      </Card>

      {/* Total Mass Disposed */}
      <Card className="relative overflow-hidden border border-card-border bg-gradient-card p-6 shadow-card">
        <div className="absolute inset-0 bg-gradient-card opacity-90" />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground-subtle">
                Total Mass
              </p>
              <p className="text-3xl font-semibold text-foreground tabular-nums">
                {massFormatter.format(summary.total_mass_disposed)}
              </p>
              <p className="text-xs text-foreground-muted">
                Pounds of food wasted
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-foreground">
              <Scale className="h-5 w-5" />
            </div>
          </div>
          
          {reductionMetrics.changes && (
            <div className="flex items-center gap-2 text-sm">
              {(() => {
                const TrendIcon = getTrendIcon(reductionMetrics.changes.mass_change_percent);
                return (
                  <TrendIcon className={`h-4 w-4 ${getTrendColor(reductionMetrics.changes.mass_change_percent)}`} />
                );
              })()}
              <span className={getTrendColor(reductionMetrics.changes.mass_change_percent)}>
                {formatChange(reductionMetrics.changes.mass_change_percent)}
              </span>
              <span className="text-foreground-muted">vs previous period</span>
            </div>
          )}
        </div>
      </Card>

      {/* Average Daily Items */}
      <Card className="relative overflow-hidden border border-card-border bg-gradient-card p-6 shadow-card">
        <div className="absolute inset-0 bg-gradient-card opacity-90" />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground-subtle">
                Daily Average
              </p>
              <p className="text-3xl font-semibold text-foreground tabular-nums">
                {massFormatter.format(summary.avg_daily_items)}
              </p>
              <p className="text-xs text-foreground-muted">
                Items per day on average
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-foreground">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          
          <div className="bg-surface/30 rounded-lg p-3 text-xs">
            <div className="flex justify-between text-foreground-muted">
              <span>Daily mass average:</span>
              <span className="font-medium text-foreground">
                {massFormatter.format(summary.avg_daily_mass)} lbs
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Unique Foods Tracked */}
      <Card className="relative overflow-hidden border border-card-border bg-gradient-card p-6 shadow-card">
        <div className="absolute inset-0 bg-gradient-card opacity-90" />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground-subtle">
                Unique Foods
              </p>
              <p className="text-3xl font-semibold text-foreground tabular-nums">
                {numberFormatter.format(summary.unique_foods_tracked)}
              </p>
              <p className="text-xs text-foreground-muted">
                Different food items tracked
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-foreground">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          
          {reductionMetrics.changes && (
            <div className="flex items-center gap-2 text-sm">
              {(() => {
                const TrendIcon = getTrendIcon(reductionMetrics.changes.unique_foods_change_percent);
                return (
                  <TrendIcon className={`h-4 w-4 ${getTrendColor(reductionMetrics.changes.unique_foods_change_percent)}`} />
                );
              })()}
              <span className={getTrendColor(reductionMetrics.changes.unique_foods_change_percent)}>
                {formatChange(reductionMetrics.changes.unique_foods_change_percent)}
              </span>
              <span className="text-foreground-muted">food variety</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}