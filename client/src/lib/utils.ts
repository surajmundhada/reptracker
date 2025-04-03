import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Create custom Bluetooth ID for the ESP32
export function generateRandomBluetoothId(): string {
  const hexChars = '0123456789ABCDEF';
  let result = '';
  
  // Format: XX:XX:XX:XX:XX:XX
  for (let i = 0; i < 6; i++) {
    result += hexChars[Math.floor(Math.random() * 16)];
    result += hexChars[Math.floor(Math.random() * 16)];
    if (i < 5) result += ':';
  }
  
  return result;
}

// Helper function to download data as CSV
export function downloadAsCSV(data: any[], filename: string): void {
  if (!data.length) return;
  
  // Extract headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = 
    headers.join(',') + 
    '\n' + 
    data.map(row => {
      return headers.map(fieldName => {
        // Handle special characters and quotes in the data
        const cell = row[fieldName] != null ? row[fieldName].toString() : '';
        return `"${cell.replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
