import { ProductList, ProductListSkeleton } from '@/modules/products/ui/components/product-list';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import React, { Suspense } from 'react';

interface Props {
        params: Promise<{ category: string }>;
}
const CategoryPage = async ({ params }: Props) => {
        const queryClient = getQueryClient();
        const { category } = await params;
        void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({ category }));

        return (
                <HydrationBoundary state={dehydrate(queryClient)}>
                        <Suspense fallback={<ProductListSkeleton />}>
                                <ProductList category={category} />
                        </Suspense>
                </HydrationBoundary>
        );
};

export default CategoryPage;
