import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface NavbarItem {
        href: string;
        children: React.ReactNode;
}

interface Props {
        items: NavbarItem[];
        open: boolean;
        onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, open, onOpenChange }: Props) => {
        const trpc = useTRPC();
        const session = useQuery(trpc.auth.session.queryOptions());
        return (
                <Sheet open={open} onOpenChange={onOpenChange}>
                        <SheetContent side="left" className="p-0 slide-in-from-left">
                                <SheetHeader className="p-4 border-b">
                                        <div className="flex items-center">
                                                <SheetTitle>Menu</SheetTitle>
                                        </div>
                                </SheetHeader>
                                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                                        {items.map((item) => (
                                                <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                                                        onClick={() => onOpenChange(false)}
                                                >
                                                        {item.children}
                                                </Link>
                                        ))}
                                        {session.data?.user ? (
                                                <div className="border-t">
                                                        <Link
                                                                href={'/dashboard'}
                                                                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                                                                onClick={() => onOpenChange(false)}
                                                        >
                                                                Dashboard
                                                        </Link>
                                                </div>
                                        ) : (
                                                <div className="border-t">
                                                        <Link
                                                                href={'/sign-in'}
                                                                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                                                                onClick={() => onOpenChange(false)}
                                                        >
                                                                Sign In
                                                        </Link>
                                                        <Link
                                                                href={'/sign-up'}
                                                                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                                                                onClick={() => onOpenChange(false)}
                                                        >
                                                                Start Selling
                                                        </Link>
                                                </div>
                                        )}
                                </ScrollArea>
                        </SheetContent>
                </Sheet>
        );
};
