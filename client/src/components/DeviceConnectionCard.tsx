import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BluetoothIcon } from "lucide-react";

export interface BluetoothDevice {
  id: string;
  name: string;
}

interface DeviceConnectionCardProps {
  isScanning: boolean;
  availableDevices: BluetoothDevice[];
  onScanClick: () => void;
  onConnectDevice: (deviceId: string) => void;
}

export default function DeviceConnectionCard({
  isScanning,
  availableDevices,
  onScanClick,
  onConnectDevice
}: DeviceConnectionCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Device Connection</h2>
          <Button 
            onClick={onScanClick}
            className="rounded-full flex items-center gap-2"
          >
            <BluetoothIcon className="h-4 w-4" />
            <span>{isScanning ? "Cancel" : "Scan for Devices"}</span>
          </Button>
        </div>
        
        {isScanning ? (
          <div className="mt-4 border dark:border-gray-700 rounded-lg p-4">
            {availableDevices.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Scanning for devices...</span>
              </div>
            ) : (
              availableDevices.map(device => (
                <div key={device.id} className="border-t dark:border-gray-700 py-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{device.name || "Unknown Device"}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {device.id}</p>
                  </div>
                  <Button 
                    onClick={() => onConnectDevice(device.id)}
                    className="rounded-full text-sm"
                  >
                    Connect
                  </Button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            <p>Click the scan button to find nearby Bluetooth devices.</p>
            <p className="mt-1">Make sure your ESP32 device is powered on and within range.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
