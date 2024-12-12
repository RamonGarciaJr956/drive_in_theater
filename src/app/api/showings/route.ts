import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { showings, movies } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    const moviesShowing = await db
        .select({
            showing: {
                id: showings.id,
                start_time: showings.start_time,
                location: showings.location,
                spaces_available: showings.spaces_available,
                is_active: showings.is_active
            },
            movie: {
                id: movies.id,
                name: movies.name,
                description: movies.description,
                duration: movies.duration,
                genre: movies.genre,
                starring: movies.starring,
                image: movies.image,
                video: movies.video,
                price: movies.price
            }
        })
        .from(showings)
        .leftJoin(movies, eq(showings.movie_id, movies.id));
    
    return NextResponse.json({ movies: moviesShowing }, { status: 200 });
}