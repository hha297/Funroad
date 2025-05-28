import { useCartStore } from '../store/use-cart-store';

export const useCart = (tenantSlug: string) => {
        const addProduct = useCartStore((state) => state.addProduct);
        const removeProduct = useCartStore((state) => state.removeProduct);
        const clearCart = useCartStore((state) => state.clearCart);
        const clearAllCarts = useCartStore((state) => state.clearAllCarts);

        const productIds = useCartStore((state) => state.tenantCarts[tenantSlug]?.productIds || []);

        const toggleProduct = (productId: string) => {
                if (productIds.includes(productId)) {
                        removeProduct(tenantSlug, productId);
                } else {
                        addProduct(tenantSlug, productId);
                }
        };

        const isProductInCart = (productId: string) => productIds.includes(productId);

        const clearTenantCart = () => {
                clearCart(tenantSlug);
        };

        return {
                productIds,
                addProduct: (productId: string) => addProduct(tenantSlug, productId),
                removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
                clearCart: clearTenantCart,
                clearAllCarts,
                toggleProduct,
                isProductInCart,
                totalItems: productIds.length,
        };
};
