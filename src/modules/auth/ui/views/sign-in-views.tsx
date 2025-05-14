'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../../schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const poppins = Poppins({
        weight: ['400', '500', '600', '700', '800', '900'],
        subsets: ['latin'],
});
export const SignInView = () => {
        const trpc = useTRPC();
        const queryClient = useQueryClient();
        const router = useRouter();
        const login = useMutation(
                trpc.auth.login.mutationOptions({
                        onSuccess: async () => {
                                await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
                                router.push('/');
                                toast.success('Signed In');
                        },
                        onError: (error) => {
                                toast.error(error.message);
                        },
                }),
        );

        const form = useForm<z.infer<typeof loginSchema>>({
                mode: 'onChange',
                resolver: zodResolver(loginSchema),
                defaultValues: {
                        email: '',
                        password: '',
                },
        });

        const onSubmit = async (values: z.infer<typeof loginSchema>) => {
                login.mutate(values);
        };

        return (
                <div className="grid grid-cols-1 lg:grid-cols-5">
                        <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
                                <Form {...form}>
                                        <form
                                                onSubmit={form.handleSubmit(onSubmit)}
                                                className="flex flex-col gap-8 p-4 lg:p-16"
                                        >
                                                <div className="flex items-center justify-between mb-8">
                                                        <Link href="/" className="text-2xl font-bold">
                                                                <span
                                                                        className={cn(
                                                                                'text-2xl font-semibold',
                                                                                poppins.className,
                                                                        )}
                                                                >
                                                                        funroad
                                                                </span>
                                                        </Link>
                                                        <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-base border-none underline"
                                                        >
                                                                <Link href="/sign-up">Sign Up</Link>
                                                        </Button>
                                                </div>
                                                <h1 className="text-4xl font-medium">
                                                        Welcome back to funroad
                                                        <span className="text-pink-400">.</span>
                                                </h1>

                                                <FormField
                                                        control={form.control}
                                                        name="email"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel className="text-base">
                                                                                Email
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                                <Input
                                                                                        type="email"
                                                                                        placeholder="Enter your email"
                                                                                        {...field}
                                                                                />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <FormField
                                                        control={form.control}
                                                        name="password"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel className="text-base">
                                                                                Password
                                                                        </FormLabel>
                                                                        <FormControl>
                                                                                <Input
                                                                                        type="password"
                                                                                        placeholder="Enter your password"
                                                                                        {...field}
                                                                                />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <Button
                                                        type="submit"
                                                        size={'lg'}
                                                        variant={'elevated'}
                                                        className="bg-black hover:bg-pink-400 text-white hover:text-primary"
                                                        disabled={login.isPending}
                                                >
                                                        Sign In
                                                </Button>
                                        </form>
                                </Form>
                        </div>
                        <div
                                className="h-screen w-full lg:col-span-2 hidden lg:block"
                                style={{
                                        backgroundImage: "url('/auth-bg.png')",
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                }}
                        />
                </div>
        );
};
