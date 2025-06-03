import { isSuperAdmin } from '@/lib/access';
import { Tenant } from '@/payload-types';
import { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
        slug: 'products',
        access: {
                read: () => true,
                create: ({ req }) => {
                        if (isSuperAdmin(req.user)) return true;

                        const tenant = req.user?.tenants?.[0]?.tenant as Tenant;

                        return Boolean(tenant?.stripeDetailsSubmitted);
                },
        },
        admin: {
                useAsTitle: 'name',
                description: 'You must verify your account to create products',
        },
        fields: [
                {
                        name: 'name',
                        type: 'text',
                        required: true,
                },
                {
                        name: 'description',
                        // TODO: CHange to Rich Text
                        type: 'text',
                        required: true,
                },
                {
                        name: 'price',
                        type: 'number',
                        admin: {
                                description: 'EUR',
                        },
                        required: true,
                },
                {
                        name: 'category',
                        type: 'relationship',
                        relationTo: 'categories',
                        hasMany: false,
                },
                {
                        name: 'tags',
                        type: 'relationship',
                        relationTo: 'tags',
                        hasMany: true,
                },
                {
                        name: 'image',
                        type: 'upload',
                        relationTo: 'media',
                },
                {
                        name: 'refundPolicy',
                        type: 'select',
                        options: ['30-day', '14-day', '7-day', '3-day', '1-day', 'no-refund'],
                        defaultValue: '30-day',
                },
                {
                        name: 'content',
                        // TODO: CHange to Rich Text
                        type: 'textarea',
                        admin: {
                                description:
                                        'Protected content only visible to customers after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Supports Markdown syntax.',
                        },
                },
        ],
};
