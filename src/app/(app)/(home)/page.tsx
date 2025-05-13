'use client';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
        const trpc = useTRPC();
        const { data } = useQuery(trpc.auth.session.queryOptions());

        return <div className="flex flex-col gap-y-4 px-4">{JSON.stringify(data?.user)}</div>;
}
