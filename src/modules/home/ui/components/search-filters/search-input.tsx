'use client';

import { Input } from '@/components/ui/input';
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';

import { CategorySidebar } from './category-sidebar';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface Props {
        disable?: boolean;
}
export const SearchInput = ({ disable }: Props) => {
        const trpc = useTRPC();
        const session = useQuery(trpc.auth.session.queryOptions());
        const [isSidebarOpen, setIsSidebarOpen] = useState(false);
        return (
                <div className="flex items-center gap-2 w-full">
                        <CategorySidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
                        <div className="relative w-full">
                                <SearchIcon className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500" />
                                <Input placeholder="Search Products" disabled={disable} className="pl-12" />
                        </div>

                        <Button
                                variant={'elevated'}
                                onClick={() => setIsSidebarOpen(true)}
                                className="size-12 shrink-0 flex lg:hidden"
                        >
                                <ListFilterIcon />
                        </Button>
                        {session.data?.user && (
                                <Button asChild variant={'elevated'} onClick={() => setIsSidebarOpen(true)}>
                                        <Link href={'/library'}>
                                                <BookmarkCheckIcon />
                                                Library
                                        </Link>
                                </Button>
                        )}
                </div>
        );
};
