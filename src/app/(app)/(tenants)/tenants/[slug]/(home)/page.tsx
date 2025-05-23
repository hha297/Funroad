import { DEFAULT_LIMIT } from '@/lib/constants';
import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SearchParams } from 'nuqs';
import React from 'react';

interface TenantPageProps {
        searchParams: Promise<SearchParams>;
        params: Promise<{
                slug: string;
        }>;
}
const TenantPage = async ({ searchParams, params }: TenantPageProps) => {
        const { slug } = await params;
        const filters = await loadProductFilters(searchParams);
        const queryClient = getQueryClient();
        void queryClient.prefetchInfiniteQuery(
                trpc.products.getMany.infiniteQueryOptions({
                        ...filters,
                        tenantSlug: slug,
                        limit: DEFAULT_LIMIT,
                }),
        );
        return (
                <HydrationBoundary state={dehydrate(queryClient)}>
                        <ProductListView tenantSlug={slug} narrowView />
                </HydrationBoundary>
        );
};

export default TenantPage;
