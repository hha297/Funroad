'use client';
import { useProductFilters } from '../../hooks/use-product-filters';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ProductSort = () => {
        const [filters, setFilters] = useProductFilters();

        return (
                <div className="flex items-center gap-2">
                        <Button
                                size={'sm'}
                                className={cn(
                                        'rounded-full bg-white',
                                        filters.sort !== 'curated' &&
                                                'bg-transparent border-transparent hover:border-border hover:bg-transparent',
                                )}
                                variant={'elevated'}
                                onClick={() => setFilters({ sort: 'curated' })}
                        >
                                Curated
                        </Button>
                        <Button
                                size={'sm'}
                                className={cn(
                                        'rounded-full bg-white',
                                        filters.sort !== 'trending' &&
                                                'bg-transparent border-transparent hover:border-border hover:bg-transparent',
                                )}
                                variant={'elevated'}
                                onClick={() => setFilters({ sort: 'trending' })}
                        >
                                Trending
                        </Button>
                        <Button
                                size={'sm'}
                                className={cn(
                                        'rounded-full bg-white',
                                        filters.sort !== 'hot_and_new' &&
                                                'bg-transparent border-transparent hover:border-border hover:bg-transparent',
                                )}
                                variant={'elevated'}
                                onClick={() => setFilters({ sort: 'hot_and_new' })}
                        >
                                Hot And New
                        </Button>
                </div>
        );
};
