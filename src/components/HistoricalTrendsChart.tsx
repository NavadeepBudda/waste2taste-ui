import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { HistoricalTrendData } from "@/types/api";

interface HistoricalTrendsChartProps {
  trends: HistoricalTrendData[];
}

export function HistoricalTrendsChart({ trends }: HistoricalTrendsChartProps) {
  const chartData = useMemo(() => {
    return trends.map(trend => ({
      date: new Date(trend.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      fullDate: trend.date,
      'Items Disposed': trend.items_disposed,
      'Total Mass (lbs)': parseFloat(trend.total_mass.toFixed(1)),
      'Unique Foods': trend.unique_foods,
      'Avg Mass': parseFloat(trend.avg_mass.toFixed(1))
    }));
  }, [trends]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-card-border rounded-lg p-4 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-foreground-muted">Items Disposed:</span>
              <span className="font-medium text-foreground">{data['Items Disposed']}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-foreground-muted">Total Mass:</span>
              <span className="font-medium text-foreground">{data['Total Mass (lbs)']} lbs</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-foreground-muted">Unique Foods:</span>
              <span className="font-medium text-foreground">{data['Unique Foods']}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-foreground-muted">Avg Mass:</span>
              <span className="font-medium text-foreground">{data['Avg Mass']} lbs</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!trends || trends.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground-muted mb-2">No trend data available</p>
          <p className="text-sm text-foreground-muted">
            Historical trends will appear when disposal data is available
          </p>
        </div>
      </div>
    );
  }

  // Show simplified view for minimal data
  if (trends.length <= 3) {
    return (
      <div className="space-y-4">
        <div className="text-center py-6">
          <p className="text-sm text-foreground-muted mb-4">
            Limited data available ({trends.length} data points)
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chartData.map((data, index) => (
            <div key={index} className="bg-surface/30 rounded-lg p-4 border border-card-border">
              <div className="text-sm font-medium text-foreground mb-3">{data.date}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Items:</span>
                  <span className="font-medium">{data['Items Disposed']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Mass:</span>
                  <span className="font-medium">{data['Total Mass (lbs)']} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Foods:</span>
                  <span className="font-medium">{data['Unique Foods']}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorMass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="opacity-30"
              stroke="hsl(var(--border))"
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: 'hsl(var(--foreground-muted))'
              }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: 'hsl(var(--foreground-muted))'
              }}
              dx={-10}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{
                fontSize: '12px',
                color: 'hsl(var(--foreground-muted))'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="Items Disposed"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorItems)"
            />
            
            <Area
              type="monotone"
              dataKey="Total Mass (lbs)"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMass)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-xs text-foreground-muted text-center">
        Showing {trends.length} days of disposal data
      </div>
    </div>
  );
}