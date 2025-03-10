'use client'

import React, { useEffect, useState } from 'react'
import NewDocumentButton from './NewDocumentButton'
import { useCollection } from 'react-firebase-hooks/firestore'
import { MenuIcon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { collectionGroup, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import { DocumentData } from 'firebase-admin/firestore'
import SidebarOption from './SidebarOption'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Interface to use when reg-grouping docs
interface RoomDocument extends DocumentData {
  createdAt: string,
  role: "owner" | "editor",
  roomId: string,
  userId: string
}

function Sidebar() {

  // Get the currently logged in user
  const { user } = useUser()

  // Use the react firestore hook useCollection to pull the docs matching the logged in user
  const [data, loading, error] = useCollection(
    user && 
      query(
        collectionGroup(db, 'rooms'),
        where('userId', '==', user.emailAddresses[0].toString())
      )
  )

  // set up grouped data state
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[]
    editor: RoomDocument[]
  }>({
    owner: [],
    editor: []
  })

  // useEffect to group the data by owner or editor
  useEffect(() => {
    if (!data) return
    const grouped = data.docs.reduce<{
      owner: RoomDocument[]
      editor: RoomDocument[]
    }>(
      (acc, obj) => {
        const roomData = obj.data() as RoomDocument
        if (roomData.role === 'owner') {
          acc.owner.push({
            id: obj.id,
            ...roomData
          })
        } else {
          acc.editor.push({
            id: obj.id,
            ...roomData
          })
        }
        return acc
    }, { 
      owner: [],
      editor: []
    })

    setGroupedData(grouped)
  }, [data])

  const menuOptions = (
    <>
      <NewDocumentButton />
      <div className="flex flex-col py-4 space-y-4 md:max-w-36">
        {/* My Documents */}
        {groupedData.owner.length === 0 ? 
          (
            <h2 className="text-gray-500 font-semibold text-sm">
              No documents found
            </h2>
          ) 
        :
          (
            <>
              <h2 className="text-gray-500 font-semibold text-sm">My Documents</h2>
              {groupedData.owner.map((doc) => (
                // <p key={doc.roomId}>{doc.roomId}</p>
                <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
              ))}
            </>
          )
        }
        {/* List... */}

        {/* Shared with Me */}
        {groupedData.editor.length > 0 && (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Shared with Me
            </h2>
            {groupedData.editor.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}
        {/* List... */}
      </div>
    </>
  )
  return ( 
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
      <Sheet>
        <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40}/>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <div>
              {menuOptions}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      </div>
      
      <div className="hidden md:inline">
        {menuOptions}
      </div>
    </div> 
  )
}

export default Sidebar