import { ProductList, ProductListSkeleton } from '@/modules/products/ui/components/product-list';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import React, { Suspense } from 'react';

interface Props {
        params: Promise<{ subCategory: string }>;
}
const SubCategoryPage = async ({ params }: Props) => {
        const queryClient = getQueryClient();
        const { subCategory } = await params;
        void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({ category: subCategory }));

        return (
                <HydrationBoundary state={dehydrate(queryClient)}>
                        <Suspense fallback={<ProductListSkeleton />}>
                                <ProductList category={subCategory} />
                        </Suspense>
                </HydrationBoundary>
        );
};

export default SubCategoryPage;
