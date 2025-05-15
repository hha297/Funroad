import React from 'react';

import {
        Breadcrumb,
        BreadcrumbList,
        BreadcrumbItem,
        BreadcrumbLink,
        BreadcrumbPage,
        BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

interface BreadcrumbNavigationProps {
        activeCategory?: string | null;
        activeCategoryName?: string | null;
        activeSubcategoryName?: string | null;
}

export const BreadcrumbNavigation = ({
        activeCategory,
        activeCategoryName,
        activeSubcategoryName,
}: BreadcrumbNavigationProps) => {
        if (!activeCategory || !activeCategoryName) return null;
        return (
                <Breadcrumb>
                        <BreadcrumbList>
                                {activeSubcategoryName ? (
                                        <>
                                                <BreadcrumbItem>
                                                        <BreadcrumbLink
                                                                asChild
                                                                className="text-xl font-medium underline text-primary"
                                                        >
                                                                <Link href={`/${activeCategory}`}>
                                                                        {activeCategoryName}
                                                                </Link>
                                                        </BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator className="text-primary font-medium text-lg">
                                                        /
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                        <BreadcrumbPage className="text-xl font-medium">
                                                                {activeSubcategoryName}
                                                        </BreadcrumbPage>
                                                </BreadcrumbItem>
                                        </>
                                ) : (
                                        <BreadcrumbItem>
                                                <BreadcrumbPage className="text-xl font-medium">
                                                        {activeCategoryName}
                                                </BreadcrumbPage>
                                        </BreadcrumbItem>
                                )}
                        </BreadcrumbList>
                </Breadcrumb>
        );
};
