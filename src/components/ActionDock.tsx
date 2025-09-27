import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Filter,
  PrinterIcon
} from "lucide-react";

export function ActionDock() {
  return (
    <div className="space-y-6">

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