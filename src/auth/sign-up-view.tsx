import { type ReactNode } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { ClientResponseError } from 'pocketbase';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { pb } from '@/pocketbase';

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

const errorSchema = z.object({
  data: z
    .object({
      username: z.object({ message: z.string() }),
      password: z.object({ message: z.string() }),
    })
    .partial(),
});

type FormSchema = z.infer<typeof formSchema>;

async function signInMutationFn({
  password,
  username,
}: {
  username: string;
  password: string;
}): Promise<void> {
  await pb.collection('users').create({
    username,
    password,
    passwordConfirm: password,
  });

  await pb.collection('users').authWithPassword(username, password);
}

export function SignUpView(): ReactNode {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: signInMutationFn,
    onError: (error) => {
      if (error instanceof ClientResponseError) {
        Object.entries(errorSchema.parse(error.data).data).forEach(
          ([key, value]) => {
            form.setError(
              key === 'username' || key === 'password' ? key : 'root',
              { message: value.message },
            );
          },
        );
      }
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>): void {
    mutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- form submit
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : null}
              Create an account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
