import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useData } from "@/contexts/DataContext";
import {
  Bell,
  ClipboardCheck,
  Download,
  Filter,
  PrinterIcon,
  Send,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

export function ActionDock() {
  const { todayData } = useData();
  const [notifyTeam, setNotifyTeam] = useState(false);

  const recommendationsGenerated = todayData?.analysis_summary?.recommendations_generated ?? 0;
  const totalAnalyzed = todayData?.analysis_summary?.total_foods_analyzed ?? 0;

  const coverage = useMemo(() => {
    if (!totalAnalyzed) {
      return 0;
    }
    return Math.min(100, Math.round((recommendationsGenerated / totalAnalyzed) * 100));
  }, [recommendationsGenerated, totalAnalyzed]);

  const coverageBackground = `conic-gradient(from 12deg, hsl(var(--accent)) 0deg, hsl(var(--accent)) ${
    coverage * 3.6
  }deg, hsl(var(--muted)) ${coverage * 3.6}deg)`;

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden rounded-2xl border border-card-border bg-[hsla(var(--surface-glass))] p-6 shadow-card">
        <div className="absolute inset-0 bg-gradient-card opacity-70" />
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-accent opacity-40 blur-3xl" />
        <div className="relative space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground-subtle">Service Playbook</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">Recommendation Queue</h3>
              <p className="mt-2 text-sm text-foreground-muted">
                Monitor swap readiness and broadcast updates to the culinary team in one tap.
              </p>
            </div>
            <Button size="sm" variant="outline" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em]">
              <ClipboardCheck className="h-4 w-4" />
              Briefing
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/40 bg-background/60 text-foreground shadow-inner dark:border-white/10"
              style={{ backgroundImage: coverageBackground }}
            >
              <div className="flex h-[82px] w-[82px] flex-col items-center justify-center rounded-full bg-[hsla(var(--surface-glass))] text-center">
                <span className="text-xl font-semibold">{coverage}%</span>
                <span className="text-[10px] uppercase tracking-[0.32em] text-foreground-muted">Ready</span>
              </div>
            </div>

            <div className="flex-1 space-y-3 text-sm text-foreground-muted">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground-subtle">
                    Swap Playbooks
                  </p>
                  <p className="text-base font-semibold text-foreground">{recommendationsGenerated} queued</p>
                </div>
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <p>
                Review dishes with the highest waste signature first, then trigger a shift briefing when
                coverage passes 80%.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-foreground-muted" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground-subtle">
                  Team Alerts
                </p>
                <p className="text-sm text-foreground-muted">Notify service leads about recommendation updates.</p>
              </div>
            </div>
            <Switch checked={notifyTeam} onCheckedChange={setNotifyTeam} aria-label="Toggle team notifications" />
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-card-border bg-[hsla(var(--surface-glass))] p-6 shadow-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground-subtle">
              Quick Actions
            </h3>
            <Button variant="ghost" size="sm" className="gap-2 text-xs uppercase tracking-[0.28em] text-foreground-muted">
              <SlidersHorizontal className="h-4 w-4" />
              Tune view
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium text-foreground"
            >
              <span className="flex items-center gap-3">
                <Filter className="h-4 w-4" />
                Filter by station
              </span>
              <span className="text-xs text-foreground-muted">Shift prep</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium text-foreground"
            >
              <span className="flex items-center gap-3">
                <PrinterIcon className="h-4 w-4" />
                Print shift brief
              </span>
              <span className="text-xs text-foreground-muted">Service leaders</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium text-foreground"
            >
              <span className="flex items-center gap-3">
                <Send className="h-4 w-4" />
                Push to display boards
              </span>
              <span className="text-xs text-foreground-muted">Dining hall</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium text-foreground"
            >
              <span className="flex items-center gap-3">
                <Download className="h-4 w-4" />
                Export food log
              </span>
              <span className="text-xs text-foreground-muted">CSV • Last 24h</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
