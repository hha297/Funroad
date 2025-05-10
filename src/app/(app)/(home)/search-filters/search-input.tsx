import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import React from 'react';

interface Props {
        disable?: boolean;
}
export const SearchInput = ({ disable }: Props) => {
        return (
                <div className="flex items-center gap-2 w-full">
                        <div className="relative w-full">
                                <SearchIcon className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500" />
                                <Input placeholder="Search Products" disabled={disable} className="pl-12" />
                        </div>
                        {/* TODO: ADD CATEGORY VIEW ALL BUTTON   */}
                </div>
        );
};
