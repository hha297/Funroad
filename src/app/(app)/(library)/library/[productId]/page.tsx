import { LibraryProductView, LibraryProductViewSkeleton } from '@/modules/library/ui/view/library-product-view';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
export const dynamic = 'force-dynamic';
interface LibraryPageProps {
        params: Promise<{ productId: string }>;
}
const LibraryItemPage = async ({ params }: LibraryPageProps) => {
        const { productId } = await params;
        const queryClient = getQueryClient();
        void queryClient.prefetchQuery(trpc.library.getOne.queryOptions({ productId }));
        void queryClient.prefetchQuery(trpc.reviews.getOne.queryOptions({ productId }));
        return (
                <HydrationBoundary state={dehydrate(queryClient)}>
                        <Suspense fallback={<LibraryProductViewSkeleton />}>
                                <LibraryProductView productId={productId} />
                        </Suspense>
                </HydrationBoundary>
        );
};

export default LibraryItemPage;
