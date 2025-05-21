import { loadProductFilters } from '@/modules/products/search-params';

import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs';

interface Props {
        params: Promise<{ category: string }>;
        searchParams: Promise<SearchParams>;
}
const CategoryPage = async ({ params, searchParams }: Props) => {
        const queryClient = getQueryClient();
        const { category } = await params;
        const filters = await loadProductFilters(searchParams);
        void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({ category, ...filters }));

        return (
                <HydrationBoundary state={dehydrate(queryClient)}>
                        <ProductListView category={category} />
                </HydrationBoundary>
        );
};

export default CategoryPage;
