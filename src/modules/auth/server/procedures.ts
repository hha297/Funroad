import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { headers as getHeaders, cookies as getCookies } from 'next/headers';

import { AUTH_COOKIE } from '../constants';
import { loginSchema, registerSchema } from '../schemas';
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

                await ctx.db.create({
                        collection: 'users',
                        data: {
                                email: input.email,
                                password: input.password,
                                username: input.username,
                        },
                });
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

                const cookies = getCookies();

                (await cookies).set({
                        name: AUTH_COOKIE,
                        value: data.token,
                        httpOnly: true,
                        path: '/',
                        // TODO: Ensure cross-site cookies are set correctly
                });

                return data;
        }),
        logout: baseProcedure.mutation(async ({}) => {
                const cookies = getCookies();

                (await cookies).delete(AUTH_COOKIE);
        }),
});
