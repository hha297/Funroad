import type { CollectionConfig } from 'payload';

export const Tenants: CollectionConfig = {
        slug: 'tenants',
        admin: {
                useAsTitle: 'slug',
        },

        fields: [
                {
                        name: 'name',
                        type: 'text',
                        required: true,
                        label: 'Store Name',
                        admin: {
                                description: 'The name of your store',
                        },
                },
                {
                        name: 'slug',
                        type: 'text',
                        index: true,
                        required: true,
                        unique: true,
                        admin: {
                                description: 'This is the subdomain of your store',
                        },
                },
                {
                        name: 'image',
                        type: 'upload',
                        relationTo: 'media',
                },
                {
                        name: 'stripeAccountId',
                        type: 'text',
                        required: true,
                        admin: {
                                readOnly: true,
                        },
                },
                {
                        name: 'stripeDetailsSubmitted',
                        type: 'checkbox',
                        admin: {
                                readOnly: true,
                                description: "You can't create a store until you've submitted your Stripe details",
                        },
                },
        ],
};
