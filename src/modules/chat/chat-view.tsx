import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { type FormEvent, useEffect, useRef } from 'react';
import { type ReactNode } from '@tanstack/react-router';
import { SendIcon } from 'lucide-react';
import { pb } from '@/modules/pocketbase/pocketbase';
import { type MessagesResponse } from '@/modules/pocketbase/pocketbase-types';
import { useUser } from '@/modules/auth/use-user';

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

export function ChatView(): ReactNode {
  const formRef = useRef<HTMLFormElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();
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
            className={`flex ${user.data?.id === userId ? 'ml-auto' : 'mr-auto'}`}
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
      <form className="px-4 pb-4" ref={formRef} onSubmit={handleSubmit}>
        <div className="flex items-center justify-center gap-4">
          <input
            className="w-full rounded-md bg-slate-400 px-6 py-2 text-black"
            type="text"
            required
            minLength={1}
            name="content"
            placeholder={
              addMessageMutation.isPending ? '...loading' : 'message'
            }
            disabled={addMessageMutation.isPending}
          />
          <button type="submit">
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
}
