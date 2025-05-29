import { LibraryProductView } from '@/modules/library/ui/view/library-product-view';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface LibraryPageProps {
        params: { productId: string };
}
const LibraryItemPage = async ({ params }: LibraryPageProps) => {
        const { productId } = await params;
        const queryClient = getQueryClient();
        void queryClient.prefetchQuery(trpc.library.getOne.queryOptions({ productId }));
        void queryClient.prefetchQuery(trpc.reviews.getOne.queryOptions({ productId }));
        return (
                <HydrationBoundary state={dehydrate(queryClient)}>
                        <LibraryProductView productId={productId} />
                </HydrationBoundary>
        );
};

export default LibraryItemPage;
