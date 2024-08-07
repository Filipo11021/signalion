import { type ReactNode } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { formatFormErrors } from '@/modules/format-form-error';
import { Button } from '@/modules/ui/button';
import { Input } from '@/modules/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/ui/form';
import { Alert, AlertTitle } from '@/modules/ui/alert';
import { pb } from '@/modules/pocketbase/pocketbase';

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

type FormSchema = z.infer<typeof formSchema>;

async function signInMutationFn({
  password,
  username,
}: {
  username: string;
  password: string;
}): Promise<void> {
  await pb.collection('users').authWithPassword(username, password);
}

export function SignInView(): ReactNode {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: signInMutationFn,
    onError: (mutationError) => {
      formatFormErrors({
        error: mutationError,
        setFormError: form.setError,
        fields: ['password', 'username'],
      });
    },
  });

  function handleSubmit(values: FormSchema): void {
    mutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials below to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
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
              Log In
            </Button>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/auth/signup" className="underline">
                Sign up
              </Link>
            </div>

            {form.formState.errors.root ? (
              <Alert variant="destructive">
                <AlertTitle>{form.formState.errors.root.message}</AlertTitle>
              </Alert>
            ) : null}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
