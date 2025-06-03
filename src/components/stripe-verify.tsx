import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';

export const StripeVerify = () => {
        return (
                <Link href={'/stripe-verify'}>
                        <Button variant={'elevated'}>Verify Account</Button>
                </Link>
        );
};
