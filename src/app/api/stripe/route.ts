import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from '~/server/db';
import { loyalty_points, tickets } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { PointsPerDollar, tiers } from "~/app/config";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY must be defined');
}
const stripe = new Stripe(stripeSecretKey);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!endpointSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET must be defined');
}

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
        return NextResponse.json({ error: 'Stripe signature is missing' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret!);
    } catch (err) {
        return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            if (!session.invoice) {
                const metadata = session.metadata;
                const subTotal = session.amount_subtotal;

                if (!metadata) {
                    return NextResponse.json({ error: 'Metadata is missing' }, { status: 400 });
                }

                const userId = metadata.userId;
                const showingId = metadata.showingId;

                if (userId && showingId) {
                    try {
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

                        if (!tiers) {
                            return NextResponse.json({ error: 'Tiers are missing from config' }, { status: 500 });
                        }

                        const newTotalPoints = (loyaltyPointsResult?.total_points ?? 0) +
                            Math.floor((subTotal! / 100) * PointsPerDollar);

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

                    } catch (error) {
                        console.error('Error processing checkout:', error);
                        return NextResponse.json({ error: 'Error processing checkout' }, { status: 500 });
                    }
                }
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
}