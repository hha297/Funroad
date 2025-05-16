import { SignUpView } from '@/modules/auth/ui/views/sign-up-views';
import { caller } from '@/trpc/server';
import { redirect } from 'next/navigation';
import React from 'react';

const SignUpPage = async () => {
        const session = await caller.auth.session();

        if (session?.user) {
                redirect('/');
        }
        return <SignUpView />;
};

export default SignUpPage;
