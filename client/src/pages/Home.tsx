import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DeviceConnectionCard from "@/components/DeviceConnectionCard";
import ExerciseStatsCards from "@/components/ExerciseStatsCards";
import AccelerationChart from "@/components/AccelerationChart";
import SessionInfoCard from "@/components/SessionInfoCard";
import ConnectionModal from "@/components/ConnectionModal";
import { useBluetooth } from "@/hooks/useBluetooth";
import { useExerciseData } from "@/hooks/useExerciseData";

export default function Home() {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { 
    isConnected,
    isScanning,
    availableDevices,
    startScan,
    stopScan,
    connectToDevice,
    accelerationData,
    isSessionActive,
    startSession,
    stopSession
  } = useBluetooth({
    onError: (error) => {
      setErrorMessage(error.message);
      setShowErrorModal(true);
    }
  });

  const {
    repCount,
    sessionDuration,
    averageRepTime,
    maxAcceleration,
    accelerationHistory,
    resetData
  } = useExerciseData({
    isSessionActive,
    accelerationData
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Navbar isConnected={isConnected} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <DeviceConnectionCard 
          isScanning={isScanning}
          availableDevices={availableDevices}
          onScanClick={() => isScanning ? stopScan() : startScan()}
          onConnectDevice={connectToDevice}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ExerciseStatsCards 
            repCount={repCount}
            accelerationData={accelerationData}
            isSessionActive={isSessionActive}
            onStartSession={startSession}
            onStopSession={stopSession}
            onResetData={resetData}
          />
          
          <AccelerationChart 
            data={accelerationHistory}
          />
        </div>
        
        <SessionInfoCard 
          sessionDuration={sessionDuration}
          averageRepTime={averageRepTime}
          maxAcceleration={maxAcceleration}
        />
      </main>
      
      <ConnectionModal 
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
      />
    </div>
  );
}
