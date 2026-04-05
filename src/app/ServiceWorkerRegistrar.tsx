import { useEffect } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function ServiceWorkerRegistrar() {
  const { status } = useServiceWorker();
  useEffect(() => { void status; }, [status]);
  return null;
}
