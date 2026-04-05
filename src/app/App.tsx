import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { GlobalStyles } from './GlobalStyles';
import { Providers } from './providers';
import { router } from './routes';
import { SplashScreen } from './SplashScreen';
import { ErrorBoundary } from './ErrorBoundary';
import { Toast } from '@/components/ui/Toast';

export default function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <GlobalStyles />
      <Providers>
        <Suspense fallback={<SplashScreen />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toast />
      </Providers>
    </ErrorBoundary>
  );
}
