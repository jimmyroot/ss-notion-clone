import RoomProvider from "@/components/RoomProvider"
import { auth } from "@clerk/nextjs/server"
import { use } from "react"

interface Props {
    children: React.ReactNode
    params: Promise<{id: string}>
}

function DocLayout(props : Props) {
  auth.protect()
  const children = props.children
  const id = use(props.params).id

  return (
    <RoomProvider roomId={id}>{children}</RoomProvider>
  )
}
export default DocLayout