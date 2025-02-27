"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { startTransition, useState, useTransition } from "react"
import { Button } from "./ui/button"
import { DialogClose } from "@radix-ui/react-dialog"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { deleteDocument } from "@/actions/actions"
import { toast } from "sonner"

function DeleteDocument() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const router = useRouter()

  const handleDelete = async () => {
    const roomId = pathname.split("/").pop()

    if (!roomId) throw Error('No room ID could be found, or was not available')

    startTransition(async() => {
        const { success } = await deleteDocument(roomId)
        success ? doSuccess() : doError() 
    })

    const doSuccess = () => {
        setIsOpen(false)
        router.replace("/")
        toast.success("Room successfully deleted!")
    }

    const doError = () => {
        toast.error("Something went wrong, we were unable to delete the room.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="destructive">
        <DialogTrigger>Delete</DialogTrigger>
    </Button>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Are you sure you want to delete this document?</DialogTitle>
        <DialogDescription>
            This will permanently delete the document, it's contents, and remove all users from it.
        </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2">
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending} >
                {isPending ? "Deleting..." : "Delete"}
            </Button>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Close
                </Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>
    </Dialog>

  )
}

export default DeleteDocument