import { ClientResponseError } from 'pocketbase';
import {
  type FieldValues,
  type Path,
  type UseFormSetError,
} from 'react-hook-form';
import { z } from 'zod';

export function formatFormErrors<TFieldValues extends FieldValues>({
  error,
  setFormError,
  fields,
}: {
  fields: (keyof TFieldValues)[];
  error: unknown;
  setFormError: UseFormSetError<TFieldValues>;
}): void {
  const schema = z.record(
    z.enum(fields as [string, ...string[]]),
    z.object({ message: z.string() }).optional(),
  );
  if (error instanceof ClientResponseError) {
    try {
      const data = schema.parse(error.data.data);

      for (const [key, value] of Object.entries(data)) {
        setFormError(key as Path<TFieldValues>, {
          message: value?.message,
        });
      }
    } catch {
      if (error instanceof Error) {
        setFormError('root', { message: error.message });
        return;
      }

      setFormError('root', { message: 'unknown error' });
    }
  }
}
