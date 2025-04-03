import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayIcon, RefreshCw, PauseIcon } from "lucide-react";

interface ExerciseStatsCardsProps {
  repCount: number;
  accelerationData: { x: number; y: number; z: number };
  isSessionActive: boolean;
  onStartSession: () => void;
  onStopSession: () => void;
  onResetData: () => void;
}

export default function ExerciseStatsCards({
  repCount,
  accelerationData,
  isSessionActive,
  onStartSession,
  onStopSession,
  onResetData
}: ExerciseStatsCardsProps) {
  const normalizePercentage = (value: number, range: number): number => {
    return Math.min(100, Math.max(0, (Math.abs(value) / range) * 100));
  };

  const xPercentage = normalizePercentage(accelerationData.x, 10);
  const yPercentage = normalizePercentage(accelerationData.y, 15);
  const zPercentage = normalizePercentage(accelerationData.z, 8);

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Reps Counter Card */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Rep Counter</h2>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">{repCount}</div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Total Reps</p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              onClick={isSessionActive ? onStopSession : onStartSession}
              className="rounded-full mr-2 flex items-center gap-1"
            >
              {isSessionActive ? (
                <>
                  <PauseIcon className="h-4 w-4" /> Stop
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4" /> Start
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={onResetData}
              className="rounded-full flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Acceleration Data Card */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Acceleration</h2>
          <div className="space-y-4">
            {/* X-Axis */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">X-Axis</span>
                <span className="text-sm font-medium">{accelerationData.x.toFixed(2)} m/s²</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${xPercentage}%` }}
                />
              </div>
            </div>
            
            {/* Y-Axis */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Y-Axis</span>
                <span className="text-sm font-medium">{accelerationData.y.toFixed(2)} m/s²</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${yPercentage}%` }}
                />
              </div>
            </div>
            
            {/* Z-Axis */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Z-Axis</span>
                <span className="text-sm font-medium">{accelerationData.z.toFixed(2)} m/s²</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${zPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
