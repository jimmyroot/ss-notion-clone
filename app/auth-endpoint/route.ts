import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    auth.protect()

    const { sessionClaims } = await auth()
    const { room } = await req.json()

    // Prepare liveblocks session, users email + userinfo object
    const session = liveblocks.prepareSession(
        sessionClaims?.email!,
        {
            userInfo: {
                name: sessionClaims?.fullName!,
                email: sessionClaims?.email!,
                avatar: sessionClaims?.image!
            },
        }
    )

    console.log('session' + session)

    // Get all the rooms that the user has access to
    const usersRooms = await adminDb
        .collectionGroup("rooms")
        .where("userId", "==", sessionClaims?.email)
        .get()

    // See if the room we're trying to access is available to the user
    const userHasRoom = usersRooms.docs.find(doc => doc.id === room)

    // If the room exists authorize the liveblocks session
    if (userHasRoom?.exists) {
        session.allow(room, session.FULL_ACCESS)
        const { body, status } = await session.authorize()  
        return new Response(body, { status })
    } else {
        return NextResponse.json(
            { message: "You're not authorized for this room" },
            { status: 403 }
        )
    }
}