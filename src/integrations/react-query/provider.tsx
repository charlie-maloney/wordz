'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: ReactNode }) {
  // ensure one client per browser tab/session
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
    </QueryClientProvider>
  );
}
