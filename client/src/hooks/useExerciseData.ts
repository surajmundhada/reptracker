import { useState, useEffect, useRef } from "react";

interface UseExerciseDataOptions {
  isSessionActive: boolean;
  accelerationData: { x: number; y: number; z: number };
}

export function useExerciseData({ isSessionActive, accelerationData }: UseExerciseDataOptions) {
  const [repCount, setRepCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState("00:00:00");
  const [averageRepTime, setAverageRepTime] = useState("0.0s");
  const [maxAcceleration, setMaxAcceleration] = useState("0.00 m/s²");
  const [accelerationHistory, setAccelerationHistory] = useState<Array<{
    timestamp: number;
    x: number;
    y: number;
    z: number;
  }>>([]);
  
  // Reference for tracking session time
  const sessionStartRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Reference values for rep detection
  const lastPeakTimeRef = useRef<number | null>(null);
  const repTimesRef = useRef<number[]>([]);
  const accelerationThresholdRef = useRef(2.0); // Adjust based on your needs
  const wasAboveThresholdRef = useRef(false);
  
  // Initialize session
  useEffect(() => {
    if (isSessionActive && sessionStartRef.current === null) {
      sessionStartRef.current = Date.now();
      startTimeRef.current = Date.now();
    } else if (!isSessionActive) {
      sessionStartRef.current = null;
    }
  }, [isSessionActive]);
  
  // Update timer
  useEffect(() => {
    if (isSessionActive && startTimeRef.current) {
      const updateTimer = () => {
        const elapsedMs = Date.now() - startTimeRef.current!;
        const seconds = Math.floor((elapsedMs / 1000) % 60);
        const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
        const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
        
        setSessionDuration(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
        
        timerRef.current = requestAnimationFrame(updateTimer);
      };
      
      timerRef.current = requestAnimationFrame(updateTimer);
      
      return () => {
        if (timerRef.current) {
          cancelAnimationFrame(timerRef.current);
        }
      };
    }
  }, [isSessionActive]);
  
  // Track acceleration data and detect reps
  useEffect(() => {
    if (!isSessionActive) return;
    
    // Add to acceleration history
    const timestamp = sessionStartRef.current ? (Date.now() - sessionStartRef.current) / 1000 : 0;
    
    setAccelerationHistory(prev => {
      const newHistory = [
        ...prev,
        { timestamp, ...accelerationData }
      ];
      
      // Keep only the last 100 points for performance
      if (newHistory.length > 100) {
        return newHistory.slice(newHistory.length - 100);
      }
      
      return newHistory;
    });
    
    // Update max acceleration
    const magnitudeSquared = 
      accelerationData.x * accelerationData.x + 
      accelerationData.y * accelerationData.y + 
      accelerationData.z * accelerationData.z;
    const magnitude = Math.sqrt(magnitudeSquared);
    
    setMaxAcceleration(prev => {
      const currentMax = parseFloat(prev);
      return magnitude > currentMax ? magnitude.toFixed(2) + " m/s²" : prev;
    });
    
    // Detect reps using a simple threshold crossing algorithm
    // This is a basic implementation - you might need to adjust based on your specific exercise
    if (magnitude > accelerationThresholdRef.current) {
      if (!wasAboveThresholdRef.current) {
        wasAboveThresholdRef.current = true;
        
        // Detect if this is a new rep (debounce)
        const now = Date.now();
        if (lastPeakTimeRef.current === null || now - lastPeakTimeRef.current > 500) {
          setRepCount(prevCount => prevCount + 1);
          
          // Calculate rep time
          if (lastPeakTimeRef.current !== null) {
            const repTimeMs = now - lastPeakTimeRef.current;
            repTimesRef.current.push(repTimeMs);
            
            // Calculate average rep time
            const avgRepTimeMs = repTimesRef.current.reduce((sum, time) => sum + time, 0) / repTimesRef.current.length;
            setAverageRepTime((avgRepTimeMs / 1000).toFixed(1) + 's');
          }
          
          lastPeakTimeRef.current = now;
        }
      }
    } else {
      wasAboveThresholdRef.current = false;
    }
  }, [accelerationData, isSessionActive]);
  
  // Reset all data
  const resetData = () => {
    setRepCount(0);
    setSessionDuration("00:00:00");
    setAverageRepTime("0.0s");
    setMaxAcceleration("0.00 m/s²");
    setAccelerationHistory([]);
    
    sessionStartRef.current = isSessionActive ? Date.now() : null;
    startTimeRef.current = isSessionActive ? Date.now() : null;
    lastPeakTimeRef.current = null;
    repTimesRef.current = [];
    wasAboveThresholdRef.current = false;
  };
  
  return {
    repCount,
    sessionDuration,
    averageRepTime,
    maxAcceleration,
    accelerationHistory,
    resetData
  };
}
