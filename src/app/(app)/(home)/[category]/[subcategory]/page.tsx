import { loadProductFilters } from '@/modules/products/search-params';

import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SearchParams } from 'nuqs/server';

interface Props {
        params: Promise<{ subCategory: string }>;
        searchParams: Promise<SearchParams>;
}
const SubCategoryPage = async ({ params, searchParams }: Props) => {
        const queryClient = getQueryClient();
        const { subCategory } = await params;
        const filters = await loadProductFilters(searchParams);
        void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({ category: subCategory, ...filters }));

        return (
                <HydrationBoundary state={dehydrate(queryClient)}>
                        <ProductListView category={subCategory} />
                </HydrationBoundary>
        );
};

export default SubCategoryPage;
