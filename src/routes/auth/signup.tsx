import { createFileRoute } from '@tanstack/react-router';
import { SignUpView } from '@/auth/sign-up-view';

export const Route = createFileRoute('/auth/signup')({
  component: SignUpView,
});
