'use client'

import Document from "@/components/Document"
import { use } from "react"

interface Props {
    params: Promise<{id: string}>
}

function DocumentPage(props: Props) {
  const id = use(props.params).id

  return (
    <div className="flex flex-col flex-1 min-h-screen">
        <Document id={id} />
    </div>
  )
}

export default DocumentPage