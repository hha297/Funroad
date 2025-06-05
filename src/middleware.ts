import { NextRequest, NextResponse } from 'next/server';

export const config = {
        matcher: [
                /*
                 * Match all request paths except for the ones starting with:
                 * - api (API routes)
                 * - /_next (Next.js internals)
                 * - /_static (inside /public folder)
                 * - all root files inside public folder
                 */
                '/((?!api/|_next/|_static/|_vercel|media/|[\w-]+\.\w+).*)',
        ],
};

export default async function middleware(req: NextRequest) {
        const url = req.nextUrl;

        const hostname = req.headers.get('host') || '';
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

        if (hostname.endsWith(`.${rootDomain}`)) {
                const tenantSlug = hostname.replace(`.${rootDomain}`, '');
                return NextResponse.rewrite(new URL(`/tenants/${tenantSlug}${url.pathname}`, req.url));
        }

        return NextResponse.next();
}
