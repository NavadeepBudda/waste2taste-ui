import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";

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
        </CardContent>
      </Card>




      {/* Utilities */}
      <Card className="bg-gradient-card border-card-border shadow-card">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Button variant="ghost" size="sm" className="w-full justify-start text-foreground-muted">
              <Printer className="w-4 h-4 mr-2" />
              Print Better Options
            </Button>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}