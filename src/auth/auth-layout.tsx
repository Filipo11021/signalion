import { type ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <div className="flex min-h-dvh flex-col items-center pt-[10%]">
      <div className="flex w-full max-w-sm flex-col">{children}</div>
    </div>
  );
}
