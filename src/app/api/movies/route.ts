import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { movies } from "~/server/db/schema";

export async function GET() {
    const Movies = await db
        .select()
        .from(movies)
    
    return NextResponse.json({ movies: Movies }, { status: 200 });
}