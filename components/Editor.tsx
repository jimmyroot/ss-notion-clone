"use client"

import { BlockNoteEditor } from "@blocknote/core"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/shadcn"
import * as Y from "yjs"
import { getYjsProviderForRoom } from "@liveblocks/yjs"
import { useRoom, useSelf } from "@liveblocks/react/suspense"
import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/shadcn/style.css"
import stringToColor from "@/lib/stringToColor"
import { Button } from "./ui/button"
 
type EditorProps = {
    doc: Y.Doc;
    provider: any;
    darkMode: boolean;
}

function BlockNote({ doc, provider, darkMode }: EditorProps) {
  const userInfo = useSelf(me => me.info)

  const editor: BlockNoteEditor = useCreateBlockNote(
    {
      collaboration: {
        provider,
        fragment: doc.getXmlFragment("document-store"),
        user: {
          name: userInfo?.name,
          color: stringToColor(userInfo?.email),
        }
      }
    }
  )

  // console.log(editor)
  
  return (
    <div className="relative max-w-6xl mx-auto">
        <BlockNoteView 
            className="min-h-screen"
            editor={editor}
            theme={darkMode ? "dark" : "light"}
        />
    </div>
  )
}

// Editor
function Editor() {

  const room = useRoom()
  const provider = getYjsProviderForRoom(room)
  const doc = provider.getYDoc()
  const [darkMode, setDarkMode] = useState(false)

  if (!doc || !provider) {
    return null 
  }

  const style = `hover:text-white ${
    darkMode ? 
        "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700" :
        "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`

  return (
    <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 justify-end mb-10">

            {/* Translate document (AI) */}
            {/* Chat to document (AI) */}
            {/* Dark mode button */}
            <Button className={style}  onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <SunIcon /> : <MoonIcon />}
            </Button>
        </div>

        <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  )
}

export default Editor