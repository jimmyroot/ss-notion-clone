"use server"

import { adminDb } from "@/firebase-admin"
import liveblocks from "@/lib/liveblocks"
import { auth } from "@clerk/nextjs/server"

export async function createNewDocument() {

    auth.protect()

    // Get session claims (uer info)
    const { sessionClaims } = await auth()

    // Get documents collection and add a new doc, save the doc ref
    const docCollectionRef = adminDb.collection('documents')
    const docRef = await docCollectionRef.add({
        title: 'New Doc'
    })

    await adminDb.collection('users') // Collection 'users'
        .doc(sessionClaims?.email!) // get the doc for the logged in user
        .collection('rooms') // get the rooms collection
        .doc(docRef.id) // will create the new room with the doc id
        .set({ // store the room details 
            userId: sessionClaims?.email!,
            role: "owner",
            createdAt: new Date(),
            roomId: docRef.id,
    })

    // return the doc id, will be used for navigation
    return { docId: docRef.id }
    }

export async function deleteDocument(roomId: string) {
    auth.protect()

    console.log((await auth()).userId, "deleteDocument:", roomId)

    try {
        // 1 Delete the document reference
        await adminDb.collection("documents").doc(roomId).delete()

        const query = await adminDb.collectionGroup("rooms").where("roomId", "==", roomId).get()

        const batch = adminDb.batch()

        // 2 Delete the room reference in the users collection for each user in the room
        query.docs.forEach(doc => {
            batch.delete(doc.ref)
        })
        await batch.commit()

        // 3 Delete the room in liveblocks
        await liveblocks.deleteRoom(roomId)
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false }
    }

}

export async function inviteUserToDocument(roomId: string, email: string) {
    auth.protect()
    console.log("inviteUserToDocument: ", roomId, email)

    try {
        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .set({
                userId: email,
                role: "editor",
                createdAt: new Date(),
                roomId,
            })
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false }
    }
}

export async function removeUserFromDocument(roomId: string, email: string) {
    console.log("removeUserFromDocument", roomId, email)

    try {
        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .delete()
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false }
    }
}