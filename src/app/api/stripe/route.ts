import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from '~/server/db';
import { loyalty_points, tickets } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { PointsPerDollar, tiers } from "~/app/config";

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
                const subTotal = event.data.object.amount_subtotal;

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

                    const loyaltyPointsResult = await db.query.loyalty_points.findFirst({
                        where: eq(loyalty_points.user_id, userId),
                        columns: {
                            total_points: true
                        }
                    });

                    if(!tiers) {
                        console.error('Tiers are missing from the config');
                        return NextResponse.json({ error: 'Tiers are missing from the config' }, { status: 500 });
                    }

                    const newTotalPoints = (loyaltyPointsResult!.total_points ?? 0) + Math.floor((subTotal! / 100) * PointsPerDollar);
                    
                    const currentTier = tiers
                        .filter(tier => tier.requiredPoints <= newTotalPoints)
                        .sort((a, b) => b.requiredPoints - a.requiredPoints)[0]!;
                    
                    const nextTier = tiers
                        .filter(tier => tier.requiredPoints > newTotalPoints)
                        .sort((a, b) => a.requiredPoints - b.requiredPoints)[0];
                    
                    const tierName = currentTier.name;
                    const nextTierPoints = nextTier ? nextTier.requiredPoints : currentTier.requiredPoints;
                    const tierProgressPercentage = nextTier 
                        ? Math.floor((newTotalPoints / nextTierPoints) * 100) 
                        : 100;
                    
                    await db.update(loyalty_points).set({
                        total_points: newTotalPoints,
                        tier_name: tierName,
                        next_tier_points: nextTierPoints,
                        tier_progress_percentage: tierProgressPercentage
                    }).where(eq(loyalty_points.user_id, userId));
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
