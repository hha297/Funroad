import configPromise from '@payload-config';
import { getPayload } from 'payload';

export default async function Home() {
        const payload = await getPayload({
                config: configPromise,
        });
        const data = await payload.find({
                collection: 'users',
        });
        return (
                <div className="flex flex-col gap-y-4 px-4">
                        {data.docs.map((item) => (
                                <div key={item.id}>
                                        <p>{item.email}</p>
                                </div>
                        ))}
                </div>
        );
}
