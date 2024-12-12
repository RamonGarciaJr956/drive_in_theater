import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { showings, tickets, movies } from '~/server/db/schema';
import { auth } from "../../../server/auth/index";
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const session = await auth();

    if (!session) {
        return NextResponse.json(new Error("Unauthorized"), { status: 401 });
    }

    const id = searchParams.get('id');
    
    if (!id) {
        return NextResponse.json(new Error("Invalid ID"), { status: 400 });
    }

    const userTicket = await db
        .select()
        .from(tickets)
        .where(and(eq(tickets.user_id, session.user.id),eq(tickets.id, id)))
        .leftJoin(showings, eq(showings.id, tickets.showing_id))
        .leftJoin(movies, eq(movies.id, showings.movie_id));

    return NextResponse.json({ ticket: userTicket }, { status: 200 });
}