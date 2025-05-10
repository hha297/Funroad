import configPromise from '@payload-config';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { SearchFilters } from './search-filters';
import { getPayload } from 'payload';
import { Category } from '@/payload-types';

interface Props {
        children: React.ReactNode;
}
const HomeLayout = async ({ children }: Props) => {
        const payload = await getPayload({
                config: configPromise,
        });
        const data = await payload.find({
                collection: 'categories',
                depth: 1,
                pagination: false,
                where: {
                        parent: {
                                exists: false,
                        },
                },
        });

        const formattedData = data.docs.map((doc) => ({
                ...doc,
                subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
                        // Because subcategories is a nested collection, It's needed to use the same method to get the data
                        ...(doc as Category),
                        subcategories: undefined,
                })),
        }));

        console.log(formattedData);

        return (
                <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <SearchFilters data={formattedData} />
                        <div className="flex-1 bg-[#F4F4F0]">{children}</div>
                        <Footer />
                </div>
        );
};

export default HomeLayout;
