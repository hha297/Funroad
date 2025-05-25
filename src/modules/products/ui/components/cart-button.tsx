import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/modules/checkout/hooks/use-cart';

interface Props {
        tenantSlug: string;
        productId: string;
}

export const CartButton = ({ tenantSlug, productId }: Props) => {
        const cart = useCart(tenantSlug);
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
