import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  TrendingUp, 
  Calendar,
  Filter,
  PrinterIcon,
  Clock
} from "lucide-react";

export function ActionDock() {
  return (
    <div className="space-y-6">
      {/* Smart Suggestions */}
      <Card className="p-6 bg-gradient-card border-card-border shadow-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Mission Control</h3>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              2 ready
            </Badge>
          </div>
          
          <div className="text-sm text-foreground-muted leading-relaxed">
            Accept these 2 swaps to improve Dinner service satisfaction by an estimated 23%.
          </div>
          
          {/* Stacked suggestion preview */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-surface-elevated rounded border border-border">
              <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
              <span className="text-sm font-medium">Herb-Crusted Chicken</span>
              <span className="text-xs text-foreground-muted">→ Mediterranean</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-surface-elevated rounded border border-border">
              <div className="w-1.5 h-1.5 bg-warning rounded-full" />
              <span className="text-sm font-medium">Quinoa Salad</span>
              <span className="text-xs text-foreground-muted">→ Greek Style</span>
            </div>
          </div>
          
          <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Accept All Swaps
          </Button>
        </div>
      </Card>

      {/* Service Context */}
      <Card className="p-6 bg-gradient-card border-card-border shadow-card">
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Service Context</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-foreground-muted" />
                <span className="text-sm text-foreground-muted">Today</span>
              </div>
              <span className="text-sm font-medium text-foreground">Nov 27, 2024</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-foreground-muted" />
                <span className="text-sm text-foreground-muted">Service</span>
              </div>
              <span className="text-sm font-medium text-foreground">Lunch (11:30-2:00)</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-foreground-muted" />
                <span className="text-sm text-foreground-muted">Trend</span>
              </div>
              <span className="text-sm font-medium text-success">+8% satisfaction</span>
            </div>
          </div>
          
          {/* Mini sparkline for total day trend */}
          <div className="pt-2">
            <div className="h-8 flex items-end gap-1">
              {[3, 5, 4, 7, 6, 8, 9, 7, 8, 6, 5, 7].map((height, i) => (
                <div 
                  key={i}
                  className="flex-1 bg-success/60 rounded-sm"
                  style={{ height: `${height * 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-card border-card-border shadow-card">
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Quick Actions</h3>
          
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-foreground-muted hover:text-foreground"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter by Station
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-foreground-muted hover:text-foreground"
            >
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print Shift Brief
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}