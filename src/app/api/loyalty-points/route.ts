import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { loyalty_points } from '~/server/db/schema';
import { auth } from "../../../server/auth/index";
import { eq } from 'drizzle-orm';

export async function GET() {
    const session = await auth();

    if (!session) {
        return NextResponse.json(new Error("Unauthorized"), { status: 401 });
    }

    const loyaltyPoints = await db
        .select()
        .from(loyalty_points)
        .where(eq(loyalty_points.user_id, session.user.id))
        .limit(1)

    return NextResponse.json({ loyaltyPoints: loyaltyPoints }, { status: 200 });
}