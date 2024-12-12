import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { users } from '~/server/db/schema';
import { auth } from "../../../server/auth/index";
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    const session = await auth();
    const body = await request.json() as { name: string, email: string, profileImage: string };

    if (!session) {
        return NextResponse.json(new Error("Unauthorized"), { status: 401 });
    }

    const [updatedUser] = await db
        .update(users)
        .set({
            name: body.name,
            email: body.email,
            image: body.profileImage
        })
        .where(eq(users.id, session.user.id))
        .returning()

    if (!updatedUser) {
        return NextResponse.json(new Error("Failed to update profile"), { status: 500 });
    }

    return NextResponse.json({ "stats": "success" }, { status: 200 });
}