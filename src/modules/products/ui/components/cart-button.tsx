import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/modules/checkout/hooks/use-cart';
import Link from 'next/link';

interface Props {
        tenantSlug: string;
        productId: string;
        isPurchased?: boolean;
}

export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {
        const cart = useCart(tenantSlug);

        if (isPurchased) {
                return (
                        <Button variant={'elevated'} asChild className="flex-1 font-medium bg-pink-400">
                                <Link href={`/library/${productId}`} prefetch>
                                        View in Library
                                </Link>
                        </Button>
                );
        }
        return (
                <Button
                        variant={'elevated'}
                        className={cn('flex-1 bg-white', cart.isProductInCart(productId) && 'bg-pink-400')}
                        onClick={() => cart.toggleProduct(productId)}
                >
                        {cart.isProductInCart(productId) ? 'Remove from cart' : 'Add to cart'}
                </Button>
        );
};
