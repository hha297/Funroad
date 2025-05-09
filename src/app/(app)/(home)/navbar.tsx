'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { NavbarSidebar } from './navbar-sidebar';
import { MenuIcon } from 'lucide-react';

const poppins = Poppins({
        weight: ['400', '500', '600', '700', '800', '900'],
        subsets: ['latin'],
});
export const Navbar = () => {
        const pathname = usePathname();
        const [isSidebarOpen, setIsSidebarOpen] = useState(false);
        return (
                <nav className="h-20 flex border-b justify-between font-medium bg-white">
                        <Link href={'/'} className="pl-6 flex items-center">
                                <span className={cn(poppins.className, 'lg:text-5xl text-2xl font-semibold')}>
                                        funroad
                                </span>
                        </Link>
                        <div className="items-center gap-4 hidden xl:flex">
                                {navbarItems.map((item) => (
                                        <NavbarItem key={item.href} href={item.href} isActive={item.href === pathname}>
                                                {item.children}
                                        </NavbarItem>
                                ))}
                        </div>
                        <div className="hidden xl:flex">
                                <Button
                                        asChild
                                        variant={'secondary'}
                                        className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
                                >
                                        <Link href={'/sign-in'}>Sign In</Link>
                                </Button>
                                <Button
                                        asChild
                                        className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg"
                                >
                                        <Link href={'sign-up'}>Start Selling</Link>
                                </Button>
                        </div>
                        <NavbarSidebar items={navbarItems} open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

                        <div className="flex xl:hidden items-center justify-center">
                                <Button
                                        onClick={() => setIsSidebarOpen(true)}
                                        variant={'ghost'}
                                        className="size-12 border-transparent bg-white"
                                >
                                        <MenuIcon />
                                </Button>
                        </div>
                </nav>
        );
};

interface NavbarItemProps {
        href: string;
        children: React.ReactNode;
        isActive?: boolean;
}
const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
        return (
                <Button
                        asChild
                        variant="outline"
                        className={cn(
                                'bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-4 text-lg',
                                isActive && 'bg-black text-white hover:bg-black/85 hover:text-white',
                        )}
                >
                        <Link href={href}>{children}</Link>
                </Button>
        );
};

const navbarItems = [
        { href: '/', children: 'Home' },
        { href: '/about', children: 'About' },
        { href: '/features', children: 'Features' },
        { href: '/pricing', children: 'Pricing' },
        { href: '/contact', children: 'Contact' },
];
