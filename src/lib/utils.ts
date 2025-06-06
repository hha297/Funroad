import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
        return twMerge(clsx(inputs));
}

export function generateTenantUrl(tenantSlug: string) {
        const isDevelopment = process.env.NODE_ENV === 'development';
        const isSubdomainRoutingEnabled = process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === 'true';

        // In Development or if subdomain routing is disabled, use normal path
        if (isDevelopment || !isSubdomainRoutingEnabled) {
                return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`;
        }

        const protocol = 'https';
        const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;
        // In Production, use subdomain
        return `${protocol}://${tenantSlug}.${domain}`;
}

export function formatCurrency(value: number | string) {
        return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
        }).format(Number(value));
}
