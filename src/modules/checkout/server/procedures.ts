import { Media, Tenant } from '@/payload-types';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import type Stripe from 'stripe';
import { z } from 'zod';
import { CheckoutMetadata, ProductMetadata } from '../type';
import { stripe } from '@/lib/stripe';

export const checkoutRouter = createTRPCRouter({
        purchase: protectedProcedure
                .input(
                        z.object({
                                tenantSlug: z.string(),
                                productIds: z.array(z.string()).min(1, 'At least one product must be selected'),
                        }),
                )

                .mutation(async ({ ctx, input }) => {
                        const products = await ctx.db.find({
                                collection: 'products',
                                depth: 2,
                                where: {
                                        and: [
                                                {
                                                        id: {
                                                                in: input.productIds,
                                                        },
                                                },
                                                {
                                                        'tenant.slug': {
                                                                equals: input.tenantSlug,
                                                        },
                                                },
                                        ],
                                },
                        });
                        if (products.totalDocs !== input.productIds.length) {
                                throw new TRPCError({
                                        code: 'NOT_FOUND',
                                        message: 'Some products not found',
                                });
                        }

                        const tenantsData = await ctx.db.find({
                                collection: 'tenants',
                                depth: 1,
                                pagination: false,
                                where: {
                                        slug: {
                                                equals: input.tenantSlug,
                                        },
                                },
                        });

                        const tenant = tenantsData.docs[0];
                        if (!tenant) {
                                throw new TRPCError({
                                        code: 'NOT_FOUND',
                                        message: 'Tenant not found',
                                });
                        }

                        // TODO: Throw error if stripe is not submitted

                        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.docs.map(
                                (product) => ({
                                        quantity: 1,
                                        price_data: {
                                                unit_amount: product.price * 100,
                                                currency: 'eur',
                                                product_data: {
                                                        name: product.name,
                                                        metadata: {
                                                                stripeAccountId: tenant.stripeAccountId,
                                                                id: product.id,
                                                                name: product.name,
                                                                price: product.price,
                                                        } as ProductMetadata,
                                                },
                                        },
                                }),
                        );
                        const checkout = await stripe.checkout.sessions.create({
                                customer_email: ctx.session.user.email,
                                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
                                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
                                mode: 'payment',
                                line_items: lineItems,
                                invoice_creation: {
                                        enabled: true,
                                },
                                metadata: {
                                        userId: ctx.session.user.id,
                                } as CheckoutMetadata,
                        });

                        if (!checkout.url) {
                                throw new TRPCError({
                                        code: 'INTERNAL_SERVER_ERROR',
                                        message: 'Failed to create checkout session',
                                });
                        }

                        return {
                                url: checkout.url,
                        };
                }),
        // Procedure to get products by their IDs
        getProducts: baseProcedure
                .input(
                        z.object({
                                ids: z.array(z.string()).optional(),
                        }),
                )
                .query(async ({ ctx, input }) => {
                        const data = await ctx.db.find({
                                collection: 'products',
                                depth: 2,
                                where: {
                                        id: {
                                                in: input.ids || [],
                                        },
                                },
                        });

                        if (data.totalDocs !== input.ids?.length) {
                                throw new TRPCError({
                                        code: 'NOT_FOUND',
                                        message: 'Product not found',
                                });
                        }
                        const totalPrice = data.docs.reduce((acc, product) => {
                                const price = Number(product.price);
                                return acc + (isNaN(price) ? 0 : price);
                        }, 0);
                        return {
                                ...data,
                                totalPrice: totalPrice,
                                docs: data.docs.map((doc) => {
                                        return {
                                                ...doc,
                                                image: doc.image as Media | null,
                                                tenant: doc.tenant as Tenant & { image: Media | null },
                                        };
                                }),
                        };
                }),
});
