import React, { useState } from 'react';
import { CustomCategory } from '../type';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        data: CustomCategory[]; //TODO: Add fetch categories and remove this prop
}
export const CategorySidebar = ({ open, onOpenChange, data }: Props) => {
        const [parentCategories, setParentCategories] = useState<CustomCategory[] | null>(null);
        const [selectedCategory, setSelectedCategory] = useState<CustomCategory | null>(null);
        const router = useRouter();
        // If we have parent categories, show those, otherwise show the root category
        const currentCategories = parentCategories || data;

        const handleOpenChange = (open: boolean) => {
                onOpenChange(open);
                setParentCategories(null);
                setSelectedCategory(null);
        };

        const handleCategoryClick = (category: CustomCategory) => () => {
                if (category.subcategories && category.subcategories.length > 0) {
                        setParentCategories(category.subcategories as CustomCategory[]);
                        setSelectedCategory(null);
                } else {
                        if (parentCategories && selectedCategory) {
                                // This is a subcategory, so we need to navigate to the subcategory
                                router.push(`/${selectedCategory.slug}/${category.slug}`);
                        } else {
                                // This is a root category, so we need to navigate to the category
                                if (category.slug === 'all') {
                                        router.push('/');
                                } else {
                                        router.push(`/${category.slug}`);
                                }
                        }

                        handleOpenChange(false);
                }
        };
        const handleBackClick = () => {
                if (parentCategories) {
                        setParentCategories(null);
                        setSelectedCategory(null);
                }
        };
        const backgroundColor = selectedCategory?.color || 'white';
        return (
                <Sheet open={open} onOpenChange={onOpenChange}>
                        <SheetContent
                                side="left"
                                className="p-0 slide-in-from-left"
                                style={{ backgroundColor: backgroundColor }}
                        >
                                <SheetHeader className="p-4 border-b">
                                        <SheetTitle className="text-lg font-semibold">Categories</SheetTitle>
                                </SheetHeader>
                                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                                        {parentCategories && (
                                                <button
                                                        onClick={handleBackClick}
                                                        className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
                                                >
                                                        <ChevronLeftIcon className="w-4 h-4" />
                                                        Back
                                                </button>
                                        )}
                                        {currentCategories.map((category) => (
                                                <button
                                                        key={category.slug}
                                                        className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center justify-between text-base font-medium cursor-pointer"
                                                        onClick={handleCategoryClick(category)}
                                                >
                                                        {category.name}
                                                        {category.subcategories &&
                                                                category.subcategories.length > 0 && (
                                                                        <span className="text-sm text-gray-500">
                                                                                <ChevronRightIcon className="w-4 h-4" />
                                                                        </span>
                                                                )}
                                                </button>
                                        ))}
                                </ScrollArea>
                        </SheetContent>
                </Sheet>
        );
};
