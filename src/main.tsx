import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { App } from './app.tsx';
import './globals.css';

const queryClient = new QueryClient();

const root = document.getElementById('root');

if (!root) throw Error('root element not exist');

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
