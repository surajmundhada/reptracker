import { Card, CardContent } from "@/components/ui/card";

interface SessionInfoCardProps {
  sessionDuration: string;
  averageRepTime: string;
  maxAcceleration: string;
}

export default function SessionInfoCard({
  sessionDuration,
  averageRepTime,
  maxAcceleration
}: SessionInfoCardProps) {
  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Session Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Duration</div>
            <div className="text-2xl font-semibold">{sessionDuration}</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Average Rep Time</div>
            <div className="text-2xl font-semibold">{averageRepTime}</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Max Acceleration</div>
            <div className="text-2xl font-semibold">{maxAcceleration}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
