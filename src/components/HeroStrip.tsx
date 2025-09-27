import { Navigation } from "@/components/Navigation";

export function HeroStrip() {
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Waste2Taste</h1>
        <Navigation />
      </div>
    </header>
  );
}
