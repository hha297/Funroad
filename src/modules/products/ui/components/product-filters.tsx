'use client';

import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { PriceFilter } from './price-filter';
import { useProductFilters } from '../../hooks/use-product-filters';
import { TagsFilter } from './tags-filter';

interface ProductFilterProps {
        title: string;
        className?: string;
        children: React.ReactNode;
}

const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
        const [isOpen, setIsOpen] = useState(false);
        const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;
        return (
                <div className={cn('p-4 border-b flex flex-col gap-2', className)}>
                        <div
                                onClick={() => setIsOpen((current) => !current)}
                                className="flex items-center justify-between cursor-pointer"
                        >
                                <p className="font-medium">{title}</p>
                                <Icon className="size-5" />
                        </div>
                        {isOpen && children}
                </div>
        );
};

export const ProductFilters = () => {
        const [filter, setFilter] = useProductFilters();

        const hasFilers = Object.entries(filter).some(([key, value]) => {
                if (key === 'sort') return false;
                if (Array.isArray(value)) return value.length > 0;
                if (typeof value === 'string') {
                        return value !== '';
                }
                return value !== null;
        });
        const onClear = () => {
                setFilter({
                        minPrice: '',
                        maxPrice: '',
                        tags: [],
                });
        };
        const onChange = (key: keyof typeof filter, value: unknown) => {
                setFilter({ ...filter, [key]: value });
        };
        return (
                <div className="border rounded-md bg-white">
                        <div className="p-4 border-b flex items-center justify-between">
                                <p>Filters</p>
                                {hasFilers && (
                                        <button className="underline cursor-pointer" type="button" onClick={onClear}>
                                                Clear All
                                        </button>
                                )}
                        </div>
                        <ProductFilter title="Price" className="border-b-0">
                                <PriceFilter
                                        minPrice={filter.minPrice}
                                        maxPrice={filter.maxPrice}
                                        onMinPriceChange={(value) => onChange('minPrice', value)}
                                        onMaxPriceChange={(value) => onChange('maxPrice', value)}
                                />
                        </ProductFilter>
                        <ProductFilter title="Tags">
                                <TagsFilter value={filter.tags} onChange={(value) => onChange('tags', value)} />
                        </ProductFilter>
                </div>
        );
};
