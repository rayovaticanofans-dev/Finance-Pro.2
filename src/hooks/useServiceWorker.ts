import { useCallback, useEffect, useState } from 'react';

type ServiceWorkerStatus = 'unsupported' | 'registering' | 'registered' | 'error';

interface ServiceWorkerState {
  status: ServiceWorkerStatus;
  isUpdateAvailable: boolean;
  updateServiceWorker: () => void;
  registration: ServiceWorkerRegistration | null;
}

export function useServiceWorker(): ServiceWorkerState {
  const [status, setStatus] = useState<ServiceWorkerStatus>('unsupported');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setStatus('unsupported');
      return;
    }

    setStatus('registering');

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        setRegistration(reg);
        setStatus('registered');

        reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(worker);
              setIsUpdateAvailable(true);
            }
          });
        });

        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
          setIsUpdateAvailable(true);
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (!waitingWorker) return;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    setIsUpdateAvailable(false);
    window.location.reload();
  }, [waitingWorker]);

  return { status, isUpdateAvailable, updateServiceWorker, registration };
}
