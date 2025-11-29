import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { Alert, AlertDescription } from './ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineBanner = () => {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !wasOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top">
      {!isOnline ? (
        <Alert className="rounded-none border-x-0 border-t-0 bg-yellow-50 border-yellow-200">
          <WifiOff className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Anda sedang offline.</strong> Menampilkan data tersimpan.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="rounded-none border-x-0 border-t-0 bg-green-50 border-green-200">
          <Wifi className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Kembali online!</strong> Menyinkronkan data...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};