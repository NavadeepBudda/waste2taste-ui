import { HeroStrip } from "@/components/HeroStrip";
import { KpiTiles } from "@/components/KpiTiles";
import { DecisionFeed } from "@/components/DecisionFeed";
import { ActionDock } from "@/components/ActionDock";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Strip */}
      <HeroStrip />
      
      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Tiles */}
        <KpiTiles />
        
        {/* Two-column layout: Decision Feed + Action Dock */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left 9 columns: Decision Feed */}
          <div className="col-span-12 lg:col-span-9">
            <DecisionFeed />
          </div>
          
          {/* Right 3 columns: Action Dock */}
          <div className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <ActionDock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
