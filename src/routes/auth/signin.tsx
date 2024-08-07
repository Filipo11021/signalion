import { createFileRoute } from '@tanstack/react-router';
import { SignInView } from '@/modules/auth/sign-in-view';

export const Route = createFileRoute('/auth/signin')({
  component: SignInView,
});
