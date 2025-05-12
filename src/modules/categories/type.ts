import { AppRouter } from '@/trpc/routers/_app';
import type { inferRouterOutputs } from '@trpc/server';

export type CategoriesGetManyOutput = inferRouterOutputs<AppRouter>['categories']['getMany'];
