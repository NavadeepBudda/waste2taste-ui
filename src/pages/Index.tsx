import { HeroStrip } from "@/components/HeroStrip";
import { KpiTiles } from "@/components/KpiTiles";
import { DecisionFeed } from "@/components/DecisionFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Strip */}
      <HeroStrip />
      
      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Tiles */}
        <KpiTiles />
        
        {/* Full-width Decision Feed */}
        <DecisionFeed />
      </div>
    </div>
  );
};

export default Index;
