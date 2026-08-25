'use client'

import { useRef } from "react"
import { Draggable } from "@/components/v2/lab/draggable"
import StickyNote from "@/components/v2/lab/sticky-note"

const Lab = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className='relative h-full w-full overflow-hidden'>
      <Draggable containerRef={containerRef} className="absolute top-1/3 left-1/3">
        <StickyNote
          id='001'
          content="MCP serverize this portfolio"
          className="bg-pink-100 border-pink-400"
          type='Complete'
        />
      </Draggable>
    </div>
  )
}

export default Lab
