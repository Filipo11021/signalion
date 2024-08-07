import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { type ReactNode } from 'react';
import { AuthLayout } from '@/modules/auth/auth-layout';
import { Protected } from '@/modules/auth/protected';

export const Route = createFileRoute('/auth')({
  component: Page,
});

function AuthOutlet(): ReactNode {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}

function Page(): ReactNode {
  return (
    <Protected Fallback={AuthOutlet}>
      <Navigate to="/app" />
    </Protected>
  );
}
