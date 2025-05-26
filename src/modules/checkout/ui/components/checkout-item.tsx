import { cn, formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface CheckoutItemProps {
        isLast?: boolean;
        imageUrl?: string | null;
        name: string;
        productUrl: string;
        tenantUrl: string;
        tenantImageUrl?: string | null;
        tenantName: string;
        price: number;
        onRemove: () => void;
}

export const CheckoutItem = ({
        isLast,
        imageUrl,
        name,
        productUrl,
        tenantUrl,
        tenantImageUrl,
        tenantName,
        price,
        onRemove,
}: CheckoutItemProps) => {
        return (
                <div className={cn('grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border-b', isLast && 'border-b-0')}>
                        <div className="outline-hidden border-r">
                                <div className="relative aspect-square h-full">
                                        <Image
                                                src={imageUrl || '/placeholder.png'}
                                                alt={name}
                                                fill
                                                className="object-cover"
                                        />
                                </div>
                        </div>
                        <div className="py-4 flex flex-col justify-between">
                                <div>
                                        <Link href={productUrl}>
                                                <h4 className="font-bold">{name}</h4>
                                        </Link>
                                        <Link href={tenantUrl} className="flex items-center gap-2 mt-1">
                                                <Image
                                                        src={tenantImageUrl || '/avatar-placeholder.png'}
                                                        alt={tenantName}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full border shrink-0 size-4"
                                                />
                                                <h4 className="text-sm font-medium hover:underline">{tenantName}</h4>
                                        </Link>
                                </div>
                        </div>
                        <div className="py-4 flex flex-col justify-between">
                                <p className="font-medium">{formatCurrency(price)}</p>
                                <button
                                        type="button"
                                        className="underline font-medium cursor-pointer"
                                        onClick={onRemove}
                                >
                                        Remove
                                </button>
                        </div>
                </div>
        );
};
