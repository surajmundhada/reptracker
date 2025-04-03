import { useState, useEffect, useCallback } from "react";
import { BluetoothDevice } from "@/components/DeviceConnectionCard";

interface UseBluetoothOptions {
  onError: (error: Error) => void;
}

export function useBluetooth({ onError }: UseBluetoothOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothLE | null>(null);
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [accelerationData, setAccelerationData] = useState({ x: 0, y: 0, z: 0 });
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Service and Characteristic UUIDs
  const ESP32_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  const ESP32_CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

  // Start scanning for devices
  const startScan = useCallback(async () => {
    try {
      if (!navigator.bluetooth) {
        throw new Error("Bluetooth is not available in your browser. Please use Chrome, Edge, or Opera.");
      }

      setIsScanning(true);
      setAvailableDevices([]);

      const device = await navigator.bluetooth.requestDevice({
        // Accept all devices that have the ESP32 service
        filters: [{ services: [ESP32_SERVICE_UUID] }],
        // Alternatively, you can scan for all devices and filter later
        // acceptAllDevices: true,
        // optionalServices: [ESP32_SERVICE_UUID]
      });

      setAvailableDevices(prev => [
        ...prev,
        { id: device.id, name: device.name || "Unknown Device" }
      ]);
    } catch (error) {
      if ((error as Error).name !== 'NotFoundError') {
        onError(error as Error);
      }
    } finally {
      setIsScanning(false);
    }
  }, [ESP32_SERVICE_UUID, onError]);

  // Stop scanning
  const stopScan = useCallback(() => {
    setIsScanning(false);
  }, []);

  // Connect to a device
  const connectToDevice = useCallback(async (deviceId: string) => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [ESP32_SERVICE_UUID] }]
      });

      if (!device) {
        throw new Error("No device selected.");
      }

      setIsScanning(false);

      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setConnectedDevice(null);
        setCharacteristic(null);
      });

      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error("Failed to connect to GATT server.");
      }

      const service = await server.getPrimaryService(ESP32_SERVICE_UUID);
      const char = await service.getCharacteristic(ESP32_CHARACTERISTIC_UUID);

      setConnectedDevice(device as BluetoothLE);
      setCharacteristic(char);
      setIsConnected(true);

      // Set up notifications for incoming data
      await char.startNotifications();
      char.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);

    } catch (error) {
      onError(error as Error);
    }
  }, [ESP32_SERVICE_UUID, ESP32_CHARACTERISTIC_UUID, onError]);

  // Handle data received from the ESP32
  const handleCharacteristicValueChanged = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    
    if (value) {
      // Decode the acceleration data from the ESP32
      // This will depend on your ESP32 firmware's data format
      // Example: Assuming the ESP32 sends a buffer with 12 bytes (3 float32 values for x, y, z)
      const dataView = new DataView(value.buffer);
      
      try {
        const x = dataView.getFloat32(0, true); // true for little-endian
        const y = dataView.getFloat32(4, true);
        const z = dataView.getFloat32(8, true);
        
        setAccelerationData({ x, y, z });
      } catch (e) {
        console.error("Error parsing acceleration data", e);
      }
    }
  }, []);

  // Start the exercise session
  const startSession = useCallback(() => {
    if (!isConnected || !characteristic) {
      onError(new Error("Please connect to a device first."));
      return;
    }
    
    setIsSessionActive(true);
    
    // Send command to ESP32 to start tracking
    // This is an example - actual command format depends on your ESP32 implementation
    const command = new Uint8Array([1]); // 1 = start
    characteristic.writeValue(command).catch(onError);
  }, [isConnected, characteristic, onError]);

  // Stop the exercise session
  const stopSession = useCallback(() => {
    if (!isConnected || !characteristic) {
      return;
    }
    
    setIsSessionActive(false);
    
    // Send command to ESP32 to stop tracking
    const command = new Uint8Array([0]); // 0 = stop
    characteristic.writeValue(command).catch(onError);
  }, [isConnected, characteristic, onError]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (characteristic) {
        characteristic.stopNotifications().catch(console.error);
      }
      if (connectedDevice?.gatt?.connected) {
        connectedDevice.gatt.disconnect();
      }
    };
  }, [connectedDevice, characteristic]);

  return {
    isConnected,
    isScanning,
    availableDevices,
    accelerationData,
    isSessionActive,
    startScan,
    stopScan,
    connectToDevice,
    startSession,
    stopSession
  };
}

// Type definitions for Web Bluetooth API
interface BluetoothLE extends Bluetooth {
  gatt?: BluetoothRemoteGATTServer;
  id: string;
  name: string;
}
