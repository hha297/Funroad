import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface LibraryProductCardProps {
        id: string;
        name: string;
        imageUrl?: string | null;
        tenantSlug: string;
        tenantImageUrl?: string | null;
        reviewRating: number;
        reviewCount: number;
}

export const LibraryProductCard = ({
        id,
        name,
        imageUrl,
        tenantSlug,
        tenantImageUrl,
        reviewRating,
        reviewCount,
}: LibraryProductCardProps) => {
        return (
                <Link href={`/library/${id}`}>
                        <div className="border rounded-md bg-white overflow-hidden h-full flex flex-col hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                                <div className="relative aspect-square">
                                        <Image
                                                src={imageUrl || '/placeholder.png'}
                                                alt={name}
                                                fill
                                                className="object-cover"
                                        />
                                </div>
                                <div className="p-4 border-y flex flex-col flex-1 gap-3">
                                        <h3 className="text-lg font-medium line-clamp-4">{name}</h3>

                                        <div className="flex items-center gap-2">
                                                {tenantImageUrl ? (
                                                        <Image
                                                                src={tenantImageUrl}
                                                                alt={tenantSlug}
                                                                width={16}
                                                                height={16}
                                                                className="rounded-full border shrink-0 size-4"
                                                        />
                                                ) : (
                                                        <Image
                                                                src={'/avatar-placeholder.png'}
                                                                alt={'placeholder'}
                                                                width={16}
                                                                height={16}
                                                                className="rounded-full border shrink-0 size-4"
                                                        />
                                                )}
                                                <p className="text-sm hover:underline font-medium">{tenantSlug}</p>
                                        </div>

                                        {reviewCount > 0 && (
                                                <div className="flex items-center gap-2">
                                                        <StarIcon className="size-4 fill-black" />
                                                        <p className="text-sm font-medium">
                                                                {reviewRating.toFixed(1)} ({reviewCount})
                                                        </p>
                                                </div>
                                        )}
                                </div>
                        </div>
                </Link>
        );
};

export const LibraryProductCardSkeleton = () => {
        return <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />;
};
