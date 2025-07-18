import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      toast.success('Conexão restaurada! 🌐');
      
      // Hide indicator after 3 seconds
      timeoutId = setTimeout(() => {
        setShowIndicator(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
      toast.warning('Você está offline. Algumas funcionalidades podem estar limitadas.');
      
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setShowIndicator(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!showIndicator) return null;

  return (
    <div className="fixed top-4 right-4 z-40 animate-fade-in">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center gap-2 py-2 px-3 shadow-soft"
      >
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            Offline
          </>
        )}
      </Badge>
    </div>
  );
};