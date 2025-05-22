import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { headers as getHeaders } from 'next/headers';

import { loginSchema, registerSchema } from '../schemas';
import { generateAuthCookie } from '../utils';
export const authRouter = createTRPCRouter({
        session: baseProcedure.query(async ({ ctx }) => {
                const headers = await getHeaders();

                const session = await ctx.db.auth({ headers });

                if (!session) {
                        return null;
                }

                return session;
        }),
        register: baseProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
                const existingUser = await ctx.db.find({
                        collection: 'users',
                        limit: 1,
                        where: {
                                username: {
                                        equals: input.username,
                                },
                        },
                });

                if (existingUser) {
                        throw new TRPCError({
                                code: 'BAD_REQUEST',
                                message: 'Username already exists',
                        });
                }

                const tenant = await ctx.db.create({
                        collection: 'tenants',
                        data: {
                                name: input.username,
                                slug: input.username,
                                stripeAccountId: 'mock',
                        },
                });

                await ctx.db.create({
                        collection: 'users',
                        data: {
                                email: input.email,
                                password: input.password,
                                username: input.username,
                                tenants: [
                                        {
                                                tenant: tenant.id,
                                        },
                                ],
                        },
                });

                const data = await ctx.db.login({
                        collection: 'users',
                        data: {
                                email: input.email,
                                password: input.password,
                        },
                });
                if (!data.token) {
                        throw new TRPCError({
                                code: 'UNAUTHORIZED',
                                message: 'Invalid email or password',
                        });
                }
                await generateAuthCookie({ prefix: `${ctx.db.config.cookiePrefix}`, value: data.token });
        }),
        login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
                const data = await ctx.db.login({
                        collection: 'users',
                        data: {
                                email: input.email,
                                password: input.password,
                        },
                });

                if (!data.token) {
                        throw new TRPCError({
                                code: 'UNAUTHORIZED',
                                message: 'Invalid email or password',
                        });
                }

                await generateAuthCookie({ prefix: `${ctx.db.config.cookiePrefix}`, value: data.token });

                return data;
        }),
});
