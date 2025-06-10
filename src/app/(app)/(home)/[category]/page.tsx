import { DEFAULT_LIMIT } from '@/lib/constants';
import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListSkeleton } from '@/modules/products/ui/components/product-list';

import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs';
import { Suspense } from 'react';

interface Props {
        searchParams: Promise<SearchParams>;
}
const CategoryPage = async ({ searchParams }: Props) => {
        const queryClient = getQueryClient();

        const filters = await loadProductFilters(searchParams);
        void queryClient.prefetchInfiniteQuery(
                trpc.products.getMany.infiniteQueryOptions({
                        ...filters,

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
};

export default CategoryPage;
