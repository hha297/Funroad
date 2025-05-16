import { AppRouter } from '@/trpc/routers/_app';
import type { inferRouterOutputs } from '@trpc/server';

export type ProductsGetManyOutput = inferRouterOutputs<AppRouter>['products']['getMany'];
