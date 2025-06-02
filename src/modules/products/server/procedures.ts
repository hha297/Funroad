import { Category, Media, Tenant } from '@/payload-types';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { Sort, Where } from 'payload';
import { z } from 'zod';
import { sortValues } from '../search-params';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { headers as getHeaders } from 'next/headers';
export const productsRouter = createTRPCRouter({
        getOne: baseProcedure
                .input(
                        z.object({
                                id: z.string(),
                        }),
                )
                .query(async ({ ctx, input }) => {
                        const headers = await getHeaders();
                        const session = await ctx.db.auth({ headers });
                        const product = await ctx.db.findByID({
                                collection: 'products',
                                id: input.id,
                                depth: 2,
                                select: {
                                        content: false,
                                },
                        });

                        let isPurchased = false;
                        if (session.user) {
                                const ordersData = await ctx.db.find({
                                        collection: 'orders',
                                        limit: 1,
                                        pagination: false,
                                        where: {
                                                and: [
                                                        {
                                                                product: {
                                                                        equals: input.id,
                                                                },
                                                        },
                                                        {
                                                                user: {
                                                                        equals: session.user.id,
                                                                },
                                                        },
                                                ],
                                        },
                                });

                                isPurchased = !!ordersData.docs[0];
                        }

                        const reviews = await ctx.db.find({
                                collection: 'reviews',
                                pagination: false,
                                where: {
                                        product: {
                                                equals: input.id,
                                        },
                                },
                        });

                        const reviewRating =
                                reviews.docs.length > 0
                                        ? reviews.docs.reduce((acc, doc) => acc + doc.rating, 0) / reviews.totalDocs
                                        : 0;

                        const ratingDistribution: Record<number, number> = {
                                1: 0,
                                2: 0,
                                3: 0,
                                4: 0,
                                5: 0,
                        };

                        if (reviews.totalDocs > 0) {
                                reviews.docs.forEach((review) => {
                                        const rating = review.rating;

                                        if (rating >= 1 && rating <= 5) {
                                                ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
                                        }
                                });

                                Object.keys(ratingDistribution).forEach((key) => {
                                        const rating = Number(key);
                                        const count = ratingDistribution[rating] || 0;

                                        ratingDistribution[rating] = Math.round((count / reviews.totalDocs) * 100);
                                });
                        }

                        return {
                                ...product,
                                isPurchased,
                                image: product.image as Media | null,
                                tenant: product.tenant as Tenant & { image: Media | null },
                                reviewRating,
                                reviewCount: reviews.totalDocs,
                                ratingDistribution,
                        };
                }),

        getMany: baseProcedure
                .input(
                        z.object({
                                cursor: z.number().default(1),
                                limit: z.number().default(DEFAULT_LIMIT),
                                category: z.string().nullable().optional(),
                                minPrice: z.string().nullable().optional(),
                                maxPrice: z.string().nullable().optional(),
                                tags: z.array(z.string()).nullable().optional(),
                                sort: z.enum(sortValues).nullable().optional(),
                                tenantSlug: z.string().nullable().optional(),
                        }),
                )
                .query(async ({ ctx, input }) => {
                        const where: Where = {};
                        let sort: Sort = '-createdAt';

                        if (input.sort === 'curated') {
                                sort = '-createdAt';
                        }

                        if (input.sort === 'hot_and_new') {
                                sort = '+createdAt';
                        }
                        if (input.sort === 'trending') {
                                sort = 'name';
                        }
                        if (input.minPrice) {
                                where.price = {
                                        greater_than_equal: input.minPrice,
                                };
                        }

                        if (input.maxPrice) {
                                where.price = {
                                        less_than_equal: input.maxPrice,
                                };
                        }

                        if (input.tenantSlug) {
                                where['tenant.slug'] = {
                                        equals: input.tenantSlug,
                                };
                        }

                        if (input.category) {
                                const categoriesData = await ctx.db.find({
                                        collection: 'categories',
                                        limit: 1,
                                        depth: 1, //Populate Subcategories
                                        pagination: false,
                                        where: {
                                                slug: {
                                                        equals: input.category,
                                                },
                                        },
                                });
                                const formattedData = categoriesData.docs.map((doc) => ({
                                        ...doc,
                                        subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
                                                // Because subcategories is a nested collection, It's needed to use the same method to get the data
                                                ...(doc as Category),
                                                subcategories: undefined,
                                        })),
                                }));
                                const subCategoriesSlugs = [];
                                const parentCategory = formattedData[0];
                                if (parentCategory) {
                                        subCategoriesSlugs.push(
                                                ...parentCategory.subcategories.map((subcategory) => subcategory.slug),
                                        );

                                        where['category.slug'] = {
                                                in: [parentCategory.slug, ...subCategoriesSlugs],
                                        };
                                }
                        }

                        if (input.tags && input.tags.length > 0) {
                                where['tags.name'] = {
                                        in: input.tags,
                                };
                        }
                        const data = await ctx.db.find({
                                collection: 'products',
                                depth: 2, //Populate Image and Category and Tenant & Tenant Image
                                where,
                                sort,
                                page: input.cursor,
                                limit: input.limit,
                                select: {
                                        content: false,
                                },
                        });

                        const dataWithSummarizedReviews = await Promise.all(
                                data.docs.map(async (doc) => {
                                        const reviewsData = await ctx.db.find({
                                                collection: 'reviews',
                                                pagination: false,
                                                where: {
                                                        product: {
                                                                equals: doc.id,
                                                        },
                                                },
                                        });
                                        return {
                                                ...doc,
                                                reviewCount: reviewsData.totalDocs,
                                                reviewsRating:
                                                        reviewsData.docs.length === 0
                                                                ? 0
                                                                : reviewsData.docs.reduce(
                                                                          (acc, doc) => acc + doc.rating,
                                                                          0,
                                                                  ) / reviewsData.totalDocs,
                                        };
                                }),
                        );

                        return {
                                ...data,
                                docs: dataWithSummarizedReviews.map((doc) => ({
                                        ...doc,
                                        image: doc.image as Media | null,
                                        tenant: doc.tenant as Tenant & { image: Media | null },
                                })),
                        };
                }),
});
