import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import type { Stripe } from 'stripe';
import config from '@payload-config';
import { ExpandedLineItem } from '@/modules/checkout/type';
export async function POST(req: Request) {
        let event: Stripe.Event;

        try {
                event = stripe.webhooks.constructEvent(
                        await (await req.blob()).text(),
                        req.headers.get('stripe-signature') as string,
                        process.env.STRIPE_WEBHOOK_SECRET! as string,
                );
        } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                if (error! instanceof Error) {
                        console.log(`Error message: ${errorMessage}`);
                }
                console.log(`Error constructing event: ${errorMessage}`);
                return NextResponse.json({ message: `Webhook Error: ${errorMessage}` }, { status: 400 });
        }

        console.log(`Received event: ${event.id} of type ${event.type}`);
        const permittedEvents: string[] = ['checkout.session.completed'];

        const payload = await getPayload({ config });

        if (permittedEvents.includes(event.type)) {
                let data;
                try {
                        switch (event.type) {
                                case 'checkout.session.completed':
                                        data = event.data.object as Stripe.Checkout.Session;
                                        if (!data.metadata?.userId) {
                                                throw new Error('User ID not found in metadata');
                                        }
                                        const user = await payload.findByID({
                                                collection: 'users',
                                                id: data.metadata.userId,
                                        });

                                        if (!user) {
                                                throw new Error('User not found');
                                        }

                                        const expandedSession = await stripe.checkout.sessions.retrieve(data.id, {
                                                expand: ['line_items.data.price.product'],
                                        });

                                        if (
                                                !expandedSession.line_items?.data ||
                                                !expandedSession.line_items.data.length
                                        ) {
                                                throw new Error('No line items found in session');
                                        }

                                        const lineItems = expandedSession.line_items.data as ExpandedLineItem[];
                                        for (const item of lineItems) {
                                                await payload.create({
                                                        collection: 'orders',
                                                        data: {
                                                                stripeCheckoutSessionId: data.id,
                                                                user: user.id,
                                                                product: item.price.product.metadata.id,
                                                                name: item.price.product.name,
                                                        },
                                                });
                                        }
                                        break;
                                default:
                                        throw new Error(`Unhandled event type: ${event.type}`);
                        }
                } catch (error) {
                        console.error('Error parsing event data:', error);
                        return NextResponse.json({ error: 'Invalid event data' }, { status: 400 });
                }
        }

        return NextResponse.json({ message: 'Event Received' }, { status: 200 });
}
