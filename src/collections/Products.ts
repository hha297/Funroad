import { isSuperAdmin } from '@/lib/access';
import { Tenant } from '@/payload-types';
import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical';
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
                delete: ({ req }) => isSuperAdmin(req.user),
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
                        type: 'richText',
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
                        editor: lexicalEditor({
                                features: ({ defaultFeatures }) => [
                                        ...defaultFeatures,
                                        UploadFeature({
                                                collections: {
                                                        media: {
                                                                fields: [
                                                                        {
                                                                                name: 'alt',
                                                                                type: 'text',
                                                                        },
                                                                ],
                                                        },
                                                },
                                        }),
                                ],
                        }),
                        type: 'richText',
                        admin: {
                                description:
                                        'Protected content only visible to customers after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Supports Markdown syntax.',
                        },
                },
                {
                        name: 'isArchived',
                        label: 'Archived',
                        type: 'checkbox',
                        defaultValue: false,
                        admin: {
                                description: 'If checked, it will not be visible to customers',
                        },
                },
                {
                        name: 'isPrivate',
                        label: 'Private',
                        type: 'checkbox',
                        defaultValue: false,
                        admin: {
                                description: 'If checked, this product will not be visible on the public store',
                        },
                },
        ],
};
