import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { TRPCReactProvider } from '@/trpc/client';
import { Toaster } from '@/components/ui/sonner';

const dmSans = DM_Sans({
        subsets: ['latin'],
});

export const metadata: Metadata = {
        title: 'Funroad',
        description: 'Multi-vendor Ecommerce',
};

export default function RootLayout({
        children,
}: Readonly<{
        children: React.ReactNode;
}>) {
        return (
                <html lang="en">
                        <body className={`${dmSans.className} antialiased`}>
                                <TRPCReactProvider>
                                        <Toaster />
                                        {children}
                                </TRPCReactProvider>
                        </body>
                </html>
        );
}
