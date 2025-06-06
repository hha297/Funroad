import { SignInView } from '@/modules/auth/ui/views/sign-in-views';
import { caller } from '@/trpc/server';
import { redirect } from 'next/navigation';
import React from 'react';
export const dynamic = 'force-dynamic';
const SignInPage = async () => {
        const session = await caller.auth.session();

        if (session?.user) {
                redirect('/');
        }
        return <SignInView />;
};

export default SignInPage;
