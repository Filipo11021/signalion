import PocketBase from 'pocketbase';
import type { TypedPocketBase } from './pocketbase-types';

export const pb = new PocketBase(
  'https://pocketbase-n4w8kco.filipo.dev/',
) as TypedPocketBase;
