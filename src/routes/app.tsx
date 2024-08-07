import { type ReactNode } from 'react';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { Protected } from '@/auth/protected';

export const Route = createFileRoute('/app')({
  component: Page,
});

function RedirectToAuth(): ReactNode {
  return <Navigate to="/auth/signup" />;
}

function Page(): ReactNode {
  return (
    <Protected Fallback={RedirectToAuth}>
      <Outlet />
    </Protected>
  );
}
