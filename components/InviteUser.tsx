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
import { usePathname, useRouter } from "next/navigation"
import { deleteDocument, inviteUserToDocument } from "@/actions/actions"
import { toast } from "sonner"
import { Input } from "./ui/input"

function InviteUser() {

    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [email, setEmail] = useState("")
    const pathname = usePathname()
    const router = useRouter()

    const handleInvite = async (event: FormEvent) => {
        console.log('inviting')
        event.preventDefault()

        const roomId = pathname.split("/").pop()
        if (!roomId)
            throw Error('No room ID could be found, or was not available')

        startTransition(async () => {
            const { success } = await inviteUserToDocument(roomId, email)

            success ? doSuccess() : doError()
        })
    }

    const doSuccess = () => {
        setIsOpen(false)
        setEmail('')
        toast.success("User added to the room successfully!")
    }

    const doError = () => {
        toast.error("Failed to add the user to the room!")
    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="outline">
        <DialogTrigger>Invite</DialogTrigger>
    </Button>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Invite a user to collaborate</DialogTitle>
        <DialogDescription>
            Enter the email address of the user you want to invite. 
        </DialogDescription>
        </DialogHeader>
        <form className="flex gap-2" onSubmit={handleInvite}>
            <Input
                type="email"
                placeholder="Email"
                className="w-full"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={!email || isPending}>
                {isPending ? "Inviting..." : "Invite"}
            </Button>
        </form>

    </DialogContent>
    </Dialog>

  )
}

export default InviteUser