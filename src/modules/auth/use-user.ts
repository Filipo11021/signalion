import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { type ReactNode, useEffect } from 'react';
import { pb } from '@/modules/pocketbase/pocketbase';

interface User {
  id: string;
  username: string;
}

export function useUser(): { user: UseQueryResult<User> } {
  const query = useQuery({
    queryKey: ['user'],
    staleTime: Infinity,
    queryFn: () => {
      const user = pb.authStore.model as unknown as User | null;
      if (!user) throw Error('Unauthorized');
      return user;
    },
  });

  return {
    user: query,
  };
}

export function UserProvider({ children }: { children: ReactNode }): ReactNode {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_, model) => {
      queryClient.setQueriesData<User>({ queryKey: ['user'] }, () => {
        const user = model as unknown as User | null;
        if (!user) throw Error('Unauthorized');
        return user;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return children;
}
