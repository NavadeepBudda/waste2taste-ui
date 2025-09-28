import { SmartInsight } from "@/types/api";
import { AlertTriangle, TrendingUp, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface WasteInsightsCardProps {
  insight: SmartInsight;
}

export function WasteInsightsCard({ insight }: WasteInsightsCardProps) {
  const getInsightIcon = (type: SmartInsight['type']) => {
    switch (type) {
      case 'frequency':
        return AlertTriangle;
      case 'trend':
        return TrendingUp;
      case 'timing':
        return Clock;
      case 'pattern':
        return Activity;
      default:
        return Activity;
    }
  };

  const getPriorityColor = (priority: SmartInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-950/30';
      case 'medium':
        return 'text-orange-500 bg-orange-50 dark:bg-orange-950/30';
      case 'low':
        return 'text-green-500 bg-green-50 dark:bg-green-950/30';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-950/30';
    }
  };

  const Icon = getInsightIcon(insight.type);

  return (
    <div className="bg-gradient-card border border-card-border rounded-2xl p-5 shadow-card hover:shadow-elevated transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            getPriorityColor(insight.priority)
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm leading-tight">
              {insight.title}
            </h3>
            <div className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1",
              getPriorityColor(insight.priority)
            )}>
              {insight.priority.toUpperCase()} PRIORITY
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-sm text-foreground-muted leading-relaxed">
          {insight.description}
        </p>
        
        <div className="bg-surface/40 rounded-lg p-3 border border-border/50">
          <div className="text-xs font-medium text-foreground mb-1">Impact</div>
          <div className="text-sm text-foreground-muted">
            {insight.impact}
          </div>
        </div>
      </div>

      {/* Type indicator */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="text-xs text-foreground-muted capitalize">
          {insight.type} Analysis
        </div>
      </div>
    </div>
  );
}