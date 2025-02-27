'use client'

import { useMyPresence, useOthers } from "@liveblocks/react"
import { PointerEventHandler } from "react"
import FollowPointer from "./FollowPointer"

function LiveCursorProvider({children}: {
    children: React.ReactNode
}) {
    const [myPresence, updateMyPresense] = useMyPresence()
    const others = useOthers()

    function handlePointerMove(e: React.MouseEvent<HTMLDivElement>) {
        const cursor = {
            x: Math.floor(e.pageX),
            y: Math.floor(e.pageY)
        }
        updateMyPresense({ cursor }) 
    }

    function handlePointerLeave(e: React.MouseEvent<HTMLDivElement>) {
        updateMyPresense({ cursor: null })
    }
    

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        {others.filter(other => other.presence.cursor !== null).map(({ connectionId, presence, info }) => {
            return <FollowPointer  
                key={connectionId} 
                info={info} 
                x={presence.cursor!.x} 
                y={presence.cursor!.y} 
            />
        })}
        {children}
    </div>
  )
}
export default LiveCursorProvider
