'use client';

import Link from 'next/link';

import { generateTenantUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavbarProps {
        slug: string;
}
export const Navbar = ({ slug }: NavbarProps) => {
        return (
                <nav className="h-20 border-b font-medium bg-white">
                        <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                                <p className="text-xl">Checkout</p>
                                <Button variant={'elevated'} asChild className=" bg-white">
                                        <Link href={`/${generateTenantUrl(slug)}`}>Continue shopping</Link>
                                </Button>
                        </div>
                </nav>
        );
};
