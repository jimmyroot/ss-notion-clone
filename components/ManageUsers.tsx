"use client"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { FormEvent, startTransition, useState, useTransition } from "react"
import { Button } from "./ui/button"
import { deleteDocument, inviteUserToDocument, removeUserFromDocument } from "@/actions/actions"
import { toast } from "sonner"
import useOwner from "@/lib/useOwner"
import { useUser } from "@clerk/nextjs"
import { useRoom } from "@liveblocks/react/suspense"
import { useCollection } from "react-firebase-hooks/firestore"
import { collectionGroup, query, where } from "firebase/firestore"
import { db } from "@/firebase"


function ManageUsers() {
    const { user } = useUser()
    const room = useRoom()
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const isOwner = useOwner()
    const [usersInRoom] = useCollection(
        user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
    )

    const handleDelete = async (userId: string) => {
        startTransition(async () => {
            if (!user) return
            const { success } = await removeUserFromDocument(room.id, userId)
            success ? doSuccess() : doError()
        })

        const doSuccess = () => {
            toast.success("User was removed from room!")
        }
    
        const doError = () => {
            toast.error("Failed to remove user from room.")
        }

    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="outline">
        <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger>
    </Button>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Access control list</DialogTitle>
        <DialogDescription>
            Below is a list of users that can access this note
        </DialogDescription>
        </DialogHeader>
        <hr className="my-2" />
        <div className="flex flex-col space-y-2">
            {/* Users in room */}
            {
                usersInRoom?.docs.map(doc => (
                    <div 
                        key={doc.data().userId}
                        className="flex items-center justify-between"
                    >
                        <p className="font-light">
                            {
                                doc.data().userId === user?.emailAddresses[0].toString() ? 
                                    `You (${doc.data().userId})` :
                                    doc.data().userId
                            }
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline">{doc.data().role}</Button>
                            {isOwner && doc.data().userId !== user?.emailAddresses[0].toString() && (
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(doc.data().userId)}
                                    disabled={isPending}
                                    size="sm"
                                >
                                {isPending ? "Removing..." : 'X'}
                                </Button>
                            )}
                        </div>
                    </div>
                ))
            }
        </div>
    </DialogContent>
    </Dialog>

  )
}

export default ManageUsers