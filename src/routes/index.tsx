import { createFileRoute, Navigate } from '@tanstack/react-router';
import { type ReactNode } from 'react';
import { Protected } from '@/modules/auth/protected';

function RedirectToAuth(): ReactNode {
  return <Navigate to="/auth/signup" />;
}

export const Route = createFileRoute('/')({
  component: () => (
    <Protected Fallback={RedirectToAuth}>
      <Navigate to="/app" />
    </Protected>
  ),
});
