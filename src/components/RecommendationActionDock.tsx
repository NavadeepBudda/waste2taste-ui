import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Filter, Printer, AlertTriangle } from "lucide-react";

export function RecommendationActionDock() {
  return (
    <div className="space-y-6">
      {/* Smart Summary */}
      <Card className="bg-gradient-card border-card-border shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Ready to Accept
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground-muted">Butternut Ravioli</span>
              <span className="text-foreground font-medium">→ Sage Brown Butter</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground-muted">Sesame Salmon</span>
              <span className="text-foreground font-medium">→ Miso Cod</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground-muted">Truffle Mac</span>
              <span className="text-foreground font-medium">→ Three Cheese</span>
            </div>
          </div>
          
          <Button className="w-full" size="sm">
            Accept All (3)
          </Button>
          
          <p className="text-xs text-foreground-muted text-center">
            Projected 15% waste reduction
          </p>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <Card className="bg-gradient-card border-card-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Quick Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Breakfast
            </Button>
            <Button variant="secondary" size="sm" className="h-8 text-xs">
              Lunch
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Dinner
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Italian <ChevronDown className="ml-1 w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Dietary <ChevronDown className="ml-1 w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Context */}
      <Card className="bg-gradient-card border-card-border shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-foreground">Service Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">Hall</span>
              <span className="text-foreground font-medium">North Dining</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">Service</span>
              <span className="text-foreground font-medium">Lunch</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">Date</span>
              <span className="text-foreground font-medium">Today</span>
            </div>
          </div>
          
          {/* Mini trend sparkline placeholder */}
          <div className="h-8 bg-accent/10 rounded border border-accent/20 flex items-center justify-center">
            <span className="text-xs text-accent font-medium">Efficiency trend ↗</span>
          </div>
        </CardContent>
      </Card>

      {/* Conflicts Alert */}
      <Card className="bg-gradient-card border-warning/20 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Ingredient Conflicts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="text-sm">
              <span className="text-foreground-muted">Miso Cod + Sesame Noodles</span>
              <p className="text-xs text-foreground-muted mt-1">Both need sesame oil</p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full text-xs">
            View All Conflicts (1)
          </Button>
        </CardContent>
      </Card>

      {/* Utilities */}
      <Card className="bg-gradient-card border-card-border shadow-card">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Button variant="ghost" size="sm" className="w-full justify-start text-foreground-muted">
              <Printer className="w-4 h-4 mr-2" />
              Print Mise en Place
            </Button>
            
            <Button variant="ghost" size="sm" className="w-full justify-start text-foreground-muted">
              View Yesterday's Swaps
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}