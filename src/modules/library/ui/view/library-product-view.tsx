'use client';

import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { ReviewSidebar } from '../components/review-sidebar';

interface LibraryProductViewProps {
        productId: string;
}
export const LibraryProductView = ({ productId }: LibraryProductViewProps) => {
        const trpc = useTRPC();
        const { data } = useSuspenseQuery(trpc.library.getOne.queryOptions({ productId }));
        return (
                <div className="min-h-screen bg-white">
                        <nav className="p-4 bg-[#F4F4F0] w-full border-b">
                                <Link href="/library" prefetch className="flex items-center gap-2">
                                        <ArrowLeftIcon className="size-4" />
                                        <span className="text-base font-medium">Back to Library</span>
                                </Link>
                        </nav>
                        <header className="bg-[#F4F4F0] py-8 border-b">
                                <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12">
                                        <h1 className="text-3xl font-medium">{data.name}</h1>
                                </div>
                        </header>
                        <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
                                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                                        <div className="lg:col-span-2">
                                                <div className="p-4 bg-white rounded-md border gap-4">
                                                        <ReviewSidebar productId={productId} />
                                                </div>
                                        </div>
                                        <div className="lg:col-span-5">
                                                {data.content ? (
                                                        <p>{data.content}</p>
                                                ) : (
                                                        <p className="font-medium italic text-muted-foreground">
                                                                {' '}
                                                                No special
                                                        </p>
                                                )}
                                        </div>
                                </div>
                        </section>
                </div>
        );
};
