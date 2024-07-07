import PocketBase from 'pocketbase';
import type { TypedPocketBase } from './pocketbase-types';
import { env } from './env';

export const pb = new PocketBase(env.POCKETBASE_URL) as TypedPocketBase;
