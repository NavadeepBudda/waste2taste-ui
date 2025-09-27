import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.healthCheck();
        setStatus('connected');
        setLastCheck(new Date());
      } catch (error) {
        setStatus('disconnected');
        setLastCheck(new Date());
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          variant: 'default' as const,
          text: 'API Connected',
          color: 'bg-green-500',
        };
      case 'disconnected':
        return {
          variant: 'destructive' as const,
          text: 'API Disconnected',
          color: 'bg-red-500',
        };
      default:
        return {
          variant: 'secondary' as const,
          text: 'Checking...',
          color: 'bg-yellow-500',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusInfo.color} ${status === 'checking' ? 'animate-pulse' : ''}`} />
          <Badge variant={statusInfo.variant} className="text-xs">
            {statusInfo.text}
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Waste2Taste API Status
          {lastCheck && (
            <>
              <br />
              Last checked: {lastCheck.toLocaleTimeString()}
            </>
          )}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}