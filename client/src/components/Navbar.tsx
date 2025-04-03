import { useTheme } from "@/hooks/use-theme-provider";
import { Button } from "@/components/ui/button";
import { Activity, Moon, Sun } from "lucide-react";

interface NavbarProps {
  isConnected: boolean;
}

export default function Navbar({ isConnected }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="text-primary h-6 w-6 mr-2" />
              <h1 className="text-xl font-semibold">Rep Tracker</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span 
                  className={`absolute inline-flex h-full w-full rounded-full ${
                    isConnected 
                      ? "bg-green-500 animate-pulse" 
                      : "bg-gray-400"
                  }`}
                />
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
