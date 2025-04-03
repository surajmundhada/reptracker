import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

export default function ConnectionModal({
  isOpen,
  onClose,
  errorMessage
}: ConnectionModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-red-500">
            <AlertCircle className="h-5 w-5 mr-2" />
            Connection Error
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-4">{errorMessage || "Unable to connect to the Bluetooth device. Please make sure:"}</p>
            <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300">
              <li>Your device is powered on</li>
              <li>Bluetooth is enabled on your computer/phone</li>
              <li>You're using a compatible browser (Chrome, Edge, Opera)</li>
              <li>The device is within range</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-primary">OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
