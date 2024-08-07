import { type ReactNode } from 'react';
import { useUser } from './use-user';

export function Protected({
  Fallback,
  Loading,
  children,
}: {
  Fallback?: () => ReactNode;
  Loading?: () => ReactNode;
  children?: ReactNode;
}): ReactNode {
  const { user } = useUser();

  if (user.status === 'error') return Fallback ? <Fallback /> : null;

  if (user.status === 'pending') return Loading ? <Loading /> : null;

  return children;
}
