'use client';

import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCart } from '../../hooks/use-cart';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { generateTenantUrl } from '@/lib/utils';
import { CheckoutItem } from '../components/checkout-item';
import { CheckoutSidebar } from '../components/checkout-sidebar';
import { InboxIcon, Loader2Icon } from 'lucide-react';
import { useCheckoutState } from '../../hooks/use-checkout-state';
import { useRouter } from 'next/navigation';

interface CheckoutViewProps {
        tenantSlug: string;
}
export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
        const [states, setStates] = useCheckoutState();
        const router = useRouter();
        const { productIds, clearAllCarts, clearCart, removeProduct } = useCart(tenantSlug);
        const trpc = useTRPC();
        const { data, isLoading, error } = useQuery(
                trpc.checkout.getProducts.queryOptions({
                        ids: productIds,
                }),
        );

        const purchase = useMutation(
                trpc.checkout.purchase.mutationOptions({
                        onMutate: () => {
                                setStates({
                                        cancel: false,
                                        success: false,
                                });
                        },
                        onSuccess: (data) => {
                                window.location.href = data.url;
                        },
                        onError: (error) => {
                                if (error?.data?.code === 'UNAUTHORIZED') {
                                        // TODO: Modify when has subdomain
                                        router.push('/sign-in');
                                        toast.error('You must be signed in to make a purchase.');
                                } else {
                                        toast.error(
                                                error.message || 'An error occurred while processing your purchase.',
                                        );
                                }
                        },
                }),
        );

        useEffect(() => {
                if (error?.data?.code === 'NOT_FOUND') {
                        clearAllCarts();
                        toast.warning(
                                'Some products in your cart are no longer available. Your cart has been cleared.',
                        );
                }
        }, [clearAllCarts, error]);

        useEffect(() => {
                if (states.success) {
                        clearCart();
                        setStates({
                                cancel: false,
                                success: false,
                        });
                        router.push('/products');
                        // TODO: Invalidate queries to refresh cart state
                }
        }, [states.success, clearCart, setStates, router]);

        if (isLoading) {
                return (
                        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                                <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                                        <Loader2Icon className="animate-spin text-muted-foreground" />
                                </div>
                        </div>
                );
        }

        if (data?.totalDocs === 0) {
                return (
                        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                                <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                                        <InboxIcon />
                                        <p className="text-base font-medium">No products found</p>
                                </div>
                        </div>
                );
        }

        return (
                <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                                <div className="lg:col-span-4">
                                        <div className="border rounded-md outline-hidden bg-white">
                                                {data?.docs.map((product, index) => (
                                                        <CheckoutItem
                                                                key={product.id}
                                                                isLast={index === data.docs.length - 1}
                                                                imageUrl={product.image?.url}
                                                                name={product.name}
                                                                productUrl={`${generateTenantUrl(product.tenant.slug)}/product/${product.id}`}
                                                                tenantUrl={generateTenantUrl(product.tenant.slug)}
                                                                tenantImageUrl={product.tenant.image?.url}
                                                                tenantName={product.tenant.name}
                                                                price={product.price}
                                                                onRemove={() => removeProduct(product.id)}
                                                        />
                                                ))}
                                        </div>
                                </div>
                                <div className="lg:col-span-3">
                                        <CheckoutSidebar
                                                total={data?.totalPrice || 0}
                                                onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
                                                isCanceled={states.cancel}
                                                isPending={purchase.isPending}
                                        />
                                </div>
                        </div>
                </div>
        );
};
