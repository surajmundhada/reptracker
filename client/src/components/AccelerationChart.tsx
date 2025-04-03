import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ZoomOutIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  EyeIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AccelerationChartProps {
  data: Array<{
    timestamp: number;
    x: number;
    y: number;
    z: number;
  }>;
}

export default function AccelerationChart({ data }: AccelerationChartProps) {
  const [visibleAxes, setVisibleAxes] = useState({
    x: true,
    y: true,
    z: true,
  });
  
  const chartRef = useRef<any>(null);
  
  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetProps?.();
    }
  };
  
  const handleToggleAxis = (axis: 'x' | 'y' | 'z') => {
    setVisibleAxes(prev => ({
      ...prev,
      [axis]: !prev[axis]
    }));
  };
  
  const handleDownloadData = () => {
    // Create CSV content
    const headers = "timestamp,x-axis,y-axis,z-axis\n";
    const csvContent = data.reduce((acc, row) => {
      return acc + `${row.timestamp},${row.x},${row.y},${row.z}\n`;
    }, headers);
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `acceleration-data-${new Date().toISOString()}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Acceleration Over Time</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetZoom}
              title="Reset zoom"
            >
              <ZoomOutIcon className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadData}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleAxis('x')}>
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Toggle X-Axis
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleAxis('y')}>
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Toggle Y-Axis
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToggleAxis('z')}>
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Toggle Z-Axis
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex mb-4">
          <div className="flex items-center mr-4">
            <span className="w-3 h-3 bg-primary rounded-full mr-1"></span>
            <span className="text-sm">X-Axis</span>
          </div>
          <div className="flex items-center mr-4">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span className="text-sm">Y-Axis</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-amber-500 rounded-full mr-1"></span>
            <span className="text-sm">Z-Axis</span>
          </div>
        </div>
        
        <div className="relative h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              ref={chartRef}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis 
                dataKey="timestamp" 
                label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} 
              />
              <YAxis 
                label={{ value: 'Acceleration (m/s²)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                  color: '#fff',
                  borderRadius: '6px' 
                }} 
              />
              {visibleAxes.x && (
                <Line 
                  type="monotone" 
                  dataKey="x" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 4 }} 
                  animationDuration={300}
                />
              )}
              {visibleAxes.y && (
                <Line 
                  type="monotone" 
                  dataKey="y" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 4 }} 
                  animationDuration={300}
                />
              )}
              {visibleAxes.z && (
                <Line 
                  type="monotone" 
                  dataKey="z" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 4 }} 
                  animationDuration={300}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Scroll to zoom, drag to pan the chart.</p>
        </div>
      </CardContent>
    </Card>
  );
}
