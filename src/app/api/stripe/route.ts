import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from '~/server/db';
import { tickets } from '~/server/db/schema';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const sig = req.headers.get('stripe-signature');
    if (!sig) {
        console.error('Stripe signature is missing');
        return NextResponse.json({ error: 'Stripe signature is missing' }, { status: 400 });
    }
    let event: Stripe.Event;
    const body = await req.text();

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error('Error verifying webhook signature:', err);
        return NextResponse.json({ error: 'Error verifying webhook signature' }, { status: 400 });
    }

    try {
        if (event.type === 'checkout.session.completed') {
            if (!event.data.object.invoice) {
                const metadata = event.data.object.metadata;

                if (!metadata) {
                    console.error('Metadata is missing from the event');
                    return NextResponse.json({ error: 'Metadata is missing from the event' }, { status: 400 });
                }

                const userId = metadata.userId as string | undefined;
                const showingId = metadata.showingId as string | undefined;

                if (userId && showingId) {
                    await db.insert(tickets).values({
                        user_id: userId,
                        showing_id: showingId
                    });
                } else {
                    console.error('User ID or Showing ID is missing from metadata');
                    return NextResponse.json({ error: 'User ID or Showing ID is missing from metadata' }, { status: 400 });
                }

            }
        } else {
            console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error('Error processing webhook event:', error);
        return NextResponse.json({ error: 'Error processing webhook event' }, { status: 500 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
