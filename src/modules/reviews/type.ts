import { AppRouter } from '@/trpc/routers/_app';
import { inferRouterOutputs } from '@trpc/server';

export type ReviewGetOneOutput = inferRouterOutputs<AppRouter>['reviews']['getOne'];
