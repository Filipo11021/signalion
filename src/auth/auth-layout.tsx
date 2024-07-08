import { Link } from '@tanstack/react-router';
import { type ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs';

export function AuthLayout({
  children,
  currentView,
}: {
  children: ReactNode;
  currentView: 'signUp' | 'signIn';
}): ReactNode {
  return (
    <div className="mt-[10%] flex min-h-dvh flex-col items-center">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Tabs className="w-full" defaultValue={currentView}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger asChild value="signUp">
              <Link to="/auth/signup">Sign Up</Link>
            </TabsTrigger>

            <TabsTrigger asChild value="signIn">
              <Link to="/auth/signin">Sign In</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </div>
  );
}
