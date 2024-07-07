import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { pb } from './pocketbase';
import type { MessagesResponse } from './pocketbase-types';

export function App(): ReactNode {
  const { data: user, status: userStatus } = useUser();

  if (userStatus === 'pending') return '..loading';

  return user?.id ? <Chat /> : <AuthPage />;
}

function Chat(): ReactNode {
  const formRef = useRef<HTMLFormElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { data: user } = useUser();
  const { data } = useMessages();
  const addMessageMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      await pb.collection('messages').create({
        content,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- ...
        user: pb.authStore.model?.id,
      });
    },
    onSuccess: () => {
      scrollRef.current?.scrollIntoView();
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content')?.toString() ?? '';
    addMessageMutation.mutate(
      { content },
      {
        onSuccess: () => {
          formRef.current?.reset();
        },
      },
    );
  }

  return (
    <div className="flex h-dvh flex-col justify-end bg-slate-900 text-white">
      <div className="flex flex-col gap-2 overflow-y-scroll p-4">
        {data?.map(({ content, id, user: userId }) => (
          <div
            className={`flex ${user?.id === userId ? 'ml-auto' : 'mr-auto'}`}
            key={id}
          >
            {content}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      {addMessageMutation.isError ? (
        <div>{addMessageMutation.error.message}</div>
      ) : null}
      <form className="px-4" ref={formRef} onSubmit={handleSubmit}>
        <input
          className="w-full rounded-md bg-slate-400 px-6 py-2 text-black"
          type="text"
          required
          minLength={1}
          name="content"
          placeholder={addMessageMutation.isPending ? '...loading' : 'message'}
          disabled={addMessageMutation.isPending}
        />
      </form>
    </div>
  );
}

function AuthPage(): ReactNode {
  const { mutate, error, isPending, isError } = useMutation({
    mutationFn: async ({
      password,
      username,
    }: {
      username: string;
      password: string;
    }) => {
      if (authType === 'register') {
        await pb.collection('users').create({
          username,
          password,
          passwordConfirm: password,
        });
      }

      await pb.collection('users').authWithPassword(username, password);
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';

    mutate({
      username,
      password,
    });
  }

  const [authType, setAuthType] = useState('login');

  return (
    <form onSubmit={handleSubmit}>
      {isError ? <div>{error.message}</div> : null}
      <input required minLength={1} name="username" type="text" />
      <input required name="password" type="password" />
      <button type="submit" disabled={isPending}>
        {isPending ? '...loading' : authType}
      </button>
      <fieldset>
        <legend>Auth Type</legend>

        <div>
          <input
            type="radio"
            id="login"
            name="auth-type"
            value="login"
            checked={authType === 'login'}
            onChange={() => {
              setAuthType('login');
            }}
          />
          <label htmlFor="login">login</label>
        </div>

        <div>
          <input
            checked={authType === 'register'}
            onChange={() => {
              setAuthType('register');
            }}
            type="radio"
            id="register"
            name="auth-type"
            value="register"
          />
          <label htmlFor="register">register</label>
        </div>
      </fieldset>
    </form>
  );
}

const messagesQueryOptions = queryOptions({
  queryKey: ['messages'],
  staleTime: Infinity,
  queryFn: () => pb.collection('messages').getFullList(),
  gcTime: Infinity,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: false,
});

function useMessages(): UseQueryResult<MessagesResponse[]> {
  const query = useQuery(messagesQueryOptions);
  const queryClient = useQueryClient();

  useEffect(() => {
    void pb.collection('messages').subscribe('*', ({ record }) => {
      queryClient.setQueriesData<MessagesResponse[]>(
        { queryKey: messagesQueryOptions.queryKey },
        (oldData) => {
          if (!oldData) return [record];
          return [...oldData, record];
        },
      );
    });

    return () => {
      void pb.collection('messages').unsubscribe('*');
    };
  }, [queryClient]);

  return query;
}

interface User {
  id: string;
  username: string;
}

function useUser(): UseQueryResult<User | null> {
  const query = useQuery({
    queryKey: ['user'],
    staleTime: Infinity,
    queryFn: () => pb.authStore.model as unknown as User | null,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsub = pb.authStore.onChange((_, model) => {
      queryClient.setQueriesData<User>({ queryKey: ['user'] }, () => {
        return model as unknown as User;
      });
    });

    return () => {
      unsub();
    };
  }, [queryClient]);

  return query;
}
