import { DEFAULT_LIMIT } from '@/lib/constants';
import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListSkeleton } from '@/modules/products/ui/components/product-list';

import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

interface Props {
        params: Promise<{ subCategory: string }>;
        searchParams: Promise<SearchParams>;
}
const SubCategoryPage = async ({ params, searchParams }: Props) => {
        const queryClient = getQueryClient();
        const { subCategory } = await params;
        const filters = await loadProductFilters(searchParams);
        void queryClient.prefetchInfiniteQuery(
                trpc.products.getMany.infiniteQueryOptions({
                        ...filters,
                        category: subCategory,
                        limit: DEFAULT_LIMIT,
                }),
        );

        return (
                <HydrationBoundary state={dehydrate(queryClient)}>
                        <Suspense fallback={<ProductListSkeleton />}>
                                <ProductListView category={subCategory} />
                        </Suspense>
                </HydrationBoundary>
        );
};

export default SubCategoryPage;
