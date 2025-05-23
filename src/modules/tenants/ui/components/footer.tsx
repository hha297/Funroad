import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({
        weight: ['400', '500', '600', '700', '800', '900'],
        subsets: ['latin'],
});
export const Footer = () => {
        return (
                <footer className="border-t font-medium bg-white">
                        <div className="max-w-(--breakpoint-xl) mx-auto flex items-center h-full gap-2 px-4 py-6 lg:px-12">
                                <p className="text-xl">Powered by</p>
                                <Link href={'/'}>
                                        <span className={cn('text-2xl font-semibold', poppins.className)}>funroad</span>
                                </Link>
                        </div>
                </footer>
        );
};
