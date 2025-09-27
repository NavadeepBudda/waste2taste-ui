import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ApiConnectionState = "checking" | "connected" | "disconnected";

const statusStyles: Record<ApiConnectionState, { label: string; dot: string; aura: string; tone: string }> = {
  connected: {
    label: "API Live",
    dot: "bg-success",
    aura: "bg-success/40",
    tone: "text-success",
  },
  checking: {
    label: "Verifying",
    dot: "bg-warning",
    aura: "bg-warning/40",
    tone: "text-warning",
  },
  disconnected: {
    label: "API Down",
    dot: "bg-destructive",
    aura: "bg-destructive/40",
    tone: "text-destructive",
  },
};

const formatRelativeTime = (date: Date | null) => {
  if (!date) {
    return "No checks yet";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return "Updated just now";
  }

  if (diffMinutes === 1) {
    return "Updated 1 minute ago";
  }

  if (diffMinutes < 60) {
    return `Updated ${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  return diffHours === 1 ? "Updated 1 hour ago" : `Updated ${diffHours} hours ago`;
};

export function ApiStatus() {
  const [status, setStatus] = useState<ApiConnectionState>("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      try {
        await api.healthCheck();
        if (!isMounted) return;
        setStatus("connected");
        setLastCheck(new Date());
      } catch (error) {
        if (!isMounted) return;
        setStatus("disconnected");
        setLastCheck(new Date());
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const detail = useMemo(() => statusStyles[status], [status]);
  const relativeTime = useMemo(() => formatRelativeTime(lastCheck), [lastCheck]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="group relative flex items-center gap-2 rounded-full border border-white/40 bg-[hsla(var(--surface-glass))] px-3 py-1.5 pr-4 text-xs font-medium shadow-card backdrop-blur-md transition-all duration-300 hover:-translate-y-px hover:border-accent/70 dark:border-white/10"
        >
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60", detail.aura, status === "checking" ? "animate-ping" : "animate-none")} />
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", detail.dot)} />
          </span>
          <span className={cn("tracking-wide", detail.tone)}>{detail.label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="text-xs">
        <div className="space-y-1">
          <p className="font-medium text-foreground">Waste2Taste API</p>
          <p className="text-foreground-muted">{relativeTime}</p>
          {lastCheck && (
            <p className="text-foreground-subtle">
              Last check • {lastCheck.toLocaleTimeString()}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
