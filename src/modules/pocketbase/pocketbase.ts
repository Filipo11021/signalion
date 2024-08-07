import PocketBase from 'pocketbase';
import { env } from '@/modules/env';
import type { TypedPocketBase } from './pocketbase-types';

export const pb = new PocketBase(env.VITE_POCKETBASE_URL) as TypedPocketBase;
