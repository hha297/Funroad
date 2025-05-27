import { Button } from '@/components/ui/button';
import { useCart } from '../../hooks/use-cart';
import { cn, generateTenantUrl } from '@/lib/utils';
import Link from 'next/link';
import { ShoppingCartIcon } from 'lucide-react';

interface CheckoutButtonProps {
        className?: string;
        hideIfEmpty?: boolean;
        tenantSlug: string;
}

export const CheckoutButton = ({ className, hideIfEmpty, tenantSlug }: CheckoutButtonProps) => {
        const { totalItems } = useCart(tenantSlug);

        if (hideIfEmpty && !totalItems) {
                return null;
        }
        return (
                <Button variant={'elevated'} asChild className={cn(' bg-white', className)}>
                        <Link href={`${generateTenantUrl(tenantSlug)}/checkout`}>
                                <ShoppingCartIcon />
                                {totalItems > 0 ? totalItems : ''}
                        </Link>
                </Button>
        );
};
