import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
        id: string;
        name: string;
        imageUrl?: string | null;
        authorUsername: string;
        authorImageUrl?: string | null;
        reviewRating: number;
        reviewCount: number;
        price: number;
}

export default function ProductCard({
        id,
        name,
        imageUrl,
        authorUsername,
        authorImageUrl,
        reviewRating,
        reviewCount,
        price,
}: ProductCardProps) {
        return (
                <Link href={`/products/${id}`}>
                        <div className="border rounded-md bg-white overflow-hidden h-full flex flex-col">
                                <div className="relative aspect-square">
                                        <Image src={imageUrl || ''} alt={name} fill className="object-cover" />
                                </div>
                        </div>
                </Link>
        );
}
