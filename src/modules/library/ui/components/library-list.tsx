'use client';
import { useTRPC } from '@/trpc/client';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { DEFAULT_LIMIT } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { InboxIcon } from 'lucide-react';
import { LibraryProductCard, LibraryProductCardSkeleton } from './library-product-card';

export const LibraryList = () => {
        const trpc = useTRPC();

        const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
                trpc.library.getMany.infiniteQueryOptions(
                        { limit: DEFAULT_LIMIT },
                        {
                                getNextPageParam: (lastPage) => {
                                        return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
                                },
                        },
                ),
        );

        if (data.pages?.[0]?.docs?.length === 0) {
                return (
                        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                                <InboxIcon />
                                <p className="text-base font-medium">No products found</p>
                        </div>
                );
        }

        return (
                <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                {data?.pages
                                        .flatMap((page) => page.docs)
                                        .map((product) => (
                                                <LibraryProductCard
                                                        key={product.id}
                                                        id={product.id}
                                                        name={product.name}
                                                        imageUrl={product.image?.url}
                                                        tenantSlug={product.tenant.slug}
                                                        tenantImageUrl={product.tenant?.image?.url}
                                                        reviewRating={product.reviewsRating}
                                                        reviewCount={product.reviewCount}
                                                />
                                        ))}
                        </div>
                        <div className="flex justify-center pt-8">
                                {hasNextPage && (
                                        <Button
                                                onClick={() => fetchNextPage()}
                                                disabled={isFetchingNextPage}
                                                variant={'elevated'}
                                                className="font-medium disabled:cursor-not-allowed disabled:opacity-50 text-base bg-white"
                                        >
                                                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                                        </Button>
                                )}
                        </div>
                </>
        );
};

export const ProductListSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                        <LibraryProductCardSkeleton key={index} />
                ))}
        </div>
);
