import { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
        slug: 'categories',
        access: {
                read: () => true,
                create: () => true,
        },
        fields: [{ name: 'name', type: 'text', required: true }],
};
