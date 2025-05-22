import Link from 'next/link';

import { CategoriesGetManyOutput } from '@/modules/categories/type';

interface SubcategoryMenuProps {
        category: CategoriesGetManyOutput[1];
        isOpen: boolean;
}

export const SubcategoryMenu = ({ category, isOpen }: SubcategoryMenuProps) => {
        if (!isOpen || !category.subcategories || category.subcategories.length === 0) return null;

        const backgroundColor = category.color || 'F5F5F5';

        return (
                <div className="absolute z-50" style={{ top: '100%', left: 0 }}>
                        {/* Invisible bridge to handle hover */}
                        <div className="h-4 w-60" />
                        <div
                                style={{ backgroundColor }}
                                className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[4px]"
                        >
                                <div>
                                        <div className="">
                                                {category.subcategories?.map((subcategory) => (
                                                        <Link
                                                                href={`/${category.slug}/${subcategory.slug}`}
                                                                key={subcategory.id}
                                                                className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline:font-medium"
                                                        >
                                                                {subcategory.name}
                                                        </Link>
                                                ))}
                                        </div>
                                </div>
                        </div>
                </div>
        );
};
