import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiIcon, WifiOffIcon } from './LordIcon';
import { toast } from 'sonner';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
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

    // Only run client-side
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Initial check
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsOnline(false);
        setShowIndicator(true);
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, []);

  if (!showIndicator) return null;

  return (
    <div className="fixed top-4 right-4 z-40 animate-fade-in">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className={`flex items-center gap-2 py-1.5 px-2.5 shadow-soft text-xs ${
          isOnline ? "bg-success-500/90 hover:bg-success-500" : "bg-error-500/90 hover:bg-error-500"
        }`}
      >
        {isOnline ? (
          <>
            <WifiIcon size={10} trigger="hover" />
            <span>Conectado</span>
          </>
        ) : (
          <>
            <WifiOffIcon size={10} trigger="hover" />
            <span>Sem conexão</span>
          </>
        )}
      </Badge>
    </div>
  );
};
