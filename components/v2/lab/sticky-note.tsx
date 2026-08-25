import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import React from 'react'

interface StickyNoteProps {
    id: string
    type?: 'To-Do' | 'In Progress' | 'Complete'
    title?: string
    content?: string

    className?: string
    cellotapeRotateAngle?: string
}

const StickyNote = ({
    id,
    type,
    title,
    content,
    className,
    cellotapeRotateAngle = '10'
}: StickyNoteProps) => {
    return (
        <div className={cn('w-fit max-w-[20rem] bg-blend-color p-4 flex flex-col gap-2 relative text-black', className)}>
            <Badge
                className="absolute bg-card/90 text-foreground -top-4 p-4 left-1/2 font-mono"
                style={{ transform: `translateX(-50%) rotate(${cellotapeRotateAngle}deg)` }}
            >{`${id}`}</Badge>
            {title && <span>{title}</span>}
            {content && <span className='text-xs'>{content}</span>}
        </div>
    )
}

export default StickyNote