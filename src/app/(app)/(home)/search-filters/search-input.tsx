'use client';

import { Input } from '@/components/ui/input';
import { ListFilterIcon, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';

import { CategorySidebar } from './category-sidebar';
import { Button } from '@/components/ui/button';

interface Props {
        disable?: boolean;
}
export const SearchInput = ({ disable }: Props) => {
        const [isSidebarOpen, setIsSidebarOpen] = useState(false);
        return (
                <div className="flex items-center gap-2 w-full">
                        <CategorySidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
                        <div className="relative w-full">
                                <SearchIcon className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500" />
                                <Input placeholder="Search Products" disabled={disable} className="pl-12" />
                        </div>
                        {/* TODO: ADD CATEGORY VIEW ALL BUTTON   */}
                        <Button
                                variant={'elevated'}
                                onClick={() => setIsSidebarOpen(true)}
                                className="size-12 shrink-0 flex lg:hidden"
                        >
                                <ListFilterIcon />
                        </Button>
                </div>
        );
};
