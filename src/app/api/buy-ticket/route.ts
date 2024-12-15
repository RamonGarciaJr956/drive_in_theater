/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { db } from '~/server/db';
import { users, movies, showings } from '~/server/db/schema';
import { eq } from "drizzle-orm";
import { auth } from "../../../server/auth/index";
import { discountDay, discountPercentage } from "../../config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true
});

async function getOrCreateCustomer(userId: string, email: string, name: string): Promise<string> {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (user.length > 0 && user[0]?.stripeCustomerId) {
        return user[0].stripeCustomerId;
    }

    const customer = await stripe.customers.create({
        email: email,
        name: name,
    });

    await db
        .update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, userId));

    return customer.id;
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        const body = await request.json() as { showingId: string }

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

        if (!user.length) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const customerId = await getOrCreateCustomer(session.user.id, session.user.email!, session.user.name!);

        if(!customerId) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        const showingAnMovie = await db.
            select().
            from(showings).
            where(eq(showings.id, body.showingId)).
            leftJoin(movies, eq(showings.movie_id, movies.id)).
            limit(1);

        if (!showingAnMovie[0]?.movie) {
            return NextResponse.json({ error: "Showing not found" }, { status: 404 });
        }

        let amount = Number(showingAnMovie[0].movie.price);

        if (new Date().getDay() === discountDay) {
            amount = amount - (amount * discountPercentage) / 100;
        }

        if (amount <= 0) {
            return NextResponse.json({ error: "Price is invalid" }, { status: 400 });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            success_url: `${process.env.DOMAIN!}/dashboard`,
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: showingAnMovie[0].movie.name,
                            images: [showingAnMovie[0].movie.image!],
                            metadata: {
                                movieId: showingAnMovie[0].movie.id,
                                showingId: body.showingId,
                            }
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                userId: session.user.id,
                showingId: body.showingId,
            },
            currency: "usd"
        });

        return NextResponse.json({ checkoutSessionUrl: checkoutSession.url }, { status: 200 });
    } catch (error) {
        console.error("Internal Error:", error);

        return NextResponse.json(
            { error: `Internal Server Error: ${(error as Error).toString()}` },
            { status: 500 }
        );
    }
}