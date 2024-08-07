import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from '@/auth/use-user';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

export const Route = createRootRoute({
  component: () => (
    <body className="dark">
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Outlet />
          <TanStackRouterDevtools position="top-left" />
          <ReactQueryDevtools buttonPosition="top-right" />
        </UserProvider>
      </QueryClientProvider>
    </body>
  ),
});
