import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Signal, SignalLow } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export const NetworkStatusIndicator: React.FC = () => {
  const networkStatus = useNetworkStatus();

  if (networkStatus.isOnline && !networkStatus.isSlowConnection) {
    return null; // Don't show anything when connection is good
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {!networkStatus.isOnline ? (
        <Alert className="border-destructive bg-destructive/10 shadow-lg">
          <WifiOff className="h-4 w-4 text-destructive" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-destructive font-medium">
              You're offline
            </span>
            <Badge variant="destructive" className="ml-2">
              No Connection
            </Badge>
          </AlertDescription>
        </Alert>
      ) : networkStatus.isSlowConnection ? (
        <Alert className="border-warning bg-warning/10 shadow-lg">
          <SignalLow className="h-4 w-4 text-warning" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-warning font-medium">
              Slow connection detected
            </span>
            <Badge variant="secondary" className="ml-2 bg-warning/20 text-warning">
              {networkStatus.effectiveType}
            </Badge>
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};