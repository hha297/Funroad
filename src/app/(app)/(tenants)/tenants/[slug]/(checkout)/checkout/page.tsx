import { CheckoutView } from '@/modules/checkout/ui/view/checkout-view';
import React from 'react';

interface CheckoutViewProps {
        params: Promise<{ slug: string }>;
}
const CheckoutPage = async ({ params }: CheckoutViewProps) => {
        const { slug } = await params;
        return <CheckoutView tenantSlug={slug} />;
};

export default CheckoutPage;
