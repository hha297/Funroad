import { baseProcedure, createTRPCRouter } from '@/trpc/init';

import { Category } from '@/payload-types';

export const categoriesRouter = createTRPCRouter({
        getMany: baseProcedure.query(async ({ ctx }) => {
                const data = await ctx.db.find({
                        collection: 'categories',
                        depth: 1,
                        pagination: false,
                        where: {
                                parent: {
                                        exists: false,
                                },
                        },
                        sort: 'name',
                });

                const formattedData = data.docs.map((doc) => ({
                        ...doc,
                        subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
                                // Because subcategories is a nested collection, It's needed to use the same method to get the data
                                ...(doc as Category),
                                subcategories: undefined,
                        })),
                }));
                return formattedData;
        }),
});
