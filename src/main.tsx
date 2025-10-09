import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/global.css';
import { config } from './config';

// Configure TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Start MSW in development mode (configurable via VITE_ENABLE_MOCKING)
async function enableMocking() {
  if (config.isDev && config.enableMocking) {
    const { worker } = await import('./mocks/browser');

    // Initialize the worker and wait for it to be ready
    return worker.start({
      onUnhandledRequest: 'warn',
    }).then(() => {
      console.log('🚀 MSW is ready and intercepting requests');
    });
  } else if (config.isDev) {
    console.log('ℹ️ MSW mocking is disabled. Using real API at:', config.apiUrl);
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
});
