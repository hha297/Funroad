import { DEFAULT_LIMIT } from '@/lib/constants';
import { ProductListSkeleton } from '@/modules/products/ui/components/product-list';

import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

export default async function Home() {
        const queryClient = getQueryClient();

        void queryClient.prefetchInfiniteQuery(
                trpc.products.getMany.infiniteQueryOptions({
                        limit: DEFAULT_LIMIT,
                }),
        );

        return (
                <HydrationBoundary state={dehydrate(queryClient)}>
                        <Suspense fallback={<ProductListSkeleton />}>
                                <ProductListView />
                        </Suspense>
                </HydrationBoundary>
        );
}
