import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { showings, tickets, movies } from '~/server/db/schema';
import { auth } from "../../../server/auth/index";
import { eq } from 'drizzle-orm';

export async function GET() {
    const session = await auth();

    if (!session) {
        return NextResponse.json(new Error("Unauthorized"), { status: 401 });
    }

    const userTickets = await db
        .select()
        .from(tickets)
        .where(eq(tickets.user_id, session.user.id))
        .leftJoin(showings, eq(showings.id, tickets.showing_id))
        .leftJoin(movies, eq(movies.id, showings.movie_id));

    return NextResponse.json({ tickets: userTickets }, { status: 200 });
}