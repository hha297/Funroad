import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { ReviewForm } from './review-form';

interface ReviewSidebarProps {
        productId: string;
}
export const ReviewSidebar = ({ productId }: ReviewSidebarProps) => {
        const trpc = useTRPC();
        const { data } = useSuspenseQuery(trpc.reviews.getOne.queryOptions({ productId }));

        return <ReviewForm productId={productId} initialData={data} />;
};
