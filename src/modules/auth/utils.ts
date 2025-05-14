import 'server-only';

import { cookies as getCookies } from 'next/headers';

interface Props {
        prefix: string;
        value: string;
}
export const generateAuthCookie = async ({ prefix, value }: Props) => {
        const cookies = getCookies();
        (await cookies).set({
                name: `${prefix}-token`,
                value: value,
                httpOnly: true,
                path: '/',
                // TODO: Ensure cross-site cookies are set correctly
        });
};
