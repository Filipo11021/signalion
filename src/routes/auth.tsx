import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { type ReactNode } from 'react';
import { AuthLayout } from '@/auth/auth-layout';

export const Route = createFileRoute('/auth')({
  component: Page,
});

function getCurrentAuthView(pathname: string): 'signUp' | 'signIn' {
  switch (pathname) {
    case '/auth/signin':
      return 'signIn';
    case '/auth/signup':
      return 'signUp';
    default:
      return 'signIn';
  }
}

function Page(): ReactNode {
  const { pathname } = useLocation();

  return (
    <AuthLayout currentView={getCurrentAuthView(pathname)}>
      <Outlet />
    </AuthLayout>
  );
}
